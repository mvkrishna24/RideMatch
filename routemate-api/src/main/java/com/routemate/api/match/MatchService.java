package com.routemate.api.match;

import com.routemate.api.common.ForbiddenException;
import com.routemate.api.commute.CommuteProfile;
import com.routemate.api.commute.CommuteProfileRepository;
import com.routemate.api.commute.GenderPreference;
import com.routemate.api.connection.ConnectionService;
import com.routemate.api.interest.Interest;
import com.routemate.api.interest.InterestRepository;
import com.routemate.api.interest.InterestStatus;
import com.routemate.api.match.dto.MatchResponse;
import com.routemate.api.safety.BlockRepository;
import com.routemate.api.user.User;
import com.routemate.api.user.VerificationStatus;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MatchService {

    private static final int MAX_RESULTS = 50;

    private final CommuteProfileRepository commuteProfileRepository;
    private final ConnectionService connectionService;
    private final InterestRepository interestRepository;
    private final BlockRepository blockRepository;
    private final MatchScorer matchScorer;

    @Transactional(readOnly = true)
    public List<MatchResponse> matchesFor(User me) {
        if (me.getVerificationStatus() != VerificationStatus.VERIFIED) {
            throw new ForbiddenException(
                    "Your account is pending verification. Matches unlock once you're verified.");
        }
        CommuteProfile myCommute =
                commuteProfileRepository.findByUserId(me.getId()).orElse(null);
        if (myCommute == null) {
            return List.of();
        }

        Set<UUID> excluded = new HashSet<>(connectionService.connectedUserIds(me.getId()));
        excluded.addAll(blockedUserIds(me.getId()));

        Map<UUID, Interest> outgoing = new HashMap<>();
        Map<UUID, Interest> incoming = new HashMap<>();
        for (Interest interest :
                interestRepository.findBySenderIdOrReceiverId(me.getId(), me.getId())) {
            if (interest.getSender().getId().equals(me.getId())) {
                outgoing.put(interest.getReceiver().getId(), interest);
            } else {
                incoming.put(interest.getSender().getId(), interest);
            }
        }

        List<CommuteProfile> candidates =
                commuteProfileRepository.findMatchCandidates(
                        me.getId(), VerificationStatus.VERIFIED, myCommute.getCollegeDestination());

        return candidates.stream()
                .filter(candidate -> !excluded.contains(candidate.getUser().getId()))
                .filter(candidate -> passesGenderFilter(me, myCommute, candidate))
                .map(candidate -> toResponse(candidate, myCommute, outgoing, incoming))
                .sorted(
                        Comparator.comparing(
                                        (MatchResponse m) -> m.incomingInterestId() != null)
                                .reversed()
                                .thenComparing(
                                        Comparator.comparingInt(MatchResponse::matchScore)
                                                .reversed()))
                .limit(MAX_RESULTS)
                .toList();
    }

    /**
     * Gender preference is a HARD filter, enforced in both directions:
     * a student who chose same-gender neither sees nor is shown to others.
     */
    private boolean passesGenderFilter(
            User me, CommuteProfile myCommute, CommuteProfile candidate) {
        User other = candidate.getUser();
        if (myCommute.getGenderPreference() == GenderPreference.SAME
                && me.getGender() != other.getGender()) {
            return false;
        }
        if (candidate.getGenderPreference() == GenderPreference.SAME
                && other.getGender() != me.getGender()) {
            return false;
        }
        return true;
    }

    private Set<UUID> blockedUserIds(UUID meId) {
        Set<UUID> ids = new HashSet<>();
        blockRepository
                .findByBlockerIdOrBlockedUserId(meId, meId)
                .forEach(
                        block -> {
                            ids.add(block.getBlockerId());
                            ids.add(block.getBlockedUserId());
                        });
        ids.remove(meId);
        return ids;
    }

    private MatchResponse toResponse(
            CommuteProfile candidate,
            CommuteProfile myCommute,
            Map<UUID, Interest> outgoing,
            Map<UUID, Interest> incoming) {
        User other = candidate.getUser();
        Interest sent = outgoing.get(other.getId());
        Interest received = incoming.get(other.getId());
        return new MatchResponse(
                other.getId(),
                other.getName(),
                other.getBranch(),
                other.getYear(),
                other.getGender(),
                candidate.getFromArea(),
                candidate.getVehicleType().name(),
                candidate.getMorningTime(),
                candidate.getActiveDays(),
                matchScorer.score(myCommute, candidate),
                sent != null ? sent.getStatus().name() : "NONE",
                received != null && received.getStatus() == InterestStatus.PENDING
                        ? received.getId()
                        : null);
    }
}
