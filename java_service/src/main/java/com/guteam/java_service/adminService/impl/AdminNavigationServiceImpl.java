package com.guteam.java_service.adminService.impl;

import com.guteam.java_service.adminService.AdminNavigationService;
import com.guteam.java_service.entity.NavigationParent;
import com.guteam.java_service.entity.NavigationType;
import com.guteam.java_service.entity.admin.AdminNavigationChild;
import com.guteam.java_service.entity.admin.AdminNavigationParent;
import com.guteam.java_service.respository.admin.AdminNavigationChildRepository;
import com.guteam.java_service.respository.admin.AdminNavigationParentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminNavigationServiceImpl implements AdminNavigationService {
    @Autowired
    private AdminNavigationChildRepository adminNavigationChildRepository;
    @Autowired
    private AdminNavigationParentRepository adminNavigationParentRepository;


    @Override
    public List<AdminNavigationParent> getAdminNavigationByIsActivate(boolean isActivate) {
        List<AdminNavigationParent> adminNavigationParentList = adminNavigationParentRepository.findAllByActivateOrderByOrderNumAsc(isActivate);
        List<AdminNavigationChild> adminNavigationChildList = adminNavigationChildRepository.findAllByActivateOrderByOrderNumAsc(isActivate);
        for(AdminNavigationParent adminNavigationParent:adminNavigationParentList){
            if(adminNavigationParent.getNavigationLevel() == 1){
                List<AdminNavigationChild> list = new ArrayList<>();
                for(AdminNavigationChild adminNavigationChild : adminNavigationChildList){
                    if(adminNavigationChild.getNavigationParentId().equals(adminNavigationParent.getId())){
                        list.add(adminNavigationChild);
                    }
                    adminNavigationParent.setAdminNavigationChildList(list);
                }
            }

        }

        return adminNavigationParentList;
    }

    @Override
    public AdminNavigationParent checkNavigationUrlIsExistAndIsActivate(String url) {
        return null;
    }
}
