package com.guteam.java_service.service;

import com.guteam.java_service.entity.AlgorithmEngine;
import com.guteam.java_service.entity.AlgorithmEnvironment;

import java.util.List;

public interface AlgorithmEngineService {
    List<AlgorithmEngine> findAllAlgorithmEngineByActivate(boolean activate);
}
