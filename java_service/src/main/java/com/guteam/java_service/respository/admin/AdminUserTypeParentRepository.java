package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.UserType;
import com.guteam.java_service.entity.UserTypeParent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminUserTypeParentRepository extends JpaRepository<UserTypeParent,String> {

    List<UserTypeParent> findAllByUserTypeParentName(String userTypeParentName);


    List<UserTypeParent> findAllByUserTypeNot(String userType);
}
