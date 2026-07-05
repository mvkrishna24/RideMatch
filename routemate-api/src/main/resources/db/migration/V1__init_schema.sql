-- RouteMate MVP schema. All Phase 3 tables exist from day one so migrations
-- stay linear; only users + commute_profiles have code against them in 2C.

CREATE TABLE users (
    id                  UUID PRIMARY KEY,
    firebase_uid        VARCHAR(128) NOT NULL UNIQUE,
    email               VARCHAR(255) NOT NULL,
    name                VARCHAR(120),
    college             VARCHAR(120),
    branch              VARCHAR(60),
    year                VARCHAR(10),
    gender              VARCHAR(10),
    verification_status VARCHAR(10)  NOT NULL DEFAULT 'PENDING',
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT chk_verification_status
        CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED'))
);

CREATE INDEX idx_users_verification_status ON users (verification_status);

CREATE TABLE commute_profiles (
    id                  UUID PRIMARY KEY,
    user_id             UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    from_area           VARCHAR(60)  NOT NULL,
    landmark            VARCHAR(120),
    college_destination VARCHAR(120) NOT NULL,
    morning_time        VARCHAR(20)  NOT NULL,
    return_time         VARCHAR(20)  NOT NULL,
    active_days         VARCHAR(30),
    vehicle_type        VARCHAR(10)  NOT NULL,
    gender_preference   VARCHAR(10)  NOT NULL,
    emergency_contact   VARCHAR(20)  NOT NULL,
    CONSTRAINT chk_vehicle_type
        CHECK (vehicle_type IN ('BIKE', 'SCOOTY', 'CAR', 'NONE')),
    CONSTRAINT chk_gender_preference
        CHECK (gender_preference IN ('SAME', 'ANY'))
);

CREATE INDEX idx_commute_from_area ON commute_profiles (from_area);

CREATE TABLE interests (
    id          UUID PRIMARY KEY,
    sender_id   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status      VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_interest_pair UNIQUE (sender_id, receiver_id),
    CONSTRAINT chk_interest_not_self CHECK (sender_id <> receiver_id),
    CONSTRAINT chk_interest_status CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED'))
);

CREATE INDEX idx_interests_receiver ON interests (receiver_id, status);

CREATE TABLE connections (
    id         UUID PRIMARY KEY,
    user_a     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    user_b     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_connection_pair UNIQUE (user_a, user_b),
    CONSTRAINT chk_connection_not_self CHECK (user_a <> user_b)
);

CREATE INDEX idx_connections_user_a ON connections (user_a);
CREATE INDEX idx_connections_user_b ON connections (user_b);

CREATE TABLE reports (
    id               UUID PRIMARY KEY,
    reporter_id      UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    reported_user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    reason           TEXT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_reported_user ON reports (reported_user_id);

CREATE TABLE blocks (
    blocker_id      UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    blocked_user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (blocker_id, blocked_user_id),
    CONSTRAINT chk_block_not_self CHECK (blocker_id <> blocked_user_id)
);
