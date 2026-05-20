package com.medihistory.model;

public class Appointment {
    private String date;
    private String doctor;
    private String type;
    private String location;
    private String mode;

    public Appointment() {
    }

    public Appointment(String date, String doctor, String type) {
        this.date = date;
        this.doctor = doctor;
        this.type = type;
    }

    public Appointment(String date, String doctor, String type, String location, String mode) {
        this.date = date;
        this.doctor = doctor;
        this.type = type;
        this.location = location;
        this.mode = mode;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getDoctor() {
        return doctor;
    }

    public void setDoctor(String doctor) {
        this.doctor = doctor;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }
}
