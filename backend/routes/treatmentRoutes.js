const express = require("express");
const router = express.Router();
const Treatment = require("../models/Treatment");

router.get("/", async (req, res) => {
  try {
    const treatments = await Treatment.find().sort({ createdAt: -1 });
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) return res.status(404).json({ error: "Treatment not found" });
    res.json(treatment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const treatment = new Treatment(req.body);
    await treatment.save();
    res.status(201).json(treatment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!treatment) return res.status(404).json({ error: "Treatment not found" });
    res.json(treatment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
    if (!treatment) return res.status(404).json({ error: "Treatment not found" });
    res.json({ message: "Treatment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
