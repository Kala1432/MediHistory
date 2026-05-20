package com.medihistory.config;

import com.medihistory.entity.UserEntity;
import com.medihistory.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedInitialAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isPresent()) {
                return;
            }

            UserEntity admin = new UserEntity();
            admin.setUsername("admin");
            admin.setEmail("admin@medihistory.local");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole("admin");
            admin.setPhone("0000000000");
            admin.setEnabled(true);
            userRepository.save(admin);
        };
    }
}
