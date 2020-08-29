package com.guteam.java_service.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.*;
import com.guteam.java_service.entity.mongo.AlgorithmDescribe;
import com.guteam.java_service.respository.mongodb.AlgorithmDescribeRepository;
import com.guteam.java_service.respository.mysql.*;
import com.guteam.java_service.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AlgorithmServiceImpl implements AlgorithmService {
    @Autowired
    private AlgorithmRepository algorithmRepository;
    @Autowired
    private NavigationParentRepository navigationParentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InputService inputService;
    @Autowired
    private OutputService outputService;
    @Autowired
    private DisplayService displayService;
    @Autowired
    private AlgorithmCartService algorithmCartService;
    @Autowired
    private AlgorithmEngineRepository algorithmEngineRepository;
    @Autowired
    private AlgorithmEnvironmentRepository algorithmEnvironmentRepository;
    @Autowired
    private AlgorithmDescribeRepository algorithmDescribeRepository;

    @Value("${dataPath}")
    private String dataPath;
    @Value("${isspersPath}")
    private String isspersPath;


    @Override
    public List<Algorithm> findAllAlgorithmBase() {
        return AlgorithmHelp(algorithmRepository.findAllByAlgorithmType("base"));
    }

    @Override
    public List<Algorithm> findAllAlgorithmCustom() {
        return AlgorithmHelp(algorithmRepository.findAllByAlgorithmType("custom"));
    }

    @Override
    public List<Algorithm> findAllAlgorithmBaseByNavigationFatherIdAndActivate(String navigationFatherId, boolean hasFinish, boolean noLock, boolean pass, boolean share, boolean activate) {
        return AlgorithmHelp(algorithmRepository.findAllByNavigationParentIdAndAlgorithmTypeAndHasFinishAndNonLockAndPassAndShareAndActivate(navigationFatherId, "base",hasFinish,noLock,pass,share,activate));
    }

    @Override
    public List<Algorithm> findAllAlgorithmCustomByNavigationFatherIdAndActivate(String navigationFatherId, boolean hasFinish, boolean noLock, boolean pass, boolean share, boolean activate) {
        return AlgorithmHelp(algorithmRepository.findAllByNavigationParentIdAndAlgorithmTypeAndHasFinishAndNonLockAndPassAndShareAndActivate(navigationFatherId, "base",hasFinish,noLock,pass,share,activate));
    }


    @Override
    public Algorithm findAlgorithmById(String userId, String algorithmId) {
        Algorithm algorithm = algorithmRepository.findById(algorithmId).orElse(null);
        if (algorithm != null) {
            List<Algorithm> algorithmList = new ArrayList<>();
            algorithmList.add(algorithm);
            algorithm = AlgorithmHelp(algorithmList).get(0);
            algorithm.setInputList(inputService.findInputListByAlgorithmId(algorithmId));
            algorithm.setOutputList(outputService.findOutputListByAlgorithmId(algorithmId));
            algorithm.setDisplayList(displayService.findDisplayListByAlgorithmId(algorithmId));
            algorithm.setCart(algorithmCartService.checkAlgorithmIsInCartByUserIdAndAlgorithmId(userId, algorithmId));
        }
        return algorithm;
    }

    @Override
    public boolean checkAlgorithmActivate(String algorithmId) {
        Algorithm algorithm = algorithmRepository.findById(algorithmId).orElse(null);
        if (algorithm != null) {
            return algorithm.isActivate();
        }
        return false;
    }

    @Override
    public List<Algorithm> findAllListAlgorithmByAlgorithmIdList(List<String> AlgorithmIdList) {
        return algorithmRepository.findAllByIdIn(AlgorithmIdList);
    }

    private List<Algorithm> AlgorithmHelp(List<Algorithm> algorithmList) {
        Set<String> userSet = new HashSet<>();
        Set<String> navigationSet = new HashSet<>();
        Set<String> engineSet = new HashSet<>();
        Set<String> environmentSet = new HashSet<>();
        List<String> describeList = new ArrayList<>();
        for (Algorithm algorithm : algorithmList) {
            userSet.add(algorithm.getUserId());
            navigationSet.add(algorithm.getNavigationParentId());
            String engine = algorithm.getAlgorithmEngineId();
            engineSet.add(engine);
            environmentSet.add(algorithm.getAlgorithmEnvironmentId());
            describeList.add(algorithm.getAlgorithmDescribeId());
        }
        List<AlgorithmDescribe> algorithmDescribeList = algorithmDescribeRepository.findAllByIdIn(describeList);
        List<User> userList = userRepository.findAllByIdIn(userSet);
        List<NavigationParent> navigationList = navigationParentRepository.findAllByIdIn(navigationSet);
        List<AlgorithmEngine> engineList = algorithmEngineRepository.findAllByIdInAndActivate(engineSet, true);
        List<AlgorithmEnvironment> algorithmEnvironmentList = algorithmEnvironmentRepository.findAllByIdInAndActivate(environmentSet, true);
        JSONObject engineJSON = new JSONObject();

        for (AlgorithmEngine algorithmEngine : engineList) {
            engineJSON.put(algorithmEngine.getId(), algorithmEngine.getEngineName());
        }
        for (Algorithm algorithm : algorithmList) {
            if (algorithm.getAlgorithmType().equals("base")) {
                algorithm.setUserName("官方");
            }

            algorithm.setAlgorithmEngine((String) engineJSON.get(algorithm.getAlgorithmEngineId()));

            for(AlgorithmDescribe algorithmDescribe : algorithmDescribeList){
                if(algorithm.getAlgorithmDescribeId().equals(algorithmDescribe.getId())){
                    algorithm.setAlgorithmDescribe(algorithmDescribe.getDescribe());
                    algorithmDescribeList.remove(algorithmDescribe);
                    break;
                }
            }

            for (AlgorithmEnvironment algorithmEnvironment : algorithmEnvironmentList) {
                if (algorithmEnvironment.getId().equals(algorithm.getAlgorithmEnvironmentId())) {
                    algorithm.setAlgorithmEnvironment(algorithmEnvironment.getAlgorithmEnvironmentName());
                }
            }
            for (NavigationParent navigationParent : navigationList) {
                if (navigationParent.getId().equals(algorithm.getNavigationParentId())) {
                    algorithm.setNavigationParent(navigationParent);
                }
            }
        }
        return algorithmList;
    }

}
