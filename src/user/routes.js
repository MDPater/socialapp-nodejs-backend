const router = require("express").Router();

const validateAuthentication = require("../common/middleware/validateAuthentication");

router.get("/users", validateAuthentication.verify,)