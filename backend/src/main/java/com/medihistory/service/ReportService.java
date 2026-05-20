package com.medihistory.service;

import com.medihistory.entity.LabReportEntity;
import com.medihistory.entity.PatientEntity;
import com.medihistory.repository.LabReportRepository;
import com.medihistory.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final LabReportRepository labReportRepository;
    private final PatientRepository patientRepository;
    private final S3StorageService s3StorageService;

    public ReportService(LabReportRepository labReportRepository,
                         PatientRepository patientRepository,
                         S3StorageService s3StorageService) {
        this.labReportRepository = labReportRepository;
        this.patientRepository = patientRepository;
        this.s3StorageService = s3StorageService;
    }

    public LabReportEntity uploadReport(String doctorUsername, String patientUsername, MultipartFile file,
                                        String reportType, String notes) throws IOException {
        PatientEntity patient = patientRepository.findByUserUsername(patientUsername)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + patientUsername));

        String objectKey = String.format("patients/%s/reports/%s-%s", patientUsername, UUID.randomUUID(), file.getOriginalFilename());
        String fileUrl = s3StorageService.uploadFile(objectKey, file);

        LabReportEntity report = new LabReportEntity();
        report.setPatient(patient);
        report.setReportType(reportType);
        report.setResultSummary(notes != null ? notes : "Uploaded by doctor " + doctorUsername);
        report.setFileUrl(fileUrl);
        report.setUploadedAt(LocalDateTime.now());

        return labReportRepository.save(report);
    }

    public List<Map<String, Object>> getReportsForPatient(String username) {
        PatientEntity patient = patientRepository.findByUserUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + username));

        return labReportRepository.findByPatient(patient).stream()
                .map(report -> Map.<String, Object>of(
                        "id", report.getId(),
                        "reportType", report.getReportType(),
                        "summary", report.getResultSummary(),
                        "fileUrl", report.getFileUrl(),
                        "uploadedAt", report.getUploadedAt().toString()
                ))
                .collect(Collectors.toList());
    }
}
