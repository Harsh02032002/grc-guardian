// Master data for Configuration module
export const masterAssetCategories = [
  { id: 1, name: "Hardware", description: "Physical IT equipment and devices" },
  { id: 2, name: "Software", description: "Applications, systems, and licenses" },
  { id: 3, name: "Information", description: "Data, databases, and documents" },
  { id: 4, name: "People", description: "Personnel and human resources" },
  { id: 5, name: "Services", description: "IT and business services" },
  { id: 6, name: "Infrastructure", description: "Network and facility infrastructure" },
];

export const masterAssetClassifications = [
  { id: 1, name: "Public", description: "Information intended for public access", level: 1 },
  { id: 2, name: "Internal", description: "For internal use only", level: 2 },
  { id: 3, name: "Confidential", description: "Restricted to authorized personnel", level: 3 },
  { id: 4, name: "Highly Confidential", description: "Strictly limited access", level: 4 },
];

export const masterRetentionPeriods = [
  { id: 1, name: "1 Year", duration: "1 year", description: "Short-term records" },
  { id: 2, name: "3 Years", duration: "3 years", description: "Medium-term operational records" },
  { id: 3, name: "5 Years", duration: "5 years", description: "Standard business records" },
  { id: 4, name: "7 Years", duration: "7 years", description: "Financial and compliance records" },
  { id: 5, name: "10 Years", duration: "10 years", description: "Legal and regulatory records" },
  { id: 6, name: "Permanent", duration: "Permanent", description: "Records kept indefinitely" },
];

export const masterDepartments = [
  { id: 1, name: "IT Department", code: "IT" },
  { id: 2, name: "Human Resources", code: "HR" },
  { id: 3, name: "Finance", code: "FIN" },
  { id: 4, name: "Operations", code: "OPS" },
  { id: 5, name: "Legal & Compliance", code: "LEG" },
  { id: 6, name: "Marketing", code: "MKT" },
  { id: 7, name: "Sales", code: "SAL" },
  { id: 8, name: "Administration", code: "ADM" },
];

export const masterAssetIdFormats = [
  { id: 1, prefix: "A", format: "A-XXX", example: "A-001", description: "Simple numeric format" },
  { id: 2, prefix: "AST", format: "AST-XXXX", example: "AST-0001", description: "Standard asset format" },
  { id: 3, prefix: "DEPT-CAT", format: "IT-HW-XXX", example: "IT-HW-001", description: "Department + Category prefix" },
];

export const masterAssetTypes = [
  { id: 1, name: "Tangible Asset", description: "Physical assets that can be touched" },
  { id: 2, name: "Scenario", description: "Process or scenario-based assets" },
  { id: 3, name: "Process", description: "Business process assets" },
  { id: 4, name: "Digital Asset", description: "Electronic and digital assets" },
  { id: 5, name: "Intangible Asset", description: "Non-physical assets like IP, brand" },
];

export const masterLocations = [
  { id: 1, name: "Data Center A", address: "Building 1, Floor 3" },
  { id: 2, name: "Data Center B", address: "Building 2, Floor 1" },
  { id: 3, name: "Head Office", address: "Corporate HQ" },
  { id: 4, name: "Branch Office - North", address: "North Region" },
  { id: 5, name: "Branch Office - South", address: "South Region" },
  { id: 6, name: "Cloud (AWS)", address: "AWS ap-south-1" },
  { id: 7, name: "Cloud (Azure)", address: "Azure Central India" },
];

export const masterRiskOwners = [
  { id: 1, name: "John Smith", email: "john.smith@company.com", phone: "+91-9876543210" },
  { id: 2, name: "Jane Doe", email: "jane.doe@company.com", phone: "+91-9876543211" },
  { id: 3, name: "Mike Wilson", email: "mike.wilson@company.com", phone: "+91-9876543212" },
  { id: 4, name: "Sara Lee", email: "sara.lee@company.com", phone: "+91-9876543213" },
  { id: 5, name: "Tom Brown", email: "tom.brown@company.com", phone: "+91-9876543214" },
  { id: 6, name: "Alex Kim", email: "alex.kim@company.com", phone: "+91-9876543215" },
  { id: 7, name: "Kumud", email: "kumud@company.com", phone: "+91-9876543216" },
];

export const masterRiskIdFormat = { prefix: "R", format: "R-XXX", example: "R-001" };
