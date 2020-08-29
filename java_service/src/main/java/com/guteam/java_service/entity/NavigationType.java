package com.guteam.java_service.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;
import java.util.List;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class NavigationType {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;

    private String navigationName;
    private Integer orderNum;
    private boolean activate;
    private boolean navigationAlgorithm;

    @Transient
    private List<NavigationParent> navigationParentList;


    public NavigationType() {
    }

    public boolean isNavigationAlgorithm() {
        return navigationAlgorithm;
    }

    public void setNavigationAlgorithm(boolean navigationAlgorithm) {
        this.navigationAlgorithm = navigationAlgorithm;
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

    public List<NavigationParent> getNavigationParentList() {
        return navigationParentList;
    }

    public void setNavigationParentList(List<NavigationParent> navigationParentList) {
        this.navigationParentList = navigationParentList;
    }
}
