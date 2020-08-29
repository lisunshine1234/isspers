package com.guteam.java_service.adminService.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.guteam.java_service.adminService.AdminPermissionService;
import com.guteam.java_service.entity.Permission;
import com.guteam.java_service.entity.UserType;
import com.guteam.java_service.entity.UserTypeParent;
import com.guteam.java_service.entity.UserTypePermission;
import com.guteam.java_service.respository.admin.AdminPermissionRepository;
import com.guteam.java_service.respository.admin.AdminUserTypeParentRepository;
import com.guteam.java_service.respository.admin.AdminUserTypePermissionRepository;
import com.guteam.java_service.respository.admin.AdminUserTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class AdminPermissionServiceImpl implements AdminPermissionService {
    @Autowired
    private AdminPermissionRepository adminPermissionRepository;
    @Autowired
    private AdminUserTypePermissionRepository adminUserTypePermissionRepository;
    @Autowired
    private AdminUserTypeParentRepository adminUserTypeParentRepository;
    @Autowired
    private AdminUserTypeRepository adminUserTypeRepository;

    @Override
    public boolean savePermission(String permissionName, String permissionUrl, boolean permissionState) {
        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        Permission permission = new Permission();
        permission.setPermissionName(permissionName);
        permission.setPermissionUrl(permissionUrl);
        permission.setActivate(permissionState);
        permission.setCreateTime(simpleDateFormat.format(date));
        permission.setUpdateTime(simpleDateFormat.format(date));
        adminPermissionRepository.save(permission);
        return true;
    }

    @Override
    public boolean savePermission(Integer permissionId, String permissionName, String permissionUrl, boolean permissionState) {
        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");

        Permission permission = adminPermissionRepository.findById(permissionId).orElse(null);
        if (permission == null) {
            return false;
        }
        permission.setPermissionName(permissionName);
        permission.setPermissionUrl(permissionUrl);
        permission.setActivate(permissionState);
        permission.setUpdateTime(simpleDateFormat.format(date));
        adminPermissionRepository.save(permission);

        return true;
    }

    @Override
    public boolean checkPermissionNameExist(Integer permissionId, String permissionName) {
        Permission permission = adminPermissionRepository.findAllByPermissionName(permissionName);
        if (permission == null) {
            return false;
        }

        return !permission.getId().equals(permissionId);
    }

    @Override
    public boolean checkPermissionUrlExist(Integer permissionId, String permissionUrl) {
        Permission permission = adminPermissionRepository.findAllByPermissionUrl(permissionUrl);
        if (permission == null) {
            return false;
        }

        return !permission.getId().equals(permissionId);
    }

    @Override
    public List<Permission> getPermissionList() {
        return adminPermissionRepository.findAll();
    }

    @Override
    public Permission getPermissionById(Integer permissionId) {
        return adminPermissionRepository.findById(permissionId).orElse(null);
    }

    @Override
    public boolean deletePermissionById(Integer permissionId) {
        Permission permission = adminPermissionRepository.findById(permissionId).orElse(null);
        if (permission == null) {
            return false;
        }
        adminPermissionRepository.deleteById(permissionId);
        return true;
    }

    @Override
    public List<UserTypePermission> getUserTypePermissionList() {
        return JSON.parseArray(adminUserTypePermissionRepository.findAllUserTypePermission().toString(), UserTypePermission.class);
    }

    @Override
    public List<UserTypeParent> getUserTypeParentList() {
//        List<UserTypeParent> userTypeParentList = adminUserTypeParentRepository.findAll();
//        List<UserType> userTypeList = adminUserTypeRepository.findAll();
//
//        for (UserType userType : userTypeList) {
//            for (UserTypeParent userTypeParent : userTypeParentList) {
//                if(userType.getUserTypeParentId().equals(userTypeParent.getId())){
//                    List<UserType> list = userTypeParent.getUserTypeList();
//                    if(list == null){
//                        list = new ArrayList<>();
//                    }
//                    list.add(userType);
//                    userTypeParent.setUserTypeList(list);
//                    break;
//                }
//            }
//        }

        return adminUserTypeParentRepository.findAll();
    }

    @Override
    public List<UserType> getUserTypeListByParentId(String userTypeParentId) {
        return adminUserTypeRepository.findAllByUserTypeParentId(userTypeParentId);
    }

    @Override
    public boolean deleteUserType(String userTypeId) {
        UserType userType = adminUserTypeRepository.findById(userTypeId).orElse(null);
        if (userType == null) {
            return false;
        }
        adminUserTypeRepository.deleteById(userTypeId);
        return true;
    }

    @Override
    public boolean deleteUserTypeParent(String userTypeParentId) {
        UserTypeParent userTypeParent = adminUserTypeParentRepository.findById(userTypeParentId).orElse(null);
        if (userTypeParent == null) {
            return false;
        }
        adminUserTypeParentRepository.deleteById(userTypeParentId);
        return true;
    }


}
