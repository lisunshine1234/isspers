package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.AlgorithmEngine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;


public interface AlgorithmEngineRepository extends JpaRepository<AlgorithmEngine, String> {
    List<AlgorithmEngine> findAllByIdInAndActivate(Set<String> engineSet, boolean activate);

    AlgorithmEngine findByIdAndActivate(String engineId,boolean activate);

    List<AlgorithmEngine> findAllByActivateOrderByOrderNum(boolean activate);
}
