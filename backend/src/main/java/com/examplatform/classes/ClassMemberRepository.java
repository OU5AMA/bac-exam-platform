package com.examplatform.classes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClassMemberRepository extends JpaRepository<ClassMember, ClassMemberId> {
    Optional<ClassMember> findByUser_Id(Long userId);
    Optional<ClassMember> findByUser_IdAndSchoolClass_Id(Long userId, Long classId);
    long countBySchoolClass_Id(Long classId);
    boolean existsByUser_Id(Long userId);
}
