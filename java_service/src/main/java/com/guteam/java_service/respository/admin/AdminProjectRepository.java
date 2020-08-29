package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminProjectRepository extends JpaRepository<Project, String> {
    Project findAllById(String projectId);
}
