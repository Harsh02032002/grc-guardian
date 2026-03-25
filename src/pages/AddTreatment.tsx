import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { risks } from "@/data/mockData";

export default function AddTreatment() {
  return (
    <div className="page-container max-w-4xl">
      <div><h1 className="page-title">Add Treatment Plan</h1><p className="page-subtitle">Create a new risk treatment plan</p></div>
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Risk *</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select risk" /></SelectTrigger>
              <SelectContent>{risks.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Treatment Option</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Mitigate", "Transfer", "Accept", "Avoid"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="col-span-full space-y-1.5"><Label>Treatment Plan *</Label><Textarea placeholder="Describe the treatment plan..." rows={3} /></div>
          <div className="space-y-1.5"><Label>Target Date</Label><Input type="date" /></div>
          <div className="space-y-1.5"><Label>Status</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Planned", "In Progress", "Completed", "Accepted"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t">
          <button className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">Save Treatment</button>
          <button className="px-6 py-2.5 rounded-md border text-sm font-medium hover:bg-muted transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}
