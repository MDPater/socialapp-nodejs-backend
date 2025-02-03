const getUserData = "SELECT id, username, profile_picture, bio FROM users WHERE id = $1";

module.exports = {
    getUserData
}