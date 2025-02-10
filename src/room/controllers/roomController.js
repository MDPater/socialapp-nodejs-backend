const pool = require("../../../db");
const queries = require("./queries");

module.exports = {
  newRoom: async (req, res) => {
    const { name, description, thumbnail } = req.body;
    const { id } = req.user.id;

    if (!name) {
      return res.status(400).json({
        status: false,
        error: "No Name entered",
      });
    }

    try {
      const room = await pool.query(queries.newRoom, [
        name,
        description,
        thumbnail,
        id,
      ]);

      return res.status(200).json({
        status: true,
        msg: "new Room created",
        data: room.rows[0],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
