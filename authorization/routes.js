const router = require("express").Router();

const AuthorizationController = require("./controllers/AuthorizationController");

router.post(
    "/signup",
    AuthorizationController.register
);

router.post(
    "/login",
    AuthorizationController.login
);

module.exports = router;