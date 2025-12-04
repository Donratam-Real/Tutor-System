package com.example.demo.controller;

import com.example.demo.model.Review;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Review> createReview(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Review review) {
        return userRepository.findByUsername(userDetails.getUsername())
                .map(student -> {
                    review.setStudent(student);
                    return ResponseEntity.ok(reviewRepository.save(review));
                })
                .orElse(ResponseEntity.status(404).build());
    }

    @GetMapping("/tutor/{tutorId}")
    public List<Review> getReviewsForTutor(@PathVariable Long tutorId) {
        return reviewRepository.findByTutorId(tutorId);
    }
}
