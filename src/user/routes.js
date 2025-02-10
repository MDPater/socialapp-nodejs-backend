const router = require("express").Router();

const UserController = require("./controllers/UserController");

router.get("/me", UserController.currentProfile);

router.patch("/me", UserController.updateUser);

router.delete("/me", UserController.deleteUser);

router.get("/sessions", UserController.getUserSessions);

router.get("/:id", UserController.getUser);

module.exports = router;
