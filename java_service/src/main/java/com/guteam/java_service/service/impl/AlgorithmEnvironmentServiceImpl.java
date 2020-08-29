package com.guteam.java_service.service.impl;

import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.AlgorithmEngine;
import com.guteam.java_service.entity.AlgorithmEnvironment;
import com.guteam.java_service.respository.mysql.*;
import com.guteam.java_service.service.AlgorithmEngineService;
import com.guteam.java_service.service.AlgorithmEnvironmentService;
import com.guteam.java_service.service.AlgorithmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlgorithmEnvironmentServiceImpl implements AlgorithmEnvironmentService {
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
    public List<AlgorithmEnvironment> findAllAlgorithmEnvironmentByActivate(boolean activate) {
        return algorithmEnvironmentRepository.findAllByActivate(activate);
    }
}
