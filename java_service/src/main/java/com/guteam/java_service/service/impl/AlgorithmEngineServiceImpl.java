package com.guteam.java_service.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.*;
import com.guteam.java_service.respository.mysql.*;
import com.guteam.java_service.service.AlgorithmCartService;
import com.guteam.java_service.service.AlgorithmEngineService;
import com.guteam.java_service.service.AlgorithmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AlgorithmEngineServiceImpl implements AlgorithmEngineService {
    @Autowired
    private AlgorithmCartRepository algorithmCartRepository;
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private AlgorithmService algorithmService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NavigationParentRepository navigationParentRepository;
    @Autowired
    private AlgorithmEngineRepository algorithmEngineRepository;
    @Autowired
    private AlgorithmEnvironmentRepository algorithmEnvironmentRepository;

    @Override
    public List<AlgorithmEngine> findAllAlgorithmEngineByActivate(boolean activate) {
        return algorithmEngineRepository.findAllByActivateOrderByOrderNum(activate);
    }
}
