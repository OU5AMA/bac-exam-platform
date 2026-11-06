package com.examplatform.progress;

import com.examplatform.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProgressService {
    private final UserProgressRepository userProgressRepository;
    private final StreakService streakService;

    public ProgressService(UserProgressRepository userProgressRepository, StreakService streakService) {
        this.userProgressRepository = userProgressRepository;
        this.streakService = streakService;
    }

    @Transactional
    public ProgressSaveResponse saveProgress(User user, ProgressSaveRequest request) {
        if (request.score() > request.maxScore()) {
            throw new IllegalArgumentException("Score cannot be greater than maxScore.");
        }
        streakService.recordActivity(user);
        UserProgress saved = userProgressRepository.save(new UserProgress(user, request));
        return new ProgressSaveResponse(saved.getId(), saved.getUnitNumber(), saved.getSkill(), saved.getScore(), saved.getMaxScore(), saved.getRecordedAt());
    }
}
