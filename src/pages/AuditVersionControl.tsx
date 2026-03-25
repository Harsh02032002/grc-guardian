import { auditLog } from "@/data/mockData";

export default function AuditVersionControl() {
  return (
    <div className="page-container">
      <div><h1 className="page-title">Audit & Version Control</h1><p className="page-subtitle">Document history and change tracking</p></div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Version</th><th>Date</th><th>Details of Changes</th><th>Process Owner</th><th>Approved By</th><th>Reviewer</th><th>Signature</th></tr></thead>
          <tbody>
            {auditLog.map((a, i) => (
              <tr key={i}>
                <td><span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{a.version}</span></td>
                <td>{a.date}</td>
                <td className="font-medium">{a.details}</td>
                <td>{a.owner}</td>
                <td>{a.approvedBy}</td>
                <td>{a.reviewer}</td>
                <td><span className="text-xs text-muted-foreground italic">Digital</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
