package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.Input;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminInputRepository extends JpaRepository<Input,String> {
    List<Input> findAllByAlgorithmIdOrderByOrderNumAsc(String algorithmId);

    void deleteAllByAlgorithmId(String algorithmId);
}
