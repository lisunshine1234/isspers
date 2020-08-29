package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.Input;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface InputRepository extends JpaRepository<Input, String> {
    List<Input> findAllByAlgorithmId(String algorithmId);

    List<Input> findAllByAlgorithmIdAndInputTypeId(String algorithmId, String InputTypeId);

    List<Input> findAllByAlgorithmIdOrderByOrderNumAsc(String algorithmId);

    List<Input> findAllByAlgorithmIdInOrderByOrderNumAsc(Set<String> algorithmIdSet);

    List<Input> findAllByAlgorithmIdInOrderByOrderNumAsc(List<String> algorithmIdList);

    void deleteAllByAlgorithmId(String algorithmId);
}
