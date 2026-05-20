package com.medihistory.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
public class PatientEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AppointmentEntity> appointments = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicalRecordEntity> medicalRecords = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PrescriptionEntity> prescriptions = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LabReportEntity> labReports = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InsuranceDetailEntity> insuranceDetails = new ArrayList<>();

    private String bloodGroup;
    private String allergies;
    private String emergencyContact;
    private String healthNotes;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getHealthNotes() {
        return healthNotes;
    }

    public void setHealthNotes(String healthNotes) {
        this.healthNotes = healthNotes;
    }

    public List<AppointmentEntity> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<AppointmentEntity> appointments) {
        this.appointments = appointments;
    }

    public List<MedicalRecordEntity> getMedicalRecords() {
        return medicalRecords;
    }

    public void setMedicalRecords(List<MedicalRecordEntity> medicalRecords) {
        this.medicalRecords = medicalRecords;
    }

    public List<PrescriptionEntity> getPrescriptions() {
        return prescriptions;
    }

    public void setPrescriptions(List<PrescriptionEntity> prescriptions) {
        this.prescriptions = prescriptions;
    }

    public List<LabReportEntity> getLabReports() {
        return labReports;
    }

    public void setLabReports(List<LabReportEntity> labReports) {
        this.labReports = labReports;
    }

    public List<InsuranceDetailEntity> getInsuranceDetails() {
        return insuranceDetails;
    }

    public void setInsuranceDetails(List<InsuranceDetailEntity> insuranceDetails) {
        this.insuranceDetails = insuranceDetails;
    }
}
