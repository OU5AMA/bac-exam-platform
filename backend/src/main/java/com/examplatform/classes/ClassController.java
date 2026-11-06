package com.examplatform.classes;

import com.examplatform.auth.CurrentUserService;
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
@RequestMapping("/api/classes")
public class ClassController {
    private final CurrentUserService currentUserService;
    private final ClassService classService;

    public ClassController(CurrentUserService currentUserService, ClassService classService) {
        this.currentUserService = currentUserService;
        this.classService = classService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClassSummaryResponse create(@Valid @RequestBody CreateClassRequest request) {
        return classService.createClass(request.name(), currentUserService.getCurrentUser());
    }

    @PostMapping("/join")
    public ClassSummaryResponse join(@Valid @RequestBody JoinClassRequest request) {
        return classService.joinClass(request.joinCode(), currentUserService.getCurrentUser());
    }

    @GetMapping("/leaderboard")
    public LeaderboardResponse leaderboard() {
        return classService.getLeaderboard(currentUserService.getCurrentUser());
    }

    @GetMapping("/my-class")
    public ResponseEntity<ClassSummaryResponse> myClass() {
        ClassSummaryResponse response = classService.getMyClass(currentUserService.getCurrentUser());
        return response == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(response);
    }
}
