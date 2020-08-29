package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.admin.AdminNavigationChild;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminNavigationChildRepository extends JpaRepository<AdminNavigationChild, String> {
    List<AdminNavigationChild> findAllByActivateOrderByOrderNumAsc(boolean activate);
}
