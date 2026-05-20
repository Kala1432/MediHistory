package com.medihistory.repository;

import com.medihistory.entity.LabReportEntity;
import com.medihistory.entity.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabReportRepository extends JpaRepository<LabReportEntity, Long> {
    List<LabReportEntity> findByPatient(PatientEntity patient);
}
