package com.guteam.java_service.respository.admin;

import com.guteam.java_service.entity.Input;
import com.guteam.java_service.entity.InputType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface AdminInputTypeRepository extends JpaRepository<InputType, String> {
    List<InputType> findAllByIdInOrderByOrderNumAsc(Set<String> inputTypeIdSet);
}
