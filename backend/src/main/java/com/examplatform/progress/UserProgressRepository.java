package com.examplatform.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    @Query(value = "SELECT COALESCE(SUM(score), 0) FROM user_progress WHERE user_id = :userId", nativeQuery = true)
    Long sumScoresByUserId(@Param("userId") Long userId);
}
