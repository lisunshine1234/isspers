package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.Display;
import com.guteam.java_service.entity.DisplayType;
import com.guteam.java_service.entity.Output;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminDisplayRepository extends JpaRepository<Display, String> {
    List<Display> findAllByAlgorithmIdOrderByOrderNumAsc(String algorithmId);

    void deleteAllByAlgorithmId(String algorithmId);
}
