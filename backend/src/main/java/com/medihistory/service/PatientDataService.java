package com.medihistory.service;

import com.medihistory.entity.AppointmentEntity;
import com.medihistory.entity.DoctorEntity;
import com.medihistory.entity.InsuranceDetailEntity;
import com.medihistory.entity.MedicalRecordEntity;
import com.medihistory.entity.NotificationEntity;
import com.medihistory.entity.PatientEntity;
import com.medihistory.entity.PrescriptionEntity;
import com.medihistory.entity.UserEntity;
import com.medihistory.repository.AppointmentRepository;
import com.medihistory.repository.DoctorRepository;
import com.medihistory.repository.InsuranceDetailRepository;
import com.medihistory.repository.MedicalRecordRepository;
import com.medihistory.repository.NotificationRepository;
import com.medihistory.repository.PatientRepository;
import com.medihistory.repository.PrescriptionRepository;
import com.medihistory.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class PatientDataService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final InsuranceDetailRepository insuranceDetailRepository;
    private final NotificationRepository notificationRepository;

    public PatientDataService(PatientRepository patientRepository,
                              DoctorRepository doctorRepository,
                              UserRepository userRepository,
                              AppointmentRepository appointmentRepository,
                              PrescriptionRepository prescriptionRepository,
                              MedicalRecordRepository medicalRecordRepository,
                              InsuranceDetailRepository insuranceDetailRepository,
                              NotificationRepository notificationRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.insuranceDetailRepository = insuranceDetailRepository;
        this.notificationRepository = notificationRepository;
    }

    public Map<String, Object> getOverview(String username) {
        PatientEntity patient = patient(username);
        return Map.of(
                "patientName", patient.getUser().getUsername(),
                "role", "Patient",
                "totalRecords", medicalRecordRepository.findByPatient(patient).size()
                        + prescriptionRepository.findByPatient(patient).size()
                        + appointmentRepository.findByPatient(patient).size(),
                "upcomingAppointments", appointmentRepository.findByPatient(patient).size(),
                "activeMedications", prescriptionRepository.findByPatient(patient).size(),
                "vaccinationStatus", "Keep updated",
                "emergencyAccessUrl", "/api/patient/emergency-profile"
        );
    }

    public List<Map<String, Object>> getDoctors() {
        return doctorRepository.findAll().stream().map(doctor -> Map.<String, Object>of(
                "id", doctor.getId(),
                "name", doctor.getDisplayName(),
                "username", doctor.getUser().getUsername(),
                "specialty", value(doctor.getSpecialty(), "General Medicine"),
                "hospital", value(doctor.getHospitalName(), "Independent")
        )).toList();
    }

    public List<Map<String, Object>> getAppointments(String username) {
        return appointmentRepository.findByPatient(patient(username)).stream().map(this::appointmentMap).toList();
    }

    public Map<String, Object> createAppointment(String username, Map<String, String> payload) {
        PatientEntity patient = patient(username);
        DoctorEntity doctor = doctorRepository.findById(Long.parseLong(payload.getOrDefault("doctorId", "0")))
                .orElseThrow(() -> new IllegalArgumentException("Select a valid doctor"));

        AppointmentEntity appointment = new AppointmentEntity();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(parseDateTime(payload.get("date"), payload.get("time")));
        appointment.setType(value(payload.get("type"), "Consultation"));
        appointment.setMode(value(payload.get("mode"), "In person"));
        appointment.setNotes(value(payload.get("notes"), "Requested by patient"));
        appointment.setStatus("Requested");
        return appointmentMap(appointmentRepository.save(appointment));
    }

    public Map<String, Object> updateAppointment(String username, Long id, Map<String, String> payload) {
        AppointmentEntity appointment = ownAppointment(username, id);
        appointment.setAppointmentTime(parseDateTime(payload.get("date"), payload.get("time")));
        appointment.setType(value(payload.get("type"), appointment.getType()));
        appointment.setMode(value(payload.get("mode"), appointment.getMode()));
        appointment.setNotes(value(payload.get("notes"), appointment.getNotes()));
        appointment.setStatus(value(payload.get("status"), appointment.getStatus()));
        return appointmentMap(appointmentRepository.save(appointment));
    }

    public void deleteAppointment(String username, Long id) {
        appointmentRepository.delete(ownAppointment(username, id));
    }

    public List<Map<String, Object>> getMedicalHistory(String username) {
        return medicalRecordRepository.findByPatient(patient(username)).stream().map(this::recordMap).toList();
    }

    public Map<String, Object> createMedicalRecord(String username, Map<String, String> payload) {
        MedicalRecordEntity record = new MedicalRecordEntity();
        record.setPatient(patient(username));
        record.setCategory(value(payload.get("category"), "General"));
        record.setTitle(value(payload.get("title"), "Medical record"));
        record.setDescription(value(payload.get("notes"), ""));
        record.setStorageUrl(value(payload.get("storageUrl"), ""));
        record.setUploadedAt(LocalDateTime.now());
        return recordMap(medicalRecordRepository.save(record));
    }

    public Map<String, Object> updateMedicalRecord(String username, Long id, Map<String, String> payload) {
        MedicalRecordEntity record = ownRecord(username, id);
        record.setCategory(value(payload.get("category"), record.getCategory()));
        record.setTitle(value(payload.get("title"), record.getTitle()));
        record.setDescription(value(payload.get("notes"), record.getDescription()));
        record.setStorageUrl(value(payload.get("storageUrl"), record.getStorageUrl()));
        return recordMap(medicalRecordRepository.save(record));
    }

    public void deleteMedicalRecord(String username, Long id) {
        medicalRecordRepository.delete(ownRecord(username, id));
    }

    public List<Map<String, Object>> getPrescriptions(String username) {
        return prescriptionRepository.findByPatient(patient(username)).stream().map(this::prescriptionMap).toList();
    }

    public Map<String, Object> createPrescription(String doctorUsername, Map<String, String> payload) {
        PatientEntity patient = patient(payload.get("patientUsername"));
        DoctorEntity doctor = doctorRepository.findByUserUsername(doctorUsername)
                .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found"));

        PrescriptionEntity prescription = new PrescriptionEntity();
        prescription.setPatient(patient);
        prescription.setMedicationName(value(payload.get("name"), "Medication"));
        prescription.setDosage(value(payload.get("dosage"), ""));
        prescription.setFrequency(value(payload.get("frequency"), ""));
        prescription.setNotes(value(payload.get("notes"), ""));
        prescription.setPrescribedBy(doctor.getDisplayName());
        prescription.setPrescribedAt(LocalDateTime.now());
        return prescriptionMap(prescriptionRepository.save(prescription));
    }

    public List<Map<String, Object>> getInsurance(String username) {
        return insuranceDetailRepository.findByPatient(patient(username)).stream().map(this::insuranceMap).toList();
    }

    public Map<String, Object> createInsurance(String username, Map<String, String> payload) {
        InsuranceDetailEntity insurance = new InsuranceDetailEntity();
        insurance.setPatient(patient(username));
        insurance.setProvider(value(payload.get("provider"), "Insurance Provider"));
        insurance.setPolicyNumber(value(payload.get("policyNumber"), ""));
        insurance.setStatus(value(payload.get("status"), "Pending Verification"));
        insurance.setIssuedAt(parseDate(payload.get("issuedAt")));
        return insuranceMap(insuranceDetailRepository.save(insurance));
    }

    public Map<String, Object> updateInsurance(String username, Long id, Map<String, String> payload) {
        InsuranceDetailEntity insurance = ownInsurance(username, id);
        insurance.setProvider(value(payload.get("provider"), insurance.getProvider()));
        insurance.setPolicyNumber(value(payload.get("policyNumber"), insurance.getPolicyNumber()));
        insurance.setStatus(value(payload.get("status"), insurance.getStatus()));
        insurance.setIssuedAt(parseDate(value(payload.get("issuedAt"), dateOnly(insurance.getIssuedAt()))));
        return insuranceMap(insuranceDetailRepository.save(insurance));
    }

    public void deleteInsurance(String username, Long id) {
        insuranceDetailRepository.delete(ownInsurance(username, id));
    }

    public List<Map<String, Object>> getReminders(String username) {
        UserEntity user = user(username);
        return notificationRepository.findByUser(user).stream().map(this::reminderMap).toList();
    }

    public Map<String, Object> createReminder(String username, Map<String, String> payload) {
        NotificationEntity reminder = new NotificationEntity();
        reminder.setUser(user(username));
        reminder.setTitle(value(payload.get("title"), "Reminder"));
        reminder.setMessage(value(payload.get("detail"), ""));
        reminder.setCreatedAt(parseDateTime(payload.get("dueDate"), payload.get("dueTime")));
        reminder.setReadFlag(false);
        return reminderMap(notificationRepository.save(reminder));
    }

    public Map<String, Object> updateReminder(String username, Long id, Map<String, String> payload) {
        NotificationEntity reminder = ownReminder(username, id);
        reminder.setTitle(value(payload.get("title"), reminder.getTitle()));
        reminder.setMessage(value(payload.get("detail"), reminder.getMessage()));
        reminder.setCreatedAt(parseDateTime(payload.get("dueDate"), payload.get("dueTime")));
        reminder.setReadFlag(Boolean.parseBoolean(value(payload.get("read"), String.valueOf(reminder.isReadFlag()))));
        return reminderMap(notificationRepository.save(reminder));
    }

    public void deleteReminder(String username, Long id) {
        notificationRepository.delete(ownReminder(username, id));
    }

    public Map<String, String> getEmergencyProfile(String username) {
        PatientEntity patient = patient(username);
        return Map.of(
                "name", patient.getUser().getUsername(),
                "bloodGroup", value(patient.getBloodGroup(), "Not set"),
                "allergies", value(patient.getAllergies(), "Not set"),
                "conditions", value(patient.getHealthNotes(), "Not set"),
                "emergencyContact", value(patient.getEmergencyContact(), "Not set")
        );
    }

    public Map<String, String> updateEmergencyProfile(String username, Map<String, String> payload) {
        PatientEntity patient = patient(username);
        patient.setBloodGroup(value(payload.get("bloodGroup"), patient.getBloodGroup()));
        patient.setAllergies(value(payload.get("allergies"), patient.getAllergies()));
        patient.setHealthNotes(value(payload.get("conditions"), patient.getHealthNotes()));
        patient.setEmergencyContact(value(payload.get("emergencyContact"), patient.getEmergencyContact()));
        patientRepository.save(patient);
        return getEmergencyProfile(username);
    }

    public List<Map<String, String>> getAnalytics(String username) {
        PatientEntity patient = patient(username);
        return List.of(
                Map.of("label", "Records", "value", String.valueOf(medicalRecordRepository.findByPatient(patient).size()), "trend", "Live"),
                Map.of("label", "Prescriptions", "value", String.valueOf(prescriptionRepository.findByPatient(patient).size()), "trend", "Live"),
                Map.of("label", "Appointments", "value", String.valueOf(appointmentRepository.findByPatient(patient).size()), "trend", "Live"),
                Map.of("label", "Insurance", "value", String.valueOf(insuranceDetailRepository.findByPatient(patient).size()), "trend", "Live")
        );
    }

    private Map<String, Object> appointmentMap(AppointmentEntity appointment) {
        return Map.of(
                "id", appointment.getId(),
                "date", dateOnly(appointment.getAppointmentTime()),
                "time", timeOnly(appointment.getAppointmentTime()),
                "provider", appointment.getDoctor().getDisplayName(),
                "doctorId", appointment.getDoctor().getId(),
                "type", value(appointment.getType(), "Consultation"),
                "location", value(appointment.getDoctor().getHospitalName(), "Clinic"),
                "mode", value(appointment.getMode(), "In person"),
                "status", value(appointment.getStatus(), "Requested"),
                "notes", value(appointment.getNotes(), "")
        );
    }

    private Map<String, Object> prescriptionMap(PrescriptionEntity prescription) {
        return Map.of(
                "id", prescription.getId(),
                "name", value(prescription.getMedicationName(), "Medication"),
                "dosage", value(prescription.getDosage(), ""),
                "frequency", value(prescription.getFrequency(), ""),
                "provider", value(prescription.getPrescribedBy(), "Doctor"),
                "status", "Active",
                "notes", value(prescription.getNotes(), ""),
                "date", dateOnly(prescription.getPrescribedAt())
        );
    }

    private Map<String, Object> recordMap(MedicalRecordEntity record) {
        return Map.of(
                "id", record.getId(),
                "date", dateOnly(record.getUploadedAt()),
                "type", "Medical Record",
                "provider", "Patient",
                "category", value(record.getCategory(), "General"),
                "title", value(record.getTitle(), "Medical record"),
                "notes", value(record.getDescription(), ""),
                "storageUrl", value(record.getStorageUrl(), "")
        );
    }

    private Map<String, Object> insuranceMap(InsuranceDetailEntity insurance) {
        return Map.of(
                "id", insurance.getId(),
                "name", value(insurance.getProvider(), "Insurance Provider"),
                "provider", value(insurance.getProvider(), "Insurance Provider"),
                "policyNumber", value(insurance.getPolicyNumber(), ""),
                "uploaded", dateOnly(insurance.getIssuedAt()),
                "issuedAt", dateOnly(insurance.getIssuedAt()),
                "status", value(insurance.getStatus(), "Pending Verification")
        );
    }

    private Map<String, Object> reminderMap(NotificationEntity reminder) {
        return Map.of(
                "id", reminder.getId(),
                "title", value(reminder.getTitle(), "Reminder"),
                "detail", value(reminder.getMessage(), ""),
                "due", displayDateTime(reminder.getCreatedAt()),
                "dueDate", dateOnly(reminder.getCreatedAt()),
                "dueTime", timeOnly(reminder.getCreatedAt()),
                "read", reminder.isReadFlag()
        );
    }

    private PatientEntity patient(String username) {
        return patientRepository.findByUserUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found: " + username));
    }

    private UserEntity user(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
    }

    private AppointmentEntity ownAppointment(String username, Long id) {
        AppointmentEntity appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        if (!appointment.getPatient().getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("Appointment does not belong to this patient");
        }
        return appointment;
    }

    private MedicalRecordEntity ownRecord(String username, Long id) {
        MedicalRecordEntity record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medical record not found"));
        if (!record.getPatient().getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("Medical record does not belong to this patient");
        }
        return record;
    }

    private InsuranceDetailEntity ownInsurance(String username, Long id) {
        InsuranceDetailEntity insurance = insuranceDetailRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Insurance record not found"));
        if (!insurance.getPatient().getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("Insurance record does not belong to this patient");
        }
        return insurance;
    }

    private NotificationEntity ownReminder(String username, Long id) {
        NotificationEntity reminder = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reminder not found"));
        if (!reminder.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("Reminder does not belong to this patient");
        }
        return reminder;
    }

    private LocalDateTime parseDateTime(String date, String time) {
        String safeDate = value(date, LocalDate.now().toString());
        String safeTime = value(time, "09:00");
        return LocalDateTime.parse(safeDate + "T" + safeTime);
    }

    private LocalDateTime parseDate(String date) {
        return LocalDate.parse(value(date, LocalDate.now().toString())).atStartOfDay();
    }

    private String dateOnly(LocalDateTime dateTime) {
        return dateTime == null ? LocalDate.now().toString() : dateTime.toLocalDate().toString();
    }

    private String timeOnly(LocalDateTime dateTime) {
        return dateTime == null ? "09:00" : dateTime.toLocalTime().toString().substring(0, 5);
    }

    private String displayDateTime(LocalDateTime dateTime) {
        return dateOnly(dateTime) + " " + timeOnly(dateTime);
    }

    private String value(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
