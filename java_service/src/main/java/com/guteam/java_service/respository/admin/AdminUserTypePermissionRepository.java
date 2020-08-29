package com.guteam.java_service.respository.admin;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.UserTypePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdminUserTypePermissionRepository extends JpaRepository<UserTypePermission,String> {

    @Query(value = "SELECT utp.*,ut.user_type_name userTypeName,p.permission_name permissionName\n" +
            "FROM  user_type_permission utp \n" +
            "LEFT JOIN user_type ut ON ut.id = utp.user_type_id\n" +
            "LEFT JOIN permission p ON p.id = utp.permission_id",nativeQuery = true)
   List<JSONObject> findAllUserTypePermission();

    List<UserTypePermission> findAllByUserTypeId(String userTypeId);

    void deleteAllByUserTypeId(String userTypeId);
}
