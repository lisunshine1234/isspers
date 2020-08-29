package com.guteam.java_service.service;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Algorithm;
import com.guteam.java_service.entity.AlgorithmCart;
import com.guteam.java_service.entity.NavigationType;

import java.util.List;

public interface AlgorithmCartService {
    List<AlgorithmCart> findAllAlgorithmCartByUserId(String userId);

    boolean checkAlgorithmIsInCartByUserIdAndAlgorithmId(String userId, String algorithmId);

    JSONObject addAlgorithmInCart(AlgorithmCart algorithmCart);

    JSONObject delAlgorithmOutCart(AlgorithmCart algorithmCart);


    List<NavigationType> findNavigationListByNavigationAlgorithm();

    List<Algorithm> findAlgorithmListByUserIdAndLockAndPassAndShareAndActivate(String userId, boolean hasFinish,boolean noLock, boolean pass, boolean share, boolean activate);

    JSONObject findAlgorithmTypeCount(List<Algorithm> algorithmList, List<NavigationType> navigationTypeList);
}
