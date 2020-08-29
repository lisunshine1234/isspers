package com.guteam.java_service.service;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Job;

import java.util.List;

public interface JobService {
    List<JSONObject> InputProcess(List<JSONObject> algorithmList);

    List<JSONObject> OutputProcess(JSONObject jsonObject, Integer algorithmListSize, String userId, String projectId);

    List<Job> findAllByUserId(String userId);

    List<Object> syncRunInfo(String jobId, long start);

    String getFirstJobId(String userId);

    void runAlgorithm(String jobId);

    String createJob(JSONObject object);

    boolean checkRun(String jobId, String userId);

    boolean checkJob(String jobId, String userId);

    String getRunJobInfo(String jobId);

    JSONObject getFinishJobInfo(String jobId);

    Job findByIdAndUserId(String jobId, String userId);

    JSONObject shutdownJobInitiative(String jobId);

    JSONObject shutdownJobPassivity(String jobId);
}
