package com.routemate.api.safety;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.routemate.api.common.NotFoundException;
import com.routemate.api.commute.CommuteProfile;
import com.routemate.api.commute.CommuteProfileRepository;
import com.routemate.api.commute.GenderPreference;
import com.routemate.api.commute.VehicleType;
import com.routemate.api.connection.ConnectionService;
import com.routemate.api.interest.InterestService;
import com.routemate.api.match.MatchService;
import com.routemate.api.match.dto.MatchResponse;
import com.routemate.api.user.Gender;
import com.routemate.api.user.User;
import com.routemate.api.user.UserRepository;
import com.routemate.api.user.VerificationStatus;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/** Blocking severs everything: connection, interests, and feed visibility. */
@SpringBootTest
@ActiveProfiles("test")
class SafetyFlowIntegrationTest {

    @Autowired private UserRepository userRepository;
    @Autowired private CommuteProfileRepository commuteProfileRepository;
    @Autowired private MatchService matchService;
    @Autowired private InterestService interestService;
    @Autowired private ConnectionService connectionService;
    @Autowired private SafetyService safetyService;
    @Autowired private ReportRepository reportRepository;

    @Test
    void blockSeversConnectionInterestsAndVisibility() {
        User kiran = student("Kiran");
        User dev = student("Dev");

        // Connect the pair through the normal flow.
        interestService.send(kiran, dev.getId());
        var interestId = interestService.incoming(dev).get(0).id();
        interestService.accept(dev, interestId);
        assertThat(connectionService.listFor(kiran)).hasSize(1);

        // Kiran blocks Dev.
        safetyService.block(kiran, dev.getId());

        // Connection is gone for both, both feeds are clean, and Dev cannot
        // re-initiate — the block reads as "student not found", never
        // revealing that a block exists.
        assertThat(connectionService.listFor(kiran)).isEmpty();
        assertThat(connectionService.listFor(dev)).isEmpty();
        assertThat(matchService.matchesFor(kiran))
                .extracting(MatchResponse::name)
                .doesNotContain("Dev");
        assertThat(matchService.matchesFor(dev))
                .extracting(MatchResponse::name)
                .doesNotContain("Kiran");
        assertThatThrownBy(() -> interestService.send(dev, kiran.getId()))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void reportIsPersistedForFounderReview() {
        User asha = student("Asha");
        User rohit = student("Rohit");

        safetyService.report(asha, rohit.getId(), "Kept asking for my home address");

        var reports = reportRepository.findByReportedUserId(rohit.getId());
        assertThat(reports).hasSize(1);
        assertThat(reports.get(0).getReporterId()).isEqualTo(asha.getId());
        assertThat(reports.get(0).getReason()).contains("home address");
    }

    private User student(String name) {
        User user =
                userRepository.save(
                        User.builder()
                                .firebaseUid("uid-" + name + "-" + UUID.randomUUID())
                                .email(name.toLowerCase() + UUID.randomUUID() + "@jntuh.ac.in")
                                .name(name)
                                .college("JNTU Hyderabad")
                                .branch("CSE")
                                .year("3rd")
                                .gender(Gender.MALE)
                                .verificationStatus(VerificationStatus.VERIFIED)
                                .build());
        commuteProfileRepository.save(
                CommuteProfile.builder()
                        .user(user)
                        .fromArea("Kukatpally")
                        .collegeDestination("JNTU Hyderabad")
                        .morningTime("8:30-9:00")
                        .returnTime("4:30-5:30")
                        .activeDays("M,T,W,Th,F")
                        .vehicleType(VehicleType.BIKE)
                        .genderPreference(GenderPreference.ANY)
                        .emergencyContact("9876543210")
                        .build());
        return user;
    }
}
