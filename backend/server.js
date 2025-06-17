require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const { connect } = require("mongoose");

//initialize the app
connectDB(); // connect to the database
const app = express();

// middleware
app.use(cors());
// app.use(express.json());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/user", userRoute);

// listen for requests
app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
