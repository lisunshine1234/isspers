package com.guteam.java_service.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;
import java.util.List;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class UserTypeParent {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String userTypeParentName;
    private String userType;


    @Transient
    private List<UserType> userTypeList;

    public List<UserType> getUserTypeList() {
        return userTypeList;
    }

    public void setUserTypeList(List<UserType> userTypeList) {
        this.userTypeList = userTypeList;
    }

    public UserTypeParent() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserTypeParentName() {
        return userTypeParentName;
    }

    public void setUserTypeParentName(String userTypeParentName) {
        this.userTypeParentName = userTypeParentName;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}
