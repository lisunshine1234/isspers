package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.User;
import com.guteam.java_service.entity.UserType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserTypeRepository extends JpaRepository<UserType, String> {
}
