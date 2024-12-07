const router = require("express").Router();

const validatePayload = require("../common/middleware/validatePayload");
const AuthorizationController = require("./controllers/AuthorizationController");

const loginPayload = require("./payload/loginPayload");
const signupPayload = require("./payload/signupPayload");

router.post(
    "/register",
    validatePayload.verify(signupPayload),
    AuthorizationController.register
);

router.post(
    "/login",
    validatePayload.verify(loginPayload),
    AuthorizationController.login
);

module.exports = router;