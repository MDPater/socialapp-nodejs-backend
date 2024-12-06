require('dotenv').config()
const express = require("express");
const app = express();
const { Sequelize } = require("sequelize");
const port = process.env.PORT;


// Express Routes Import
const AuthorizationRoutes = require("./authorization/routes");

//db model
const UserModel = require("./common/models/User");

app.get('/status', (req, res) => {
    const status = {
        "status": "running",
        "version": "1.0.0",
    }
    res.send(status)
})

app.use(express.json());

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./storage/data.db", // Path to the file that will store the SQLite DB.
});

// Initialising the Model on sequelize
UserModel.initialise(sequelize);

sequelize
  .sync()
  .then(() => {
    console.log("Sequelize Initialised!!");

    // Attaching the Authentication and User Routes to the app.
    app.use("/auth", AuthorizationRoutes);

    app.listen(port, () => {
      console.log("Server Listening on PORT:", port);
    });
  })
  .catch((err) => {
    console.error("Sequelize Initialisation threw an error:", err);
  });