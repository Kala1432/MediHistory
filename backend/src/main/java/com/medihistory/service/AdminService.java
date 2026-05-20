package com.medihistory.service;

import com.medihistory.dto.CreateDoctorRequest;
import com.medihistory.entity.DoctorEntity;
import com.medihistory.entity.UserEntity;
import com.medihistory.repository.DoctorRepository;
import com.medihistory.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository,
                        DoctorRepository doctorRepository,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Map<String, String>> getDoctors() {
        List<Map<String, String>> doctors = doctorRepository.findAll()
                .stream()
                .map(this::toDoctorCard)
                .toList();

        return doctors.isEmpty() ? DataService.getDoctors() : doctors;
    }

    public Map<String, String> createDoctor(CreateDoctorRequest request) {
        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

        Optional<UserEntity> existingUsername = userRepository.findByUsername(username);
        if (existingUsername.isPresent()) {
            throw new IllegalArgumentException("Username is already taken");
        }

        Optional<UserEntity> existingEmail = userRepository.findByEmail(email);
        if (existingEmail.isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }

        UserEntity user = new UserEntity();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("doctor");
        user.setPhone(clean(request.getPhone()));
        user.setEnabled(true);

        UserEntity savedUser = userRepository.save(user);

        DoctorEntity doctor = new DoctorEntity();
        doctor.setUser(savedUser);
        doctor.setDisplayName(request.getName().trim());
        doctor.setSpecialty(request.getSpecialty().trim());
        doctor.setHospitalName(clean(request.getHospitalName()));
        doctor.setQualifications(clean(request.getQualifications()));
        doctorRepository.save(doctor);

        return Map.of(
                "status", "created",
                "message", "Doctor account created for " + doctor.getDisplayName(),
                "username", savedUser.getUsername()
        );
    }

    private Map<String, String> toDoctorCard(DoctorEntity doctor) {
        UserEntity user = doctor.getUser();
        return Map.of(
                "name", doctor.getDisplayName(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "specialty", valueOrFallback(doctor.getSpecialty(), "General Medicine"),
                "hospital", valueOrFallback(doctor.getHospitalName(), "Independent"),
                "qualifications", valueOrFallback(doctor.getQualifications(), "Not provided"),
                "status", user.isEnabled() ? "Active" : "Disabled"
        );
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String valueOrFallback(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
