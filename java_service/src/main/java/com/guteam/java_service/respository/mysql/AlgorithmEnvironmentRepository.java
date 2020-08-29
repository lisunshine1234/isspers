package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.AlgorithmEngine;
import com.guteam.java_service.entity.AlgorithmEnvironment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;


public interface AlgorithmEnvironmentRepository extends JpaRepository<AlgorithmEnvironment, String> {
    List<AlgorithmEnvironment> findAllByIdInAndActivate(Set<String> environmentSet, boolean activate);

    List<AlgorithmEnvironment> findAllByActivate(boolean activate);
}
