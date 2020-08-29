package com.guteam.java_service.service;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Project;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectService {
    List<Project> findAllByUserIdOrderByUpdateTimeDesc(String userId);

    List<Project> findConciseByUserIdOrderByUpdateTimeDesc(String userId);

    Project findByUserIdAndActivateAndNonLock(String userId, boolean isActivate, boolean isNonLock);

    Project findProjectByIdAndUserId(String id, String userId);

    JSONObject checkProject(String userId, String fileName);

    @Transactional
    boolean createProduct(Project project);

    @Transactional
    boolean deleteProject(String id, String userId);

    @Transactional
    boolean updateProduct(Project project);


}
