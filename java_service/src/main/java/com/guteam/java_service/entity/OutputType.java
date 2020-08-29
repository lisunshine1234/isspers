package com.guteam.java_service.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class OutputType {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String outputKey;
    private String outputName;
    private String outputDescribe;
    private boolean canGroup;
    private Integer orderNum;
    private String navigationParentId;
    private boolean activate;

    public OutputType() {
    }

    public Integer getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(Integer orderNum) {
        this.orderNum = orderNum;
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

    public boolean isCanGroup() {
        return canGroup;
    }

    public void setCanGroup(boolean canGroup) {
        this.canGroup = canGroup;
    }

    public String getOutputKey() {
        return outputKey;
    }

    public void setOutputKey(String outputKey) {
        this.outputKey = outputKey;
    }

    public String getOutputName() {
        return outputName;
    }

    public void setOutputName(String outputName) {
        this.outputName = outputName;
    }

    public String getOutputDescribe() {
        return outputDescribe;
    }

    public void setOutputDescribe(String outputDescribe) {
        this.outputDescribe = outputDescribe;
    }

    public boolean isActivate() {
        return activate;
    }

    public void setActivate(boolean activate) {
        this.activate = activate;
    }
}
