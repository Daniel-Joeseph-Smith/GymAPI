const mongoose = require("mongoose");
 
const GymSchema = new mongoose.Schema({
    exercise: { type: String, required: true },
    instructions: { type: String, required: true },
    equipmentOperational: { type: Boolean},
    createDate: { type: Date, default: Date.now }
});
 
module.exports = mongoose.model("Gym", GymSchema);