package com.guteam.java_service.entity.admin;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;
import java.util.List;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class AdminNavigationParent {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;

    private String navigationName;
    private String navigationIcon;
    private String navigationUrl;
    private Integer navigationLevel;
    private Integer orderNum;
    private boolean activate;

    @Transient
    private List<AdminNavigationChild> adminNavigationChildList;



    public AdminNavigationParent() {
    }


    public List<AdminNavigationChild> getAdminNavigationChildList() {
        return adminNavigationChildList;
    }

    public void setAdminNavigationChildList(List<AdminNavigationChild> adminNavigationChildList) {
        this.adminNavigationChildList = adminNavigationChildList;
    }

    public Integer getNavigationLevel() {
        return navigationLevel;
    }

    public void setNavigationLevel(Integer navigationLevel) {
        this.navigationLevel = navigationLevel;
    }

    public String getNavigationIcon() {
        return navigationIcon;
    }

    public void setNavigationIcon(String navigationIcon) {
        this.navigationIcon = navigationIcon;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNavigationName() {
        return navigationName;
    }

    public void setNavigationName(String navigationName) {
        this.navigationName = navigationName;
    }

    public String getNavigationUrl() {
        return navigationUrl;
    }

    public void setNavigationUrl(String navigationUrl) {
        this.navigationUrl = navigationUrl;
    }

    public Integer getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(Integer orderNum) {
        this.orderNum = orderNum;
    }

    public boolean isActivate() {
        return activate;
    }

    public void setActivate(boolean activate) {
        this.activate = activate;
    }
}
