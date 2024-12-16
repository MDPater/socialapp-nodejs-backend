require('dotenv').config()
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require('../../db');
const queries = require('./queries');
const { error } = require('console');

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
        const {username, email, password} = req.body;
        let encryptedPassword = encryptPassword(password);

        try{
            //check if username and email exist
            const userExists = await pool.query(queries.checkUsernameEmail, [username, email]);

            if(userExists.rows.length > 0){
                return res.status(400).json({error: "Username/email already exists"})
            }
            //register user in db and create accessToken
            const newUser = await pool.query(queries.register, [username, email, encryptedPassword]);
            const userId = newUser.rows[0].id;
            const accessToken = generateAccessToken(username, userId);

            res.status(201).json({status: true, user: newUser.rows[0], token: accessToken})

        }catch(e){
            console.log(e.message);
            res.status(500).json({
                error: "Internal Server Error"
            })
        }
    },

    //login User
    login: async (req, res) => {
        const {username, password} = req.body;

        try{
            //check if username exists
            const checkUser = await pool.query(queries.checkUser, [username])
            if(checkUser.rows.length === 0){
                return res.status(400).json({
                    error: "User does not exist"
                })
            }

            //compare hashed passwords
            let encryptedPassword = encryptPassword(password);
            if(checkUser.rows[0].password !== encryptedPassword){
                return res.status(400).json({
                    error: "Password not Valid"
                })
            }

            //generate token
            const userId = checkUser.rows[0].id;
            const accessToken = generateAccessToken(username, userId);

            res.status(201).json({status: true, user: checkUser.rows[0], token: accessToken})

        }catch(e){
            console.log(e.message);
            res.status(500).json({
                error: "Internal Server Error"
            })
        }

        
    }
}
  