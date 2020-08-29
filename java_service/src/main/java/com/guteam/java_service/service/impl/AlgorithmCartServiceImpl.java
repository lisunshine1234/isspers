package com.guteam.java_service.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.*;
import com.guteam.java_service.respository.mysql.*;
import com.guteam.java_service.service.AlgorithmCartService;
import com.guteam.java_service.service.AlgorithmService;
import com.guteam.java_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.annotation.Transient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AlgorithmCartServiceImpl implements AlgorithmCartService {
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
    public List<AlgorithmCart> findAllAlgorithmCartByUserId(String userId) {
        List<AlgorithmCart> algorithmCartList = algorithmCartRepository.findAllByUserId(userId);
        List<String> algorithmIdList = new ArrayList<>();
        for (AlgorithmCart algorithmCart : algorithmCartList) {
            algorithmIdList.add(algorithmCart.getAlgorithmId());
        }

        List<Algorithm> algorithmUserList = algorithmService.findAllListAlgorithmByAlgorithmIdList(algorithmIdList);

//        for (AlgorithmCart algorithmCart : algorithmCartList) {
//            List<AlgorithmUser> algorithmUserTemp = new ArrayList<>();
//            for (AlgorithmUser algorithmUser : algorithmUserList) {
//                if (algorithmUser.getId().equals(algorithmCart.getAlgorithmId())) {
//                    algorithmUserTemp.add(algorithmUser);
//                }
//            }
//            algorithmCart.setAlgorithmUserList(algorithmUserTemp);
//        }
        return algorithmCartList;
    }

    @Override
    public boolean checkAlgorithmIsInCartByUserIdAndAlgorithmId(String userId, String algorithmId) {
        return algorithmCartRepository.findAllByUserIdAndAlgorithmId(userId, algorithmId) != null;
    }

    @Override
    @Transactional
    public JSONObject addAlgorithmInCart(AlgorithmCart algorithmCart) {
        JSONObject jsonObject = new JSONObject();
        if (algorithmCartRepository.findAllByUserIdAndAlgorithmId(algorithmCart.getUserId(), algorithmCart.getAlgorithmId()) != null) {
            jsonObject.put("sign", false);
            jsonObject.put("tip", "该算法已经收藏过");
            return jsonObject;
        }
        algorithmCart = algorithmCartRepository.save(algorithmCart);
        if (algorithmCart.getId() != null) {
            jsonObject.put("sign", true);
            jsonObject.put("tip", "已成功添加到收藏夹");
            return jsonObject;
        } else {
            jsonObject.put("sign", false);
            jsonObject.put("tip", "收藏算法失败");
            return jsonObject;
        }
    }

    @Override
    public JSONObject delAlgorithmOutCart(AlgorithmCart algorithmCart) {
        JSONObject jsonObject = new JSONObject();
        algorithmCart = algorithmCartRepository.findAllByUserIdAndAlgorithmId(algorithmCart.getUserId(), algorithmCart.getAlgorithmId());
        if (algorithmCart == null) {
            jsonObject.put("sign", false);
            jsonObject.put("tip", "算法尚未收藏,不能移除");
            return jsonObject;
        }
        algorithmCartRepository.deleteById(algorithmCart.getId());
        if (algorithmCartRepository.findById(algorithmCart.getId()).orElse(null) == null) {
            jsonObject.put("sign", true);
            jsonObject.put("tip", "已成功从收藏夹移除算法");
            return jsonObject;
        } else {
            jsonObject.put("sign", false);
            jsonObject.put("tip", "算法移除失败");
            return jsonObject;
        }
    }

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
    public List<Algorithm> findAlgorithmListByUserIdAndLockAndPassAndShareAndActivate(String userId, boolean hasFinish, boolean noLock, boolean pass, boolean share, boolean activate) {
        List<AlgorithmCart> algorithmCartList = algorithmCartRepository.findAllByUserId(userId);
        List<String> algorithmIdList = new ArrayList<>();
        for (AlgorithmCart algorithmCart : algorithmCartList) {
            algorithmIdList.add(algorithmCart.getAlgorithmId());
        }

        List<Algorithm> algorithmList = algorithmService.findAllListAlgorithmByAlgorithmIdList(algorithmIdList);
        List<Algorithm> algorithmListTemp = new ArrayList<>();
        for (Algorithm algorithm : algorithmList) {
            if (algorithm.isHasFinish() == hasFinish && algorithm.isNonLock() == noLock && algorithm.isPass() == pass && algorithm.isShare() == share && algorithm.isActivate() == activate) {
                algorithmListTemp.add(algorithm);
            }
        }
        return AlgorithmHelp(algorithmListTemp);
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
        for (Algorithm algorithm : algorithmList) {
            userSet.add(algorithm.getUserId());
            navigationSet.add(algorithm.getNavigationParentId());
            String[] engines = algorithm.getAlgorithmEngineId().split(",");
            engineSet.addAll(Arrays.asList(engines));
            environmentSet.add(algorithm.getAlgorithmEnvironmentId());
        }
        List<User> userList = userRepository.findAllByIdIn(userSet);
        List<NavigationParent> navigationList = navigationParentRepository.findAllByIdIn(navigationSet);
        List<AlgorithmEngine> engineList = algorithmEngineRepository.findAllByIdInAndActivate(engineSet, true);
        List<AlgorithmEnvironment> algorithmEnvironmentList = algorithmEnvironmentRepository.findAllByIdInAndActivate(environmentSet, true);
        JSONObject engineJSON = new JSONObject();

        for (AlgorithmEngine algorithmEngine : engineList) {
            engineJSON.put(algorithmEngine.getId(), algorithmEngine.getEngineName());
        }
        for (Algorithm algorithm : algorithmList) {
            algorithm.setAlgorithmDescribe(algorithm.getAlgorithmDescribeId() + algorithm.getAlgorithmDescribeId());
            if (algorithm.getAlgorithmType().equals("base")) {
                algorithm.setUserName("官方");
            }

            String[] engines = algorithm.getAlgorithmEngineId().split(",");
            StringBuilder stringBuilder = new StringBuilder("");
            for (String engine : engines) {
                stringBuilder.append(engineJSON.get(engine)).append(",");
            }

            algorithm.setAlgorithmEngine(stringBuilder.toString().substring(0, stringBuilder.length() - 1));


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
