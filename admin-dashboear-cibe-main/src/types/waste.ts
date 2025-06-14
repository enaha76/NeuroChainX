export interface WasteReport {
  id: string;
  binId: string;
  reporterId: string;
  reporterName: string;
  photoUrl: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  urgencyLevel: "low" | "medium" | "high" | "critical";
  status: "pending" | "verified" | "cleaning" | "completed" | "rejected";
  rewardStatus: "pending" | "awarded" | "not_eligible";
  rewardAmount?: number;
  reportedAt: string;
  verifiedAt?: string;
  completedAt?: string;
  adminNotes?: string;
  wasteType: string[];
  fillLevel: number; // 0-100
}

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  completedToday: number;
  totalRewardsAwarded: number;
  averageResponseTime: number; // in hours
  criticalBins: number;
}

export interface FilterState {
  status: string;
  urgency: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  searchTerm: string;
}
