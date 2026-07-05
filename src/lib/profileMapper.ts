import type {
  CommuteProfile,
  Gender,
  GenderPreference,
  Vehicle,
} from '../context/OnboardingContext';
import type {
  ApiGender,
  ApiGenderPreference,
  ApiVehicleType,
  CommuteRequest,
  UpdateMeRequest,
  UserResponse,
} from './apiTypes';

const GENDER_TO_API: Record<Gender, ApiGender> = {
  female: 'FEMALE',
  male: 'MALE',
  other: 'OTHER',
};
const GENDER_FROM_API: Record<ApiGender, Gender> = {
  FEMALE: 'female',
  MALE: 'male',
  OTHER: 'other',
};

const VEHICLE_TO_API: Record<Vehicle, ApiVehicleType> = {
  bike: 'BIKE',
  scooty: 'SCOOTY',
  car: 'CAR',
  none: 'NONE',
};
const VEHICLE_FROM_API: Record<ApiVehicleType, Vehicle> = {
  BIKE: 'bike',
  SCOOTY: 'scooty',
  CAR: 'car',
  NONE: 'none',
};

const PREFERENCE_TO_API: Record<GenderPreference, ApiGenderPreference> = {
  same: 'SAME',
  any: 'ANY',
};
const PREFERENCE_FROM_API: Record<ApiGenderPreference, GenderPreference> = {
  SAME: 'same',
  ANY: 'any',
};

export function toUpdateMeRequest(profile: CommuteProfile): UpdateMeRequest {
  return {
    name: profile.fullName,
    college: profile.college,
    branch: profile.branch,
    year: profile.year,
    gender: GENDER_TO_API[profile.gender],
  };
}

export function toCommuteRequest(profile: CommuteProfile): CommuteRequest {
  return {
    fromArea: profile.fromArea,
    landmark: profile.landmark || null,
    collegeDestination: profile.college,
    morningTime: profile.arrivalSlot,
    returnTime: profile.returnSlot,
    activeDays: profile.activeDays.join(','),
    vehicleType: VEHICLE_TO_API[profile.vehicle],
    genderPreference: PREFERENCE_TO_API[profile.genderPreference],
    emergencyContact: profile.emergencyContact,
  };
}

/**
 * A backend user counts as having a complete profile only when both the
 * identity fields and the commute row exist.
 */
export function fromUserResponse(user: UserResponse): CommuteProfile | null {
  if (!user.commute || !user.name || !user.gender || !user.year || !user.branch) {
    return null;
  }
  return {
    fullName: user.name,
    college: user.college ?? user.commute.collegeDestination,
    year: user.year,
    branch: user.branch,
    gender: GENDER_FROM_API[user.gender],
    fromArea: user.commute.fromArea,
    landmark: user.commute.landmark ?? '',
    arrivalSlot: user.commute.morningTime,
    returnSlot: user.commute.returnTime,
    activeDays: user.commute.activeDays ? user.commute.activeDays.split(',') : [],
    vehicle: VEHICLE_FROM_API[user.commute.vehicleType],
    genderPreference: PREFERENCE_FROM_API[user.commute.genderPreference],
    emergencyContact: user.commute.emergencyContact,
  };
}
