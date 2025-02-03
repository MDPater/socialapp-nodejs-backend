const jwt = require("jsonwebtoken");
const pool = require("../../../db");
const queries = require("../queries/queries");
const accessToken = process.env.ACCESS_TOKEN_SECRET;

module.exports = {
    verify: async (req, res, next) => {
        const token = req.headers['authorization'];
        const bearerToken = token.split(' ')[1];

        if(!token){
            return res.status(401).json({
                status: false,
                error: "no token found"
            })
        }

        try {
            //check DB for session
            const userSession = await pool.query(queries.checkSession, [bearerToken]);
            if(userSession.rows.length === 0){
                return res.status(400).json({
                    status: false,
                    error: "no session found"
                })
            }

            jwt.verify(bearerToken, accessToken, (err, user) => {
                if (err) return res.sendStatus(403);  // Invalid token
        
                req.user = user;
                req.user.token = bearerToken;
                return next();
            })
        } catch (error) {
            console.log(error);
        }
    }
}