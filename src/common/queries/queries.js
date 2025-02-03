const checkSession = "SELECT * FROM user_sessions WHERE session_id = $1"

module.exports = {
    checkSession
}