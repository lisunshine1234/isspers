package com.guteam.java_service.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;
import java.util.List;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class Algorithm {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String algorithmName;
    private String algorithmEngineId;
    private String algorithmSize;
    private String navigationParentId;
    private String algorithmType;
    private String algorithmRun;
    private String algorithmFile;
    private String algorithmDescribeId;
    private String userId;
    private String algorithmEnvironmentId;
    private String algorithmPath;
    private String uploadTime;
    private boolean activate;
    private boolean share;
    private boolean download;
    private boolean pass;
    private boolean nonLock;
    private String lockMessage;
    private boolean hasFinish;
    private Integer visitCount;
    private Integer useCount;
    private Integer cartCount;

    @Transient
    private String algorithmEngine;
    @Transient
    private String algorithmEnvironment;
    @Transient
    private String algorithmDescribe;
    @Transient
    private String userName;
    @Transient
    private NavigationParent navigationParent;
    @Transient
    private List<Input> inputList;
    @Transient
    private List<Output> outputList;
    @Transient
    private List<Display> displayList;
    @Transient
    private boolean isCart;

    public Algorithm() {
    }

    public String getLockMessage() {
        return lockMessage;
    }

    public void setLockMessage(String lockMessage) {
        this.lockMessage = lockMessage;
    }

    public boolean isHasFinish() {
        return hasFinish;
    }

    public void setHasFinish(boolean hasFinish) {
        this.hasFinish = hasFinish;
    }

    public String getAlgorithmEngine() {
        return algorithmEngine;
    }

    public void setAlgorithmEngine(String algorithmEngine) {
        this.algorithmEngine = algorithmEngine;
    }

    public String getAlgorithmEnvironment() {
        return algorithmEnvironment;
    }

    public void setAlgorithmEnvironment(String algorithmEnvironment) {
        this.algorithmEnvironment = algorithmEnvironment;
    }

    public String getAlgorithmPath() {
        return algorithmPath;
    }

    public void setAlgorithmPath(String algorithmPath) {
        this.algorithmPath = algorithmPath;
    }

    public String getAlgorithmEnvironmentId() {
        return algorithmEnvironmentId;
    }

    public void setAlgorithmEnvironmentId(String algorithmEnvironmentId) {
        this.algorithmEnvironmentId = algorithmEnvironmentId;
    }

    public boolean isCart() {
        return isCart;
    }

    public void setCart(boolean cart) {
        isCart = cart;
    }

    public Integer getVisitCount() {
        return visitCount;
    }

    public void setVisitCount(Integer visitCount) {
        this.visitCount = visitCount;
    }

    public Integer getUseCount() {
        return useCount;
    }

    public void setUseCount(Integer useCount) {
        this.useCount = useCount;
    }

    public Integer getCartCount() {
        return cartCount;
    }

    public void setCartCount(Integer cartCount) {
        this.cartCount = cartCount;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getId() {
        return id;
    }

    public List<Display> getDisplayList() {
        return displayList;
    }

    public void setDisplayList(List<Display> displayList) {
        this.displayList = displayList;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAlgorithmName() {
        return algorithmName;
    }

    public void setAlgorithmName(String algorithmName) {
        this.algorithmName = algorithmName;
    }

    public String getAlgorithmEngineId() {
        return algorithmEngineId;
    }

    public void setAlgorithmEngineId(String algorithmEngineId) {
        this.algorithmEngineId = algorithmEngineId;
    }

    public String getAlgorithmSize() {
        return algorithmSize;
    }

    public void setAlgorithmSize(String algorithmSize) {
        this.algorithmSize = algorithmSize;
    }

    public String getNavigationParentId() {
        return navigationParentId;
    }

    public void setNavigationParentId(String navigationParentId) {
        this.navigationParentId = navigationParentId;
    }

    public String getAlgorithmType() {
        return algorithmType;
    }

    public void setAlgorithmType(String algorithmType) {
        this.algorithmType = algorithmType;
    }

    public String getAlgorithmRun() {
        return algorithmRun;
    }

    public void setAlgorithmRun(String algorithmRun) {
        this.algorithmRun = algorithmRun;
    }

    public String getAlgorithmFile() {
        return algorithmFile;
    }

    public void setAlgorithmFile(String algorithmFile) {
        this.algorithmFile = algorithmFile;
    }

    public String getAlgorithmDescribeId() {
        return algorithmDescribeId;
    }

    public void setAlgorithmDescribeId(String algorithmDescribeId) {
        this.algorithmDescribeId = algorithmDescribeId;
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

    public boolean isShare() {
        return share;
    }

    public void setShare(boolean share) {
        this.share = share;
    }

    public boolean isDownload() {
        return download;
    }

    public void setDownload(boolean download) {
        this.download = download;
    }

    public boolean isPass() {
        return pass;
    }

    public void setPass(boolean pass) {
        this.pass = pass;
    }

    public boolean isNonLock() {
        return nonLock;
    }

    public void setNonLock(boolean nonLock) {
        this.nonLock = nonLock;
    }

    public String getUploadTime() {
        return uploadTime;
    }

    public void setUploadTime(String uploadTime) {
        this.uploadTime = uploadTime;
    }

    public String getAlgorithmDescribe() {
        return algorithmDescribe;
    }

    public void setAlgorithmDescribe(String algorithmDescribe) {
        this.algorithmDescribe = algorithmDescribe;
    }


    public NavigationParent getNavigationParent() {
        return navigationParent;
    }

    public void setNavigationParent(NavigationParent navigationParent) {
        this.navigationParent = navigationParent;
    }

    public List<Input> getInputList() {
        return inputList;
    }

    public void setInputList(List<Input> inputList) {
        this.inputList = inputList;
    }

    public List<Output> getOutputList() {
        return outputList;
    }

    public void setOutputList(List<Output> outputList) {
        this.outputList = outputList;
    }
}
