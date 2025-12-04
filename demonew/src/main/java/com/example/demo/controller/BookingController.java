package com.example.demo.controller;

import com.example.demo.model.AvailabilitySlot;
import com.example.demo.model.Booking;
import com.example.demo.repository.AvailabilitySlotRepository;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // 🔥 อนุญาตให้ Frontend เรียกได้
public class BookingController {

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    // --- ส่วนของ Tutor: เพิ่มเวลาว่าง ---
    @PostMapping("/tutor/availability")
    public ResponseEntity<AvailabilitySlot> addAvailability(@AuthenticationPrincipal UserDetails userDetails, @RequestBody AvailabilitySlot slot) {
        return userRepository.findByUsername(userDetails.getUsername())
                .map(user -> {
                    if (!"TUTOR".equals(user.getRole())) {
                        return ResponseEntity.status(403).<AvailabilitySlot>build();
                    }
                    slot.setTutor(user);
                    slot.setBooked(false);
                    return ResponseEntity.ok(availabilitySlotRepository.save(slot));
                })
                .orElse(ResponseEntity.status(404).<AvailabilitySlot>build());
    }

    // --- ส่วนของ Tutor/Student: ดูเวลาว่างของครูคนหนึ่ง ---
    @GetMapping("/tutor/{tutorId}/availability")
    public List<AvailabilitySlot> getTutorAvailability(@PathVariable Long tutorId) {
        return availabilitySlotRepository.findByTutorId(tutorId);
    }

    // --- ส่วนของ Student: จองเวลาเรียน ---
    @PostMapping("/student/book")
    public ResponseEntity<Booking> bookSlot(@AuthenticationPrincipal UserDetails userDetails, @RequestParam Long slotId) {
        return userRepository.findByUsername(userDetails.getUsername())
                .flatMap(student -> availabilitySlotRepository.findById(slotId)
                        .map(slot -> {
                            if (slot.isBooked()) {
                                return ResponseEntity.badRequest().<Booking>build(); // จองซ้ำไม่ได้
                            }
                            slot.setBooked(true); // อัปเดตสถานะว่าไม่ว่างแล้ว
                            availabilitySlotRepository.save(slot);

                            Booking booking = new Booking();
                            booking.setStudent(student);
                            booking.setTutor(slot.getTutor());
                            booking.setSlot(slot);
                            booking.setBookingTime(LocalDateTime.now());
                            booking.setStatus("CONFIRMED");

                            return ResponseEntity.ok(bookingRepository.save(booking));
                        }))
                .orElse(ResponseEntity.status(404).<Booking>build());
    }

    // 🔥 ส่วนที่เพิ่มใหม่: ดึงประวัติการจองของนักเรียน (Student Schedule)
    @GetMapping("/bookings/student/{studentId}")
    public List<Booking> getStudentBookings(@PathVariable Long studentId) {
        return bookingRepository.findByStudentId(studentId);
    }

    @GetMapping("/bookings/tutor/{tutorId}")
    public List<Booking> getTutorBookings(@PathVariable Long tutorId) {
        return bookingRepository.findByTutorId(tutorId);
    }
}