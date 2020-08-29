package com.guteam.java_service.entity;

import javax.persistence.*;

@Entity
public class UserTypePermission {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id;
    private String permissionId;
    private String userTypeId;

    @Transient
    private String userTypeName;
    @Transient
    private String PermissionName;

    public UserTypePermission() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(String permissionId) {
        this.permissionId = permissionId;
    }

    public String getUserTypeId() {
        return userTypeId;
    }

    public void setUserTypeId(String userTypeId) {
        this.userTypeId = userTypeId;
    }

    public String getUserTypeName() {
        return userTypeName;
    }

    public void setUserTypeName(String userTypeName) {
        this.userTypeName = userTypeName;
    }

    public String getPermissionName() {
        return PermissionName;
    }

    public void setPermissionName(String permissionName) {
        PermissionName = permissionName;
    }
}
