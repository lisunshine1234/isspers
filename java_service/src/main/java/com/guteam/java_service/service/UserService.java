package com.guteam.java_service.service;

import com.guteam.java_service.entity.User;

public interface UserService {
    User findUserByUserName(String userName);

    User findUserByUserNameAndIsNonLock(String username, boolean isNonLock);

    User findUserByIdSecurity(String userId);

    User findUserById(String userId);
}
