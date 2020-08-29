package com.guteam.java_service.service;

import com.guteam.java_service.entity.NavigationParent;
import com.guteam.java_service.entity.NavigationType;

import java.util.List;

public interface NavigationService {
    /**
     * 父类导航栏信息
     *
     * @return 导航栏list集合
     */
    List<NavigationType> getNavigationByIsActivate(boolean isActivate);
//
//    List<Input> getNavigationChildAttribute(Integer childId);

    //    NavigationParent findNavigationParentByUrl(String url);
    boolean checkNavigationIdIsExist(String navigationId);

    NavigationParent checkNavigationUrlIsExistAndIsActivate(String url);
//    Integer getChildIdByFatherUrlAndChildUrl(String fatherKey,String childKey);


    List<NavigationType> findAllByActivateAndNavigationAlgorithm(boolean activate, boolean navigationAlgorithm);

}
