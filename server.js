const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser');
const connectDB = require("./config/db");
const gymRoutes = require("./routes/gymRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();


//
connectDB(); // Make sure you're connecting to MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use Routes
app.use("/gym", gymRoutes);
app.use("/users", userRoutes);

// Default Route
app.get("/", (req, res) => {
    res.send("Welcome to the Recipe API");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
