package com.guteam.java_service.respository.mongodb;

import com.guteam.java_service.entity.mongo.AlgorithmDescribe;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AlgorithmDescribeRepository extends MongoRepository<AlgorithmDescribe, String> {
    AlgorithmDescribe findAllById(String algorithmDescribeId);

    List<AlgorithmDescribe> findAllByIdIn(List<String> describeIdList);
}
