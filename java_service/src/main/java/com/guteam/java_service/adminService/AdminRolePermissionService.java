package com.guteam.java_service.adminService;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Permission;
import com.guteam.java_service.entity.UserType;
import com.guteam.java_service.entity.UserTypeParent;
import com.guteam.java_service.entity.UserTypePermission;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AdminRolePermissionService {
    List<UserTypePermission> getUserTypePermissionList();

    List<UserTypeParent> getUserTypeParentList();

    List<UserType> getUserTypeListByParentId(String userTypeParentId);

    @Transactional
    boolean deleteUserType(String userTypeId);

    @Transactional
    boolean deleteUserTypeParent(String userTypeParentId);

    List<JSONObject> getPermissionList(String userTypeId);

    @Transactional
    boolean updateRolePermissionByUserTypeId(String userTypeId, List<JSONObject> permissionList);

    boolean checkUserTypeParentNameExist(String userTypeParentId, String userTypeParentName);

    boolean checkUserTypeNameExist(String userTypeId, String userTypeName);

    UserType getUserTypeById(String userTypeId);

    UserTypeParent getUserTypeParentById(String userTypeParentId);

    @Transactional
    boolean insertUseTypeParent(String userTypeParentName,String userTypeParentType);

    @Transactional
    boolean insertUseType(String userTypeName, String userTypeParentId);

    @Transactional
    boolean updateUseTypeParent(String userTypeParentId, String userTypeParentName,String userTypeParentType);

    @Transactional
    boolean updateUseType(String userTypeId, String userTypeName, String userTypeParentId);

    @Transactional
    boolean updateUserTypePermission(String userTypeId,List<String> permissionList);
}
