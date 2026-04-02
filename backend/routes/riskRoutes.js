const express = require("express");
const router = express.Router();
const Risk = require("../models/Risk");

// GET all risks
router.get("/", async (req, res) => {
  try {
    const risks = await Risk.find().sort({ createdAt: -1 });
    res.json(risks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single risk
router.get("/:id", async (req, res) => {
  try {
    const risk = await Risk.findById(req.params.id);
    if (!risk) return res.status(404).json({ error: "Risk not found" });
    res.json(risk);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create risk
router.post("/", async (req, res) => {
  try {
    const risk = new Risk(req.body);
    await risk.save();
    res.status(201).json(risk);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update risk
router.put("/:id", async (req, res) => {
  try {
    const risk = await Risk.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!risk) return res.status(404).json({ error: "Risk not found" });
    res.json(risk);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE risk
router.delete("/:id", async (req, res) => {
  try {
    const risk = await Risk.findByIdAndDelete(req.params.id);
    if (!risk) return res.status(404).json({ error: "Risk not found" });
    res.json({ message: "Risk deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
