package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.Output;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface OutputRepository extends JpaRepository<Output, String> {
    List<Output> findAllByAlgorithmIdOrderByOrderNumAsc(String algorithmId);

    List<Output> findAllByAlgorithmIdInOrderByOrderNumAsc(Set<String> algorithmIdSet);

    List<Output> findAllByAlgorithmIdInOrderByOrderNumAsc(List<String> algorithmIdList);

    void deleteAllByAlgorithmId(String algorithmId);

    void deleteAllByIdIn(List<String> outputIdList);
}
