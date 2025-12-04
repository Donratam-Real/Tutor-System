package com.example.demo.config;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;


@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TutorProfileRepository tutorProfileRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private TutorSubjectRepository tutorSubjectRepository;
    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // ✅ ส่วนที่เพิ่ม: เช็คก่อนว่ามีข้อมูลใน User หรือยัง?
        if (userRepository.count() > 0) {
            System.out.println("----------");
            System.out.println("⚠️ มีข้อมูลใน Database แล้ว -> ข้ามการสร้างข้อมูลเริ่มต้น (Data Seeding skipped)");
            System.out.println("----------");
            return; // สั่งจบการทำงานทันที ไม่ทำบรรทัดล่างๆ ต่อ
        }

        System.out.println("🚀 เริ่มสร้างข้อมูลจำลอง (Data Seeding)...");

        String commonPassword = passwordEncoder.encode("1234"); 

        User student1 = new User();
        student1.setUsername("student1");
        student1.setEmail("student1@test.com");
        student1.setPassword(commonPassword); // ใช้รหัส 1234
        student1.setRole("STUDENT");

        User student2 = new User();
        student2.setUsername("student2");
        student2.setEmail("student2@test.com");
        student2.setPassword(commonPassword); // ใช้รหัส 1234
        student2.setRole("STUDENT");

        User tutorUser1 = new User();
        tutorUser1.setUsername("johndoe");
        tutorUser1.setEmail("john.doe@tutor.com");
        tutorUser1.setPassword(commonPassword); // ใช้รหัส 1234
        tutorUser1.setRole("TUTOR");

        User tutorUser2 = new User();
        tutorUser2.setUsername("janesmith");
        tutorUser2.setEmail("jane.smith@tutor.com");
        tutorUser2.setPassword(commonPassword); // ใช้รหัส 1234
        tutorUser2.setRole("TUTOR");
        
        userRepository.saveAll(Arrays.asList(student1, student2, tutorUser1, tutorUser2));

        // --- 2. Create Subjects ---
        Subject math = new Subject();
        math.setName("Mathematics");
        Subject physics = new Subject();
        physics.setName("Physics");
        Subject chemistry = new Subject();
        chemistry.setName("Chemistry");
        Subject english = new Subject();
        english.setName("English");

        subjectRepository.saveAll(Arrays.asList(math, physics, chemistry, english));

        // --- 3. Create Tutor Profiles ---
        TutorProfile profile1 = new TutorProfile();
        profile1.setUser(tutorUser1);
        profile1.setHeadline("Experienced Math & Physics Tutor");
        profile1.setDescription("With over 10 years of teaching experience, I make complex topics easy to understand. Let's conquer Math and Physics together!");
        profile1.setHourlyRate(50.0);
        
        TutorProfile profile2 = new TutorProfile();
        profile2.setUser(tutorUser2);
        profile2.setHeadline("Friendly Chemistry & English Teacher");
        profile2.setDescription("I specialize in helping students build confidence in Chemistry and improve their English conversational skills. My lessons are fun and engaging.");
        profile2.setHourlyRate(45.0);

        tutorProfileRepository.saveAll(Arrays.asList(profile1, profile2));

        // --- 4. Link Tutors to Subjects ---
        TutorSubject ts1 = new TutorSubject();
        ts1.setTutorProfile(profile1);
        ts1.setSubject(math);
        TutorSubject ts2 = new TutorSubject();
        ts2.setTutorProfile(profile1);
        ts2.setSubject(physics);
        TutorSubject ts3 = new TutorSubject();
        ts3.setTutorProfile(profile2);
        ts3.setSubject(chemistry);
        TutorSubject ts4 = new TutorSubject();
        ts4.setTutorProfile(profile2);
        ts4.setSubject(english);

        tutorSubjectRepository.saveAll(Arrays.asList(ts1, ts2, ts3, ts4));

        // --- 5. Create Availability Slots ---
        LocalDateTime now = LocalDateTime.now().withMinute(0).withSecond(0).withNano(0);
        AvailabilitySlot slot1 = new AvailabilitySlot();
        slot1.setTutor(tutorUser1);
        slot1.setStartTime(now.plusDays(1).withHour(10));
        slot1.setEndTime(now.plusDays(1).withHour(11));
        slot1.setBooked(false);

        AvailabilitySlot slot2 = new AvailabilitySlot();
        slot2.setTutor(tutorUser1);
        slot2.setStartTime(now.plusDays(1).withHour(11));
        slot2.setEndTime(now.plusDays(1).withHour(12));
        slot2.setBooked(true); 

        AvailabilitySlot slot3 = new AvailabilitySlot();
        slot3.setTutor(tutorUser2);
        slot3.setStartTime(now.plusDays(2).withHour(14));
        slot3.setEndTime(now.plusDays(2).withHour(15));
        slot3.setBooked(false);

        availabilitySlotRepository.saveAll(Arrays.asList(slot1, slot2, slot3));

        // --- 6. Create a Booking ---
        Booking booking1 = new Booking();
        booking1.setStudent(student1);
        booking1.setTutor(tutorUser1);
        booking1.setSlot(slot2);
        booking1.setBookingTime(now.minusDays(1));
        booking1.setStatus("CONFIRMED");

        bookingRepository.save(booking1);

        // --- 7. Create Reviews ---
        Review review1 = new Review();
        review1.setTutor(tutorUser1);
        review1.setStudent(student1);
        review1.setRating(5);
        review1.setComment("John is an amazing tutor! He explained everything so clearly. I finally understand calculus!");

        Review review2 = new Review();
        review2.setTutor(tutorUser1);
        review2.setStudent(student2);
        review2.setRating(4);
        review2.setComment("Good session, very helpful.");

        reviewRepository.saveAll(Arrays.asList(review1, review2));
        
        System.out.println("✅ สร้างข้อมูลเริ่มต้นสำเร็จ!");
    }
}
