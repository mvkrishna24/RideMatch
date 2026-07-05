-- Dev-only seed: three VERIFIED students on the Kukatpally corridor so the
-- match feed has people in it. NEVER run against production.
--
-- Run:
--   docker exec -i routemate-postgres psql -U routemate -d routemate < dev-seed.sql
--
-- Then verify YOUR OWN account (sign up in the app first):
--   docker exec -it routemate-postgres psql -U routemate -d routemate \
--     -c "UPDATE users SET verification_status='VERIFIED' WHERE email='you@example.com';"

INSERT INTO users (id, firebase_uid, email, name, college, branch, year, gender, verification_status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'seed-arjun', 'arjun.seed@jntuh.ac.in',
   'Arjun Sharma', 'JNTU Hyderabad', 'CSE', '3rd', 'MALE', 'VERIFIED'),
  ('22222222-2222-2222-2222-222222222222', 'seed-meera', 'meera.seed@jntuh.ac.in',
   'Meera Patel', 'JNTU Hyderabad', 'ECE', '2nd', 'FEMALE', 'VERIFIED'),
  ('33333333-3333-3333-3333-333333333333', 'seed-ravi', 'ravi.seed@jntuh.ac.in',
   'Ravi Kumar', 'JNTU Hyderabad', 'MECH', '4th', 'MALE', 'VERIFIED')
ON CONFLICT (firebase_uid) DO NOTHING;

INSERT INTO commute_profiles
  (id, user_id, from_area, landmark, college_destination, morning_time, return_time,
   active_days, vehicle_type, gender_preference, emergency_contact)
VALUES
  ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
   'Kukatpally', 'JNTU Metro Station', 'JNTU Hyderabad', '8:30-9:00', '4:30-5:30',
   'M,T,W,Th,F', 'BIKE', 'ANY', '9876543210'),
  ('aaaaaaaa-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222',
   'Miyapur', 'Miyapur Metro', 'JNTU Hyderabad', '8:30-9:00', '4:30-5:30',
   'M,W,F', 'SCOOTY', 'ANY', '9876543211'),
  ('aaaaaaaa-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333',
   'Kukatpally', 'KPHB Colony', 'JNTU Hyderabad', '9:00-9:30', '4:30-5:30',
   'M,T,W,Th,F,S', 'NONE', 'ANY', '9876543212')
ON CONFLICT (user_id) DO NOTHING;
