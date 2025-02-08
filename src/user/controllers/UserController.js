require("dotenv").config();
const pool = require("../../../db");
const queries = require("./queries");

module.exports = {
  //get a users currrent profile
  currentProfile: async (req, res) => {
    try {
      const user = await pool.query(queries.getUserData, [req.user.id]);
      const followers = await pool.query(queries.getUserFollowers, [
        req.user.id,
      ]);
      const following = await pool.query(queries.getUserFollowing, [
        req.user.id,
      ]);

      const userData = user.rows[0];
      const userFollowers = followers.rows.length;
      const userFollowing = following.rows.length;

      //return json object with user data
      return res.status(200).json({
        status: true,
        msg: "Auth succesful",
        data: {
          user: userData,
          followers: userFollowers,
          following: userFollowing,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        error: "Internal Server Error",
      });
    }
  },

  //get a users data
  getUser: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await pool.query(queries.getUserData, [id]);
      const followers = await pool.query(queries.getUserFollowers, [id]);
      const following = await pool.query(queries.getUserFollowing, [id]);

      if (user.rows.length === 0) {
        return res.status(404).json({
          status: false,
          error: "ID not Found",
        });
      }

      //set user Follower & Following number
      const userFollowers = followers.rows.length;
      const userFollowing = following.rows.length;

      return res.status(200).json({
        status: true,
        msg: "Auth succesful",
        data: `{
                ${user.rows[0]}
                followers: ${userFollowers},
                following: ${userFollowing}
                }`,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //get all sessions of a user
  getUserSessions: async (req, res) => {
    const { id } = req.params;

    if (req.user.id == id) {
      const sessions = await pool.query(queries.getUserSessions, [req.user.id]);

      return res.status(200).json({
        status: true,
        msg: "Authenticated for this Account",
        data: sessions.rows,
      });
    }

    return res.status(403).json({
      status: false,
      error: "Not Authenticated for this Account",
    });
  },

  //update user
  updateUser: async (req, res) => {
    const { id } = req.params;

    if (req.user.id == id) {
      return res.status(201).json({
        status: true,
        msg: "Authenticated for this Account",
      });
    }

    return res.status(403).json({
      status: false,
      error: "Not Authenticated for this Account",
    });
  },

  //delete user
  deleteUser: async (req, res) => {},
};
