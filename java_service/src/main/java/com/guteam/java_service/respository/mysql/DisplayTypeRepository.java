package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.DisplayType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface DisplayTypeRepository extends JpaRepository<DisplayType, String> {
    List<DisplayType> findAllByActivateOrderByOrderNumAsc(boolean activate);

    List<DisplayType> findAllByIdInAndActivateOrderByOrderNumAsc(Set<String> displayTypeIdSet, boolean activate);

    List<DisplayType> findAllByIdInAndActivateOrderByOrderNumAsc(List<String> displayTypeIdList, boolean activate);

    List<DisplayType> findAllByIdInOrderByOrderNumAsc(Set<String> displayTypeIdSet);

    List<DisplayType> findAllByIdInOrderByOrderNumAsc(List<String> displayTypeIdList);

    DisplayType findAllByIdOrderByOrderNumAsc(String displayTypeId);

    DisplayType findAllByIdAndActivateOrderByOrderNumAsc(String displayTypeId, boolean activate);

}
