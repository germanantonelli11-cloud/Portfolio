package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;
import java.util.ArrayList;
import java.util.List;

@Controller
public class HomeController {

    // Global session simulation tracker
    private boolean isAdminLoggedIn = false;

    // Storing our custom Objects instead of raw strings
    private List<ProjectItem> masterProjectList = new ArrayList<>(List.of(
        new ProjectItem("Personal Task Tracker Application", true),
        new ProjectItem("Relational Database Manager", true),
        new ProjectItem("System Performance Monitor", true)
    ));

    @GetMapping("/")
    public String homePage(Model model) {
        model.addAttribute("developerName", "German");

        List<ProjectItem> approvedOnly = new ArrayList<>();
        for (ProjectItem item : masterProjectList) {
            if (item.isApproved()) {
                approvedOnly.add(item);
            }
        }
        model.addAttribute("myProjects", approvedOnly);
        return "home";
    }

    // 1. SECURE ADMIN ROUTE
    @GetMapping("/admin")
    public String adminPage(Model model) {
        // Intercept: If you are not signed in, render the login portal view immediately
        if (!isAdminLoggedIn) {
            return "login";
        }

        List<ProjectItem> pendingOnly = new ArrayList<>();
        for (ProjectItem item : masterProjectList) {
            if (!item.isApproved()) {
                pendingOnly.add(item);
            }
        }
        model.addAttribute("pendingProjects", pendingOnly);
        return "admin";
    }

    // 2. DISPLAY LOGIN PAGE ROUTE
    @GetMapping("/login")
    public String showLoginPage(Model model) {
        return "login"; // Loads login.html
    }

    // 3. PROCESS LOGIN SUBMISSION ROUTE
    @PostMapping("/login")
    public String handleLogin(@RequestParam("adminPassword") String password, Model model) {
        // Authenticating against your new custom password: TheEngineer123
        if ("TheEngineer123".equals(password)) {
            isAdminLoggedIn = true;
            
            // Load the admin dashboard data and view immediately on the spot
            List<ProjectItem> pendingOnly = new ArrayList<>();
            for (ProjectItem item : masterProjectList) {
                if (!item.isApproved()) {
                    pendingOnly.add(item);
                }
            }
            model.addAttribute("pendingProjects", pendingOnly);
            return "admin"; // Loads admin.html directly without a browser redirection
        } else {
            model.addAttribute("errorMessage", "Invalid engineering signature password.");
            return "login"; // Reloads login.html directly with the error text block
        }
    }

    // 4. LOGOUT ROUTE
    @GetMapping("/logout")
    public String handleLogout(Model model) {
        isAdminLoggedIn = false;
        return homePage(model); // Directly renders home screen layout without redirecting
    }

    @PostMapping("/add-project")
    public String addProject(@RequestParam("projectName") String newProjectName, Model model) {
        if (newProjectName != null && !newProjectName.trim().isEmpty()) {
            masterProjectList.add(new ProjectItem(newProjectName, false));
        }
        return homePage(model); // Directly refreshes public content views on the spot
    }

    @PostMapping("/approve-project")
    public String approveProject(@RequestParam("projectIndex") int index, Model model) {
        int pendingCount = 0;
        for (ProjectItem item : masterProjectList) {
            if (!item.isApproved()) {
                if (pendingCount == index) {
                    item.setApproved(true);
                    break;
                }
                pendingCount++;
            }
        }
        return adminPage(model); // Directly updates and loads admin panel state details
    }

    @PostMapping("/reject-project")
    public String rejectProject(@RequestParam("projectIndex") int index, Model model) {
        int pendingCount = 0;
        for (int i = 0; i < masterProjectList.size(); i++) {
            if (!masterProjectList.get(i).isApproved()) {
                if (pendingCount == index) {
                    masterProjectList.remove(i);
                    break;
                }
                pendingCount++;
            }
        }
        return adminPage(model); // Directly refreshes layout configuration records on the spot
    }
}
