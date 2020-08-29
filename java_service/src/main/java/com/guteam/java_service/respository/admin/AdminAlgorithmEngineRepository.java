package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.AlgorithmEngine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface AdminAlgorithmEngineRepository extends JpaRepository<AlgorithmEngine,String> {
    List<AlgorithmEngine> findAllByIdIn(Set<String> idSet);
}
