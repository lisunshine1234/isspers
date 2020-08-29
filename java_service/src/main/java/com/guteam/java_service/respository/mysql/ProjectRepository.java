package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, String> {
    List<Project> findByUserIdAndActivateAndNonLock(String userId, boolean isActivate, boolean isNonLock);

    Project findByIdAndUserId(String id, String userId);

    @Modifying
    @Query(value = "select * from project where user_id = ? ORDER BY activate desc,update_time desc", nativeQuery = true)
    List<Project> findAllByUserIdOrderByUpdateTimeDesc(String userId);


    @Modifying
    @Query(value = "update project set activate = false where id <> ? and user_id = ? ", nativeQuery = true)
    void updateAllActivateToFalse(String id, String userId);

}
