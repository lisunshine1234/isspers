package com.guteam.java_service.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.*;
import com.guteam.java_service.entity.mongo.AlgorithmDescribe;
import com.guteam.java_service.respository.mongodb.AlgorithmDescribeRepository;
import com.guteam.java_service.respository.mysql.*;
import com.guteam.java_service.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ShopServiceImpl implements ShopService {
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NavigationParentRepository navigationParentRepository;
    @Autowired
    private AlgorithmRepository algorithmRepository;
    @Autowired
    private AlgorithmDescribeRepository algorithmDescribeRepository;
    @Autowired
    private AlgorithmEngineRepository algorithmEngineRepository;
    @Autowired
    private AlgorithmEnvironmentRepository algorithmEnvironmentRepository;


    @Override
    public List<NavigationType> findNavigationListByNavigationAlgorithm() {
        List<NavigationType> navigationTypeList = (List<NavigationType>) redisUtil.get("navigation");

        List<NavigationType> navigationTypeListTemp = new ArrayList<>();

        for (NavigationType navigationType : navigationTypeList) {
            List<NavigationParent> navigationParentTemp = new ArrayList<>();
            if (navigationType.isNavigationAlgorithm()) {
                for (NavigationParent navigationParent : navigationType.getNavigationParentList()) {
                    if (navigationParent.isActivate()) {
                        navigationParentTemp.add(navigationParent);
                    }
                }
                navigationType.setNavigationParentList(navigationParentTemp);
                navigationTypeListTemp.add(navigationType);
            }
        }
        return navigationTypeListTemp;
    }

    @Override
    public List<Algorithm> findAlgorithmListByLockAndPassAndShareAndActivate(boolean hasFinish,boolean noLock, boolean pass, boolean share, boolean activate) {
        return AlgorithmHelp(algorithmRepository.findAllByHasFinishAndNonLockAndPassAndShareAndActivate(hasFinish,noLock, pass, share, activate));
    }

    @Override
    public JSONObject findAlgorithmTypeCount(List<Algorithm> algorithmList, List<NavigationType> navigationTypeList) {
        JSONObject navigationCount = new JSONObject();
        navigationCount.put("all", 0);
        for (NavigationType navigationType : navigationTypeList) {
            navigationCount.put(navigationType.getId(), 0);
            for (NavigationParent navigationParent : navigationType.getNavigationParentList()) {
                navigationCount.put(navigationParent.getId(), 0);
            }
        }
        for (Algorithm algorithm : algorithmList) {
            navigationCount.put(algorithm.getNavigationParentId(), (int) navigationCount.get(algorithm.getNavigationParentId()) + 1);
        }
        for (NavigationType navigationType : navigationTypeList) {
            for (NavigationParent navigationParent : navigationType.getNavigationParentList()) {
                navigationCount.put(navigationType.getId(), (int) navigationCount.get(navigationType.getId()) + (int) navigationCount.get(navigationParent.getId()));
                navigationCount.put("all", (int) navigationCount.get("all") + (int) navigationCount.get(navigationParent.getId()));
            }
        }

        return navigationCount;
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
