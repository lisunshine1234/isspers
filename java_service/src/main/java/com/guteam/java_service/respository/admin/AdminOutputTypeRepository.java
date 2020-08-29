package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.OutputType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface AdminOutputTypeRepository extends JpaRepository<OutputType,String> {
    List<OutputType> findAllByIdInOrderByOrderNumAsc(Set<String> outputTypeIdSet);
}
