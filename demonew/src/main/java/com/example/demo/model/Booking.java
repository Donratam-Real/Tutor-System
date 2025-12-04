package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private User tutor;

    @OneToOne
    @JoinColumn(name = "availability_slot_id")
    private AvailabilitySlot slot;

    private LocalDateTime bookingTime;
    private String status; // e.g., "CONFIRMED", "CANCELLED"
}
