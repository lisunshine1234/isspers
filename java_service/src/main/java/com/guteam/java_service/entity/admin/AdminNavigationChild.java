package com.guteam.java_service.entity.admin;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class AdminNavigationChild {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;

    private String navigationName;
    private String navigationParentId;
    private String navigationUrl;
    private Integer orderNum;
    private boolean activate;

    public AdminNavigationChild() {
    }

    public String getNavigationParentId() {
        return navigationParentId;
    }

    public void setNavigationParentId(String navigationParentId) {
        this.navigationParentId = navigationParentId;
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
