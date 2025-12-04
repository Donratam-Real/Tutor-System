package com.example.demo.controller;

import com.example.demo.model.Subject;
import com.example.demo.model.TutorProfile;
import com.example.demo.model.TutorSubject;
import com.example.demo.model.User;
import com.example.demo.repository.SubjectRepository;
import com.example.demo.repository.TutorProfileRepository;
import com.example.demo.repository.TutorSubjectRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.TutorProfileSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:3000") // อนุญาต Frontend
public class ProfileController {

    @Autowired
    private TutorProfileRepository tutorProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TutorSubjectRepository tutorSubjectRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    // --- สร้างหรือแก้ไขข้อมูลส่วนตัว (Bio, Headline, Rate) ---
    @PostMapping("/tutor")
    public ResponseEntity<?> createOrUpdateTutorProfile(@AuthenticationPrincipal UserDetails userDetails, @RequestBody TutorProfile profile) {
        
        // 🔥🔥🔥 เพิ่มท่อนนี้ครับ (กัน Error 500) 🔥🔥🔥
        if (userDetails == null) {
            System.out.println("Error: UserDetails is null. Token might be missing or invalid.");
            return ResponseEntity.status(401).body("Unauthorized: Please login first");
        }
        // 🔥🔥🔥 จบท่อนกันชน 🔥🔥🔥

        return userRepository.findByUsername(userDetails.getUsername())
                .map(user -> {
                    if (!"TUTOR".equals(user.getRole())) {
                        return ResponseEntity.status(403).body("Access Denied: Tutors only");
                    }
                    // เช็คว่ามี Profile เดิมไหม
                    TutorProfile existingProfile = tutorProfileRepository.findByUserId(user.getId());
                    if (existingProfile != null) {
                        profile.setId(existingProfile.getId());
                    }
                    
                    profile.setUser(user);
                    return ResponseEntity.ok(tutorProfileRepository.save(profile));
                })
                .orElse(ResponseEntity.status(404).body("User not found in database"));
    }

    // --- 🔥 [ใหม่] อัปเดตวิชาที่สอน (รับ ID วิชาเป็น List) ---
    @PostMapping("/tutor/subjects")
    @Transactional
    public ResponseEntity<?> updateTutorSubjects(@AuthenticationPrincipal UserDetails userDetails, @RequestBody List<Long> subjectIds) {
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.status(404).body("User not found");

        User user = userOpt.get();
        TutorProfile profile = tutorProfileRepository.findByUserId(user.getId());

        if (profile == null) {
            profile = new TutorProfile();
            profile.setUser(user);
            profile = tutorProfileRepository.save(profile);
        }

        // 1. ลบของเก่า
        tutorSubjectRepository.deleteByTutorProfileId(profile.getId());
        tutorSubjectRepository.flush(); // 🔥 เพิ่มบรรทัดนี้: บังคับให้ลบจริงๆ ทันที

        // 2. หาข้อมูลวิชา
        List<Subject> subjects = subjectRepository.findAllById(subjectIds);

        // 3. เพิ่มของใหม่
        for (Subject sub : subjects) {
            TutorSubject ts = new TutorSubject();
            ts.setTutorProfile(profile);
            ts.setSubject(sub);
            tutorSubjectRepository.save(ts);
        }

        return ResponseEntity.ok("Subjects updated successfully");
    }

    // --- ดึงข้อมูล Tutor ทั้งหมด ---
    @GetMapping("/tutor")
    public List<TutorProfile> getAllTutorProfiles() {
        return tutorProfileRepository.findAll();
    }

    // --- ค้นหา Tutor ---
    @GetMapping("/tutor/search")
    public List<TutorProfile> searchTutorProfiles(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) Double maxRate) {
        Specification<TutorProfile> spec = Specification.where(TutorProfileSpecification.hasSubject(subject))
                .and(TutorProfileSpecification.hasHourlyRateLessThan(maxRate));
        return tutorProfileRepository.findAll(spec);
    }

    // --- ดึงข้อมูล Tutor ตาม ID ---
    @GetMapping("/tutor/{id}")
    public ResponseEntity<TutorProfile> getTutorProfileById(@PathVariable Long id) {
        return tutorProfileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tutor/user/{userId}")
    public ResponseEntity<TutorProfile> getTutorProfileByUserId(@PathVariable Long userId) {
        TutorProfile profile = tutorProfileRepository.findByUserId(userId);
        if (profile != null) {
            return ResponseEntity.ok(profile);
        }
        return ResponseEntity.notFound().build();
    }
}