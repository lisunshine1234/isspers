package com.guteam.java_service.service;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Output;
import com.guteam.java_service.entity.OutputType;

import java.util.List;
import java.util.Set;

public interface OutputService {
    List<Output> findOutputListByAlgorithmId(String algorithmId);

    List<OutputType> findOutputListByActivate(boolean activate);

    List<Output> findOutputListByAlgorithmIdAndActivate(String algorithmId, boolean activate);

    JSONObject findOutputJSONByAlgorithmIdIn(List<String> algorithmIdList);

    JSONObject findOutputJSONByAlgorithmIdInAndActivate(List<String> algorithmIdList, boolean activate);

    JSONObject findOutputJSONByAlgorithmIdIn(Set<String> algorithmIdList);

    JSONObject findOutputJSONByAlgorithmIdInAndActivate(Set<String> algorithmIdList, boolean activate);
}
