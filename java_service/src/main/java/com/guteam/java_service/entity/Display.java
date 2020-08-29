package com.guteam.java_service.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class Display {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String displayTypeId;
    private String displayName;
    private String displayDescribe;
    private String outputId;
    private String algorithmId;
    private Integer orderNum;
    @Transient
    private DisplayType displayType;
    @Transient
    private String outputTypeId;
    @Transient
    private String outputKey;

    public String getAlgorithmId() {
        return algorithmId;
    }

    public void setAlgorithmId(String algorithmId) {
        this.algorithmId = algorithmId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDisplayTypeId() {
        return displayTypeId;
    }

    public void setDisplayTypeId(String displayTypeId) {
        this.displayTypeId = displayTypeId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayDescribe() {
        return displayDescribe;
    }

    public void setDisplayDescribe(String displayDescribe) {
        this.displayDescribe = displayDescribe;
    }

    public String getOutputId() {
        return outputId;
    }

    public void setOutputId(String outputId) {
        this.outputId = outputId;
    }

    public String getOutputTypeId() {
        return outputTypeId;
    }

    public void setOutputTypeId(String outputTypeId) {
        this.outputTypeId = outputTypeId;
    }

    public Integer getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(Integer orderNum) {
        this.orderNum = orderNum;
    }

    public DisplayType getDisplayType() {
        return displayType;
    }

    public void setDisplayType(DisplayType displayType) {
        this.displayType = displayType;
    }

    public String getOutputKey() {
        return outputKey;
    }

    public void setOutputKey(String outputKey) {
        this.outputKey = outputKey;
    }
}
