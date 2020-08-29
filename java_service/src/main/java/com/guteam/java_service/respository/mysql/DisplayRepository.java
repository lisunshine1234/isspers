package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.Display;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface DisplayRepository extends JpaRepository<Display, String> {
    List<Display> findAllByOutputIdInOrderByOrderNumAsc(List<String> OutputIdList);

    List<Display> findAllByOutputIdInOrderByOrderNumAsc(Set<String> OutputIdSet);

    List<Display> findAllByOutputIdOrderByOrderNumAsc(String OutputId);

    List<Display> findAllByAlgorithmIdOrderByOrderNumAsc(String algorithmId);

    void deleteAllByOutputId(String outputId);

    void deleteAllByIdIn(List<String> displayIdList);

    void deleteAllByAlgorithmId(String algorithmId);
}
