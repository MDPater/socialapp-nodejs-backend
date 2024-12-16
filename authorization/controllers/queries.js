const register  = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";
const checkUsernameEmail = "SELECT * FROM users WHERE username = $1 OR email = $2";

module.exports = {
    register,
    checkUsernameEmail,
}