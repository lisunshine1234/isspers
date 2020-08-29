package com.guteam.java_service.adminService;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Project;
import com.guteam.java_service.entity.SetFile;
import com.guteam.java_service.entity.admin.AdminNavigationParent;

import java.util.List;

public interface AdminProjectService {
    List<Project> findAllSet();

    JSONObject findProjectById(String setId, String url);

    boolean saveAlgorithmNonLock(String algorithmId, boolean nonLock, String message);
}
