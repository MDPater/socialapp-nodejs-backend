const jwt = require("jsonwebtoken");
const pool = require("../../../db");
const queries = require("../queries/queries");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

module.exports = {
  verify: async (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(403).json({
        status: false,
        error: "no token found",
      });
    }

    const bearerToken = token.split(" ")[1];

    try {
      //check DB for session
      const userSession = await pool.query(queries.checkSession, [bearerToken]);
      if (userSession.rows.length === 0) {
        return res.status(401).json({
          status: false,
          error: "no session found",
        });
      }

      const user = jwt.verify(bearerToken, accessTokenSecret);

      console.log(
        "user: " + user.id + ":" + user.username + " authenticated call"
      );

      req.user = user;
      req.user.token = bearerToken;

      await pool.query(queries.updateTokenActive, [bearerToken]);
      return next();
    } catch (error) {
      console.log(error);
    }
  },
};
