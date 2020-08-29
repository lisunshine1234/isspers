package com.guteam.java_service.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class Project {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String projectName;
    private String projectPath;
    private String createTime;
    private String updateTime;
    private String userId;
    private String lockMessage;
    private String projectDescribeId;
    private boolean activate;
    private boolean nonLock;
    @Transient
    private String projectDescribe;
    @Transient
    private String userName;

    public Project() {
    }

    @Override
    public String toString() {
        return "Project{" +
                "id='" + id + '\'' +
                ", projectName='" + projectName + '\'' +
                ", createTime='" + createTime + '\'' +
                ", updateTime='" + updateTime + '\'' +
                ", userId='" + userId + '\'' +
                ", activate=" + activate +
                ", nonLock=" + nonLock +
                ", projectDescribe='" + projectDescribe + '\'' +
                '}';
    }

    public String getProjectPath() {
        return projectPath;
    }

    public void setProjectPath(String projectPath) {
        this.projectPath = projectPath;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getLockMessage() {
        return lockMessage;
    }

    public void setLockMessage(String lockMessage) {
        this.lockMessage = lockMessage;
    }

    public String getProjectDescribeId() {
        return projectDescribeId;
    }

    public void setProjectDescribeId(String projectDescribeId) {
        this.projectDescribeId = projectDescribeId;
    }

    public Project(String projectName, String createTime, String updateTime, String userId, boolean activate, boolean nonLock, String projectDescribe) {
        this.projectName = projectName;
        this.createTime = createTime;
        this.updateTime = updateTime;
        this.userId = userId;
        this.activate = activate;
        this.nonLock = nonLock;
        this.projectDescribe = projectDescribe;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectDescribe() {
        return projectDescribe;
    }

    public void setProjectDescribe(String projectDescribe) {
        this.projectDescribe = projectDescribe;
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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public boolean isActivate() {
        return activate;
    }

    public void setActivate(boolean activate) {
        this.activate = activate;
    }

    public boolean isNonLock() {
        return nonLock;
    }

    public void setNonLock(boolean nonLock) {
        this.nonLock = nonLock;
    }
}
