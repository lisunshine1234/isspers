package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.InputType;
import com.guteam.java_service.entity.OutputType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface InputTypeRepository extends JpaRepository<InputType, String> {
    InputType findByInputKeyOrderByOrderNumAsc(String inputKey);

    List<InputType> findAllByActivateOrderByOrderNumAsc(boolean activate);

    List<InputType> findAllByIdInAndActivateOrderByOrderNumAsc(Set<String> InputTypeIdSet, boolean activate);

    List<InputType> findAllByIdInAndActivateOrderByOrderNumAsc(List<String> InputTypeIdList, boolean activate);

    List<InputType> findAllByIdInOrderByOrderNumAsc(Set<String> InputTypeIdSet);

    List<InputType> findAllByIdInOrderByOrderNumAsc(List<String> InputTypeIdList);

    InputType findAllByIdAndActivateOrderByOrderNumAsc(String InputTypeId, boolean activate);

    InputType findAllByIdOrderByOrderNumAsc(String InputTypeId);
}
