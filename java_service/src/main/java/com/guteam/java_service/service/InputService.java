package com.guteam.java_service.service;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Input;
import com.guteam.java_service.entity.InputType;

import java.util.List;
import java.util.Set;

public interface InputService {
    List<Input> findAllInputList();

    List<InputType> findAllInputTypeList();

    List<InputType> findAllInputTypeListByActivate(boolean activate);

    List<Input> findInputListByAlgorithmId(String algorithmId);

    List<Input> findInputListByAlgorithmIdAndActivate(String algorithmId, boolean activate);

    JSONObject findInputJSONByAlgorithmIdIn(List<String> algorithmIdList);

    JSONObject findInputJSONByAlgorithmIdInAndActivate(List<String> algorithmIdList, boolean activate);

    JSONObject findInputJSONByAlgorithmIdIn(Set<String> algorithmIdList);

    JSONObject findInputJSONByAlgorithmIdInAndActivate(Set<String> algorithmIdList, boolean activate);
}
