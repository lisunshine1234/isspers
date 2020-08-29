package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.UserType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminUserTypeRepository extends JpaRepository<UserType,String> {
    List<UserType> findAllByUserTypeParentId(String userTypeParentId);

    List<UserType> findAllByUserTypeName(String userTypeName);

    List<UserType> findAllByUserTypeParentIdIn(List<String> userTypeParentIdList);

    void deleteAllByUserTypeParentId(String userTypeParentId);

}
