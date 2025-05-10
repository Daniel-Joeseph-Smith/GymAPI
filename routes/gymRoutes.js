const express = require("express");
const Gym = require("../models/Gym");

const router = express.Router();


router.post("/add", async (req, res)  =>{
    try{
        const newEquipment = new Gym(req.body);
        await newEquipment.save();
        res.status(201).json({message: "Equipment added successfully", data: newEquipment});
    } catch(error){
        res.status(500).json({error: error.message});
    }
});

//get every equipment in the database
router.get("/", async (req, res) =>{
    try{
        const Equipmemts = await Gym.find();
        res.status(200).json(Equipmemts);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const equipmemt = await Gym.findById(req.params.id);
        if (!equipmemt) return res.status(404).json({ error: "Equipmemt not found" });
        res.json(equipmemt);
    } catch (error) {
        res.status(500).json({ error: "Invalid equipmemt ID" });
    }
  });

router.put("/:id", async (req, res) => {
   try {
        const updatedEquipmemt = await Gym.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEquipmemt) return res.status(404).json({ error: "Equipmemt not found" });
        res.json({ message: "Equipmemt updated", data: updatedEquipmemt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });


  router.delete("/:id", async (req, res) => {
      try {
          const deletedEquipment = await Gym.findByIdAndDelete(req.params.id);
          if (!deletedEquipment) return res.status(404).json({ error: "Equipment not found" });
          res.json({ message: "Equipment deleted" });
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  });
  

module.exports = router;
  

