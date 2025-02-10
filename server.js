require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

// Express Routes Import
const AuthorizationRoutes = require("./src/authorization/routes");
const UserRoutes = require("./src/user/routes");
const RoomRoutes = require("./src/room/routes");
const validateAuthentication = require("./src/common/middleware/validateAuthentication");

app.get("/status", (req, res) => {
  const status = {
    status: "running",
    version: "0.1.0",
    owner: "MDPater",
  };
  res.send(status);
});

app.use(express.json());

app.use("/auth", AuthorizationRoutes);
app.use("/user", validateAuthentication.verify, UserRoutes);
app.use("/room", validateAuthentication.verify, RoomRoutes);

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});
