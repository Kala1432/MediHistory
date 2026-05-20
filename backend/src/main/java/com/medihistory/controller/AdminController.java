package com.medihistory.controller;

import com.medihistory.dto.CreateDoctorRequest;
import com.medihistory.service.AdminService;
import com.medihistory.service.DataService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        return DataService.getAdminDashboard();
    }

    @GetMapping("/doctors")
    public List<Map<String, String>> getDoctors() {
        return adminService.getDoctors();
    }

    @PostMapping("/doctors")
    public Map<String, String> createDoctor(@Valid @RequestBody CreateDoctorRequest request) {
        return adminService.createDoctor(request);
    }

    @GetMapping("/verify-profiles")
    public List<Map<String, String>> getPendingVerifications() {
        return DataService.getPendingVerifications();
    }

    @PostMapping("/verify")
    public Map<String, String> verifyProfile(@RequestBody Map<String, String> payload) {
        return Map.of(
                "status", "verified",
                "message", payload.getOrDefault("name", "Profile") + " has been verified"
        );
    }

    @GetMapping("/reports")
    public List<Map<String, String>> getReportStats() {
        return DataService.getReportStats();
    }
}
