package com.guteam.java_service.entity;


import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;
import java.util.List;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class SystemInfo {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String systemName;
    private String systemFoot;
    private String systemBatch;
    private String systemLogo1;
    private String systemLogo2;
    private String systemLogo3;
    private String systemLogo4;
    private String systemLogo5;
    private String systemLogo1Name;
    private String systemLogo2Name;
    private String systemLogo3Name;
    private String systemLogo4Name;
    private String systemLogo5Name;
    @Transient
    private String systemLogo1Url;
    @Transient
    private String systemLogo2Url;
    @Transient
    private String systemLogo3Url;
    @Transient
    private String systemLogo4Url;
    @Transient
    private String systemLogo5Url;

    public SystemInfo() {
    }

    @Override
    public String toString() {
        return "SystemInfo{" +
                "id='" + id + '\'' +
                ", systemName='" + systemName + '\'' +
                ", systemFoot='" + systemFoot + '\'' +
                ", systemLogo1='" + systemLogo1 + '\'' +
                ", systemLogo2='" + systemLogo2 + '\'' +
                ", systemLogo3='" + systemLogo3 + '\'' +
                ", systemLogo4='" + systemLogo4 + '\'' +
                ", systemLogo5='" + systemLogo5 + '\'' +
                ", systemBatch='" + systemBatch + '\'' +
                '}';
    }

    public String getSystemLogo1Url() {
        return systemLogo1Url;
    }

    public void setSystemLogo1Url(String systemLogo1Url) {
        this.systemLogo1Url = systemLogo1Url;
    }

    public String getSystemLogo2Url() {
        return systemLogo2Url;
    }

    public void setSystemLogo2Url(String systemLogo2Url) {
        this.systemLogo2Url = systemLogo2Url;
    }

    public String getSystemLogo3Url() {
        return systemLogo3Url;
    }

    public void setSystemLogo3Url(String systemLogo3Url) {
        this.systemLogo3Url = systemLogo3Url;
    }

    public String getSystemLogo4Url() {
        return systemLogo4Url;
    }

    public void setSystemLogo4Url(String systemLogo4Url) {
        this.systemLogo4Url = systemLogo4Url;
    }

    public String getSystemLogo5Url() {
        return systemLogo5Url;
    }

    public void setSystemLogo5Url(String systemLogo5Url) {
        this.systemLogo5Url = systemLogo5Url;
    }

    public String getSystemLogo1Name() {
        return systemLogo1Name;
    }

    public void setSystemLogo1Name(String systemLogo1Name) {
        this.systemLogo1Name = systemLogo1Name;
    }

    public String getSystemLogo2Name() {
        return systemLogo2Name;
    }

    public void setSystemLogo2Name(String systemLogo2Name) {
        this.systemLogo2Name = systemLogo2Name;
    }

    public String getSystemLogo3Name() {
        return systemLogo3Name;
    }

    public void setSystemLogo3Name(String systemLogo3Name) {
        this.systemLogo3Name = systemLogo3Name;
    }

    public String getSystemLogo4Name() {
        return systemLogo4Name;
    }

    public void setSystemLogo4Name(String systemLogo4Name) {
        this.systemLogo4Name = systemLogo4Name;
    }

    public String getSystemLogo5Name() {
        return systemLogo5Name;
    }

    public void setSystemLogo5Name(String systemLogo5Name) {
        this.systemLogo5Name = systemLogo5Name;
    }

    public String getSystemLogo4() {
        return systemLogo4;
    }

    public void setSystemLogo4(String systemLogo4) {
        this.systemLogo4 = systemLogo4;
    }

    public String getSystemLogo5() {
        return systemLogo5;
    }

    public void setSystemLogo5(String systemLogo5) {
        this.systemLogo5 = systemLogo5;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSystemName() {
        return systemName;
    }

    public void setSystemName(String systemName) {
        this.systemName = systemName;
    }

    public String getSystemFoot() {
        return systemFoot;
    }

    public void setSystemFoot(String systemFoot) {
        this.systemFoot = systemFoot;
    }

    public String getSystemLogo1() {
        return systemLogo1;
    }

    public void setSystemLogo1(String systemLogo1) {
        this.systemLogo1 = systemLogo1;
    }

    public String getSystemLogo2() {
        return systemLogo2;
    }

    public void setSystemLogo2(String systemLogo2) {
        this.systemLogo2 = systemLogo2;
    }

    public String getSystemLogo3() {
        return systemLogo3;
    }

    public void setSystemLogo3(String systemLogo3) {
        this.systemLogo3 = systemLogo3;
    }

    public String getSystemBatch() {
        return systemBatch;
    }

    public void setSystemBatch(String systemBatch) {
        this.systemBatch = systemBatch;
    }

}
