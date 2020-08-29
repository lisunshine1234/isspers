package com.guteam.java_service.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class InputType {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String inputName;
    private String inputKey;
    private String inputDescribe;
    private Integer orderNum;
    private boolean hasJson;
    private boolean activate;

    public InputType() {
    }

    public Integer getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(Integer orderNum) {
        this.orderNum = orderNum;
    }

    public boolean isHasJson() {
        return hasJson;
    }

    public void setHasJson(boolean hasJson) {
        this.hasJson = hasJson;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getInputName() {
        return inputName;
    }

    public void setInputName(String inputName) {
        this.inputName = inputName;
    }

    public String getInputKey() {
        return inputKey;
    }

    public void setInputKey(String inputKey) {
        this.inputKey = inputKey;
    }

    public String getInputDescribe() {
        return inputDescribe;
    }

    public void setInputDescribe(String inputDescribe) {
        this.inputDescribe = inputDescribe;
    }

    public boolean isActivate() {
        return activate;
    }

    public void setActivate(boolean activate) {
        this.activate = activate;
    }
}


