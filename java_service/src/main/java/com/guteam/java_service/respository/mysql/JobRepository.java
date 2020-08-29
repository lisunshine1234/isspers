package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, String> {
    List<Job> findAllByUserIdOrderByCreateTimeDesc(String userId);

    Job findFirstByUserIdOrderByCreateTimeDesc(String userId);

    Job findByIdAndUserId(String jobId, String userId);
}
