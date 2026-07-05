package com.routemate.api.commute;

import com.routemate.api.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "commute_profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CommuteProfile {

    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "from_area", nullable = false)
    private String fromArea;

    private String landmark;

    @Column(name = "college_destination", nullable = false)
    private String collegeDestination;

    @Column(name = "morning_time", nullable = false)
    private String morningTime;

    @Column(name = "return_time", nullable = false)
    private String returnTime;

    /** Comma-separated day keys, e.g. "M,T,W,Th,F". */
    @Column(name = "active_days")
    private String activeDays;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender_preference", nullable = false)
    private GenderPreference genderPreference;

    @Column(name = "emergency_contact", nullable = false)
    private String emergencyContact;
}
