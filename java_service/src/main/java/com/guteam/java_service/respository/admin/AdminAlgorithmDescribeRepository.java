package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.AlgorithmEngine;
import com.guteam.java_service.entity.mongo.AlgorithmDescribe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Set;

public interface AdminAlgorithmDescribeRepository extends MongoRepository<AlgorithmDescribe, String> {
    AlgorithmDescribe findAllById(String algorithmDescribeId);

    List<AlgorithmDescribe> findAllByIdIn(List<String> describeIdList);
}
