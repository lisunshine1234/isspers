package com.guteam.java_service.service;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Algorithm;
import com.guteam.java_service.entity.NavigationType;

import java.util.List;

public interface AlgorithmService {

    List<Algorithm> findAllAlgorithmBase();

    List<Algorithm> findAllAlgorithmCustom();

    List<Algorithm> findAllAlgorithmBaseByNavigationFatherIdAndActivate(String navigationFatherId,boolean hasFinish, boolean noLock, boolean pass, boolean share, boolean activate);

    List<Algorithm> findAllAlgorithmCustomByNavigationFatherIdAndActivate(String navigationFatherId, boolean hasFinish, boolean noLock, boolean pass, boolean share, boolean activate);

    Algorithm findAlgorithmById(String userId, String algorithmId);

    boolean checkAlgorithmActivate(String algorithmId);

    List<Algorithm> findAllListAlgorithmByAlgorithmIdList(List<String> AlgorithmIdList);


//    JSONObject checkAlgorithmList(List<JSONObject> algorithmList, String userId, String projectId);
}
