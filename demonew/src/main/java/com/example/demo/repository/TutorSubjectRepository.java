package com.example.demo.repository;

import com.example.demo.model.TutorSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying; // <--- เพิ่ม
import org.springframework.transaction.annotation.Transactional; // <--- เพิ่ม

public interface TutorSubjectRepository extends JpaRepository<TutorSubject, Long> {
    @Modifying // <--- ใส่เพื่อบอกว่ามีการเปลี่ยนแปลงข้อมูล (ลบ)
    @Transactional // <--- ใส่เพื่อยืนยันการลบ
    void deleteByTutorProfileId(Long tutorProfileId);
}
