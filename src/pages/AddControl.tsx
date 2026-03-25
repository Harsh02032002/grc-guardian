import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddControl() {
  return (
    <div className="page-container max-w-4xl">
      <div><h1 className="page-title">Add New Control</h1><p className="page-subtitle">Register a new organizational control</p></div>
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Control Name *</Label><Input placeholder="Enter control name" /></div>
          <div className="space-y-1.5"><Label>Control Type</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Preventive", "Detective", "Corrective"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Control Nature</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Manual", "Automated"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Implementation Parameter</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Technical", "Administrative", "Physical"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Effectiveness</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["None", "Low", "Medium", "High"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t">
          <button className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">Save Control</button>
          <button className="px-6 py-2.5 rounded-md border text-sm font-medium hover:bg-muted transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}
