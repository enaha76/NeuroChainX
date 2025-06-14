import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileBarChart,
  MapPin,
  Clock,
  CheckCircle,
  Coins,
  Camera,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for demonstration
const mockReports = [
  {
    id: "REP001",
    location: "Central Park, Bin #42",
    status: "pending",
    urgency: "high",
    timestamp: "2024-01-15T10:30:00Z",
    reward: 50,
    image: "/placeholder.svg",
  },
  {
    id: "REP002",
    location: "Downtown Plaza, Bin #128",
    status: "cleaned",
    urgency: "medium",
    timestamp: "2024-01-14T15:45:00Z",
    reward: 25,
    image: "/placeholder.svg",
  },
  {
    id: "REP003",
    location: "Main Street, Bin #67",
    status: "verified",
    urgency: "critical",
    timestamp: "2024-01-13T09:20:00Z",
    reward: 75,
    image: "/placeholder.svg",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "verified":
      return "bg-blue-100 text-blue-800";
    case "cleaned":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "low":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "critical":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Dashboard = () => {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
        <p className="text-gray-600">
          Track your waste reports, rewards, and environmental impact
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Reports
                </p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <FileBarChart className="h-8 w-8 text-eco-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tokens Earned
                </p>
                <p className="text-2xl font-bold text-green-600">650</p>
              </div>
              <Coins className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Bins Cleaned
                </p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-purple-600">3</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Reports</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link to="/report">
              <Camera className="mr-2 h-4 w-4" />
              New Report
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={report.image}
                    alt="Report"
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                  />
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {report.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <Badge className={getUrgencyColor(report.urgency)}>
                        {report.urgency}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    +{report.reward} ECO
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(report.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" className="w-full md:w-auto">
              View All Reports
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Notice */}
      <Card className="bg-gradient-to-br from-eco-50 to-nature-50 border-eco-200">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-eco-100">
            <FileBarChart className="h-8 w-8 text-eco-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Enhanced Dashboard Coming Soon
          </h3>
          <p className="text-gray-600 mb-4">
            We're working on advanced analytics, detailed reporting, and more
            interactive features for your dashboard.
          </p>
          <Badge variant="secondary" className="bg-eco-100 text-eco-700">
            In Development
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
