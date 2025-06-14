import { useState, useMemo } from "react";
import { Recycle, Bell, Settings, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardStats } from "@/components/DashboardStats";
import { ReportFilters } from "@/components/ReportFilters";
import { WasteReportsTable } from "@/components/WasteReportsTable";
import { AnalyticsPage } from "@/components/AnalyticsPage";
import { TeamsPage } from "@/components/TeamsPage";
import { mockReports, mockStats } from "@/lib/mockData";
import { WasteReport, FilterState } from "@/types/waste";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<WasteReport[]>(mockReports);
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    urgency: "",
    dateRange: { from: null, to: null },
    searchTerm: "",
  });
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "analytics" | "teams"
  >("dashboard");

  // Filter reports based on current filters
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Status filter
      if (filters.status && report.status !== filters.status) return false;

      // Urgency filter
      if (filters.urgency && report.urgencyLevel !== filters.urgency)
        return false;

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchFields = [
          report.id,
          report.binId,
          report.reporterName,
          report.location.address,
        ].map((field) => field.toLowerCase());

        if (!searchFields.some((field) => field.includes(searchLower)))
          return false;
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const reportDate = new Date(report.reportedAt);
        if (filters.dateRange.from && reportDate < filters.dateRange.from)
          return false;
        if (filters.dateRange.to && reportDate > filters.dateRange.to)
          return false;
      }

      return true;
    });
  }, [reports, filters]);

  const handleStatusChange = (
    reportId: string,
    newStatus: WasteReport["status"],
  ) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: newStatus,
              verifiedAt:
                newStatus === "verified"
                  ? new Date().toISOString()
                  : report.verifiedAt,
              completedAt:
                newStatus === "completed"
                  ? new Date().toISOString()
                  : report.completedAt,
              rewardStatus:
                newStatus === "verified" ? "awarded" : report.rewardStatus,
            }
          : report,
      ),
    );

    toast({
      title: "Status Updated",
      description: `Report ${reportId} status changed to ${newStatus}`,
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Data Refreshed",
      description: "Reports have been updated with the latest information",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your report export will be ready shortly",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-eco-600 rounded-lg">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">EcoWatch</h1>
                <p className="text-xs text-slate-500">
                  Waste Management Dashboard
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Button
                variant="ghost"
                className={`${
                  activeTab === "dashboard"
                    ? "text-eco-600 font-medium"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className={`${
                  activeTab === "analytics"
                    ? "text-eco-600 font-medium"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </Button>
              <Button
                variant="ghost"
                className={`${
                  activeTab === "teams"
                    ? "text-eco-600 font-medium"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setActiveTab("teams")}
              >
                Teams
              </Button>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {mockStats.criticalBins}
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Admin User
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@ecowatch.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {activeTab === "dashboard" && "Waste Management Dashboard"}
            {activeTab === "analytics" && "Analytics Dashboard"}
            {activeTab === "teams" && "Teams Management"}
          </h2>
          <p className="text-slate-600">
            {activeTab === "dashboard" &&
              "Monitor waste reports, manage cleanup operations, and track reward distributions"}
            {activeTab === "analytics" &&
              "Advanced analytics and insights for waste management operations"}
            {activeTab === "teams" &&
              "Manage cleanup teams and workforce assignments"}
          </p>
        </div>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <>
            {/* Dashboard Stats */}
            <DashboardStats stats={mockStats} />

            {/* Filters */}
            <ReportFilters
              filters={filters}
              onFiltersChange={setFilters}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />

            {/* Reports Table */}
            <WasteReportsTable
              reports={filteredReports}
              onStatusChange={handleStatusChange}
            />

            {/* Empty State */}
            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <Recycle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No reports found
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  No waste reports match your current filters. Try adjusting
                  your search criteria or clearing filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    setFilters({
                      status: "",
                      urgency: "",
                      dateRange: { from: null, to: null },
                      searchTerm: "",
                    })
                  }
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}

        {/* Analytics Content */}
        {activeTab === "analytics" && <AnalyticsPage />}

        {/* Teams Content */}
        {activeTab === "teams" && <TeamsPage />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Recycle className="h-5 w-5 text-eco-600" />
              <span className="text-slate-600">
                © 2024 EcoWatch. All rights reserved.
              </span>
            </div>
            <div className="flex space-x-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-700">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-slate-700">
                Terms of Service
              </a>
              <a href="#" className="hover:text-slate-700">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
