package com.guteam.java_service.adminService;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.NavigationParent;
import com.guteam.java_service.entity.NavigationType;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AdminUserNavigationService {
    List<NavigationType> findAllNavigationTypeListByAlgorithmNavigation();

    List<NavigationType> findAllNavigationTypeList();

    @Transactional
    boolean insertNavigationParent(NavigationParent navigationParent);

    @Transactional
    boolean insertNavigationType(NavigationType navigationType);


    @Transactional
    boolean saveNavigationParent(NavigationParent navigationParent);

    @Transactional
    boolean saveNavigationType(NavigationType navigationType);

    @Transactional
    boolean saveNavigationParentOrder(String navigationTypeId, JSONObject json);

    @Transactional
    boolean saveNavigationTypeOrder(JSONObject json);


    @Transactional
    boolean deleteNavigationTypeById(String navigationTypeId);


    @Transactional
    boolean deleteNavigationParentById(String navigationParentId);


    boolean checkNavigationUrlExist(String navigationId, String navigationUrl);

    boolean checkNavigationTypeNameExist(String navigationId, String navigationName);

    boolean checkNavigationParentNameExist(String navigationId, String navigationName);
}
