package com.guteam.java_service.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class Input {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String inputTypeId;
    private String inputName;
    private String inputKey;
    private String inputJson;
    private String inputDescribe;
    private String algorithmId;
    private boolean required;
    private Integer orderNum;

    @Transient
    private InputType inputType;
    public Input() {
    }


    public String getInputJson() {
        return inputJson;
    }

    public void setInputJson(String inputJson) {
        this.inputJson = inputJson;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public InputType getInputType() {
        return inputType;
    }

    public void setInputType(InputType inputType) {
        this.inputType = inputType;
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

    public String getInputTypeId() {
        return inputTypeId;
    }

    public void setInputTypeId(String inputTypeId) {
        this.inputTypeId = inputTypeId;
    }

    public String getInputDescribe() {
        return inputDescribe;
    }

    public void setInputDescribe(String inputDescribe) {
        this.inputDescribe = inputDescribe;
    }

    public String getAlgorithmId() {
        return algorithmId;
    }

    public void setAlgorithmId(String algorithmId) {
        this.algorithmId = algorithmId;
    }

    public Integer getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(Integer orderNum) {
        this.orderNum = orderNum;
    }
}
