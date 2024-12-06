require('dotenv').config()
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const jwtSecret = process.env.JWTSECRET;
const jwtExpirationInSeconds = process.env.JWT_EXPIRATION_IN_SECONDS;

const UserModel = require("../../common/models/User");
const { register } = require('module');

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
    // We will hash the password using SHA256 Algorithm before storing in the DB
    // Creating SHA-256 hash object
    const hash = crypto.createHash("sha256");
    // Update the hash object with the string to be encrypted
    hash.update(password);
    // Get the encrypted value in hexadecimal format
    return hash.digest("hex");
};

module.exports = {
    register: (req, res) => {
        const payload = req.body;
        let encryptedPassword = encryptPassword(payload.password);

        UserModel.createUser(
            Object.assign(payload, {password: encryptedPassword})
        ).then((user) => {
            //generate accesstoken
            const accessToken = generateAccessToken(payload.username, user.id);

            return res.status(200).json({
                status: true,
                data: {
                    user: user.toJSON(),
                    token: accessToken,
                }
            });
        })
        .catch((err) => {
            return res.status(500).json({
                status: false,
                error: err,
            })
        })
    }
}
  