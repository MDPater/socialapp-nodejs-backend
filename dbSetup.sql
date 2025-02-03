CREATE DATABASE snapshare;

-- Switch to the newly created database
\c snapshare;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    bio VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
	verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE followers (
    id SERIAL PRIMARY KEY,
    following_id INT NOT NULL,
    follower_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_following FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_follower FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    ip VARCHAR(30),
    info VARCHAR(255),
    user_role VARCHAR(10) DEFAULT 'user',
    user_id INT NOT NULL,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE party_room (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description VARCHAR(255),
    thumbnail VARCHAR(255),
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE room_participants (
    id SERIAL PRIMARY KEY,
    room_id INT NOT NULL,
    participant_id INT NOT NULL,
    CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES party_room(id) ON DELETE CASCADE,
    CONSTRAINT fk_participant FOREIGN KEY (participant_id) REFERENCES users(id) ON DELETE CASCADE
)