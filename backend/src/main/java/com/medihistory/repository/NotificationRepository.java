package com.medihistory.repository;

import com.medihistory.entity.NotificationEntity;
import com.medihistory.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByUser(UserEntity user);
}
