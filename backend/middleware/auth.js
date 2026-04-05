const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "grc-super-secret-key-2024";

// Auth middleware - verify JWT
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate("companyId");
    if (!user) return res.status(401).json({ error: "User not found" });
    if (!user.isApproved && user.role !== "superadmin")
      return res.status(403).json({ error: "Account not approved yet" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// RBAC middleware - check role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

// Module check middleware - check if user has access to module
const checkModule = (moduleName) => {
  return (req, res, next) => {
    if (req.user.role === "superadmin") return next();
    if (
      req.user.assignedModules.includes(moduleName) ||
      req.user.assignedModules.includes("all")
    ) {
      return next();
    }
    return res.status(403).json({ error: `No access to ${moduleName} module` });
  };
};

// Company scope middleware - filter data by companyId for clients
const companyScope = (req, res, next) => {
  if (req.user.role === "superadmin") {
    // Superadmin sees all, optionally filter by query param
    if (req.query.companyId) {
      req.companyFilter = { companyId: req.query.companyId };
    } else {
      req.companyFilter = {};
    }
  } else {
    // Sub-admin and client only see their company data
    req.companyFilter = { companyId: req.user.companyId?._id || req.user.companyId };
  }
  next();
};

module.exports = { authenticate, authorize, checkModule, companyScope, JWT_SECRET };
