package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // เพิ่ม import
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap; // เพิ่ม import
import java.util.Map; // เพิ่ม import

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "*") // 🔥 แก้ปัญหา CORS: อนุญาตให้ทุกเว็บเรียกใช้งานได้ (แก้ 403 เบื้องต้น)
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody User user) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Incorrect username or password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        // 🔥 ดึงข้อมูล User เต็มๆ เพื่อเอา Role
        User fullUser = userRepository.findByUsername(user.getUsername()).orElseThrow();

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("username", userDetails.getUsername());
        response.put("role", fullUser.getRole()); // ✅ เพิ่มบรรทัดนี้: ส่ง Role กลับไป (STUDENT หรือ TUTOR)
        response.put("userId", String.valueOf(fullUser.getId())); // ✅ แถม ID ไปด้วย (เอาไว้ใช้ยิง API จอง/ดูตาราง)
        
        return ResponseEntity.ok(response);
    }
}