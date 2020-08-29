package com.guteam.java_service.service.impl;

import com.guteam.java_service.entity.User;
import com.guteam.java_service.entity.UserType;
import com.guteam.java_service.respository.mysql.UserRepository;
import com.guteam.java_service.respository.mysql.UserTypeRepository;
import com.guteam.java_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserTypeRepository userTypeRepository;


    @Override
    public User findUserByUserName(String userName) {
        User user = userRepository.findUserByUserName(userName);
        if (user == null) {
            return null;
        }
        UserType userType = userTypeRepository.findById(user.getId()).orElse(null);
        if (userType == null) {
            user.setUserType(null);
        } else {
            user.setUserType(userType);
        }

        return user;
    }

    @Override
    public User findUserByUserNameAndIsNonLock(String userName, boolean isNonLock) {
        User user = userRepository.findUserByUserNameAndNonLock(userName, isNonLock);
        if (user == null) {
            return null;
        }
        UserType userType = userTypeRepository.findById(user.getUserTypeId()).orElse(null);
        if (userType == null) {
            user.setUserType(null);
        } else {
            user.setUserType(userType);
        }

        return user;
    }

    @Override
    public User findUserByIdSecurity(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }
        user.setMoney(null);
        user.setPassword(null);
        user.setUserName(null);
        user.setPhone(null);
        user.setEmail(null);
        UserType userType = userTypeRepository.findById(user.getId()).orElse(null);
        if (userType == null) {
            user.setUserType(null);
        } else {
            user.setUserType(userType);
        }
        return null;
    }

    @Override
    public User findUserById(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }
        UserType userType = userTypeRepository.findById(user.getId()).orElse(null);
        if (userType == null) {
            user.setUserType(null);
        } else {
            user.setUserType(userType);
        }
        return null;
    }
}
