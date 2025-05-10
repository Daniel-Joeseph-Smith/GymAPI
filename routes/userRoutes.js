const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// Register Route with correct input validation. An error msg will be sent if it fails
router.post(
    "/register",
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ error: "User already exists" });

            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ username, email, password: hashedPassword });
            await user.save();

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            res.status(201).json({ message: "Registered successfully", token });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Server error" });
        }
    }
);

module.exports = router;


//Login Route an error msg will be sent if it fails
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid email / password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid email / password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ message: "Sign in successful", token });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Update Route with correct input validation. An error msg will be sent if it fails
router.put("/:id",
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("oldPassword").notEmpty().withMessage("Old password required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const { username, email, oldPassword, password } = req.body;
    try {
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid email / password" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid email / password" });

        const hashedPassword = await bcrypt.hash(password, 10);
         const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                username, email, password: hashedPassword
            },
            { new: true }
        );
         if (!updatedUser) return res.status(404).json({ error: "User not found" });
         res.json({ message: "User updated", data: updatedUser });
 
     } catch (error) {
         res.status(500).json({ error: error.message });
     }
   });
 

module.exports = router;
