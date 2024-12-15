require('dotenv').config()
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const jwtSecret = process.env.JWTSECRET;
const jwtExpirationInSeconds = process.env.JWT_EXPIRATION_IN_SECONDS;

//Access Token using username and userId for authentication
const generateAccessToken = (username, userId) => {
    return jwt.sign(
        {
            userId,
            username
        }, 
        jwtSecret,
        {
            expiresIn: jwtExpirationInSeconds
        }
    );
};

const encryptPassword = (password) => {
    // We will hash the password using SHA256 Algorithm
    const hash = crypto.createHash("sha256");
    // Update the hash object with the string to be encrypted
    hash.update(password);
    // Get the encrypted value in hexadecimal format
    return hash.digest("hex");
};

module.exports = {
    //register user

    //login user
}
  