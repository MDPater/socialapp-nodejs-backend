const checkSession = "SELECT * FROM user_sessions WHERE session_id = $1"
const updateTokenActive = "UPDATE user_sessions SET active_at = CURRENT_TIMESTAMP WHERE session_id = $1;"

module.exports = {
    checkSession,
    updateTokenActive
}