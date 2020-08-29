package com.guteam.java_service.adminService.impl;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminUserNavigationService;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.Job;
import com.guteam.java_service.entity.NavigationParent;
import com.guteam.java_service.entity.NavigationType;
import com.guteam.java_service.respository.admin.AdminUserNavigationParentRepository;
import com.guteam.java_service.respository.admin.AdminUserNavigationTypeRepository;
import com.guteam.java_service.respository.admin.AdminUserTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminUserNavigationServiceImpl implements AdminUserNavigationService {
    @Autowired
    private AdminUserNavigationTypeRepository adminUserNavigationTypeRepository;
    @Autowired
    private AdminUserNavigationParentRepository adminUserNavigationParentRepository;
    @Autowired
    private RedisUtil redisUtil;

    @Override
    public List<NavigationType> findAllNavigationTypeListByAlgorithmNavigation() {
        List<NavigationType> navigationTypeList = adminUserNavigationTypeRepository.findAllByNavigationAlgorithmOrderByOrderNumAsc(true);
        List<NavigationParent> navigationParentList = adminUserNavigationParentRepository.findAllOrderByOrderNumAsc();

        for (NavigationType navigationType : navigationTypeList) {
            List<NavigationParent> newNavigationParentList = new ArrayList<>();
            for (NavigationParent navigationParent : navigationParentList) {
                if (navigationType.getId().equals(navigationParent.getNavigationTypeId())) {
                    newNavigationParentList.add(navigationParent);
                }
            }
            navigationType.setNavigationParentList(newNavigationParentList);
        }
        return navigationTypeList;
    }

    @Override
    public List<NavigationType> findAllNavigationTypeList() {
        List<NavigationType> navigationTypeList = adminUserNavigationTypeRepository.findAllOrderByOrderNumAsc();
        List<NavigationParent> navigationParentList = adminUserNavigationParentRepository.findAllOrderByOrderNumAsc();

        for (NavigationType navigationType : navigationTypeList) {
            List<NavigationParent> newNavigationParentList = new ArrayList<>();
            for (NavigationParent navigationParent : navigationParentList) {
                if (navigationType.getId().equals(navigationParent.getNavigationTypeId())) {
                    newNavigationParentList.add(navigationParent);
                }
            }
            navigationType.setNavigationParentList(newNavigationParentList);
        }
        return navigationTypeList;
    }

    @Override
    public boolean insertNavigationParent(NavigationParent navigationParent) {
        navigationParent.setOrderNum(adminUserNavigationParentRepository.findAllByNavigationTypeId(navigationParent.getNavigationTypeId()).size());
        adminUserNavigationParentRepository.save(navigationParent);
        if (navigationParent.isActivate()) {
            redisUtil.del("navigation");
        }
        return true;
    }

    @Override
    public boolean insertNavigationType(NavigationType navigationType) {
        navigationType.setOrderNum(adminUserNavigationTypeRepository.findAll().size());
        adminUserNavigationTypeRepository.save(navigationType);
        if (navigationType.isActivate()) {
            redisUtil.del("navigation");
        }
        return true;
    }

    @Override
    public boolean saveNavigationParent(NavigationParent navigationParent) {
        adminUserNavigationParentRepository.save(navigationParent);
        redisUtil.del("navigation");
        return true;
    }

    @Override
    public boolean saveNavigationType(NavigationType navigationType) {
        adminUserNavigationTypeRepository.save(navigationType);
        redisUtil.del("navigation");
        return true;
    }

    @Override
    public boolean saveNavigationParentOrder(String navigationTypeId, JSONObject json) {
        List<NavigationParent> navigationParentList = adminUserNavigationParentRepository.findAllByNavigationTypeId(navigationTypeId);
        for (NavigationParent navigationParent : navigationParentList) {
            if (json.containsKey(navigationParent.getId())) {
                navigationParent.setOrderNum(Integer.parseInt(json.get(navigationParent.getId()).toString()));
            } else {
                return false;
            }
        }
        adminUserNavigationParentRepository.saveAll(navigationParentList);
        redisUtil.del("navigation");
        return true;
    }

    @Override
    public boolean saveNavigationTypeOrder(JSONObject json) {
        List<NavigationType> navigationTypeList = adminUserNavigationTypeRepository.findAll();
        for (NavigationType navigationType : navigationTypeList) {
            if (json.containsKey(navigationType.getId())) {
                navigationType.setOrderNum(Integer.parseInt(json.get(navigationType.getId()).toString()));
            } else {
                return false;
            }
        }
        adminUserNavigationTypeRepository.saveAll(navigationTypeList);
        redisUtil.del("navigation");
        return true;
    }

    @Override
    public boolean deleteNavigationTypeById(String navigationTypeId) {
        NavigationType navigationType = adminUserNavigationTypeRepository.findById(navigationTypeId).orElse(null);
        if (navigationType == null) {
            return false;
        }

        List<NavigationParent> navigationParentList = adminUserNavigationParentRepository.findAllByNavigationTypeId(navigationTypeId);
        if (navigationParentList.size() > 0) {
            adminUserNavigationParentRepository.deleteAll(navigationParentList);
        }
        adminUserNavigationTypeRepository.delete(navigationType);
        redisUtil.del("navigation");
        return true;
    }

    @Override
    public boolean deleteNavigationParentById(String navigationParentId) {
        NavigationParent navigationParent = adminUserNavigationParentRepository.findById(navigationParentId).orElse(null);
        if (navigationParent == null) {
            return false;
        }
        adminUserNavigationParentRepository.delete(navigationParent);
        redisUtil.del("navigation");

        return true;
    }

    @Override
    public boolean checkNavigationUrlExist(String navigationId,String navigationUrl) {
        return adminUserNavigationParentRepository.findAllByIdNotAndNavigationUrl(navigationId,navigationUrl).size() > 0;
    }

    @Override
    public boolean checkNavigationTypeNameExist(String navigationId,String navigationName) {
        return adminUserNavigationTypeRepository.findAllByIdNotAndNavigationName(navigationId,navigationName).size() > 0;
    }

    @Override
    public boolean checkNavigationParentNameExist(String navigationId,String navigationName) {
        return adminUserNavigationParentRepository.findAllByIdNotAndNavigationName(navigationId,navigationName).size() > 0;
    }


}
