package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.admin.AdminNavigationParent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminNavigationParentRepository extends JpaRepository<AdminNavigationParent, String> {
    List<AdminNavigationParent> findAllByActivateOrderByOrderNumAsc(boolean activate);
}
