require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT;


// Express Routes Import
const AuthorizationRoutes = require("./src/authorization/routes");

app.get('/status', (req, res) => {
    const status = {
        "status": "running",
        "version": "1.0.0",
        "owner": "MDPater"
    }
    res.send(status)
})

app.use(express.json());
app.use("/auth", AuthorizationRoutes);

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});