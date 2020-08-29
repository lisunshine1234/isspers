package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;


public interface AdminUserRepository extends JpaRepository<User, String> {
    User findByUserName(String userName);

    User findByPhone(String phone);

    User findByEmail(String email);

    @Query(value = "UPDATE `user` SET non_lock = ? WHERE id = ?",nativeQuery = true)
    User updateUserNonLockById(boolean nonLock,String id);

    List<User> findAllByIdIn(Set<String> userSet);

    User findUserByUserNameAndNonLock(String userName, boolean isNonLock);


    List<User> findAllByUserTypeIdIn(List<String> userTypeIdList);
}
