package com.guteam.java_service.adminService.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminPermissionService;
import com.guteam.java_service.adminService.AdminRolePermissionService;
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
import java.util.Set;

@Service
public class AdminRolePermissionServiceImpl implements AdminRolePermissionService {
    @Autowired
    private AdminPermissionRepository adminPermissionRepository;
    @Autowired
    private AdminUserTypePermissionRepository adminUserTypePermissionRepository;
    @Autowired
    private AdminUserTypeParentRepository adminUserTypeParentRepository;
    @Autowired
    private AdminUserTypeRepository adminUserTypeRepository;


    @Override
    public List<UserTypePermission> getUserTypePermissionList() {
        return JSON.parseArray(adminUserTypePermissionRepository.findAllUserTypePermission().toString(), UserTypePermission.class);
    }

    @Override
    public List<UserTypeParent> getUserTypeParentList() {
        return adminUserTypeParentRepository.findAllByUserTypeNot("SUPER_ADMIN");
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
        adminUserTypeRepository.deleteAllByUserTypeParentId(userTypeParentId);
        adminUserTypeParentRepository.deleteById(userTypeParentId);
        return true;
    }

    @Override
    public List<JSONObject> getPermissionList(String userTypeId) {
        List<UserTypePermission> userTypePermissionList = adminUserTypePermissionRepository.findAllByUserTypeId(userTypeId);
        List<Permission> permissionList = adminPermissionRepository.findAll();
        JSONObject userTypePermissionJson = new JSONObject();
        for (UserTypePermission userTypePermission : userTypePermissionList) {
            userTypePermissionJson.put(userTypePermission.getPermissionId(), null);
        }
        List<JSONObject> back = new ArrayList<>();
        for (Permission permission : permissionList) {
            JSONObject temp = new JSONObject();
            temp.put("id", permission.getId());
            temp.put("permissionName", permission.getPermissionName());
            temp.put("checked", userTypePermissionJson.containsKey(permission.getId().toString()));
            back.add(temp);
        }

        return back;
    }

    @Override
    public boolean updateRolePermissionByUserTypeId(String userTypeId, List<JSONObject> permissionList) {
        List<UserTypePermission> userTypePermissionList = new ArrayList<>();
        for (JSONObject json : permissionList) {
            UserTypePermission userTypePermission = new UserTypePermission();
            userTypePermission.setPermissionId(json.get("permissionId").toString());
            userTypePermission.setUserTypeId(json.get("userTypeId").toString());
        }
        adminUserTypePermissionRepository.deleteAllByUserTypeId(userTypeId);
        adminUserTypePermissionRepository.saveAll(userTypePermissionList);
        return true;
    }

    @Override
    public boolean checkUserTypeParentNameExist(String userTypeParentId, String userTypeParentName) {
        List<UserTypeParent> userTypeParentList = adminUserTypeParentRepository.findAllByUserTypeParentName(userTypeParentName);
        if (userTypeParentList.size() == 0) {
            return false;
        }

        return !userTypeParentList.get(0).getId().equals(userTypeParentId);
    }

    @Override
    public boolean checkUserTypeNameExist(String userTypeId, String userTypeName) {
        List<UserType> userTypeList = adminUserTypeRepository.findAllByUserTypeName(userTypeName);
        if (userTypeList.size() == 0) {
            return false;
        }

        return !userTypeList.get(0).getId().equals(userTypeId);
    }

    @Override
    public UserType getUserTypeById(String userTypeId) {
        UserType userType = adminUserTypeRepository.findById(userTypeId).orElse(null);
        if (userType == null) {
            userType = new UserType();
        }
        return userType;
    }

    @Override
    public UserTypeParent getUserTypeParentById(String userTypeParentId) {
        UserTypeParent userTypeParent = adminUserTypeParentRepository.findById(userTypeParentId).orElse(null);
        if (userTypeParent == null) {
            userTypeParent = new UserTypeParent();
        }
        return userTypeParent;
    }

    @Override
    public boolean insertUseTypeParent(String userTypeParentName, String userTypeParentType) {
        if (!userTypeParentType.equals("ADMIN") && !userTypeParentType.equals("USER")) {
            return false;
        }
        UserTypeParent userTypeParent = new UserTypeParent();
        userTypeParent.setUserTypeParentName(userTypeParentName);
        userTypeParent.setUserType(userTypeParentType);
        adminUserTypeParentRepository.save(userTypeParent);
        return true;
    }

    @Override
    public boolean insertUseType(String userTypeName, String userTypeParentId) {
        UserType userType = new UserType();
        userType.setUserTypeName(userTypeName);
        userType.setUserTypeParentId(userTypeParentId);
        adminUserTypeRepository.save(userType);
        return true;
    }

    @Override
    public boolean updateUseTypeParent(String userTypeParentId, String userTypeParentName, String userTypeParentType) {
        UserTypeParent userTypeParent = adminUserTypeParentRepository.findById(userTypeParentId).orElse(null);
        if (userTypeParent == null) {
            return false;
        }
        userTypeParent.setUserTypeParentName(userTypeParentName);
        userTypeParent.setUserType(userTypeParentType);
        adminUserTypeParentRepository.save(userTypeParent);
        return true;
    }

    @Override
    public boolean updateUseType(String userTypeId, String userTypeName, String userTypeParentId) {
        UserType userType = adminUserTypeRepository.findById(userTypeId).orElse(null);
        if (userType == null) {
            return false;
        }
        userType.setUserTypeName(userTypeName);
        userType.setUserTypeParentId(userTypeParentId);
        adminUserTypeRepository.save(userType);
        return true;
    }

    @Override
    public boolean updateUserTypePermission(String userTypeId, List<String> permissionList) {
        List<UserTypePermission> userTypePermissionList = new ArrayList<>();
        for (String id :permissionList) {
            UserTypePermission userTypePermission = new UserTypePermission();
            userTypePermission.setUserTypeId(userTypeId);
            userTypePermission.setPermissionId(id);
            userTypePermissionList.add(userTypePermission);
        }
        adminUserTypePermissionRepository.deleteAllByUserTypeId(userTypeId);
        adminUserTypePermissionRepository.saveAll(userTypePermissionList);
        return true;
    }


}
