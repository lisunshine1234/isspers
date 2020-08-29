package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.OutputType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface OutputTypeRepository extends JpaRepository<OutputType, String> {
    List<OutputType> findAllByActivateOrderByOrderNumAsc(boolean activate);

    List<OutputType> findAllByIdInAndActivateOrderByOrderNumAsc(Set<String> outputTypeIdSet, boolean activate);

    List<OutputType> findAllByIdInAndActivateOrderByOrderNumAsc(List<String> outputTypeIdList, boolean activate);

    List<OutputType> findAllByIdInOrderByOrderNumAsc(Set<String> outputTypeIdSet);

    List<OutputType> findAllByIdInOrderByOrderNumAsc(List<String> outputTypeIdList);

    OutputType findAllByIdAndActivateOrderByOrderNumAsc(String outputTypeId, boolean activate);

    OutputType findAllByIdOrderByOrderNumAsc(String outputTypeId);
}
