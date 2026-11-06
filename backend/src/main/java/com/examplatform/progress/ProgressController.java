package com.examplatform.progress;

import com.examplatform.auth.CurrentUserService;
import com.examplatform.auth.dto.AuthResponse;
import com.examplatform.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    private final CurrentUserService currentUserService;
    private final StreakService streakService;
    private final ProgressService progressService;

    public ProgressController(CurrentUserService currentUserService, StreakService streakService, ProgressService progressService) {
        this.currentUserService = currentUserService;
        this.streakService = streakService;
        this.progressService = progressService;
    }

    @GetMapping("/dashboard")
    public StreakDashboardResponse dashboard() {
        return StreakDashboardResponse.from(currentUserService.getCurrentUser());
    }

    @PostMapping("/activity")
    public ResponseEntity<AuthResponse> recordActivity() {
        User user = currentUserService.getCurrentUser();
        streakService.recordActivity(user);
        return ResponseEntity.ok(AuthResponse.from(user));
    }

    @PostMapping("/save")
    @ResponseStatus(HttpStatus.CREATED)
    public ProgressSaveResponse saveProgress(@Valid @RequestBody ProgressSaveRequest request) {
        return progressService.saveProgress(currentUserService.getCurrentUser(), request);
    }
}
