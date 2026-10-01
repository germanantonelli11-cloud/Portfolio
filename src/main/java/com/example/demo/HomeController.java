package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(
    origins = {
        "https://antonelli.dev",
        "https://www.antonelli.dev",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    },
    allowedHeaders = {"Content-Type", "Authorization"}
)
public class HomeController {

    // Give each successful login its own token, valid for one hour.
    private static final long TOKEN_LIFETIME_SECONDS = 60 * 60;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, Instant> activeTokens = new ConcurrentHashMap<>();

    // Projects are stored in memory and reset if the Render service restarts.
    private final List<ProjectItem> masterProjectList = new ArrayList<>(List.of(
        new ProjectItem("Dynamic Full-Stack Web Architecture Portfolio", true),
        new ProjectItem("Small Business Operations & Inventory Tracker", true),
        new ProjectItem("Programmatic Matrix & Linear Algebra Solver", true)
    ));

    // Return approved projects.
    @GetMapping("/projects")
    public synchronized List<ProjectItem> getPublicProjects() {
        List<ProjectItem> approved = new ArrayList<>();

        for (ProjectItem item : masterProjectList) {
            if (item.isApproved()) {
                approved.add(item);
            }
        }

        return approved;
    }

    // Receive a visitor's project suggestion.
    @PostMapping("/add-project")
    public synchronized ResponseEntity<Map<String, String>> addProject(
            @RequestBody Map<String, String> payload) {

        String name = payload.get("projectName");

        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Project name cannot be empty."
            ));
        }

        masterProjectList.add(new ProjectItem(name.trim(), false));

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Project idea submitted for review!"
        ));
    }

    // Check the password stored in Render's ADMIN_PASSWORD environment variable.
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> handleLogin(
            @RequestBody Map<String, String> payload) {

        String expected = System.getenv("ADMIN_PASSWORD");

        if (expected == null || expected.isBlank()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "status", "error",
                "message", "Admin password is not configured."
            ));
        }

        String supplied = payload.get("adminPassword");

        if (supplied == null || !MessageDigest.isEqual(
                supplied.getBytes(StandardCharsets.UTF_8),
                expected.getBytes(StandardCharsets.UTF_8))) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "status", "error",
                "message", "Invalid password."
            ));
        }

        // Generate an unpredictable token for this login.
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        String token = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        activeTokens.put(
            token,
            Instant.now().plusSeconds(TOKEN_LIFETIME_SECONDS)
        );

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "token", token
        ));
    }

    // Check the token included with each admin request.
    private boolean isAuthorized(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return false;
        }

        String token = authorization.substring(7);
        Instant expiry = activeTokens.get(token);

        if (expiry == null) {
            return false;
        }

        if (!expiry.isAfter(Instant.now())) {
            activeTokens.remove(token);
            return false;
        }

        return true;
    }

    // Return suggestions awaiting review.
    @GetMapping("/admin/pending")
    public synchronized ResponseEntity<?> getPendingProjects(
            @RequestHeader(value = "Authorization", required = false)
            String authorization) {

        if (!isAuthorized(authorization)) {
            return unauthorized();
        }

        List<ProjectItem> pending = new ArrayList<>();

        for (ProjectItem item : masterProjectList) {
            if (!item.isApproved()) {
                pending.add(item);
            }
        }

        return ResponseEntity.ok(pending);
    }

    // Approve one suggestion.
    @PostMapping("/approve-project")
    public synchronized ResponseEntity<Map<String, String>> approveProject(
            @RequestHeader(value = "Authorization", required = false)
            String authorization,
            @RequestBody Map<String, Integer> payload) {

        if (!isAuthorized(authorization)) {
            return unauthorized();
        }

        Integer index = payload.get("projectIndex");

        if (index != null && index >= 0) {
            int pendingIndex = 0;

            for (ProjectItem item : masterProjectList) {
                if (!item.isApproved()) {
                    if (pendingIndex == index) {
                        item.setApproved(true);

                        return ResponseEntity.ok(Map.of(
                            "status", "success",
                            "message", "Project approved!"
                        ));
                    }

                    pendingIndex++;
                }
            }
        }

        return ResponseEntity.badRequest().body(Map.of(
            "status", "error",
            "message", "Invalid project index."
        ));
    }

    // Reject and remove one suggestion.
    @PostMapping("/reject-project")
    public synchronized ResponseEntity<Map<String, String>> rejectProject(
            @RequestHeader(value = "Authorization", required = false)
            String authorization,
            @RequestBody Map<String, Integer> payload) {

        if (!isAuthorized(authorization)) {
            return unauthorized();
        }

        Integer index = payload.get("projectIndex");

        if (index != null && index >= 0) {
            int pendingIndex = 0;

            for (int i = 0; i < masterProjectList.size(); i++) {
                if (!masterProjectList.get(i).isApproved()) {
                    if (pendingIndex == index) {
                        masterProjectList.remove(i);

                        return ResponseEntity.ok(Map.of(
                            "status", "success",
                            "message", "Project rejected."
                        ));
                    }

                    pendingIndex++;
                }
            }
        }

        return ResponseEntity.badRequest().body(Map.of(
            "status", "error",
            "message", "Invalid project index."
        ));
    }

    // Revoke the token used by this browser.
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> handleLogout(
            @RequestHeader(value = "Authorization", required = false)
            String authorization) {

        if (authorization != null && authorization.startsWith("Bearer ")) {
            activeTokens.remove(authorization.substring(7));
        }

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Logged out successfully."
        ));
    }

    // Send the same unauthorized response from each protected endpoint.
    private ResponseEntity<Map<String, String>> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
            "status", "error",
            "message", "Unauthorized access."
        ));
    }
}