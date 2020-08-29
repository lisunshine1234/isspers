package com.guteam.java_service.respository.mysql;


import com.guteam.java_service.entity.NavigationParent;
import com.guteam.java_service.entity.NavigationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NavigationTypeRepository extends JpaRepository<NavigationType, String> {
    List<NavigationType> findAllByActivateOrderByOrderNumAsc(boolean isActivate);

    List<NavigationType> findAllByActivateAndNavigationAlgorithm(boolean activate, boolean navigationAlgorithm);
}
