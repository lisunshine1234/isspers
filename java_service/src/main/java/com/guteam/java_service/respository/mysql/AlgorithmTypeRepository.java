package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.AlgorithmEnvironment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlgorithmTypeRepository extends JpaRepository<AlgorithmEnvironment, String> {

}
