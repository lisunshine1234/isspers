package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.AlgorithmEngine;
import com.guteam.java_service.entity.AlgorithmEnvironment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface AdminAlgorithmEnvironmentRepository extends JpaRepository<AlgorithmEnvironment,String> {
    List<AlgorithmEnvironment> findAllByIdIn(Set<String> idSet);
}
