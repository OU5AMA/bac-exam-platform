package com.examplatform.daily;

import com.examplatform.auth.CurrentUserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/challenges/daily")
public class DailyChallengeController {
    private final CurrentUserService currentUserService;
    private final DailyChallengeService dailyChallengeService;

    public DailyChallengeController(CurrentUserService currentUserService, DailyChallengeService dailyChallengeService) {
        this.currentUserService = currentUserService;
        this.dailyChallengeService = dailyChallengeService;
    }

    @GetMapping
    public DailyChallengeResponse today() {
        return dailyChallengeService.getToday(currentUserService.getCurrentUser());
    }

    @PostMapping("/start")
    public DailyChallengeResponse start() {
        return dailyChallengeService.start(currentUserService.getCurrentUser());
    }

    @PostMapping("/submit")
    public DailyChallengeResponse submit(@RequestBody DailyChallengeSubmission submission) {
        return dailyChallengeService.submit(currentUserService.getCurrentUser(), submission.answers());
    }
}
