package com.guteam.java_service.adminService.impl;

import com.guteam.java_service.adminService.AdminUserService;
import com.guteam.java_service.entity.User;
import com.guteam.java_service.entity.UserType;
import com.guteam.java_service.entity.UserTypeParent;
import com.guteam.java_service.respository.admin.AdminUserRepository;
import com.guteam.java_service.respository.admin.AdminUserTypeParentRepository;
import com.guteam.java_service.respository.admin.AdminUserTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminUserServiceImpl implements AdminUserService {
    @Autowired
    private AdminUserRepository adminUserRepository;
    @Autowired
    private AdminUserTypeRepository adminUserTypeRepository;
    @Autowired
    private AdminUserTypeParentRepository adminUserTypeParentRepository;

    @Override
    public List<User> selectAll() {


        List<UserTypeParent> userTypeParentList = adminUserTypeParentRepository.findAllByUserTypeNot("SUPER_ADMIN");
        List<String> UserTypeParentIdList = new ArrayList<>();
        for(UserTypeParent userTypeParent:userTypeParentList){
            UserTypeParentIdList.add(userTypeParent.getId());
        }

        List<UserType> userTypeList = adminUserTypeRepository.findAllByUserTypeParentIdIn(UserTypeParentIdList);
        List<String> UserTypeIdList = new ArrayList<>();
        for(UserType userType:userTypeList){
            UserTypeIdList.add(userType.getId());
        }


        List<User> userList = adminUserRepository.findAllByUserTypeIdIn(UserTypeIdList);


        for (User user : userList) {
            for (UserType userType : userTypeList) {
                if (user.getUserTypeId().equals(userType.getId())) {
                    user.setUserType(userType);
                    break;
                }
            }
        }

        return userList;
    }
    @Override
    public User findUserByUserNameAndIsNonLock(String userName, boolean isNonLock) {
        User user = adminUserRepository.findUserByUserNameAndNonLock(userName, isNonLock);
        if (user == null) {
            return null;
        }
        UserType userType = adminUserTypeRepository.findById(user.getUserTypeId()).orElse(null);
        if (userType == null) {
            user.setUserType(null);
        } else {
            user.setUserType(userType);
        }

        return user;
    }
    @Override
    public User selectUserById(String userId) {
        User user = adminUserRepository.findById(userId).orElse(null);
        List<UserType> userTypeList = adminUserTypeRepository.findAll();
        if (user == null) {
            return null;
        }
        for (UserType userType : userTypeList) {
            if (user.getUserTypeId().equals(userType.getId())) {
                user.setUserType(userType);
                break;
            }
        }
        return user;
    }

    @Override
    public List<UserType> selectAllUserType() {
        return adminUserTypeRepository.findAll();
    }

    @Override
    public boolean resetUserUsernameById(String userId) {
        User user = adminUserRepository.findById(userId).orElse(null);
        if (user == null) {
            return false;
        }
        user.setUserName("");
        adminUserRepository.save(user);
        return true;
    }

    @Override
    public boolean resetUserPasswordById(String userId) {
        User user = adminUserRepository.findById(userId).orElse(null);
        if (user == null) {
            return false;
        }
        user.setPassword("123456");
        adminUserRepository.save(user);
        return true;
    }

    @Override
    public boolean resetUserPhoneById(String userId) {
        User user = adminUserRepository.findById(userId).orElse(null);
        if (user == null) {
            return false;
        }
        user.setPhone("");
        adminUserRepository.save(user);
        return true;
    }

    @Override
    public boolean resetUserEmailById(String userId) {
        User user = adminUserRepository.findById(userId).orElse(null);
        if (user == null) {
            return false;
        }
        user.setEmail("");
        adminUserRepository.save(user);
        return true;
    }

    @Override
    public boolean checkUserName(String userName) {
        return adminUserRepository.findByUserName(userName) != null;
    }

    @Override
    public boolean checkPhone(String phone) {
        return adminUserRepository.findByPhone(phone) != null;
    }

    @Override
    public boolean checkEmail(String email) {
        return adminUserRepository.findByEmail(email) != null;
    }

    @Override
    public boolean insertUser(User user) {
        adminUserRepository.save(user);
        return true;
    }

    @Override
    public boolean deleteUserById(String userId) {
        adminUserRepository.deleteById(userId);
        return true;
    }

    @Override
    public boolean updateUserNonLockById(boolean nonLock, String id) {
        User user = adminUserRepository.findById(id).orElse(null);
        if(user == null){
            return false;
        }
        user.setNonLock(nonLock);
        adminUserRepository.save(user);
        return true;
    }
}
