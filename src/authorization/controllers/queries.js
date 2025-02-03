const register  = "INSERT INTO users (username, email, password, verification_token) VALUES ($1, $2, $3, $4) RETURNING *";

const checkUsernameEmail = "SELECT * FROM users WHERE username = $1 OR email = $2";
const checkUsername = "SELECT * FROM users WHERE username = $1";
const checkVerificationToken = "SELECT * FROM users WHERE verification_token = $1";

const verifyUser = "UPDATE users SET verified = $1, verification_token = $2 WHERE id = $3";
const deleteUser = "DELETE FROM users WHERE id= $1";

const createSession = "INSERT INTO user_sessions (user_id, session_id) VALUES ($1, $2)";
const deleteSession = "DELETE FROM user_sessions WHERE session_id = $1 RETURNING *"


module.exports = {
    register,
    checkUsernameEmail,
    checkUsername,
    checkVerificationToken,
    verifyUser,
    deleteUser,
    createSession,
    deleteSession
}