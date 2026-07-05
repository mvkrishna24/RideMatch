// Mirrors routemate-api DTOs. Enums are UPPERCASE on the wire;
// profileMapper.ts converts to/from the app's lowercase model.

export type ApiGender = 'FEMALE' | 'MALE' | 'OTHER';
export type ApiVehicleType = 'BIKE' | 'SCOOTY' | 'CAR' | 'NONE';
export type ApiGenderPreference = 'SAME' | 'ANY';
export type ApiVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface CommuteResponse {
  id: string;
  fromArea: string;
  landmark: string | null;
  collegeDestination: string;
  morningTime: string;
  returnTime: string;
  activeDays: string | null;
  vehicleType: ApiVehicleType;
  genderPreference: ApiGenderPreference;
  emergencyContact: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  college: string | null;
  branch: string | null;
  year: string | null;
  gender: ApiGender | null;
  verificationStatus: ApiVerificationStatus;
  createdAt: string;
  commute: CommuteResponse | null;
}

export interface UpdateMeRequest {
  name: string;
  college: string;
  branch: string;
  year: string;
  gender: ApiGender;
}

export interface CommuteRequest {
  fromArea: string;
  landmark: string | null;
  collegeDestination: string;
  morningTime: string;
  returnTime: string;
  activeDays: string | null;
  vehicleType: ApiVehicleType;
  genderPreference: ApiGenderPreference;
  emergencyContact: string;
}
