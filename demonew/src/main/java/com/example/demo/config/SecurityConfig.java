package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // -------------------------------------------------------
                // 🔒 1. กฎเข้มงวด (POST/PUT/DELETE) -> ต้อง Login เท่านั้น
                // -------------------------------------------------------
                .requestMatchers(HttpMethod.POST, "/api/profiles/tutor/**").authenticated() // แก้ไขโปรไฟล์
                .requestMatchers(HttpMethod.POST, "/api/profiles/tutor/subjects").authenticated() // บันทึกวิชา
                .requestMatchers(HttpMethod.POST, "/api/tutor/**").authenticated() // เพิ่มเวลาว่าง
                .requestMatchers(HttpMethod.POST, "/api/student/**").authenticated() // จองเรียน
                
                // -------------------------------------------------------
                // 🔓 2. กฎผ่อนปรน (GET) -> อนุญาตให้ดูได้ (Public)
                // -------------------------------------------------------
                .requestMatchers(HttpMethod.GET, "/api/bookings/**").permitAll() // หรือ authenticated() ก็ได้ถ้าอยากบังคับ
                .requestMatchers(HttpMethod.GET, "/api/subjects/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/profiles/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/tutor/**").permitAll()
                
                // -------------------------------------------------------
                // 🔓 3. ระบบพื้นฐาน
                // -------------------------------------------------------
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/", "/error", "/favicon.ico", "/manifest.json").permitAll()

                // สุดท้าย: อื่นๆ ต้อง Login
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }
    
    private UrlBasedCorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        // อนุญาต Frontend (ใส่ทั้ง 3000 และ 5173 เผื่อไว้)
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}