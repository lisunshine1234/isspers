package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.Algorithm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlgorithmRepository extends JpaRepository<Algorithm, String> {
    List<Algorithm> findAllByNavigationParentIdAndAlgorithmTypeAndHasFinishAndNonLockAndPassAndShareAndActivate(String navigationFatherId, String algorithmType, boolean hasFinish, boolean noLock, boolean pass, boolean share, boolean activate);

    List<Algorithm> findAllByActivateAndAlgorithmType(boolean activate, String algorithmType);

    List<Algorithm> findAllByAlgorithmType(String algorithmType);

    List<Algorithm> findAllByNavigationParentIdAndUserIdAndActivate(String navigationFatherId, String userId, boolean activate);

    List<Algorithm> findAllByActivate(boolean activate);

    List<Algorithm> findAllByHasFinishAndNonLockAndPassAndShareAndActivate(boolean hasFinish, boolean noLock, boolean pass, boolean share, boolean activate);

    List<Algorithm> findAllByIdIn(List<String> algorithmIdList);

    List<Algorithm> findAllByUserIdOrderByUploadTimeDesc(String userId);

    List<Algorithm> findAllByUserIdAndHasFinish(String userId, boolean hasFinish);

    Algorithm findAlgorithmByIdAndUserId(String algorithmId,String userId);
}
