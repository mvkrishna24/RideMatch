// Single source for every onboarding option list.
// The area list must stay in sync with the Phase 0 Google Form dropdown —
// matching quality depends on both funnels speaking the same area names.

export interface ChipOption {
  value: string;
  label: string;
}

export const COLLEGE = 'Sanskriti University';

export const YEARS: ChipOption[] = [
  { value: '1st', label: '1st Year' },
  { value: '2nd', label: '2nd Year' },
  { value: '3rd', label: '3rd Year' },
  { value: '4th', label: '4th Year' },
];

export const BRANCHES: ChipOption[] = [
  { value: 'CSE', label: 'CSE' },
  { value: 'AI&ML', label: 'AI & ML' },
  { value: 'ECE', label: 'ECE' },
  { value: 'EEE', label: 'EEE' },
  { value: 'IT', label: 'IT' },
  { value: 'MECH', label: 'MECH' },
  { value: 'CIVIL', label: 'CIVIL' },
  { value: 'OTHER', label: 'Other' },
];

export const GENDERS: ChipOption[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Prefer not to say' },
];

export const AREAS: ChipOption[] = [
  { value: 'Kukatpally', label: 'Kukatpally' },
  { value: 'KPHB', label: 'KPHB' },
  { value: 'Miyapur', label: 'Miyapur' },
  { value: 'Nizampet', label: 'Nizampet' },
  { value: 'Bachupally', label: 'Bachupally' },
  { value: 'JNTU', label: 'JNTU' },
  { value: 'Kondapur', label: 'Kondapur' },
  { value: 'Gachibowli', label: 'Gachibowli' },
  { value: 'Madhapur', label: 'Madhapur' },
  { value: 'Ameerpet', label: 'Ameerpet' },
  { value: 'ECIL', label: 'ECIL' },
  { value: 'Uppal', label: 'Uppal' },
  { value: 'LB Nagar', label: 'LB Nagar' },
  { value: 'Dilsukhnagar', label: 'Dilsukhnagar' },
  { value: 'Secunderabad', label: 'Secunderabad' },
  { value: 'Other', label: 'Other' },
];

export const ARRIVAL_SLOTS: ChipOption[] = [
  { value: 'before-8:30', label: 'Before 8:30 AM' },
  { value: '8:30-9:00', label: '8:30 – 9:00' },
  { value: '9:00-9:30', label: '9:00 – 9:30' },
  { value: '9:30-10:00', label: '9:30 – 10:00' },
];

export const RETURN_SLOTS: ChipOption[] = [
  { value: 'before-3:30', label: 'Before 3:30 PM' },
  { value: '3:30-4:30', label: '3:30 – 4:30' },
  { value: '4:30-5:30', label: '4:30 – 5:30' },
  { value: 'after-5:30', label: 'After 5:30' },
];

export const ACTIVE_DAYS: ChipOption[] = [
  { value: 'M', label: 'Mon' },
  { value: 'T', label: 'Tue' },
  { value: 'W', label: 'Wed' },
  { value: 'Th', label: 'Thu' },
  { value: 'F', label: 'Fri' },
  { value: 'S', label: 'Sat' },
];

export const VEHICLES: ChipOption[] = [
  { value: 'bike', label: 'Bike' },
  { value: 'scooty', label: 'Scooty' },
  { value: 'car', label: 'Car' },
  { value: 'none', label: 'No vehicle' },
];

export const GENDER_PREFERENCES: ChipOption[] = [
  { value: 'same', label: 'Same gender preferred' },
  { value: 'any', label: 'Anyone from my college' },
];

// Indian mobile: 10 digits starting 6-9, optional +91/0 prefix stripped first.
export function isValidIndianMobile(raw: string): boolean {
  const digits = raw.replace(/[^0-9]/g, '').replace(/^(91|0)(?=[6-9]\d{9}$)/, '');
  return /^[6-9]\d{9}$/.test(digits);
}
