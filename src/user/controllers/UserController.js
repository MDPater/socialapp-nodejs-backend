require('dotenv').config();
const pool = require('../../../db');
const queries = require('./queries')

module.exports = {
    //get user data
    getUser: async (req, res) => {
        const {id} = req.params;

        try {

            const result = await pool.query(queries.getUserData, [id]);

            if(result.rows.length === 0){
                return res.status(404).json({
                    status: false,
                    error: "ID not Found"
                })
            }

            return res.status(200).json({
                status: true,
                msg: "Auth succesful",
                data: result.rows[0]
            })
        } catch (error) {
            console.log(error)
        }
    }
}