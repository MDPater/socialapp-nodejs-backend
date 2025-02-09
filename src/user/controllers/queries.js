const getUserData =
  "SELECT id, username, profile_picture, bio FROM users WHERE id = $1";
const getUserFollowers = "SELECT * FROM followers WHERE following_id = $1";
const getUserFollowing = "SELECT * FROM followers WHERE follower_id = $1";
const getUserSessions =
  "SELECT ip, device_info, active_at, user_id FROM user_sessions WHERE user_id = $1";

module.exports = {
  getUserData,
  getUserFollowers,
  getUserFollowing,
  getUserSessions,
};
