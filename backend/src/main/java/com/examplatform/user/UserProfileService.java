package com.examplatform.user;

import com.examplatform.auth.CurrentUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Iterator;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserProfileService {
    private static final int MAX_IMAGE_BYTES = 2 * 1024 * 1024;
    private static final long MAX_IMAGE_PIXELS = 4_000_000;
    private static final Pattern DATA_URI = Pattern.compile(
            "^data:image/(png|jpeg|gif);base64,([A-Za-z0-9+/]+={0,2})$",
            Pattern.CASE_INSENSITIVE
    );

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;

    public UserProfileService(CurrentUserService currentUserService, UserRepository userRepository) {
        this.currentUserService = currentUserService;
        this.userRepository = userRepository;
    }

    @Transactional
    public User updateProfilePicture(String imageBase64) {
        byte[] imageBytes = decodeAndValidate(imageBase64);
        String dataUri = imageBase64.trim();
        User user = currentUserService.getCurrentUser();
        user.setProfilePictureUrl(dataUri);
        return userRepository.save(user);
    }

    private byte[] decodeAndValidate(String imageBase64) {
        if (imageBase64 == null) {
            throw invalidImage();
        }
        Matcher matcher = DATA_URI.matcher(imageBase64.trim());
        if (!matcher.matches()) {
            throw invalidImage();
        }

        byte[] bytes;
        try {
            bytes = Base64.getDecoder().decode(matcher.group(2));
        } catch (IllegalArgumentException exception) {
            throw invalidImage();
        }
        if (bytes.length == 0 || bytes.length > MAX_IMAGE_BYTES || !isValidRasterImage(bytes, matcher.group(1))) {
            throw invalidImage();
        }
        return bytes;
    }

    private boolean isValidRasterImage(byte[] bytes, String declaredType) {
        try (ImageInputStream input = ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))) {
            if (input == null) return false;
            Iterator<ImageReader> readers = ImageIO.getImageReaders(input);
            if (!readers.hasNext()) return false;

            ImageReader reader = readers.next();
            try {
                reader.setInput(input, true, true);
                String actualFormat = reader.getFormatName().toLowerCase(Locale.ROOT);
                String expectedFormat = declaredType.toLowerCase(Locale.ROOT);
                if (!(actualFormat.equals(expectedFormat)
                        || (expectedFormat.equals("jpeg") && actualFormat.equals("jpg")))) {
                    return false;
                }
                int width = reader.getWidth(0);
                int height = reader.getHeight(0);
                if (width <= 0 || height <= 0 || (long) width * height > MAX_IMAGE_PIXELS) {
                    return false;
                }
                return reader.read(0) != null;
            } finally {
                reader.dispose();
            }
        } catch (IOException | RuntimeException exception) {
            return false;
        }
    }

    private IllegalArgumentException invalidImage() {
        return new IllegalArgumentException(
                "Upload a valid PNG, JPEG, or GIF image up to 2 MB and 4 megapixels."
        );
    }
}
