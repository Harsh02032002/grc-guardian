import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, GripVertical, Plus, Download, Upload } from "lucide-react";
import { useAssets } from "@/hooks/useApi";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type SortField = 'assetId' | 'name' | 'category' | 'assetType' | 'group' | 'department' | 'location' | 'businessCriticality' | 'c' | 'i' | 'a' | 'assetScore' | 'assetRanking' | 'assetValue' | 'owner' | 'custodian' | 'retentionPeriod' | 'reviewDueDate' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface ColumnConfig {
  id: SortField;
  label: string;
  sortable: boolean;
  visible: boolean;
  width?: string;
}

const defaultColumns: ColumnConfig[] = [
  { id: 'assetId', label: 'Asset ID', sortable: true, visible: true, width: '80px' },
  { id: 'name', label: 'Asset Name', sortable: true, visible: true, width: '200px' },
  { id: 'category', label: 'Category', sortable: true, visible: true, width: '100px' },
  { id: 'assetType', label: 'Type', sortable: true, visible: true, width: '120px' },
  { id: 'group', label: 'Group', sortable: true, visible: true, width: '120px' },
  { id: 'department', label: 'Department', sortable: true, visible: true, width: '100px' },
  { id: 'location', label: 'Location', sortable: true, visible: true, width: '120px' },
  { id: 'businessCriticality', label: 'Criticality', sortable: true, visible: true, width: '100px' },
  { id: 'c', label: 'C', sortable: true, visible: true, width: '50px' },
  { id: 'i', label: 'I', sortable: true, visible: true, width: '50px' },
  { id: 'a', label: 'A', sortable: true, visible: true, width: '50px' },
  { id: 'assetScore', label: 'Score', sortable: true, visible: true, width: '60px' },
  { id: 'assetRanking', label: 'Ranking', sortable: true, visible: true, width: '80px' },
  { id: 'assetValue', label: 'Value', sortable: true, visible: true, width: '60px' },
  { id: 'owner', label: 'Owner', sortable: true, visible: true, width: '120px' },
  { id: 'custodian', label: 'Custodian', sortable: true, visible: true, width: '120px' },
  { id: 'retentionPeriod', label: 'Retention', sortable: true, visible: true, width: '100px' },
  { id: 'reviewDueDate', label: 'Review Due', sortable: true, visible: true, width: '100px' },
  { id: 'status', label: 'Status', sortable: true, visible: true, width: '80px' },
];

// Draggable Column Header Component
function DraggableColumnHeader({ 
  column, 
  sortField, 
  sortDirection, 
  onSort 
}: { 
  column: ColumnConfig; 
  sortField: SortField; 
  sortDirection: SortDirection; 
  onSort: (field: SortField) => void; 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  return (
    <th 
      ref={setNodeRef} 
      style={style}
      className="text-left p-3 font-medium text-xs border-r last:border-r-0"
      {...attributes}
    >
      <div className="flex items-center gap-2">
        <div 
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </div>
        {column.sortable ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSort(column.id)}
            className="h-auto p-0 font-medium flex-1 justify-start"
          >
            {column.label}
            {getSortIcon(column.id)}
          </Button>
        ) : (
          <span className="flex-1">{column.label}</span>
        )}
      </div>
    </th>
  );
}

