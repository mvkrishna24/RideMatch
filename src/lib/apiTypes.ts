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

export type ApiInterestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface MatchResponse {
  userId: string;
  name: string | null;
  branch: string | null;
  year: string | null;
  gender: ApiGender | null;
  fromArea: string;
  vehicleType: ApiVehicleType;
  morningTime: string;
  activeDays: string | null;
  matchScore: number;
  outgoingInterestStatus: ApiInterestStatus | 'NONE';
  incomingInterestId: string | null;
}

export interface UserSummary {
  userId: string;
  name: string | null;
  branch: string | null;
  year: string | null;
  gender: ApiGender | null;
  fromArea: string | null;
  vehicleType: ApiVehicleType | null;
  morningTime: string | null;
  activeDays: string | null;
}

export interface InterestResponse {
  id: string;
  status: ApiInterestStatus;
  createdAt: string;
  sender: UserSummary;
}

export interface ConnectionResponse {
  id: string;
  createdAt: string;
  user: UserSummary;
  /** Partner's Firebase UID — only exposed post-connection; keys the chat room. */
  partnerFirebaseUid: string;
}
