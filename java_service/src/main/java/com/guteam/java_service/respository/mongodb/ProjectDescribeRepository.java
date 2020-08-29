package com.guteam.java_service.respository.mongodb;

import com.guteam.java_service.entity.mongo.AlgorithmDescribe;
import com.guteam.java_service.entity.mongo.ProjectDescribe;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectDescribeRepository extends MongoRepository<ProjectDescribe, String> {
}
