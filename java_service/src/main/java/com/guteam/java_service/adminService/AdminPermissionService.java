package com.guteam.java_service.adminService;

import com.guteam.java_service.entity.Permission;
import com.guteam.java_service.entity.UserType;
import com.guteam.java_service.entity.UserTypeParent;
import com.guteam.java_service.entity.UserTypePermission;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface AdminPermissionService {
    @Transactional
    boolean savePermission( String permissionName,String permissionUrl,boolean permissionState);

    @Transactional
    boolean savePermission(Integer permissionId, String permissionName,String permissionUrl,boolean permissionState);

    boolean checkPermissionNameExist(Integer permissionId,String permissionName);

    boolean checkPermissionUrlExist(Integer permissionId,String permissionUrl);

    List<Permission> getPermissionList();

    Permission getPermissionById(Integer permissionId);

    @Transactional
    boolean deletePermissionById(Integer permissionId);

    List<UserTypePermission> getUserTypePermissionList();

    List<UserTypeParent> getUserTypeParentList();

    List<UserType> getUserTypeListByParentId(String userTypeParentId);

    boolean deleteUserType(String userTypeId);

    boolean deleteUserTypeParent(String userTypeParentId);
}
