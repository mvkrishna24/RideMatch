package com.routemate.api.match;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.routemate.api.common.ConflictException;
import com.routemate.api.common.ForbiddenException;
import com.routemate.api.commute.CommuteProfile;
import com.routemate.api.commute.CommuteProfileRepository;
import com.routemate.api.commute.GenderPreference;
import com.routemate.api.commute.VehicleType;
import com.routemate.api.connection.ConnectionService;
import com.routemate.api.interest.InterestService;
import com.routemate.api.interest.dto.InterestResponse;
import com.routemate.api.match.dto.MatchResponse;
import com.routemate.api.user.Gender;
import com.routemate.api.user.User;
import com.routemate.api.user.UserRepository;
import com.routemate.api.user.VerificationStatus;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/** The whole product loop: see match → send interest → accept → connection. */
@SpringBootTest
@ActiveProfiles("test")
class MatchFlowIntegrationTest {

    @Autowired private UserRepository userRepository;
    @Autowired private CommuteProfileRepository commuteProfileRepository;
    @Autowired private MatchService matchService;
    @Autowired private InterestService interestService;
    @Autowired private ConnectionService connectionService;

    @Test
    void fullLoopFromMatchToConnection() {
        User arjun =
                student("Arjun", Gender.MALE, VerificationStatus.VERIFIED,
                        "Kukatpally", "8:30-9:00", VehicleType.NONE, GenderPreference.ANY);
        User ravi =
                student("Ravi", Gender.MALE, VerificationStatus.VERIFIED,
                        "Kukatpally", "8:30-9:00", VehicleType.BIKE, GenderPreference.ANY);
        User priya =
                student("Priya", Gender.FEMALE, VerificationStatus.VERIFIED,
                        "Kukatpally", "8:30-9:00", VehicleType.SCOOTY, GenderPreference.SAME);

        // Arjun sees Ravi (perfect complement, score 100) but never Priya
        // (her same-gender preference is a hard filter, both directions).
        List<MatchResponse> matches = matchService.matchesFor(arjun);
        assertThat(matches).extracting(MatchResponse::name).containsExactly("Ravi");
        assertThat(matches.get(0).matchScore()).isEqualTo(100);

        // Priya, in turn, sees no men.
        assertThat(matchService.matchesFor(priya)).isEmpty();

        // Arjun sends interest; duplicates and self-sends are rejected.
        interestService.send(arjun, ravi.getId());
        assertThatThrownBy(() -> interestService.send(arjun, ravi.getId()))
                .isInstanceOf(ConflictException.class);
        assertThatThrownBy(() -> interestService.send(arjun, arjun.getId()))
                .isInstanceOf(ConflictException.class);

        // Ravi sees the incoming interest and accepts.
        List<InterestResponse> incoming = interestService.incoming(ravi);
        assertThat(incoming).hasSize(1);
        assertThat(incoming.get(0).sender().name()).isEqualTo("Arjun");
        interestService.accept(ravi, incoming.get(0).id());

        // A connection now exists for both, and they vanish from each other's feed.
        assertThat(connectionService.listFor(arjun))
                .singleElement()
                .satisfies(c -> assertThat(c.user().name()).isEqualTo("Ravi"));
        assertThat(connectionService.listFor(ravi))
                .singleElement()
                .satisfies(c -> assertThat(c.user().name()).isEqualTo("Arjun"));
        assertThat(matchService.matchesFor(arjun)).isEmpty();
        assertThat(matchService.matchesFor(ravi))
                .extracting(MatchResponse::name)
                .doesNotContain("Arjun");
    }

    @Test
    void unverifiedUsersCanNeitherSeeMatchesNorAppearInThem() {
        User verified =
                student("Meera", Gender.FEMALE, VerificationStatus.VERIFIED,
                        "Miyapur", "9:00-9:30", VehicleType.SCOOTY, GenderPreference.ANY);
        User pending =
                student("Pending", Gender.FEMALE, VerificationStatus.PENDING,
                        "Miyapur", "9:00-9:30", VehicleType.NONE, GenderPreference.ANY);

        assertThatThrownBy(() -> matchService.matchesFor(pending))
                .isInstanceOf(ForbiddenException.class);
        assertThat(matchService.matchesFor(verified))
                .extracting(MatchResponse::name)
                .doesNotContain("Pending");
    }

    private User student(
            String name,
            Gender gender,
            VerificationStatus status,
            String area,
            String slot,
            VehicleType vehicle,
            GenderPreference preference) {
        User user =
                userRepository.save(
                        User.builder()
                                .firebaseUid("uid-" + name + "-" + UUID.randomUUID())
                                .email(name.toLowerCase() + "@jntuh.ac.in")
                                .name(name)
                                .college("JNTU Hyderabad")
                                .branch("CSE")
                                .year("3rd")
                                .gender(gender)
                                .verificationStatus(status)
                                .build());
        commuteProfileRepository.save(
                CommuteProfile.builder()
                        .user(user)
                        .fromArea(area)
                        .collegeDestination("JNTU Hyderabad")
                        .morningTime(slot)
                        .returnTime("4:30-5:30")
                        .activeDays("M,T,W,Th,F")
                        .vehicleType(vehicle)
                        .genderPreference(preference)
                        .emergencyContact("9876543210")
                        .build());
        return user;
    }
}
