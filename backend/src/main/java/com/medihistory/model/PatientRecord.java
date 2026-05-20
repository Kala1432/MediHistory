package com.medihistory.model;

public class PatientRecord {
    private final int totalRecords;
    private final int upcomingAppointments;
    private final int activeMedications;
    private final String vaccinationStatus;

    public PatientRecord(int totalRecords, int upcomingAppointments, int activeMedications, String vaccinationStatus) {
        this.totalRecords = totalRecords;
        this.upcomingAppointments = upcomingAppointments;
        this.activeMedications = activeMedications;
        this.vaccinationStatus = vaccinationStatus;
    }

    public int getTotalRecords() {
        return totalRecords;
    }

    public int getUpcomingAppointments() {
        return upcomingAppointments;
    }

    public int getActiveMedications() {
        return activeMedications;
    }

    public String getVaccinationStatus() {
        return vaccinationStatus;
    }
}
