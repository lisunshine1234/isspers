package com.guteam.java_service.respository.mysql;


import com.guteam.java_service.entity.NavigationParent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface NavigationParentRepository extends JpaRepository<NavigationParent, String> {
    List<NavigationParent> findAllByActivateOrderByOrderNumAsc(boolean isActivate);

    List<NavigationParent> findAllByNavigationTypeIdInAndActivateOrderByOrderNumAsc(List<String> navigationTypeIdList, boolean isActivate);

    List<NavigationParent> findAllByIdIn(Set<String> id);

    NavigationParent findByNavigationUrl(String url);
}
