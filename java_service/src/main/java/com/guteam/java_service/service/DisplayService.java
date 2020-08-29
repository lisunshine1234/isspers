package com.guteam.java_service.service;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Display;
import com.guteam.java_service.entity.DisplayType;
import com.guteam.java_service.entity.Output;

import java.util.List;
import java.util.Set;

public interface DisplayService {
    List<Display> findDisplayListByOutputId(String outputId);

    List<Display> findDisplayListByOutputIdAndActivate(String outputId, boolean activate);

    List<Display> findDisplayListByOutputIdIn(List<Output> outputList);

    List<Display> findDisplayListByOutputIdInAndActivate(List<Output> outputList, boolean activate);

    List<Display> findDisplayListByOutputIdIn(Set<Output> outputSet);

    List<Display> findDisplayListByOutputIdInAndActivate(Set<Output> outputSet, boolean activate);

    JSONObject findOutputIdAndDisplayTypeListJsonByActivate(boolean activate);

    List<Display> findDisplayListByAlgorithmId(String algorithmId);

}
