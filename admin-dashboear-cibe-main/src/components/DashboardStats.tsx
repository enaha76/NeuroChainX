import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Coins,
  FileText,
  TrendingUp,
} from "lucide-react";
import { DashboardStats as StatsType } from "@/types/waste";

interface DashboardStatsProps {
  stats: StatsType;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statCards = [
    {
      title: "Total Reports",
      value: stats.totalReports.toLocaleString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeColor: "text-green-600",
    },
    {
      title: "Pending Reports",
      value: stats.pendingReports.toLocaleString(),
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      change: "-5%",
      changeColor: "text-green-600",
    },
    {
      title: "Completed Today",
      value: stats.completedToday.toLocaleString(),
      icon: CheckCircle,
      color: "text-eco-600",
      bgColor: "bg-eco-50",
      change: "+18%",
      changeColor: "text-green-600",
    },
    {
      title: "Total Rewards",
      value: `${stats.totalRewardsAwarded.toLocaleString()} HBAR`,
      icon: Coins,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+24%",
      changeColor: "text-green-600",
    },
    {
      title: "Avg Response Time",
      value: `${stats.averageResponseTime.toFixed(1)}h`,
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      change: "-15%",
      changeColor: "text-green-600",
    },
    {
      title: "Critical Bins",
      value: stats.criticalBins.toLocaleString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "Urgent",
      changeColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="hover:shadow-md transition-shadow duration-200 animate-fade-in"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs mt-1">
                <Badge
                  variant="outline"
                  className={`${stat.changeColor} border-current`}
                >
                  {stat.change}
                </Badge>
                <span className="text-muted-foreground">from last week</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
