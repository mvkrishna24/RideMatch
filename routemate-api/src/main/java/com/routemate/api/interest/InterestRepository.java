package com.routemate.api.interest;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterestRepository extends JpaRepository<Interest, UUID> {

    boolean existsBySenderIdAndReceiverId(UUID senderId, UUID receiverId);

    List<Interest> findByReceiverIdAndStatusOrderByCreatedAtDesc(UUID receiverId, InterestStatus status);

    List<Interest> findBySenderIdOrReceiverId(UUID senderId, UUID receiverId);

    void deleteBySenderIdAndReceiverId(UUID senderId, UUID receiverId);
}
