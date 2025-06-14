import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Plus,
  MapPin,
  Clock,
  Star,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: "active" | "busy" | "offline";
  efficiency: number;
  tasksCompleted: number;
  location: string;
  joinDate: string;
  specialties: string[];
}

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "in-progress" | "completed";
  location: string;
  estimatedTime: string;
  createdAt: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "TM001",
    name: "Alex Rodriguez",
    role: "Team Lead",
    email: "alex.rodriguez@ecowatch.com",
    phone: "+1-555-0123",
    status: "active",
    efficiency: 94.5,
    tasksCompleted: 187,
    location: "Downtown District",
    joinDate: "2023-01-15",
    specialties: ["Hazardous Waste", "Team Management"],
  },
  {
    id: "TM002",
    name: "Maria Santos",
    role: "Senior Cleaner",
    email: "maria.santos@ecowatch.com",
    phone: "+1-555-0124",
    status: "busy",
    efficiency: 89.2,
    tasksCompleted: 156,
    location: "Central Park Area",
    joinDate: "2023-02-20",
    specialties: ["Recycling", "Heavy Machinery"],
  },
  {
    id: "TM003",
    name: "David Chen",
    role: "Waste Specialist",
    email: "david.chen@ecowatch.com",
    phone: "+1-555-0125",
    status: "active",
    efficiency: 92.1,
    tasksCompleted: 143,
    location: "Business Quarter",
    joinDate: "2023-03-10",
    specialties: ["Chemical Waste", "Documentation"],
  },
  {
    id: "TM004",
    name: "Sarah Johnson",
    role: "Field Coordinator",
    email: "sarah.johnson@ecowatch.com",
    phone: "+1-555-0126",
    status: "offline",
    efficiency: 87.8,
    tasksCompleted: 134,
    location: "Residential Zone A",
    joinDate: "2023-04-05",
    specialties: ["Route Optimization", "Quality Control"],
  },
];

const mockTasks: Task[] = [
  {
    id: "TSK001",
    title: "Critical Waste Overflow - BIN-A1234",
    assignedTo: "TM001",
    priority: "critical",
    status: "in-progress",
    location: "123 Main St, Downtown",
    estimatedTime: "30 min",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "TSK002",
    title: "Recycling Bin Maintenance - BIN-B5678",
    assignedTo: "TM002",
    priority: "medium",
    status: "pending",
    location: "456 Park Ave, Central",
    estimatedTime: "45 min",
    createdAt: "2024-01-15T09:15:00Z",
  },
  {
    id: "TSK003",
    title: "Hazardous Material Disposal - BIN-C9012",
    assignedTo: "TM003",
    priority: "high",
    status: "completed",
    location: "789 Broadway, Business",
    estimatedTime: "60 min",
    createdAt: "2024-01-15T08:45:00Z",
  },
];

export const TeamsPage = () => {
  const [selectedView, setSelectedView] = useState<
    "members" | "tasks" | "schedule"
  >("members");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [tasks, setTasks] = useState(mockTasks);

  const getStatusBadge = (status: TeamMember["status"]) => {
    const statusConfig = {
      active: {
        label: "Active",
        className: "bg-eco-100 text-eco-700 border-eco-200",
      },
      busy: {
        label: "Busy",
        className: "bg-amber-100 text-amber-700 border-amber-200",
      },
      offline: {
        label: "Offline",
        className: "bg-gray-100 text-gray-700 border-gray-200",
      },
    };
    return (
      <Badge variant="outline" className={statusConfig[status].className}>
        {statusConfig[status].label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Task["priority"]) => {
    const priorityConfig = {
      low: {
        label: "Low",
        className: "bg-eco-100 text-eco-700 border-eco-200",
      },
      medium: {
        label: "Medium",
        className: "bg-amber-100 text-amber-700 border-amber-200",
      },
      high: {
        label: "High",
        className: "bg-orange-100 text-orange-700 border-orange-200",
      },
      critical: {
        label: "Critical",
        className: "bg-red-100 text-red-700 border-red-200",
      },
    };
    return (
      <Badge variant="outline" className={priorityConfig[priority].className}>
        {priorityConfig[priority].label}
      </Badge>
    );
  };

  const getTaskStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-eco-600" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Team Management
          </h3>
          <p className="text-sm text-slate-600">
            Manage cleanup teams, assignments, and performance tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedView}
            onValueChange={(value) => setSelectedView(value as any)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="members">Team Members</SelectItem>
              <SelectItem value="tasks">Active Tasks</SelectItem>
              <SelectItem value="schedule">Schedule</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
                <DialogDescription>
                  Add a new team member to your waste management crew
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cleaner">Cleaner</SelectItem>
                        <SelectItem value="specialist">
                          Waste Specialist
                        </SelectItem>
                        <SelectItem value="coordinator">
                          Field Coordinator
                        </SelectItem>
                        <SelectItem value="lead">Team Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@ecowatch.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+1-555-0123" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Downtown District" />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Add Member</Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingMember(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Members
                </p>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Tasks
                </p>
                <p className="text-2xl font-bold">
                  {tasks.filter((t) => t.status !== "completed").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Efficiency
                </p>
                <p className="text-2xl font-bold">
                  {(
                    teamMembers.reduce(
                      (sum, member) => sum + member.efficiency,
                      0,
                    ) / teamMembers.length
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <Star className="h-8 w-8 text-eco-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Online Now
                </p>
                <p className="text-2xl font-bold">
                  {teamMembers.filter((m) => m.status === "active").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-eco-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members View */}
      {selectedView === "members" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(member.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Efficiency</p>
                    <p className="text-lg font-bold text-eco-600">
                      {member.efficiency}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tasks Completed</p>
                    <p className="text-lg font-bold">{member.tasksCompleted}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {member.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {member.phone}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-1">
                    {member.specialties.map((specialty, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tasks View */}
      {selectedView === "tasks" && (
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => {
                const assignedMember = teamMembers.find(
                  (m) => m.id === task.assignedTo,
                );
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {getTaskStatusIcon(task.status)}
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {task.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {assignedMember?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {task.estimatedTime}
                        </p>
                      </div>
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule View */}
      {selectedView === "schedule" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Team Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Schedule Management
              </h3>
              <p className="text-slate-600 max-w-md mx-auto mb-4">
                Advanced scheduling features including shift management, task
                assignments, and availability tracking are coming soon.
              </p>
              <Button variant="outline">Request Schedule Feature</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
