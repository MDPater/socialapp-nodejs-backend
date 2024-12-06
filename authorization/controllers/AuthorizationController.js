require('dotenv').config()
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const jwtSecret = process.env.JWTSECRET;
const jwtExpirationInSeconds = process.env.JWT_EXPIRATION_IN_SECONDS;

const UserModel = require("../../common/models/User");

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

    //register User
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
    },

    //login User
    login: (req, res) => {
        const {username, password} = req.body;

        UserModel.findUser({ username })
        .then((user) => {
            //Return error if username not found
            if(!user){
                return res.status(400).json({
                    status: false,
                    error: {
                        message: 'Username not found!'
                    }
                });
            }

            const encryptedPassword = encryptPassword(password);

            //Return error if password is false
            if(user.password !== encryptedPassword) {
                return res.status(400).json({
                    status: false,
                    error: {
                        message: 'Password did not match!'
                    }
                });
            }

            //create accessToken
            const accessToken = generateAccessToken(user.username, user.id);

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
  