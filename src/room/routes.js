const router = require("express").Router();

const roomController = require("./controllers/roomController");

router.post("/new", roomController.newRoom);

module.exports = router;
