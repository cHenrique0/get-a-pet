require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
// const mongoose = require("./src/database/connection");
const UserRoutes = require("./src/routes/UserRoutes");

const app = express();
const port = process.env.APP_PORT;

// JSON response
app.use(express.json());

// CORS
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000" /* IP da aplicação frontend */,
  })
);

// Public folder
app.use(express.static(__dirname + "/public"));

// Routes
app.use("/users", UserRoutes);

// Starting App
app.listen(port, () => {
  console.log(`* API is running at port: ${port}`);
  console.log(`* http://localhost:${port}`);
});
