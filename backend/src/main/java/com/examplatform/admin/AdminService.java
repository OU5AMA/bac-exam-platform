package com.examplatform.admin;

import com.examplatform.admin.dto.PendingTeacherResponse;
import com.examplatform.common.exception.ResourceNotFoundException;
import com.examplatform.user.AccountStatus;
import com.examplatform.user.User;
import com.examplatform.user.UserRepository;
import com.examplatform.user.UserRole;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<PendingTeacherResponse> getPendingTeachers() {
        return userRepository.findByRoleAndAccountStatus(UserRole.TEACHER, AccountStatus.PENDING_APPROVAL)
                .stream()
                .map(PendingTeacherResponse::from)
                .toList();
    }

    @Transactional
    public void approveTeacher(Long userId) {
        User user = findPendingTeacher(userId);
        user.setAccountStatus(AccountStatus.ACTIVE);
        userRepository.save(user);
    }

    @Transactional
    public void rejectTeacher(Long userId) {
        User user = findPendingTeacher(userId);
        user.setAccountStatus(AccountStatus.REJECTED);
        userRepository.save(user);
    }

    private User findPendingTeacher(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        if (user.getRole() != UserRole.TEACHER) {
            throw new IllegalArgumentException("User " + userId + " is not a teacher");
        }
        return user;
    }
}