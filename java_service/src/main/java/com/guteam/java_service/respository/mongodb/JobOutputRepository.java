package com.guteam.java_service.respository.mongodb;

import com.guteam.java_service.entity.mongo.JobOutput;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JobOutputRepository extends MongoRepository<JobOutput, String> {
    JobOutput findAllById(String jobOutputMongoId);

}
