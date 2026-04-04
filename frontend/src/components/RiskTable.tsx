import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, GripVertical } from "lucide-react";
import { useRisks } from "@/hooks/useApi";
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
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortField = 'riskId' | 'name' | 'description' | 'category' | 'subcategory' | 'assetName' | 'assetType' | 'c' | 'i' | 'a' | 'assetScore' | 'assetRanking' | 'threat' | 'tValue' | 'vulnerability' | 'vValue' | 'tvValue' | 'tvPair' | 'probability' | 'impact' | 'absoluteRIR' | 'riskImpactRating' | 'revisedRIR' | 'riskPriority' | 'treatmentRequired' | 'treatmentOption' | 'riskOwner' | 'status' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

interface ColumnConfig {
  id: SortField;
  label: string;
  sortable: boolean;
  visible: boolean;
  width?: string;
}

const defaultColumns: ColumnConfig[] = [
  { id: 'riskId', label: 'Risk ID', sortable: true, visible: true, width: '80px' },
  { id: 'name', label: 'Risk Name', sortable: true, visible: true, width: '200px' },
  { id: 'description', label: 'Description', sortable: true, visible: true, width: '150px' },
  { id: 'category', label: 'Category', sortable: true, visible: true, width: '120px' },
  { id: 'subcategory', label: 'Subcategory', sortable: true, visible: true, width: '120px' },
  { id: 'assetName', label: 'Asset', sortable: true, visible: true, width: '120px' },
  { id: 'assetType', label: 'Asset Type', sortable: true, visible: true, width: '100px' },
  { id: 'c', label: 'C', sortable: true, visible: true, width: '50px' },
  { id: 'i', label: 'I', sortable: true, visible: true, width: '50px' },
  { id: 'a', label: 'A', sortable: true, visible: true, width: '50px' },
  { id: 'assetScore', label: 'Score', sortable: true, visible: true, width: '60px' },
  { id: 'assetRanking', label: 'Ranking', sortable: true, visible: true, width: '80px' },
  { id: 'threat', label: 'Threat', sortable: true, visible: true, width: '100px' },
  { id: 'tValue', label: 'T-Val', sortable: true, visible: true, width: '60px' },
  { id: 'vulnerability', label: 'Vulnerability', sortable: true, visible: true, width: '120px' },
  { id: 'vValue', label: 'V-Val', sortable: true, visible: true, width: '60px' },
  { id: 'tvValue', label: 'TV', sortable: true, visible: true, width: '50px' },
  { id: 'tvPair', label: 'TVP', sortable: true, visible: true, width: '50px' },
  { id: 'probability', label: 'PoA', sortable: true, visible: true, width: '50px' },
  { id: 'absoluteRIR', label: 'Abs RIR', sortable: true, visible: true, width: '70px' },
  { id: 'riskImpactRating', label: 'Impact', sortable: true, visible: true, width: '80px' },
  { id: 'revisedRIR', label: 'RRIR', sortable: true, visible: true, width: '60px' },
  { id: 'riskPriority', label: 'Priority', sortable: true, visible: true, width: '80px' },
  { id: 'treatmentRequired', label: 'Treatment', sortable: true, visible: true, width: '80px' },
  { id: 'riskOwner', label: 'Owner', sortable: true, visible: true, width: '100px' },
  { id: 'status', label: 'Status', sortable: true, visible: true, width: '80px' },
  { id: 'createdAt', label: 'Created', sortable: true, visible: true, width: '100px' },
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

interface RiskTableProps {
  searchQuery?: string;
  onRiskSelect?: (risk: any) => void;
  onRiskEdit?: (risk: any) => void;
  onRiskView?: (risk: any) => void;
}

export function RiskTable({ searchQuery = "", onRiskSelect, onRiskEdit, onRiskView }: RiskTableProps) {
  const { data: risks = [], isLoading } = useRisks();
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [activeId, setActiveId] = useState<SortField | null>(null);

  // Load column order from localStorage
  useEffect(() => {
    // Clear old localStorage to ensure new columns load
    localStorage.removeItem('risk-table-columns');
    
    const savedColumns = localStorage.getItem('risk-table-columns');
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

  // Filter and sort risks
  const filteredAndSortedRisks = useMemo(() => {
    let filtered = risks;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((risk: any) => 
        risk.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.riskId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.assetName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.threat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.vulnerability?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.riskOwner?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((risk: any) => risk.status === filterStatus);
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter((risk: any) => risk.riskPriority === filterPriority);
    }

    // Sort risks
    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle different field types
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        // Handle numeric fields
        aValue = aValue;
        bValue = bValue;
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [risks, searchQuery, filterStatus, filterPriority, sortField, sortDirection]);

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
        localStorage.setItem('risk-table-columns', JSON.stringify(newColumns));
        
        return newColumns;
      });
    }

    setActiveId(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800 border-red-200';
      case 'Mitigating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Accepted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Closed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCellValue = (risk: any, columnId: SortField) => {
    switch (columnId) {
      case 'riskId':
        return <span className="font-mono text-xs">{risk.riskId}</span>;
      case 'name':
        return (
          <div>
            <div className="font-medium text-sm">{risk.name}</div>
            {risk.description && (
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {risk.description}
              </div>
            )}
          </div>
        );
      case 'description':
        return <div className="text-sm line-clamp-3">{risk.description || '-'}</div>;
      case 'category':
        return <div className="text-sm">{risk.category || '-'}</div>;
      case 'subcategory':
        return <div className="text-sm">{risk.subcategory || '-'}</div>;
      case 'assetName':
        return <div className="text-sm">{risk.assetName || '-'}</div>;
      case 'assetType':
        return <div className="text-sm">{risk.assetType || '-'}</div>;
      case 'c':
      case 'i':
      case 'a':
        return <div className="text-sm font-mono text-center">{risk[columnId] || 0}</div>;
      case 'assetScore':
        return <div className="text-sm font-mono text-center">{risk.assetScore || 0}</div>;
      case 'assetRanking':
        return (
          <Badge className={`text-xs ${getPriorityColor(risk.assetRanking)}`}>
            {risk.assetRanking || '-'}
          </Badge>
        );
      case 'threat':
        return <div className="text-sm">{risk.threat || '-'}</div>;
      case 'tValue':
        return <div className="text-sm font-mono text-center">{risk.tValue || 0}</div>;
      case 'vulnerability':
        return <div className="text-sm">{risk.vulnerability || '-'}</div>;
      case 'vValue':
        return <div className="text-sm font-mono text-center">{risk.vValue || 0}</div>;
      case 'tvValue':
        return <div className="text-sm font-mono text-center">{risk.tvValue || 0}</div>;
      case 'tvPair':
        return <div className="text-sm font-mono text-center">{risk.tvPair || 0}</div>;
      case 'probability':
        return <div className="text-sm font-mono text-center">{risk.probability || 0}</div>;
      case 'impact':
        return <div className="text-sm font-mono text-center">{risk.impact || 0}</div>;
      case 'absoluteRIR':
        return <div className="text-sm font-mono text-center">{risk.absoluteRIR || 0}</div>;
      case 'riskImpactRating':
        return <div className="text-sm">{risk.riskImpactRating || '-'}</div>;
      case 'revisedRIR':
        return <div className="text-sm font-mono text-center">{risk.revisedRIR || 0}</div>;
      case 'riskPriority':
        return (
          <Badge className={`text-xs ${getPriorityColor(risk.riskPriority)}`}>
            {risk.riskPriority || '-'}
          </Badge>
        );
      case 'treatmentRequired':
        return (
          <Badge className={`text-xs ${risk.treatmentRequired === 'Yes' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
            {risk.treatmentRequired || 'No'}
          </Badge>
        );
      case 'treatmentOption':
        return <div className="text-sm">{risk.treatmentOption || '-'}</div>;
      case 'riskOwner':
        return <div className="text-sm">{risk.riskOwner || '-'}</div>;
      case 'status':
        return (
          <Badge className={`text-xs ${getStatusColor(risk.status)}`}>
            {risk.status || '-'}
          </Badge>
        );
      case 'createdAt':
        return <div className="text-sm">{formatDate(risk.createdAt)}</div>;
      case 'updatedAt':
        return <div className="text-sm">{formatDate(risk.updatedAt)}</div>;
      default:
        return <div className="text-sm">-</div>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">Loading risks...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const visibleColumns = columns.filter(col => col.visible);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span>Risk Register</span>
              <Badge variant="secondary">{filteredAndSortedRisks.length} risks</Badge>
            </CardTitle>
            
            {/* Filters */}
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs px-2 py-1 border rounded"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="Mitigating">Mitigating</option>
                <option value="Accepted">Accepted</option>
                <option value="Closed">Closed</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="text-xs px-2 py-1 border rounded"
              >
                <option value="all">All Priority</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredAndSortedRisks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-sm text-muted-foreground">No risks found</div>
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
                  {filteredAndSortedRisks.map((risk: any) => (
                    <tr 
                      key={risk._id} 
                      className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => onRiskSelect?.(risk)}
                    >
                      {visibleColumns.map((column) => (
                        <td key={column.id} className="p-3 border-r last:border-r-0" style={{ width: column.width }}>
                          {getCellValue(risk, column.id)}
                        </td>
                      ))}
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRiskView?.(risk);
                            }}
                          >
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRiskEdit?.(risk);
                            }}
                          >
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
    </DndContext>
  );
}
