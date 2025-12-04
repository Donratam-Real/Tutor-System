package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class TutorSubject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tutor_profile_id")
    private TutorProfile tutorProfile;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
}
