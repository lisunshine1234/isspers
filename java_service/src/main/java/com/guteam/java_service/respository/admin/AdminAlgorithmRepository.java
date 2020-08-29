package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.Algorithm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminAlgorithmRepository extends JpaRepository<Algorithm,String> {
    List<Algorithm> findAllByAlgorithmType(String algorithmType);
}
