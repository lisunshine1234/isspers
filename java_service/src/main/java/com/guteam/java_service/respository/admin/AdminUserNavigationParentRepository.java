package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.NavigationParent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface AdminUserNavigationParentRepository extends JpaRepository<NavigationParent,String> {
    List<NavigationParent> findAllByIdIn(Set<String> idSet);

    List<NavigationParent> findAllByActivateOrderByOrderNumAsc(boolean activate);


    @Query(value = "SELECT * FROM navigation_parent ORDER BY order_num asc",nativeQuery = true)
    List<NavigationParent> findAllOrderByOrderNumAsc();


    List<NavigationParent> findAllByNavigationTypeId(String navigationTypeId);

    List<NavigationParent> findAllByIdNotAndNavigationUrl(String navigationId,String navigationUrl);

    List<NavigationParent> findAllByIdNotAndNavigationName(String navigationId,String navigationName);
}
