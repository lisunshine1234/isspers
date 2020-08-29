package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.Job;
import com.guteam.java_service.entity.UserType;
import org.apache.catalina.LifecycleState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdminJobRepository extends JpaRepository<Job,String> {

    @Query(value = "SELECT * FROM job ORDER BY create_time desc",nativeQuery = true)
    List<Job> findAllOrderByCreateTimeDesc();
}
