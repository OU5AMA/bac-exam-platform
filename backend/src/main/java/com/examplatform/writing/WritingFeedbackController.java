package com.examplatform.writing;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/writing/story")
public class WritingFeedbackController {
    private final WritingFeedbackService service;

    public WritingFeedbackController(WritingFeedbackService service) {
        this.service = service;
    }

    @PostMapping("/feedback")
    public WritingFeedbackResponse feedback(@Valid @RequestBody WritingFeedbackRequest request) {
        return service.getFeedback(request.text(), request.unitNumber());
    }
}
