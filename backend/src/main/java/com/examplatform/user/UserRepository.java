package com.examplatform.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByOauthProviderAndOauthSubject(String provider, String subject);
    boolean existsByEmail(String email);
    Optional<User> findByUsernameIgnoreCase(String username);
    boolean existsByUsernameIgnoreCase(String username);
    List<User> findByRoleAndAccountStatus(UserRole role, AccountStatus accountStatus);
}
