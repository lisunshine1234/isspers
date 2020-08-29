package com.guteam.java_service.adminService;

import com.guteam.java_service.entity.NavigationParent;
import com.guteam.java_service.entity.NavigationType;
import com.guteam.java_service.entity.admin.AdminNavigationParent;

import java.util.List;

public interface AdminNavigationService {

    /**
     * 父类导航栏信息
     *
     * @return 导航栏list集合
     */
    List<AdminNavigationParent> getAdminNavigationByIsActivate(boolean isActivate);

    AdminNavigationParent checkNavigationUrlIsExistAndIsActivate(String url);

}
