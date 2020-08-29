package com.guteam.java_service.respository.mongodb;

import com.guteam.java_service.entity.mongo.JobRunInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JobRunInfoRepository extends MongoRepository<JobRunInfo, String> {
    JobRunInfo findAllById(String jobRunInfoMongoId);

}