export default function AssetRegister() {
  const navigate = useNavigate();
  const { data: assets = [], isLoading } = useAssets();
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCriticality, setFilterCriticality] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [activeId, setActiveId] = useState<SortField | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Load column order from localStorage
  useEffect(() => {
    const savedColumns = localStorage.getItem('asset-table-columns');
    if (savedColumns) {
      try {
        setColumns(JSON.parse(savedColumns));
      } catch (e) {
        console.error('Failed to load column configuration');
      }
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter and sort assets
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((asset: any) => 
        asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assetId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((asset: any) => asset.status === filterStatus);
    }

    // Apply criticality filter
    if (filterCriticality !== 'all') {
      filtered = filtered.filter((asset: any) => asset.businessCriticality === filterCriticality);
    }

    // Apply department filter
    if (filterDepartment !== 'all') {
      filtered = filtered.filter((asset: any) => asset.department === filterDepartment);
    }

    // Sort assets
    return filtered.sort((a: any, b: any) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle different field types
      if (sortField === 'createdAt' || sortField === 'reviewDueDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [assets, searchQuery, filterStatus, filterCriticality, filterDepartment, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as SortField);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newColumns = arrayMove(items, oldIndex, newIndex);
        
        // Save to localStorage
        localStorage.setItem('asset-table-columns', JSON.stringify(newColumns));
        
        return newColumns;
      });
    }

    setActiveId(null);
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCellValue = (asset: any, columnId: SortField) => {
    switch (columnId) {
      case 'assetId':
        return <span className="font-mono text-xs">{asset.assetId}</span>;
      case 'name':
        return (
          <div>
            <div className="font-medium text-sm">{asset.name}</div>
            {asset.description && (
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {asset.description}
              </div>
            )}
          </div>
        );
      case 'category':
        return <div className="text-sm">{asset.category}</div>;
      case 'assetType':
        return <div className="text-sm">{asset.assetType}</div>;
      case 'group':
        return <div className="text-sm">{asset.group}</div>;
      case 'department':
        return <div className="text-sm">{asset.department}</div>;
      case 'location':
        return <div className="text-sm">{asset.location}</div>;
      case 'businessCriticality':
        return (
          <Badge className={`text-xs ${getCriticalityColor(asset.businessCriticality)}`}>
            {asset.businessCriticality}
          </Badge>
        );
      case 'c':
      case 'i':
      case 'a':
        return <div className="text-sm font-mono text-center">{asset[columnId] || 0}</div>;
      case 'assetScore':
        return <div className="text-sm font-mono text-center">{asset.assetScore || 0}</div>;
      case 'assetRanking':
        return (
          <Badge className={`text-xs ${getCriticalityColor(asset.assetRanking)}`}>
            {asset.assetRanking}
          </Badge>
        );
      case 'assetValue':
        return <div className="text-sm font-mono text-center">{asset.assetValue || 0}</div>;
      case 'owner':
        return <div className="text-sm">{asset.owner}</div>;
      case 'custodian':
        return <div className="text-sm">{asset.custodian}</div>;
      case 'retentionPeriod':
        return <div className="text-sm">{asset.retentionPeriod}</div>;
      case 'reviewDueDate':
        return <div className="text-sm">{formatDate(asset.reviewDueDate)}</div>;
      case 'status':
        return (
          <Badge className={`text-xs ${getStatusColor(asset.status)}`}>
            {asset.status}
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="page-container max-w-7xl">
        <div className="flex items-center justify-center h-32">
          <div className="text-sm text-muted-foreground">Loading assets...</div>
        </div>
      </div>
    );
  }

  const visibleColumns = columns.filter(col => col.visible);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="page-container max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title">Asset Register</h1>
            <p className="page-subtitle">Complete inventory of organizational assets</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => navigate('/assets/add')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
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
                  placeholder="Search assets by name, ID, category, or description..."
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
                    <label className="text-xs font-medium text-muted-foreground">Status</label>
                    <select 
                      value={filterStatus} 
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full mt-1 text-sm px-3 py-2 border rounded"
                    >
                      <option value="all">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Under Review">Under Review</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Criticality</label>
                    <select 
                      value={filterCriticality} 
                      onChange={(e) => setFilterCriticality(e.target.value)}
                      className="w-full mt-1 text-sm px-3 py-2 border rounded"
                    >
                      <option value="all">All Criticality</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Department</label>
                    <select 
                      value={filterDepartment} 
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="w-full mt-1 text-sm px-3 py-2 border rounded"
                    >
                      <option value="all">All Departments</option>
                      <option value="IT">IT</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">HR</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Asset Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span>Asset Inventory</span>
                <Badge variant="secondary">{filteredAndSortedAssets.length} assets</Badge>
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {filteredAndSortedAssets.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-sm text-muted-foreground">No assets found</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {searchQuery && "Try adjusting your search or filters"}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <SortableContext items={visibleColumns.map(col => col.id)} strategy={verticalListSortingStrategy}>
                        {visibleColumns.map((column) => (
                          <DraggableColumnHeader
                            key={column.id}
                            column={column}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                        ))}
                      </SortableContext>
                      <th className="text-left p-3 font-medium text-xs w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedAssets.map((asset: any) => (
                      <tr key={asset._id} className="border-b hover:bg-muted/30 transition-colors">
                        {visibleColumns.map((column) => (
                          <td key={column.id} className="p-3 border-r last:border-r-0" style={{ width: column.width }}>
                            {getCellValue(asset, column.id)}
                          </td>
                        ))}
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="text-xs">
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <DragOverlay>
          {activeId ? (
            <div className="bg-white border shadow-lg rounded p-2 text-sm font-medium">
              {columns.find(col => col.id === activeId)?.label}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
                                  
