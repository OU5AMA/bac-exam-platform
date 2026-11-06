package com.examplatform.user;

import com.examplatform.auth.dto.AuthResponse;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {
    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PutMapping(value = "/profile-picture", consumes = MediaType.APPLICATION_JSON_VALUE)
    public AuthResponse updateProfilePicture(@Valid @RequestBody ProfilePictureRequest request) {
        return AuthResponse.from(userProfileService.updateProfilePicture(request.imageBase64()));
    }

    @PutMapping(value = "/display-name", consumes = MediaType.APPLICATION_JSON_VALUE)
    public AuthResponse updateDisplayName(@Valid @RequestBody DisplayNameRequest request) {
        return AuthResponse.from(userProfileService.updateDisplayName(request.displayName()));
    }
}
