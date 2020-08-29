package com.guteam.java_service.service;

import com.guteam.java_service.entity.Algorithm;
import com.guteam.java_service.entity.AlgorithmEnvironment;

import java.util.List;

public interface AlgorithmEnvironmentService {

    List<AlgorithmEnvironment> findAllAlgorithmEnvironmentByActivate(boolean activate);

}
