package com.guteam.java_service.entity;


import org.hibernate.annotations.GenericGenerator;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class SystemIntroduce {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String introduceName;
    private String introduceInfoId;
    private String createTime;
    private String updateTime;
    private Integer orderNum;
    private boolean activate;
    @Transient
    private String introduceInfo;

    public SystemIntroduce() {
    }

    public String getIntroduceInfo() {
        return introduceInfo;
    }

    public void setIntroduceInfo(String introduceInfo) {
        this.introduceInfo = introduceInfo;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIntroduceName() {
        return introduceName;
    }

    public void setIntroduceName(String introduceName) {
        this.introduceName = introduceName;
    }

    public String getIntroduceInfoId() {
        return introduceInfoId;
    }

    public void setIntroduceInfoId(String introduceInfoId) {
        this.introduceInfoId = introduceInfoId;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
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
