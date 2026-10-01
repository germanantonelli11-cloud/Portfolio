package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
    "https://antonelli.dev",
    "https://www.antonelli.dev",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
})
public class HomeController {

    private boolean isAdminLoggedIn = false;

    private final List<ProjectItem> masterProjectList = new ArrayList<>(List.of(
        new ProjectItem("Dynamic Full-Stack Web Architecture Portfolio", true),
        new ProjectItem("Small Business Operations & Inventory Tracker", true),
        new ProjectItem("Programmatic Matrix & Linear Algebra Solver", true)
    ));

    // GET /api/projects - Returns approved projects for public site
    @GetMapping("/projects")
    public List<ProjectItem> getPublicProjects() {
        List<ProjectItem> approvedOnly = new ArrayList<>();
        for (ProjectItem item : masterProjectList) {
            if (item.isApproved()) {
                approvedOnly.add(item);
            }
        }
        return approvedOnly;
    }

    // POST /api/add-project - Recruiter submits a project idea (defaults to unapproved)
    @PostMapping("/add-project")
    public ResponseEntity<Map<String, String>> addProject(@RequestBody Map<String, String> payload) {
        String newProjectName = payload.get("projectName");
        if (newProjectName != null && !newProjectName.trim().isEmpty()) {
            masterProjectList.add(new ProjectItem(newProjectName.trim(), false));
            return ResponseEntity.ok(Map.of("status", "success", "message", "Project idea submitted for review!"));
        }
        return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Project name cannot be empty."));
    }

    // POST /api/login - Authenticate admin password
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> handleLogin(@RequestBody Map<String, String> payload) {
        String password = payload.get("adminPassword");
        if ("TheEngineer123".equals(password)) {
            isAdminLoggedIn = true;
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "authenticated", true,
                "message", "Admin authentication successful."
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "status", "error",
                "authenticated", false,
                "message", "Invalid engineering signature password."
            ));
        }
    }

    // GET /api/admin/pending - Get unapproved project suggestions for admin review
    @GetMapping("/admin/pending")
    public ResponseEntity<?> getPendingProjects() {
        if (!isAdminLoggedIn) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Unauthorized access."));
        }

        List<ProjectItem> pendingOnly = new ArrayList<>();
        for (ProjectItem item : masterProjectList) {
            if (!item.isApproved()) {
                pendingOnly.add(item);
            }
        }
        return ResponseEntity.ok(pendingOnly);
    }

    // POST /api/approve-project - Approve pending project
    @PostMapping("/approve-project")
    public ResponseEntity<Map<String, String>> approveProject(@RequestBody Map<String, Integer> payload) {
        if (!isAdminLoggedIn) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Unauthorized access."));
        }

        Integer index = payload.get("projectIndex");
        if (index != null) {
            int pendingCount = 0;
            for (ProjectItem item : masterProjectList) {
                if (!item.isApproved()) {
                    if (pendingCount == index) {
                        item.setApproved(true);
                        return ResponseEntity.ok(Map.of("status", "success", "message", "Project approved!"));
                    }
                    pendingCount++;
                }
            }
        }
        return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Invalid project index."));
    }

    // POST /api/reject-project - Reject/delete pending project
    @PostMapping("/reject-project")
    public ResponseEntity<Map<String, String>> rejectProject(@RequestBody Map<String, Integer> payload) {
        if (!isAdminLoggedIn) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Unauthorized access."));
        }

        Integer index = payload.get("projectIndex");
        if (index != null) {
            int pendingCount = 0;
            for (int i = 0; i < masterProjectList.size(); i++) {
                if (!masterProjectList.get(i).isApproved()) {
                    if (pendingCount == index) {
                        masterProjectList.remove(i);
                        return ResponseEntity.ok(Map.of("status", "success", "message", "Project rejected."));
                    }
                    pendingCount++;
                }
            }
        }
        return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Invalid project index."));
    }

    // POST /api/logout - Admin logout
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> handleLogout() {
        isAdminLoggedIn = false;
        return ResponseEntity.ok(Map.of("status", "success", "message", "Logged out successfully."));
    }
}
