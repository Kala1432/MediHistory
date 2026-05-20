package com.medihistory.controller;

import com.medihistory.service.DataService;
import com.medihistory.service.PatientDataService;
import com.medihistory.service.ReportService;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/doctor")
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorController {

    private final ReportService reportService;
    private final PatientDataService patientDataService;

    public DoctorController(ReportService reportService, PatientDataService patientDataService) {
        this.reportService = reportService;
        this.patientDataService = patientDataService;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        return DataService.getDoctorDashboard();
    }

    @GetMapping("/patients")
    public List<Map<String, String>> getPatients() {
        return DataService.getDoctorPatients();
    }

    @GetMapping("/appointments")
    public List<Map<String, String>> getAppointments() {
        return DataService.getDoctorSchedule();
    }

    @PostMapping("/prescriptions")
    public Map<String, Object> createPrescription(@RequestBody Map<String, String> payload, Authentication authentication) {
        return patientDataService.createPrescription(authentication.getName(), payload);
    }

    @PostMapping(value = "/report", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> uploadReport(
            @RequestParam("patientUsername") String patientUsername,
            @RequestParam("reportType") String reportType,
            @RequestParam(value = "notes", required = false) String notes,
            @RequestPart("file") MultipartFile file,
            Authentication authentication
    ) throws IOException {
        var report = reportService.uploadReport(authentication.getName(), patientUsername, file, reportType, notes);
        return Map.of(
                "status", "success",
                "message", "Report uploaded successfully for " + patientUsername,
                "fileUrl", report.getFileUrl()
        );
    }
}
