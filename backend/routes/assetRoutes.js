const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Asset = require("../models/Asset");

// GET all assets
router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single asset
router.get("/:id", async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create asset
router.post("/", async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update asset
router.put("/:id", async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    res.json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE asset
router.delete("/:id", async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    res.json({ message: "Asset deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEED assets with sample data
router.post("/seed", async (req, res) => {
  try {
    // Clear existing assets
    await Asset.deleteMany({});
    
    // Reset counter for assetId generation
    await mongoose.connection.collection('assets').deleteMany({});
    await mongoose.connection.collection('counters').deleteMany({ _id: 'assetId' });
    
    const sampleAssets = [
      {
        assetId: "A001",
        name: "Customer Database Server",
        category: "Hardware",
        assetType: "Server",
        group: "IT Infrastructure",
        description: "Primary database server storing customer information and transaction data",
        department: "IT",
        location: "Data Center - Rack A1",
        businessCriticality: "Critical",
        c: 5,
        i: 5,
        a: 5,
        owner: "John Smith",
        custodian: "IT Operations Team",
        retentionPeriod: "7 years",
        entryBy: "admin",
        status: "Active"
      },
      {
        assetId: "A002",
        name: "Corporate Website",
        category: "Software",
        assetType: "Web Application",
        group: "Digital Assets",
        description: "Main corporate website and marketing portal",
        department: "Marketing",
        location: "Cloud - AWS",
        businessCriticality: "High",
        c: 4,
        i: 5,
        a: 3,
        owner: "Jane Doe",
        custodian: "Web Development Team",
        retentionPeriod: "3 years",
        entryBy: "admin",
        status: "Active"
      },
      {
        assetId: "A003",
        name: "Financial Accounting System",
        category: "Software",
        assetType: "Enterprise Application",
        group: "Business Systems",
        description: "ERP system for financial management and accounting",
        department: "Finance",
        location: "Data Center - Rack B2",
        businessCriticality: "Critical",
        c: 5,
        i: 5,
        a: 4,
        owner: "Michael Chen",
        custodian: "Finance Department",
        retentionPeriod: "10 years",
        entryBy: "admin",
        status: "Active"
      },
      {
        assetId: "A004",
        name: "Employee Laptops",
        category: "Hardware",
        assetType: "Mobile Device",
        group: "End User Devices",
        description: "Company-issued laptops for employee use",
        department: "IT",
        location: "Various",
        businessCriticality: "Medium",
        c: 3,
        i: 4,
        a: 3,
        owner: "HR Department",
        custodian: "Individual Employees",
        retentionPeriod: "4 years",
        entryBy: "admin",
        status: "Active"
      },
      {
        assetId: "A005",
        name: "Email Server",
        category: "Hardware",
        assetType: "Server",
        group: "IT Infrastructure",
        description: "Microsoft Exchange server for corporate email",
        department: "IT",
        location: "Data Center - Rack A3",
        businessCriticality: "High",
        c: 4,
        i: 4,
        a: 4,
        owner: "John Smith",
        custodian: "IT Operations Team",
        retentionPeriod: "5 years",
        entryBy: "admin",
        status: "Active"
      },
      {
        assetId: "A006",
        name: "CRM System",
        category: "Software",
        assetType: "Cloud Application",
        group: "Business Systems",
        description: "Salesforce CRM for customer relationship management",
        department: "Sales",
        location: "Cloud - Salesforce",
        businessCriticality: "High",
        c: 4,
        i: 5,
        a: 3,
        owner: "Sarah Johnson",
        custodian: "Sales Operations",
        retentionPeriod: "7 years",
        entryBy: "admin",
        status: "Active"
      },
      {
        assetId: "A007",
        name: "Backup Storage System",
        category: "Hardware",
        assetType: "Storage Array",
        group: "IT Infrastructure",
        description: "Network attached storage for data backups",
        department: "IT",
        location: "Data Center - Rack C1",
        businessCriticality: "High",
        c: 3,
        i: 5,
        a: 4,
        owner: "John Smith",
        custodian: "Backup Admin Team",
        retentionPeriod: "1 year",
        entryBy: "admin",
        status: "Active"
      },
      {
        assetId: "A008",
        name: "Mobile Banking App",
        category: "Software",
        assetType: "Mobile Application",
        group: "Digital Assets",
        description: "iOS and Android mobile banking application",
        department: "Digital Banking",
        location: "Cloud - Azure",
        businessCriticality: "Critical",
        c: 5,
        i: 5,
        a: 4,
        owner: "David Lee",
        custodian: "Mobile Development Team",
        retentionPeriod: "7 years",
        entryBy: "admin",
        status: "Active"
      },
      {
        assetId: "A009",
        name: "Network Switches",
        category: "Hardware",
        assetType: "Network Device",
        group: "IT Infrastructure",
        description: "Core network switches for internal connectivity",
        department: "IT",
        location: "Data Center - Network Room",
        businessCriticality: "Critical",
        c: 5,
        i: 4,
        a: 5,
        owner: "John Smith",
        custodian: "Network Team",
        retentionPeriod: "5 years",
        entryBy: "admin",
        status: "Active"
      },
      {
        assetId: "A010",
        name: "HR Management System",
        category: "Software",
        assetType: "Enterprise Application",
        group: "Business Systems",
        description: "Human resources management and payroll system",
        department: "HR",
        location: "Data Center - Rack B3",
        businessCriticality: "Medium",
        c: 3,
        i: 5,
        a: 3,
        owner: "Emily Wilson",
        custodian: "HR Department",
        retentionPeriod: "7 years",
        entryBy: "admin",
        status: "Active"
      },
      {
        assetId: "A011",
        name: "Video Conference System",
        category: "Hardware",
        assetType: "AV Equipment",
        group: "Office Equipment",
        description: "Conference room video conferencing equipment",
        department: "Facilities",
        location: "Conference Rooms",
        businessCriticality: "Low",
        c: 2,
        i: 2,
        a: 2,
        owner: "Facilities Manager",
        custodian: "AV Support Team",
        retentionPeriod: "3 years",
        entryBy: "admin",
        status: "Active"
      },
      {
        assetId: "A012",
        name: "Security Camera System",
        category: "Hardware",
        assetType: "Security Device",
        group: "Security Systems",
        description: "IP-based surveillance camera system",
        department: "Security",
        location: "Building Wide",
        businessCriticality: "Medium",
        c: 3,
        i: 3,
        a: 4,
        owner: "Security Manager",
        custodian: "Security Team",
        retentionPeriod: "90 days",
        entryBy: "admin",
        status: "Active"
      }
    ];

    const insertedAssets = await Asset.insertMany(sampleAssets);
    
    res.status(201).json({
      message: "Sample assets seeded successfully",
      count: insertedAssets.length,
      assets: insertedAssets
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
