package com.example.demo.service;

import com.example.demo.model.TutorProfile;
import org.springframework.data.jpa.domain.Specification;

public class TutorProfileSpecification {

    public static Specification<TutorProfile> hasSubject(String subject) {
        return (root, query, criteriaBuilder) -> {
            if (subject == null || subject.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            // This requires a join. For simplicity, we'll filter by headline for now.
            // A more complex implementation would join with TutorSubject and Subject entities.
            return criteriaBuilder.like(root.get("headline"), "%" + subject + "%");
        };
    }

    public static Specification<TutorProfile> hasHourlyRateLessThan(Double rate) {
        return (root, query, criteriaBuilder) -> {
            if (rate == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("hourlyRate"), rate);
        };
    }
}
