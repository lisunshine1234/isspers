package com.guteam.java_service.adminService;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Job;
import com.guteam.java_service.entity.Project;

import java.util.List;

public interface AdminJobService {
    List<Job> findAllJob();

    boolean saveJobNonLock(String jobId, boolean nonLock, String message);
}
