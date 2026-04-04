const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Company = require("../models/Company");
const { authenticate, authorize } = require("../middleware/auth");

// All admin routes require authentication + superadmin or subadmin role
router.use(authenticate);

// ========== COMPANIES ==========

// GET all companies (superadmin only)
router.get("/companies", authorize("superadmin"), async (req, res) => {
  try {
    const companies = await Company.find().populate("createdBy", "name email").sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH approve/reject company
router.patch("/companies/:id/approve", authorize("superadmin"), async (req, res) => {
  try {
    const { isApproved } = req.body;
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );
    if (!company) return res.status(404).json({ error: "Company not found" });

    // Also approve/reject the associated user
    await User.updateMany(
      { companyId: company._id },
      { isApproved }
    );

    res.json({ message: `Company ${isApproved ? "approved" : "rejected"}`, company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE company
router.delete("/companies/:id", authorize("superadmin"), async (req, res) => {
  try {
    await User.deleteMany({ companyId: req.params.id });
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Company and associated users deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== USERS / SUB-ADMINS ==========

// GET all users (superadmin sees all, subadmin sees own company)
router.get("/users", authorize("superadmin", "subadmin"), async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "subadmin") {
      filter.companyId = req.user.companyId;
    }
    if (req.query.companyId) {
      filter.companyId = req.query.companyId;
    }
    const users = await User.find(filter).populate("companyId", "name").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create sub-admin (superadmin only)
router.post("/users/create-subadmin", authorize("superadmin"), async (req, res) => {
  try {
    const { name, email, password, companyId, assignedModules } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const user = new User({
      name,
      email,
      password,
      role: "subadmin",
      companyId,
      assignedModules: assignedModules || [],
      isApproved: true,
      isVerified: true,
      emailVerifiedAt: new Date(),
    });
    await user.save();

    res.status(201).json(user.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update user modules
router.put("/users/:id/modules", authorize("superadmin"), async (req, res) => {
  try {
    const { assignedModules } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { assignedModules },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update user role
router.put("/users/:id/role", authorize("superadmin"), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE user
router.delete("/users/:id", authorize("superadmin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== DASHBOARD STATS (Super Admin) ==========
router.get("/stats", authorize("superadmin", "subadmin"), async (req, res) => {
  try {
    const Asset = require("../models/Asset");
    const Risk = require("../models/Risk");
    const Control = require("../models/Control");
    const Treatment = require("../models/Treatment");

    let filter = {};
    if (req.user.role === "subadmin") {
      filter.companyId = req.user.companyId;
    }

    const [totalCompanies, totalUsers, totalAssets, totalRisks, totalControls, totalTreatments, pendingCompanies] =
      await Promise.all([
        Company.countDocuments(),
        User.countDocuments(filter),
        Asset.countDocuments(filter),
        Risk.countDocuments(filter),
        Control.countDocuments(filter),
        Treatment.countDocuments(filter),
        Company.countDocuments({ isApproved: false }),
      ]);

    res.json({
      totalCompanies,
      totalUsers,
      totalAssets,
      totalRisks,
      totalControls,
      totalTreatments,
      pendingCompanies,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
