import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Leaf,
  Target,
  Clock,
  Users,
  MapPin,
  Calendar,
  Download,
} from "lucide-react";
import { useState } from "react";

interface AnalyticsData {
  wasteReduction: number;
  responseTime: number;
  teamEfficiency: number;
  carbonSaved: number;
  monthlyReports: number[];
  urgencyDistribution: { level: string; count: number; percentage: number }[];
  topLocations: { address: string; reports: number; efficiency: number }[];
  timeMetrics: { metric: string; value: string; change: number }[];
}

const mockAnalyticsData: AnalyticsData = {
  wasteReduction: 23.5,
  responseTime: 2.1,
  teamEfficiency: 87.3,
  carbonSaved: 145.8,
  monthlyReports: [65, 78, 82, 94, 87, 102, 118, 125, 134, 142, 156, 168],
  urgencyDistribution: [
    { level: "Critical", count: 12, percentage: 7.7 },
    { level: "High", count: 34, percentage: 21.8 },
    { level: "Medium", count: 67, percentage: 42.9 },
    { level: "Low", count: 43, percentage: 27.6 },
  ],
  topLocations: [
    { address: "Downtown District", reports: 45, efficiency: 94.2 },
    { address: "Central Park Area", reports: 38, efficiency: 89.5 },
    { address: "Business Quarter", reports: 32, efficiency: 91.8 },
    { address: "Residential Zone A", reports: 28, efficiency: 87.3 },
    { address: "Industrial Area", reports: 25, efficiency: 82.1 },
  ],
  timeMetrics: [
    { metric: "Avg. Report to Verification", value: "45 min", change: -12 },
    { metric: "Avg. Verification to Cleanup", value: "2.3 hours", change: -8 },
    { metric: "Avg. Total Resolution", value: "4.7 hours", change: -15 },
    { metric: "Response Time (Critical)", value: "23 min", change: -22 },
  ],
};

export const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("last-30-days");

  const getChangeIcon = (change: number) => {
    return change > 0 ? (
      <TrendingUp className="h-4 w-4 text-eco-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change > 0 ? "text-eco-600" : "text-red-600";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Analytics Overview
          </h3>
          <p className="text-sm text-slate-600">
            Track performance, trends, and environmental impact metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Waste Reduction
            </CardTitle>
            <Leaf className="h-4 w-4 text-eco-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-eco-600">
              {mockAnalyticsData.wasteReduction}%
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-eco-600">+5.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalyticsData.responseTime}h
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-eco-600">-18%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Team Efficiency
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalyticsData.teamEfficiency}%
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-eco-600">+3.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
            <Leaf className="h-4 w-4 text-eco-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-eco-600">
              {mockAnalyticsData.carbonSaved} kg
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-eco-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Reports Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Reports Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Jan</span>
                <span>Dec</span>
              </div>
              {/* Simple bar chart representation */}
              <div className="grid grid-cols-12 gap-1 h-32">
                {mockAnalyticsData.monthlyReports.map((value, index) => (
                  <div key={index} className="flex flex-col justify-end">
                    <div
                      className="bg-eco-200 rounded-t-sm transition-all duration-300 hover:bg-eco-300"
                      style={{
                        height: `${(value / Math.max(...mockAnalyticsData.monthlyReports)) * 100}%`,
                        minHeight: "8px",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Showing steady growth with{" "}
                {mockAnalyticsData.monthlyReports.slice(-1)[0]} reports this
                month
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Urgency Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Urgency Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnalyticsData.urgencyDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={
                        item.level === "Critical"
                          ? "border-red-200 text-red-700"
                          : item.level === "High"
                            ? "border-orange-200 text-orange-700"
                            : item.level === "Medium"
                              ? "border-amber-200 text-amber-700"
                              : "border-eco-200 text-eco-700"
                      }
                    >
                      {item.level}
                    </Badge>
                    <span className="text-sm font-medium">
                      {item.count} reports
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Performing Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalyticsData.topLocations.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <div className="font-medium text-sm">
                      {location.address}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {location.reports} reports processed
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-eco-600">
                      {location.efficiency}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      efficiency
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Response Time Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalyticsData.timeMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <div className="font-medium text-sm">{metric.metric}</div>
                    <div className="text-lg font-bold">{metric.value}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getChangeIcon(metric.change)}
                    <span
                      className={`text-sm font-medium ${getChangeColor(metric.change)}`}
                    >
                      {Math.abs(metric.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-eco-600" />
            Environmental Impact Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-eco-50 rounded-lg">
              <div className="text-2xl font-bold text-eco-600 mb-1">
                2,847 kg
              </div>
              <div className="text-sm text-muted-foreground">
                Total Waste Processed
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                1,234 L
              </div>
              <div className="text-sm text-muted-foreground">
                Water Contamination Prevented
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                567 m²
              </div>
              <div className="text-sm text-muted-foreground">
                Clean Areas Maintained
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
