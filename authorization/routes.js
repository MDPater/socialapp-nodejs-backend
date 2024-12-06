const router = require("express").Router();

const AuthorizationController = require("./controllers/AuthorizationController");

router.get("/",  (req, res) => {
    res.send("200")
}
);

router.post(
    "/signup",
    
);

router.post(
    "/login",
    
);

module.exports = router;