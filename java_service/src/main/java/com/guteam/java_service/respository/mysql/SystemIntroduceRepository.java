package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.SystemIntroduce;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SystemIntroduceRepository extends JpaRepository<SystemIntroduce, String> {
    List<SystemIntroduce> findAllByActivateOrderByOrderNumAsc(boolean isActivate);

}
