package com.guteam.java_service.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class AlgorithmEnvironment {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String algorithmEnvironmentKey;
    private String algorithmEnvironmentName;
    private boolean activate;

    public AlgorithmEnvironment() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAlgorithmEnvironmentKey() {
        return algorithmEnvironmentKey;
    }

    public void setAlgorithmEnvironmentKey(String algorithmEnvironmentKey) {
        this.algorithmEnvironmentKey = algorithmEnvironmentKey;
    }

    public String getAlgorithmEnvironmentName() {
        return algorithmEnvironmentName;
    }

    public void setAlgorithmEnvironmentName(String algorithmEnvironmentName) {
        this.algorithmEnvironmentName = algorithmEnvironmentName;
    }

    public boolean isActivate() {
        return activate;
    }

    public void setActivate(boolean activate) {
        this.activate = activate;
    }
}
