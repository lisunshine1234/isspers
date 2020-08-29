package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, String> {

    User findUserByUserName(String userName);

    User findUserByUserNameAndNonLock(String userName, boolean isNonLock);

    List<User> findAllByIdIn(Set<String> id);
}
