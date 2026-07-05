package com.routemate.api.interest;

import com.routemate.api.common.ConflictException;
import com.routemate.api.common.ForbiddenException;
import com.routemate.api.common.NotFoundException;
import com.routemate.api.common.UserSummary;
import com.routemate.api.commute.CommuteProfileRepository;
import com.routemate.api.connection.ConnectionService;
import com.routemate.api.interest.dto.InterestResponse;
import com.routemate.api.safety.BlockRepository;
import com.routemate.api.user.User;
import com.routemate.api.user.UserRepository;
import com.routemate.api.user.VerificationStatus;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InterestService {

    private final InterestRepository interestRepository;
    private final UserRepository userRepository;
    private final CommuteProfileRepository commuteProfileRepository;
    private final BlockRepository blockRepository;
    private final ConnectionService connectionService;

    @Transactional
    public InterestResponse send(User me, UUID receiverId) {
        requireVerified(me);
        if (me.getId().equals(receiverId)) {
            throw new ConflictException("You cannot send an interest to yourself");
        }
        User receiver =
                userRepository
                        .findById(receiverId)
                        .filter(u -> u.getVerificationStatus() == VerificationStatus.VERIFIED)
                        .orElseThrow(() -> new NotFoundException("Student not found"));

        if (isBlockedEitherWay(me.getId(), receiverId)) {
            throw new NotFoundException("Student not found");
        }
        if (interestRepository.existsBySenderIdAndReceiverId(me.getId(), receiverId)) {
            throw new ConflictException("Interest already sent");
        }
        if (interestRepository.existsBySenderIdAndReceiverId(receiverId, me.getId())) {
            throw new ConflictException(
                    "This student already sent you an interest — check your requests");
        }

        Interest saved =
                interestRepository.save(Interest.builder().sender(me).receiver(receiver).build());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<InterestResponse> incoming(User me) {
        return interestRepository
                .findByReceiverIdAndStatusOrderByCreatedAtDesc(me.getId(), InterestStatus.PENDING)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public InterestResponse accept(User me, UUID interestId) {
        Interest interest = pendingInterestForReceiver(me, interestId);
        interest.setStatus(InterestStatus.ACCEPTED);
        interestRepository.save(interest);
        connectionService.connect(interest.getSender(), interest.getReceiver());
        return toResponse(interest);
    }

    @Transactional
    public InterestResponse decline(User me, UUID interestId) {
        Interest interest = pendingInterestForReceiver(me, interestId);
        interest.setStatus(InterestStatus.DECLINED);
        interestRepository.save(interest);
        return toResponse(interest);
    }

    private Interest pendingInterestForReceiver(User me, UUID interestId) {
        Interest interest =
                interestRepository
                        .findById(interestId)
                        .orElseThrow(() -> new NotFoundException("Interest not found"));
        if (!interest.getReceiver().getId().equals(me.getId())) {
            throw new ForbiddenException("This interest was not sent to you");
        }
        if (interest.getStatus() != InterestStatus.PENDING) {
            throw new ConflictException("This interest was already answered");
        }
        return interest;
    }

    private boolean isBlockedEitherWay(UUID a, UUID b) {
        return blockRepository.findByBlockerIdOrBlockedUserId(a, a).stream()
                .anyMatch(
                        block ->
                                block.getBlockerId().equals(b) || block.getBlockedUserId().equals(b));
    }

    private void requireVerified(User user) {
        if (user.getVerificationStatus() != VerificationStatus.VERIFIED) {
            throw new ForbiddenException(
                    "Your account is pending verification. You can send interests once verified.");
        }
    }

    private InterestResponse toResponse(Interest interest) {
        var senderCommute =
                commuteProfileRepository.findByUserId(interest.getSender().getId()).orElse(null);
        return new InterestResponse(
                interest.getId(),
                interest.getStatus(),
                interest.getCreatedAt(),
                UserSummary.of(interest.getSender(), senderCommute));
    }
}
