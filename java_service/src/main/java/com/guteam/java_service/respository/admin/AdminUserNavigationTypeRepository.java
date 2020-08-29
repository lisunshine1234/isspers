package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.NavigationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdminUserNavigationTypeRepository extends JpaRepository<NavigationType,String> {
    List<NavigationType> findAllByNavigationAlgorithmOrderByOrderNumAsc(boolean navigationAlgorithm);

    @Query(value = "SELECT * FROM navigation_type ORDER BY order_num asc",nativeQuery = true)
    List<NavigationType> findAllOrderByOrderNumAsc();

    List<NavigationType> findAllByIdNotAndNavigationName(String navigationId,String navigationName);
}
