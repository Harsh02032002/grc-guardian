import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter, Download, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RiskTable } from "@/components/RiskTable";
import { toast } from "@/hooks/use-toast";

export default function Risks() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleAddRisk = () => {
    navigate("/add-risk");
  };

  const handleExportRisks = () => {
    toast({
      title: "Export Started",
      description: "Risk register export will begin shortly"
    });
  };

  const handleImportRisks = () => {
    toast({
      title: "Import Feature",
      description: "Risk import feature coming soon"
    });
  };

  return (
    <div className="page-container max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Risk Register</h1>
          <p className="page-subtitle">Manage and monitor all organizational risks</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleImportRisks}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportRisks}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddRisk}>
            <Plus className="w-4 h-4 mr-2" />
            Add Risk
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search risks by name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          {/* Advanced Filters (expandable) */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Date Range</label>
                  <select className="w-full mt-1 text-sm px-3 py-2 border rounded">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                    <option>All time</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Risk Owner</label>
                  <select className="w-full mt-1 text-sm px-3 py-2 border rounded">
                    <option>All owners</option>
                    <option>John Smith</option>
                    <option>Jane Doe</option>
                    <option>Alex Kim</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Department</label>
                  <select className="w-full mt-1 text-sm px-3 py-2 border rounded">
                    <option>All departments</option>
                    <option>IT</option>
                    <option>Finance</option>
                    <option>Operations</option>
                    <option>HR</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Risk Score Range</label>
                  <select className="w-full mt-1 text-sm px-3 py-2 border rounded">
                    <option>All scores</option>
                    <option>High (16-25)</option>
                    <option>Medium (9-15)</option>
                    <option>Low (1-8)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Table */}
      <RiskTable 
        searchQuery={searchQuery}
        onRiskSelect={(risk) => {
          navigate(`/risk/${risk._id}`);
        }}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Risks</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">T</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Risks</p>
                <p className="text-2xl font-bold text-red-600">0</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-medium">!</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Risks</p>
                <p className="text-2xl font-bold text-orange-600">0</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm font-medium">O</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mitigated</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-medium">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
