package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.Display;
import com.guteam.java_service.entity.DisplayType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminDisplayTypeRepository extends JpaRepository<DisplayType,String> {
    List<DisplayType> findAllByActivateOrderByOrderNumAsc(boolean activate);
}
