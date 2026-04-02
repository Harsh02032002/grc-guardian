const express = require("express");
const router = express.Router();
const Control = require("../models/Control");

router.get("/", async (req, res) => {
  try {
    const controls = await Control.find().sort({ createdAt: -1 });
    res.json(controls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const control = await Control.findById(req.params.id);
    if (!control) return res.status(404).json({ error: "Control not found" });
    res.json(control);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const control = new Control(req.body);
    await control.save();
    res.status(201).json(control);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const control = await Control.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!control) return res.status(404).json({ error: "Control not found" });
    res.json(control);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const control = await Control.findByIdAndDelete(req.params.id);
    if (!control) return res.status(404).json({ error: "Control not found" });
    res.json({ message: "Control deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
