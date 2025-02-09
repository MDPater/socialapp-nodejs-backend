const router = require("express").Router();

const UserController = require("./controllers/UserController");

router.get("/current-profile", UserController.currentProfile);

router.get("/sessions", UserController.getUserSessions);

router.get("/:id", UserController.getUser);

router.put("/:id", UserController.updateUser);

module.exports = router;
