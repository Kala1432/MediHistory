package com.medihistory.repository;

import com.medihistory.entity.InsuranceDetailEntity;
import com.medihistory.entity.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsuranceDetailRepository extends JpaRepository<InsuranceDetailEntity, Long> {
    List<InsuranceDetailEntity> findByPatient(PatientEntity patient);
}
