require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { connect } = require("mongoose");

//initialize the app
connectDB(); // connect to the database
const app = express();

// middleware
app.use(cors());
const orderRoutes = require("./routes/orderRoute");
app.use("/api/orders", orderRoutes);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// listen for requests
app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
