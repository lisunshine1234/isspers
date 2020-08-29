package com.guteam.java_service.respository.mongodb;

import com.guteam.java_service.entity.mongo.SystemIntroduceInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AdminSystemIntroduceInfoRepository extends MongoRepository<SystemIntroduceInfo, String> {
    List<SystemIntroduceInfo> findAllByIdIn(List<String> systemIntroduceIdList);
}
