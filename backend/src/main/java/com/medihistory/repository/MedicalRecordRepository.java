package com.medihistory.repository;

import com.medihistory.entity.MedicalRecordEntity;
import com.medihistory.entity.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecordEntity, Long> {
    List<MedicalRecordEntity> findByPatient(PatientEntity patient);
}
