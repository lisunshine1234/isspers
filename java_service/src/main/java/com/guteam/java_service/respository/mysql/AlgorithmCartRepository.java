package com.guteam.java_service.respository.mysql;

import com.guteam.java_service.entity.AlgorithmCart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlgorithmCartRepository extends JpaRepository<AlgorithmCart, String> {
    List<AlgorithmCart> findAllByUserId(String userId);

    AlgorithmCart findAllByUserIdAndAlgorithmId(String userId, String algorithmId);

    AlgorithmCart findAllByUserIdAndId(String userId, String cartId);


}
