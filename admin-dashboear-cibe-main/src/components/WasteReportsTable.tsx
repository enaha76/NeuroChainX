import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WasteReport } from "@/types/waste";
import { formatDistanceToNow } from "date-fns";

interface WasteReportsTableProps {
  reports: WasteReport[];
  onStatusChange: (reportId: string, newStatus: WasteReport["status"]) => void;
}

export const WasteReportsTable = ({
  reports,
  onStatusChange,
}: WasteReportsTableProps) => {
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(
    null,
  );

  const getStatusBadge = (status: WasteReport["status"]) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
      verified: {
        label: "Verified",
        variant: "default" as const,
        icon: CheckCircle,
      },
      cleaning: {
        label: "Cleaning",
        variant: "secondary" as const,
        icon: AlertCircle,
      },
      completed: {
        label: "Completed",
        variant: "secondary" as const,
        icon: CheckCircle,
      },
      rejected: {
        label: "Rejected",
        variant: "destructive" as const,
        icon: XCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: WasteReport["urgencyLevel"]) => {
    const urgencyConfig = {
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
      <Badge variant="outline" className={urgencyConfig[urgency].className}>
        {urgencyConfig[urgency].label}
      </Badge>
    );
  };

  const getRewardBadge = (
    rewardStatus: WasteReport["rewardStatus"],
    amount?: number,
  ) => {
    const rewardConfig = {
      pending: {
        label: "Pending",
        className: "bg-amber-100 text-amber-700 border-amber-200",
      },
      awarded: {
        label: `${amount} HBAR`,
        className: "bg-eco-100 text-eco-700 border-eco-200",
      },
      not_eligible: {
        label: "Not Eligible",
        className: "bg-gray-100 text-gray-700 border-gray-200",
      },
    };

    return (
      <Badge variant="outline" className={rewardConfig[rewardStatus].className}>
        {rewardConfig[rewardStatus].label}
      </Badge>
    );
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 40) return address;
    return `${address.substring(0, 40)}...`;
  };

  return (
    <Card className="animate-fade-in">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Waste Reports</h3>
          <div className="text-sm text-muted-foreground">
            {reports.length} reports
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={report.photoUrl}
                        alt="Waste bin"
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                      <div>
                        <div className="font-medium text-sm">{report.id}</div>
                        <div className="text-xs text-muted-foreground">
                          {report.binId}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Fill: {report.fillLevel}%
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {report.reporterName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {report.reporterName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {report.reporterId}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm max-w-48">
                      {truncateAddress(report.location.address)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {report.location.latitude.toFixed(4)},{" "}
                      {report.location.longitude.toFixed(4)}
                    </div>
                  </TableCell>

                  <TableCell>{getUrgencyBadge(report.urgencyLevel)}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    {getRewardBadge(report.rewardStatus, report.rewardAmount)}
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      {formatDistanceToNow(new Date(report.reportedAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {report.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                onStatusChange(report.id, "verified")
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Verify Report
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                onStatusChange(report.id, "rejected")
                              }
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject Report
                            </DropdownMenuItem>
                          </>
                        )}
                        {report.status === "verified" && (
                          <DropdownMenuItem
                            onClick={() =>
                              onStatusChange(report.id, "cleaning")
                            }
                          >
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Start Cleaning
                          </DropdownMenuItem>
                        )}
                        {report.status === "cleaning" && (
                          <DropdownMenuItem
                            onClick={() =>
                              onStatusChange(report.id, "completed")
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Completed
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Report Details Dialog */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={() => setSelectedReport(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details - {selectedReport?.id}</DialogTitle>
            <DialogDescription>
              Detailed information about this waste report
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <img
                    src={selectedReport.photoUrl}
                    alt="Waste bin"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Bin ID</label>
                    <div className="text-sm text-muted-foreground">
                      {selectedReport.binId}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reporter</label>
                    <div className="text-sm text-muted-foreground">
                      {selectedReport.reporterName}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Fill Level</label>
                    <div className="text-sm text-muted-foreground">
                      {selectedReport.fillLevel}%
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Waste Types</label>
                    <div className="flex gap-1 mt-1">
                      {selectedReport.wasteType.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Full Address</label>
                <div className="text-sm text-muted-foreground">
                  {selectedReport.location.address}
                </div>
              </div>

              {selectedReport.adminNotes && (
                <div>
                  <label className="text-sm font-medium">Admin Notes</label>
                  <div className="text-sm text-muted-foreground">
                    {selectedReport.adminNotes}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t">
                <div className="flex-1">
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Urgency</label>
                  <div className="mt-1">
                    {getUrgencyBadge(selectedReport.urgencyLevel)}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Reward</label>
                  <div className="mt-1">
                    {getRewardBadge(
                      selectedReport.rewardStatus,
                      selectedReport.rewardAmount,
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
