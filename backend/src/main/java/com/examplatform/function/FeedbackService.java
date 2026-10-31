package com.examplatform.function;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class FeedbackService {
    private static final String SYSTEM_PROMPT = "You are an English teacher grading a 2 Bac student on 'Expressing Opinion'. "
            + "The student was asked: 'Some people think youth should volunteer for community service. What is your opinion?' "
            + "Read the student's response. Check if they used an opinion starter, if they gave a strong argument, and if they used correct grammar. "
            + "Return your response strictly in JSON format: { \"positives\": [\"point 1\", \"point 2\"], \"negatives\": [\"point 1\", \"point 2\"], \"score\": 8 }. "
            + "Do not include markdown formatting, just the raw JSON.";

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String apiKey;
    private final String model;

    public FeedbackService(
            ObjectMapper objectMapper,
            @Value("${openrouter.api-key:}") String apiKey,
            @Value("${openrouter.model:meta-llama/llama-3.1-8b-instruct:free}") String model
    ) {
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.model = model;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
    }

    public FeedbackResponse getFeedback(String text) {
        if (apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Feedback service is not configured.");
        }

        try {
            String requestBody = objectMapper.createObjectNode()
                    .put("model", model)
                    .set("messages", objectMapper.createArrayNode()
                            .add(objectMapper.createObjectNode().put("role", "system").put("content", SYSTEM_PROMPT))
                            .add(objectMapper.createObjectNode().put("role", "user").put("content", text)))
                    .toString();

            HttpRequest request = HttpRequest.newBuilder(URI.create("https://openrouter.ai/api/v1/chat/completions"))
                    .timeout(Duration.ofSeconds(45))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "The feedback provider could not process your paragraph.");
            }

            JsonNode content = objectMapper.readTree(response.body()).path("choices").path(0).path("message").path("content");
            if (!content.isTextual()) {
                throw new IOException("Feedback response did not include message content.");
            }
            JsonNode feedback = objectMapper.readTree(content.asText().strip());
            FeedbackResponse result = objectMapper.treeToValue(feedback, FeedbackResponse.class);
            if (result.positives() == null || result.negatives() == null || result.score() < 0 || result.score() > 10) {
                throw new IOException("Feedback response had an invalid shape.");
            }
            return result;
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Feedback was interrupted. Please try again.");
        } catch (IOException | RuntimeException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "We couldn't create feedback right now. Please try again.");
        }
    }
}
