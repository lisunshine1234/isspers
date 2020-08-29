package com.guteam.java_service.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class NavigationParent {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;

    private String navigationName;
    private String navigationTypeId;
    private String navigationIcon;
    private String navigationUrl;
    private Integer orderNum;
    private boolean activate;
    @Transient
    private String navigationType;

    public NavigationParent() {
    }

    public String getNavigationIcon() {
        return navigationIcon;
    }

    public void setNavigationIcon(String navigationIcon) {
        this.navigationIcon = navigationIcon;
    }

    public String getNavigationType() {
        return navigationType;
    }

    public void setNavigationType(String navigationType) {
        this.navigationType = navigationType;
    }

    public String getNavigationTypeId() {
        return navigationTypeId;
    }

    public void setNavigationTypeId(String navigationTypeId) {
        this.navigationTypeId = navigationTypeId;
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
