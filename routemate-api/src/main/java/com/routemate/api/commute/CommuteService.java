package com.routemate.api.commute;

import com.routemate.api.commute.dto.CommuteRequest;
import com.routemate.api.user.User;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommuteService {

    private final CommuteProfileRepository commuteProfileRepository;

    @Transactional(readOnly = true)
    public Optional<CommuteProfile> findByUser(User user) {
        return commuteProfileRepository.findByUserId(user.getId());
    }

    /** One commute profile per user: create on first call, overwrite after. */
    @Transactional
    public CommuteProfile upsert(User user, CommuteRequest request) {
        CommuteProfile profile =
                commuteProfileRepository
                        .findByUserId(user.getId())
                        .orElseGet(() -> CommuteProfile.builder().user(user).build());

        profile.setFromArea(request.fromArea());
        profile.setLandmark(request.landmark());
        profile.setCollegeDestination(request.collegeDestination());
        profile.setMorningTime(request.morningTime());
        profile.setReturnTime(request.returnTime());
        profile.setActiveDays(request.activeDays());
        profile.setVehicleType(request.vehicleType());
        profile.setGenderPreference(request.genderPreference());
        profile.setEmergencyContact(request.emergencyContact());

        return commuteProfileRepository.save(profile);
    }
}
