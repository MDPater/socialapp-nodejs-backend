const router = require("express").Router();

const UserController = require("./controllers/UserController");

router.get("/:id", UserController.getUser);

router.put("/:id", UserController.updateUser);

module.exports = router;