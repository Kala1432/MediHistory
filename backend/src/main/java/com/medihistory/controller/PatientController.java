package com.medihistory.controller;

import com.medihistory.service.PatientDataService;
import com.medihistory.service.ReportService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/patient")
@PreAuthorize("hasRole('PATIENT')")
public class PatientController {

    private final ReportService reportService;
    private final PatientDataService patientDataService;

    public PatientController(ReportService reportService, PatientDataService patientDataService) {
        this.reportService = reportService;
        this.patientDataService = patientDataService;
    }

    @GetMapping("/overview")
    public Map<String, Object> getOverview(Authentication authentication) {
        return patientDataService.getOverview(authentication.getName());
    }

    @GetMapping("/doctors")
    public List<Map<String, Object>> getDoctors() {
        return patientDataService.getDoctors();
    }

    @GetMapping("/medical-history")
    public List<Map<String, Object>> getMedicalHistory(Authentication authentication) {
        return patientDataService.getMedicalHistory(authentication.getName());
    }

    @PostMapping("/medical-history")
    public Map<String, Object> createMedicalHistory(@RequestBody Map<String, String> payload, Authentication authentication) {
        return patientDataService.createMedicalRecord(authentication.getName(), payload);
    }

    @PutMapping("/medical-history/{id}")
    public Map<String, Object> updateMedicalHistory(@PathVariable Long id, @RequestBody Map<String, String> payload, Authentication authentication) {
        return patientDataService.updateMedicalRecord(authentication.getName(), id, payload);
    }

    @DeleteMapping("/medical-history/{id}")
    public Map<String, String> deleteMedicalHistory(@PathVariable Long id, Authentication authentication) {
        patientDataService.deleteMedicalRecord(authentication.getName(), id);
        return Map.of("status", "deleted");
    }

    @GetMapping("/prescriptions")
    public List<Map<String, Object>> getPrescriptions(Authentication authentication) {
        return patientDataService.getPrescriptions(authentication.getName());
    }

    @GetMapping("/vaccinations")
    public List<Map<String, String>> getVaccinations() {
        return List.of(
                Map.of("name", "COVID-19", "date", "2025-12-02", "status", "Completed"),
                Map.of("name", "Flu", "date", "2026-01-18", "status", "Completed"),
                Map.of("name", "Hepatitis B", "date", "2025-09-10", "status", "Due")
        );
    }

    @GetMapping("/insurance")
    public List<Map<String, Object>> getInsuranceDetails(Authentication authentication) {
        return patientDataService.getInsurance(authentication.getName());
    }

    @PostMapping("/insurance")
    public Map<String, Object> createInsurance(@RequestBody Map<String, String> payload, Authentication authentication) {
        return patientDataService.createInsurance(authentication.getName(), payload);
    }

    @PutMapping("/insurance/{id}")
    public Map<String, Object> updateInsurance(@PathVariable Long id, @RequestBody Map<String, String> payload, Authentication authentication) {
        return patientDataService.updateInsurance(authentication.getName(), id, payload);
    }

    @DeleteMapping("/insurance/{id}")
    public Map<String, String> deleteInsurance(@PathVariable Long id, Authentication authentication) {
        patientDataService.deleteInsurance(authentication.getName(), id);
        return Map.of("status", "deleted");
    }

    @GetMapping("/analytics")
    public List<Map<String, String>> getAnalytics(Authentication authentication) {
        return patientDataService.getAnalytics(authentication.getName());
    }

    @GetMapping("/reminders")
    public List<Map<String, Object>> getReminders(Authentication authentication) {
        return patientDataService.getReminders(authentication.getName());
    }

    @PostMapping("/reminders")
    public Map<String, Object> createReminder(@RequestBody Map<String, String> payload, Authentication authentication) {
        return patientDataService.createReminder(authentication.getName(), payload);
    }

    @PutMapping("/reminders/{id}")
    public Map<String, Object> updateReminder(@PathVariable Long id, @RequestBody Map<String, String> payload, Authentication authentication) {
        return patientDataService.updateReminder(authentication.getName(), id, payload);
    }

    @DeleteMapping("/reminders/{id}")
    public Map<String, String> deleteReminder(@PathVariable Long id, Authentication authentication) {
        patientDataService.deleteReminder(authentication.getName(), id);
        return Map.of("status", "deleted");
    }

    @GetMapping("/appointments")
    public List<Map<String, Object>> getAppointments(Authentication authentication) {
        return patientDataService.getAppointments(authentication.getName());
    }

    @GetMapping("/emergency-profile")
    public Map<String, String> getEmergencyProfile(Authentication authentication) {
        return patientDataService.getEmergencyProfile(authentication.getName());
    }

    @PutMapping("/emergency-profile")
    public Map<String, String> updateEmergencyProfile(@RequestBody Map<String, String> payload, Authentication authentication) {
        return patientDataService.updateEmergencyProfile(authentication.getName(), payload);
    }

    @GetMapping("/reports")
    public List<Map<String, Object>> getReports(Authentication authentication) {
        return reportService.getReportsForPatient(authentication.getName());
    }

    @PostMapping("/appointments")
    public Map<String, Object> createAppointment(@RequestBody Map<String, String> payload, Authentication authentication) {
        return patientDataService.createAppointment(authentication.getName(), payload);
    }

    @PutMapping("/appointments/{id}")
    public Map<String, Object> updateAppointment(@PathVariable Long id, @RequestBody Map<String, String> payload, Authentication authentication) {
        return patientDataService.updateAppointment(authentication.getName(), id, payload);
    }

    @DeleteMapping("/appointments/{id}")
    public Map<String, String> deleteAppointment(@PathVariable Long id, Authentication authentication) {
        patientDataService.deleteAppointment(authentication.getName(), id);
        return Map.of("status", "deleted");
    }
}
