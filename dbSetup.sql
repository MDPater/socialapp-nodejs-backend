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

CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    ip VARCHAR(30),
    user_role VARCHAR(10) DEFAULT user,
    user_id INT NOT NULL,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);