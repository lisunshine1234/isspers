package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.OutputDisplay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OutputDisplayRepository extends JpaRepository<OutputDisplay, String> {
    List<OutputDisplay> findAllByOutputIdInOrderByOrderNum(List<String> outputList);
}
