package com.guteam.java_service.adminService;

import com.guteam.java_service.entity.User;
import com.guteam.java_service.entity.UserType;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AdminUserService {
    List<User> selectAll();

    User selectUserById(String userId);

    List<UserType> selectAllUserType();

    @Transactional
    boolean resetUserUsernameById(String userId);

    @Transactional
    boolean resetUserPasswordById(String userId);

    @Transactional
    boolean resetUserPhoneById(String userId);

    @Transactional
    boolean resetUserEmailById(String userId);

    boolean checkUserName(String userName);

    boolean checkPhone(String phone);

    boolean checkEmail(String email);

    boolean insertUser(User user);

    @Transactional
    boolean deleteUserById(String userId);

    @Transactional
    boolean updateUserNonLockById(boolean nonLock, String id);

    User findUserByUserNameAndIsNonLock(String userName, boolean isNonLock);
}
