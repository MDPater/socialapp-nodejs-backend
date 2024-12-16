const register  = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";
const checkUsernameEmail = "SELECT * FROM users WHERE username = $1 OR email = $2";
const checkUser = "SELECT * FROM users WHERE username = $1";

module.exports = {
    register,
    checkUsernameEmail,
    checkUser,
}