require("dotenv").config();
const jwt = require("jsonwebtoken");
const os = require("os");
const crypto = require("crypto");
const pool = require("../../../db");
const queries = require("./queries");
const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_PUBLIC_KEY,
  process.env.MAILJET_SECRET_KEY
);

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

//Create and send Verification email
const sendVerificationEmail = async (email, token) =>
  mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "support@snap-share.net",
          Name: "Snap Share",
        },
        To: [
          {
            Email: email,
          },
        ],
        TemplateID: 6681435,
        TemplateLanguage: true,
        Subject: "Email Verification",
        Variables: {
          token: token,
        },
      },
    ],
  });

//Access Token using username and userId for authentication
const generateAccessToken = (username, userId) => {
  return jwt.sign(
    {
      id: userId,
      username: username,
    },
    accessTokenSecret,
    {
      expiresIn: "90d",
    }
  );
};

const encryptPassword = (password) => {
  // hash the password using SHA256 Algorithm
  const hash = crypto.createHash("sha256");
  // Update the hash object with the string to be encrypted
  hash.update(password);
  // Get the encrypted value in hexadecimal format
  return hash.digest("hex");
};

module.exports = {
  //register User
  register: async (req, res) => {
    const { username, email, password } = req.body;

    try {
      //check if username and email exist
      const userExists = await pool.query(queries.checkUsernameEmail, [
        username,
        email,
      ]);

      if (userExists.rows.length > 0) {
        return res
          .status(400)
          .json({ error: "Username / email already exists" });
      }

      //register user in db and create verificationToken
      let encryptedPassword = encryptPassword(password);
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const newUser = await pool.query(queries.register, [
        username,
        email,
        encryptedPassword,
        verificationToken,
      ]);

      //send verification email
      await sendVerificationEmail(email, verificationToken)
        .then((result) => {
          console.log(result.body);
        })
        .catch((err) => {
          console.log(err.statusCode);
        });

      res.status(201).json({
        status: true,
        msg: "Verify Email Adress",
        data: newUser.rows[0].email,
      });
    } catch (e) {
      console.log(e.message);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },

  //login User
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      //check if username exists
      const userExists = await pool.query(queries.checkUsername, [username]);
      if (userExists.rows.length === 0) {
        return res.status(400).json({
          error: "User does not exist",
        });
      }

      const user = userExists.rows[0];

      //check if user is verified
      if (!user.verified) {
        return res.status(400).json({
          error: "User not Verified",
        });
      }

      //compare hashed passwords
      let encryptedPassword = encryptPassword(password);
      if (user.password_hash !== encryptedPassword) {
        return res.status(400).json({
          error: "Password not Valid",
        });
      }

      //generate token with device info and create session
      const accessToken = generateAccessToken(username, user.id);
      const deviceInfo = req.header("user-agent");

      await pool.query(queries.createSession, [
        deviceInfo,
        user.id,
        accessToken,
      ]);

      res.status(201).json({
        status: true,
        msg: "Login Succesful",
        accessToken: accessToken,
      });
    } catch (e) {
      console.log(e.message);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },

  //logout user and delete session
  logout: async (req, res) => {
    console.log("logout: " + req.user.id);
    console.log("token: " + req.user.token);

    try {
      //delete token from user session table
      const deletedSession = await pool.query(queries.deleteSession, [
        req.user.token,
      ]);

      if (deletedSession.rows.length === 0) {
        return res.status(400).json({
          status: false,
          error: "no session with that token",
        });
      }

      return res.status(200).json({
        status: true,
        msg: "logout succesful",
      });
    } catch (error) {
      console.log(error);
    }
  },

  //verify user
  verifyEmail: async (req, res) => {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        error: "Invalid or Missing token",
      });
    }

    try {
      //find user with verification token
      const user = await pool.query(queries.checkVerificationToken, [token]);
      if (user.rows.length === 0) {
        return res.status(400).json({
          status: false,
          error: "Invalid or Expired token",
        });
      }

      //update user to verified
      await pool.query(queries.verifyUser, [true, null, user.rows[0].id]);

      return res.status(200).json({
        msg: "Email verified succesfully.",
      });
    } catch (e) {
      console.log(e.message);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },

  //delete user entry if email is false
  notme: async (req, res) => {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        error: "Invalid or Missing token",
      });
    }

    try {
      //find user with verification token
      const user = await pool.query(queries.checkVerificationToken, [token]);
      if (user.rows.length === 0) {
        return res.status(400).json({
          status: false,
          error: "Invalid or Expired token",
        });
      }

      //delete user from DB
      await pool.query(queries.deleteUser, [user.rows[0].id]);

      return res.status(200).json({
        msg: "All data connected to this email has been deleted",
      });
    } catch (e) {
      console.log(e.message);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },
};
