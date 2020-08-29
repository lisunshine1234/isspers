package com.guteam.java_service.entity;

import com.alibaba.fastjson.JSONObject;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class Job {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String createTime;
    private String algorithmList;
    private String userId;
    private String projectId;
    private String navigationId;
    private String outputMongoId;
    private String runInfoMongoId;
    private String lockMessage;
    private boolean run;
    private boolean error;
    private boolean finish;
    private boolean nonLock;
    private boolean shutdown;
    @Transient
    private String navigationName;

    @Transient
    private String userName;
    public Job() {
    }

    public String getLockMessage() {
        return lockMessage;
    }

    public void setLockMessage(String lockMessage) {
        this.lockMessage = lockMessage;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public boolean isShutdown() {
        return shutdown;
    }

    public void setShutdown(boolean shutdown) {
        this.shutdown = shutdown;
    }

    public String getOutputMongoId() {
        return outputMongoId;
    }

    public void setOutputMongoId(String outputMongoId) {
        this.outputMongoId = outputMongoId;
    }

    public Job(String createTime, String algorithmList, String userId, String projectId, String navigationId, boolean run, boolean error, boolean finish, boolean shutdown, boolean nonLock) {
        this.createTime = createTime;
        this.algorithmList = algorithmList;
        this.userId = userId;
        this.projectId = projectId;
        this.navigationId = navigationId;
        this.run = run;
        this.error = error;
        this.finish = finish;
        this.shutdown = shutdown;
        this.nonLock = nonLock;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getNavigationName() {
        return navigationName;
    }

    public void setNavigationName(String navigationName) {
        this.navigationName = navigationName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRunInfoMongoId() {
        return runInfoMongoId;
    }

    public void setRunInfoMongoId(String runInfoMongoId) {
        this.runInfoMongoId = runInfoMongoId;
    }

    public String getNavigationId() {
        return navigationId;
    }

    public void setNavigationId(String navigationId) {
        this.navigationId = navigationId;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getAlgorithmList() {
        return algorithmList;
    }

    public void setAlgorithmList(String algorithmList) {
        this.algorithmList = algorithmList;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public boolean isRun() {
        return run;
    }

    public void setRun(boolean run) {
        this.run = run;
    }

    public boolean isError() {
        return error;
    }

    public void setError(boolean error) {
        this.error = error;
    }

    public boolean isFinish() {
        return finish;
    }

    public void setFinish(boolean finish) {
        this.finish = finish;
    }

    public boolean isNonLock() {
        return nonLock;
    }

    public void setNonLock(boolean nonLock) {
        this.nonLock = nonLock;
    }
}
