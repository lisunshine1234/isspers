package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminPermissionRepository extends JpaRepository<Permission,Integer> {
    Permission findAllByPermissionName(String permissionName);

    Permission findAllByPermissionUrl(String permissionUrl);
}
