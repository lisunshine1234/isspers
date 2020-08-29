package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.SystemIntroduce;
import com.guteam.java_service.entity.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdminSystemIntroduceRepository extends JpaRepository<SystemIntroduce,String> {

    @Query(value = "SELECT * FROM system_introduce ORDER BY order_num ASC",nativeQuery = true)
    List<SystemIntroduce> findAllOrderByOrderNumAsc();
}
