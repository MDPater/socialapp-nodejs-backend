require('dotenv').config()
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require('../../../db');
const queries = require('./queries');
const { error } = require('console');

const jwtSecret = process.env.JWTSECRET;
const jwtExpirationInSeconds = process.env.JWT_EXPIRATION_IN_SECONDS;

//Create and send Verification email
const sendVerificationEmail = async (email, token) => {
    //set Email Transport variables
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        from: process.env.EMAIL_USER,
    });

    const verificationLink = `${process.env.API_URL}/auth/verify-email?token=${token}`;

    const mailOptions = {
        to: email,
        subject: 'Snap Share Verification',
        text: `Please verify your email by clicking on the link: ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions);
}


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

        try{
            //check if username and email exist
            const userExists = await pool.query(queries.checkUsernameEmail, [username, email]);

            if(userExists.rows.length > 0){
                return res.status(400).json({error: "Username / email already exists"})
            }

            //register user in db and create verificationToken
            let encryptedPassword = encryptPassword(password);
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const newUser = await pool.query(queries.register, [username, email, encryptedPassword, verificationToken]);

            //send verification email
            await sendVerificationEmail(email, verificationToken);

            res.status(201).json({status: true, user: newUser.rows[0], msg: "Verify Email Adress"})

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
            const userExists = await pool.query(queries.userExistsname, [username])
            if(userExists.rows.length === 0){
                return res.status(400).json({
                    error: "User does not exist"
                })
            }

            //compare hashed passwords
            let encryptedPassword = encryptPassword(password);
            if(userExists.rows[0].password !== encryptedPassword){
                return res.status(400).json({
                    error: "Password not Valid"
                })
            }

            //generate token
            const userId = userExists.rows[0].id;
            const accessToken = generateAccessToken(username, userId);

            res.status(201).json({status: true, user: userExists.rows[0], token: accessToken})

        }catch(e){
            console.log(e.message);
            res.status(500).json({
                error: "Internal Server Error"
            })
        }

        
    },

    //verify user
    verifyEmail: async (req,res) =>{
        const {token} = req.query;

        if(!token){
            return res.status(400).json({
                error: "Invalid or Missing token"
            })
        }

        try{
            //find user with verification token
            const user = await pool.query(queries.checkVerificationToken, [token]);
            if(user.rows.length === 0) {
                return res.status(400).json({
                    status: false,
                    error: "Invalid or Expired token"
                })
            }

            //update user to verified
            await pool.query(queries.verifyUser, [true, null, user.rows[0].id]);

            return res.status(200).json({
                msg: "Email verified succesfully."
            })

        } catch(e) {
            console.log(e.message);
            res.status(500).json({
                error: "Internal Server Error"
            })
        }
    }
}
  