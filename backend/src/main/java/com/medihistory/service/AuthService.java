package com.medihistory.service;

import com.medihistory.dto.JwtResponse;
import com.medihistory.dto.LoginRequest;
import com.medihistory.dto.MessageResponse;
import com.medihistory.dto.RegisterRequest;
import com.medihistory.entity.PatientEntity;
import com.medihistory.entity.UserEntity;
import com.medihistory.repository.PatientRepository;
import com.medihistory.repository.UserRepository;
import com.medihistory.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Optional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PatientRepository patientRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        String usernameOrEmail = loginRequest.getUsernameOrEmail().trim();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(usernameOrEmail, loginRequest.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtTokenProvider.generateToken(userDetails);
        UserEntity user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user could not be loaded"));

        return new JwtResponse(jwt, user.getUsername(), user.getRole());
    }

    public MessageResponse registerUser(RegisterRequest registerRequest) {
        String username = registerRequest.getUsername().trim();
        String email = registerRequest.getEmail().trim().toLowerCase(Locale.ROOT);

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
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole("patient");
        user.setPhone(registerRequest.getPhone() != null ? registerRequest.getPhone().trim() : null);
        user.setEnabled(true);

        UserEntity savedUser = userRepository.save(user);

        PatientEntity patient = new PatientEntity();
        patient.setUser(savedUser);
        patient.setHealthNotes("New patient profile. Complete health details after first consultation.");
        patientRepository.save(patient);

        return new MessageResponse("Patient account registered successfully");
    }
}
