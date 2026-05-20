package com.medihistory.service;

import java.util.List;
import java.util.Map;

public class DataService {

    public static Map<String, Object> getPatientOverview() {
        return Map.of(
                "patientName", "Ananya Sharma",
                "role", "Patient",
                "totalRecords", 124,
                "upcomingAppointments", 3,
                "activeMedications", 5,
                "vaccinationStatus", "Up to date",
                "emergencyAccessUrl", "/api/patient/emergency-profile"
        );
    }

    public static List<Map<String, String>> getMedicalHistory() {
        return List.of(
                Map.of("date", "2026-04-14", "type", "Lab Report", "provider", "City Hospital", "category", "Blood Test", "notes", "Normal range"),
                Map.of("date", "2026-03-28", "type", "Prescription", "provider", "Dr. Rohan Singh", "category", "Diabetes", "notes", "Continue metformin"),
                Map.of("date", "2026-02-10", "type", "Vaccination", "provider", "City Clinic", "category", "Flu Shot", "notes", "No complications")
        );
    }

    public static List<Map<String, String>> getPrescriptions() {
        return List.of(
                Map.of("name", "Metformin", "dosage", "500mg", "frequency", "Twice daily", "provider", "Dr. Rohan Singh", "status", "Active"),
                Map.of("name", "Atorvastatin", "dosage", "20mg", "frequency", "Once daily", "provider", "Dr. Asha Mehta", "status", "Active")
        );
    }

    public static List<Map<String, String>> getVaccinations() {
        return List.of(
                Map.of("name", "COVID-19", "date", "2025-12-02", "status", "Completed"),
                Map.of("name", "Flu", "date", "2026-01-18", "status", "Completed"),
                Map.of("name", "Hepatitis B", "date", "2025-09-10", "status", "Due")
        );
    }

    public static List<Map<String, String>> getInsuranceDetails() {
        return List.of(
                Map.of("name", "Health Insurance Card", "uploaded", "2025-11-05", "status", "Verified"),
                Map.of("name", "Policy Document", "uploaded", "2026-02-01", "status", "Pending Verification")
        );
    }

    public static List<Map<String, String>> getReminders() {
        return List.of(
                Map.of("title", "Metformin", "detail", "Take 500mg after breakfast", "due", "Today 08:00 AM"),
                Map.of("title", "Appointment", "detail", "Consultation with Dr. Asha Mehta", "due", "May 25, 2026 10:00 AM"),
                Map.of("title", "Vaccination", "detail", "Hepatitis B booster due", "due", "Jun 15, 2026")
        );
    }

    public static List<Map<String, String>> getAnalytics() {
        return List.of(
                Map.of("label", "BMI", "value", "22.7", "trend", "Stable"),
                Map.of("label", "Blood Pressure", "value", "118/78", "trend", "Normal"),
                Map.of("label", "Glucose", "value", "98 mg/dL", "trend", "Controlled"),
                Map.of("label", "Sleep Score", "value", "86", "trend", "Improving")
        );
    }

    public static Map<String, String> getEmergencyProfile() {
        return Map.of(
                "name", "Ananya Sharma",
                "bloodGroup", "O+",
                "allergies", "Penicillin",
                "conditions", "Asthma",
                "emergencyContact", "+91 98765 43210"
        );
    }

    public static Map<String, Object> getDoctorDashboard() {
        return Map.of(
                "activePatients", 56,
                "pendingReports", 12,
                "followUpsToday", 7,
                "notesProcessed", 320
        );
    }

    public static List<Map<String, String>> getDoctorPatients() {
        return List.of(
                Map.of("name", "Sneha Patel", "age", "32", "condition", "Hypertension", "lastVisit", "May 2, 2026"),
                Map.of("name", "Arjun Mehta", "age", "45", "condition", "Type 2 Diabetes", "lastVisit", "Apr 18, 2026"),
                Map.of("name", "Nisha Rao", "age", "28", "condition", "Asthma", "lastVisit", "Mar 22, 2026")
        );
    }

    public static List<Map<String, String>> getDoctorSchedule() {
        return List.of(
                Map.of("date", "May 25, 2026", "time", "10:00 AM", "patient", "Sneha Patel", "type", "Follow-up"),
                Map.of("date", "May 26, 2026", "time", "02:00 PM", "patient", "Arjun Mehta", "type", "Prescription review")
        );
    }

    public static Map<String, Object> getAdminDashboard() {
        return Map.of(
                "hospitalAccounts", 14,
                "pendingVerifications", 2,
                "activeDoctors", 38,
                "platformSessions", 12400
        );
    }

    public static List<Map<String, String>> getDoctors() {
        return List.of(
                Map.of("name", "Dr. Asha Mehta", "specialty", "Cardiology", "status", "Active"),
                Map.of("name", "Dr. Rohan Singh", "specialty", "Endocrinology", "status", "Active"),
                Map.of("name", "Dr. Kavita Sharma", "specialty", "Pediatrics", "status", "Pending")
        );
    }

    public static List<Map<String, String>> getPendingVerifications() {
        return List.of(
                Map.of("name", "Rahul Jain", "type", "Patient", "submitted", "May 18, 2026"),
                Map.of("name", "Nidhi Kapoor", "type", "Hospital", "submitted", "May 12, 2026")
        );
    }

    public static List<Map<String, String>> getReportStats() {
        return List.of(
                Map.of("title", "Hospital Report Uploads", "value", "48", "change", "+12%"),
                Map.of("title", "Doctor Notes Processed", "value", "320", "change", "+8%")
        );
    }
}
