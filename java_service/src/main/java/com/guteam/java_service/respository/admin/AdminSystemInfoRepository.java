package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.SystemInfo;
import com.guteam.java_service.entity.SystemIntroduce;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminSystemInfoRepository extends JpaRepository<SystemInfo,String> {

}
