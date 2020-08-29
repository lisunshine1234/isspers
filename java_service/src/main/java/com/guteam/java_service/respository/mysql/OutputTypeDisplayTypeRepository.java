package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.Output;
import com.guteam.java_service.entity.OutputTypeDisplayType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OutputTypeDisplayTypeRepository extends JpaRepository<OutputTypeDisplayType, String> {
    List<OutputTypeDisplayType> findAllByActivate(boolean activate);
}
