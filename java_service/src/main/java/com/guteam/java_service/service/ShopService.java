package com.guteam.java_service.service;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Algorithm;
import com.guteam.java_service.entity.NavigationType;

import java.util.List;

public interface ShopService {
    List<NavigationType> findNavigationListByNavigationAlgorithm();

    List<Algorithm> findAlgorithmListByLockAndPassAndShareAndActivate(boolean hasFinish,boolean noLock, boolean pass, boolean share, boolean activate);

    JSONObject findAlgorithmTypeCount(List<Algorithm> algorithmList, List<NavigationType> navigationTypeList);
}
