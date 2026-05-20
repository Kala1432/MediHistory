package com.medihistory.repository;

import com.medihistory.entity.PrescriptionEntity;
import com.medihistory.entity.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<PrescriptionEntity, Long> {
    List<PrescriptionEntity> findByPatient(PatientEntity patient);
}
