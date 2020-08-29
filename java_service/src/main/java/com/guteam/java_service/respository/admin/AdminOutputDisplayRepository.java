package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.OutputDisplay;
import com.guteam.java_service.entity.OutputTypeDisplayType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminOutputDisplayRepository extends JpaRepository<OutputDisplay,String> {
}
