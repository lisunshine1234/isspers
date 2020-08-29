package com.guteam.java_service.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class UserType {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String userTypeName;
    private String userTypeParentId;

    public UserType() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserTypeName() {
        return userTypeName;
    }

    public void setUserTypeName(String userTypeName) {
        this.userTypeName = userTypeName;
    }

    public String getUserTypeParentId() {
        return userTypeParentId;
    }

    public void setUserTypeParentId(String userTypeParentId) {
        this.userTypeParentId = userTypeParentId;
    }
}
