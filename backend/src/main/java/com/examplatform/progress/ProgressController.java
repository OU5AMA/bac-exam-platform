package com.examplatform.progress;

import com.examplatform.auth.CurrentUserService;
import com.examplatform.auth.dto.AuthResponse;
import com.examplatform.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    private final CurrentUserService currentUserService;
    private final StreakService streakService;

    public ProgressController(CurrentUserService currentUserService, StreakService streakService) {
        this.currentUserService = currentUserService;
        this.streakService = streakService;
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
}
