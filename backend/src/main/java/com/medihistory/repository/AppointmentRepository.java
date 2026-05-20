package com.medihistory.repository;

import com.medihistory.entity.AppointmentEntity;
import com.medihistory.entity.DoctorEntity;
import com.medihistory.entity.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {
    List<AppointmentEntity> findByPatient(PatientEntity patient);
    List<AppointmentEntity> findByDoctor(DoctorEntity doctor);
}
