export const assetCategories = [
  "Hardware", "Software", "Information", "People", "Services", "Infrastructure",
];

export const riskCategories = [
  { name: "Operational", subcategories: ["Process Failure", "Human Error", "System Outage"] },
  { name: "Strategic", subcategories: ["Market Risk", "Competitive Risk", "Regulatory Change"] },
  { name: "Financial", subcategories: ["Credit Risk", "Liquidity Risk", "Currency Risk"] },
  { name: "Compliance", subcategories: ["Legal Non-compliance", "Policy Violation", "Audit Finding"] },
  { name: "Cybersecurity", subcategories: ["Data Breach", "Malware", "Unauthorized Access", "Phishing"] },
  { name: "Third Party", subcategories: ["Vendor Risk", "Supply Chain", "Outsourcing Risk"] },
];

export const assets = [
  { id: "A001", name: "ERP System", category: "Software", group: "Business Applications", criticality: "High", c: 4, i: 4, a: 3, value: 4, owner: "John Smith", status: "Active" },
  { id: "A002", name: "Customer Database", category: "Information", group: "Data Assets", criticality: "Critical", c: 4, i: 4, a: 4, value: 4, owner: "Jane Doe", status: "Active" },
  { id: "A003", name: "Mail Server", category: "Hardware", group: "IT Infrastructure", criticality: "High", c: 3, i: 3, a: 4, value: 4, owner: "Mike Wilson", status: "Active" },
  { id: "A004", name: "HR Portal", category: "Software", group: "Business Applications", criticality: "Medium", c: 3, i: 3, a: 2, value: 3, owner: "Sara Lee", status: "Active" },
  { id: "A005", name: "Backup Tapes", category: "Hardware", group: "Storage", criticality: "High", c: 4, i: 3, a: 3, value: 4, owner: "Tom Brown", status: "Inactive" },
  { id: "A006", name: "VPN Gateway", category: "Infrastructure", group: "Network", criticality: "Critical", c: 4, i: 4, a: 4, value: 4, owner: "Alex Kim", status: "Active" },
];

export const risks = [
  { id: "R001", name: "Data Breach via Phishing", category: "Cybersecurity", subcategory: "Phishing", asset: "Customer Database", threat: "Social Engineering", vulnerability: "Lack of Awareness Training", likelihood: 4, impact: 4, rir: 16, owner: "Jane Doe", status: "Open" },
  { id: "R002", name: "ERP System Downtime", category: "Operational", subcategory: "System Outage", asset: "ERP System", threat: "Hardware Failure", vulnerability: "Single Point of Failure", likelihood: 3, impact: 4, rir: 12, owner: "John Smith", status: "Mitigating" },
  { id: "R003", name: "Unauthorized Access", category: "Cybersecurity", subcategory: "Unauthorized Access", asset: "VPN Gateway", threat: "Credential Theft", vulnerability: "Weak Password Policy", likelihood: 3, impact: 3, rir: 9, owner: "Alex Kim", status: "Open" },
  { id: "R004", name: "Regulatory Non-compliance", category: "Compliance", subcategory: "Legal Non-compliance", asset: "HR Portal", threat: "Regulation Change", vulnerability: "Outdated Policies", likelihood: 2, impact: 4, rir: 8, owner: "Sara Lee", status: "Accepted" },
  { id: "R005", name: "Backup Failure", category: "Operational", subcategory: "Process Failure", asset: "Backup Tapes", threat: "Media Degradation", vulnerability: "No Backup Testing", likelihood: 3, impact: 3, rir: 9, owner: "Tom Brown", status: "Open" },
];

export const controls = [
  { id: "C001", name: "Multi-Factor Authentication", type: "Preventive", nature: "Automated", parameter: "Technical", effectiveness: "High", value: 4, ranking: "A" },
  { id: "C002", name: "Security Awareness Training", type: "Preventive", nature: "Manual", parameter: "Administrative", effectiveness: "Medium", value: 3, ranking: "B" },
  { id: "C003", name: "Intrusion Detection System", type: "Detective", nature: "Automated", parameter: "Technical", effectiveness: "High", value: 4, ranking: "A" },
  { id: "C004", name: "Incident Response Plan", type: "Corrective", nature: "Manual", parameter: "Administrative", effectiveness: "Medium", value: 3, ranking: "B" },
  { id: "C005", name: "Data Encryption", type: "Preventive", nature: "Automated", parameter: "Technical", effectiveness: "High", value: 4, ranking: "A" },
  { id: "C006", name: "Access Control Policy", type: "Preventive", nature: "Manual", parameter: "Administrative", effectiveness: "High", value: 4, ranking: "A" },
];

export const treatments = [
  { id: "T001", riskName: "Data Breach via Phishing", plan: "Implement advanced email filtering and conduct quarterly phishing simulations", option: "Mitigate", targetDate: "2026-06-30", status: "In Progress" },
  { id: "T002", riskName: "ERP System Downtime", plan: "Deploy redundant infrastructure with automated failover", option: "Mitigate", targetDate: "2026-05-15", status: "Planned" },
  { id: "T003", riskName: "Unauthorized Access", plan: "Enforce MFA across all access points and implement PAM solution", option: "Mitigate", targetDate: "2026-04-30", status: "In Progress" },
  { id: "T004", riskName: "Regulatory Non-compliance", plan: "Accept current risk level with quarterly review cycle", option: "Accept", targetDate: "2026-12-31", status: "Accepted" },
  { id: "T005", riskName: "Backup Failure", plan: "Transfer backup operations to managed cloud provider", option: "Transfer", targetDate: "2026-07-01", status: "Planned" },
];

export const auditLog = [
  { version: "1.0", date: "2026-01-15", details: "Initial GRC framework setup", owner: "John Smith", approvedBy: "CIO", reviewer: "Jane Doe" },
  { version: "1.1", date: "2026-02-10", details: "Added cybersecurity risk category", owner: "Alex Kim", approvedBy: "CISO", reviewer: "Mike Wilson" },
  { version: "1.2", date: "2026-03-01", details: "Updated CIA matrix scoring", owner: "Sara Lee", approvedBy: "CRO", reviewer: "Tom Brown" },
  { version: "1.3", date: "2026-03-20", details: "Added treatment plan templates", owner: "Jane Doe", approvedBy: "CIO", reviewer: "John Smith" },
];

export const ciaMatrix = [
  { level: 1, label: "Low", description: "Minimal impact", financial: "<$10K", operational: "No disruption" },
  { level: 2, label: "Medium", description: "Moderate impact", financial: "$10K-$100K", operational: "Minor disruption" },
  { level: 3, label: "High", description: "Significant impact", financial: "$100K-$1M", operational: "Major disruption" },
  { level: 4, label: "Critical", description: "Severe impact", financial: ">$1M", operational: "Complete shutdown" },
];

export const impactGuidelines = [
  { type: "Financial Impact", levels: ["<$10K", "$10K-$100K", "$100K-$1M", ">$1M"] },
  { type: "Operational Impact", levels: ["No disruption", "Minor disruption", "Major disruption", "Complete shutdown"] },
  { type: "Customer Impact", levels: ["No effect", "Minor inconvenience", "Service degradation", "Service unavailable"] },
  { type: "Legal Impact", levels: ["No issue", "Minor violation", "Regulatory action", "Litigation/Penalty"] },
  { type: "Brand Impact", levels: ["No effect", "Local mention", "National coverage", "Lasting damage"] },
  { type: "HR Impact", levels: ["No effect", "Minor morale", "Staff turnover", "Mass departure"] },
];
