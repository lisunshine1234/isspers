package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.Output;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminOutputRepository extends JpaRepository<Output,String> {
    List<Output> findAllByAlgorithmIdOrderByOrderNumAsc(String algorithmId);

    void deleteAllByIdIn(List<String> outputIdDeleteList);

    void deleteAllByAlgorithmId(String algorithmId);
}
