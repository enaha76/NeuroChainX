import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Coins,
  Gift,
  TrendingUp,
  Award,
  Star,
  Zap,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for demonstration
const rewardTiers = [
  {
    name: "Bronze",
    min: 0,
    max: 100,
    color: "amber",
    benefits: ["Basic rewards", "Community access"],
  },
  {
    name: "Silver",
    min: 100,
    max: 500,
    color: "gray",
    benefits: ["2x rewards", "Priority support", "Exclusive events"],
  },
  {
    name: "Gold",
    min: 500,
    max: 1500,
    color: "yellow",
    benefits: ["3x rewards", "VIP access", "Special NFTs"],
  },
  {
    name: "Platinum",
    min: 1500,
    max: 9999,
    color: "purple",
    benefits: ["5x rewards", "Governance voting", "Premium features"],
  },
];

const availableRewards = [
  {
    id: 4,
    name: "City Cleanup Kit",
    cost: 50,
    description: "Complete kit for community cleanup events",
    icon: "🧹",
    category: "Tools",
  },
];

const recentTransactions = [
  {
    id: 1,
    type: "earned",
    amount: 50,
    description: "Waste report verified",
    date: "2024-01-15",
  },
  {
    id: 2,
    type: "earned",
    amount: 25,
    description: "Bin cleaned confirmation",
    date: "2024-01-14",
  },
  {
    id: 3,
    type: "spent",
    amount: -50,
    description: "Coffee shop voucher",
    date: "2024-01-13",
  },
  {
    id: 4,
    type: "earned",
    amount: 75,
    description: "Critical waste report",
    date: "2024-01-12",
  },
];

const currentTokens = 650;
const currentTier = rewardTiers.find(
  (tier) => currentTokens >= tier.min && currentTokens < tier.max,
);
const nextTier = rewardTiers.find((tier) => tier.min > currentTokens);

const Rewards = () => {
  const progressToNextTier = nextTier
    ? ((currentTokens - (currentTier?.min || 0)) /
        (nextTier.min - (currentTier?.min || 0))) *
      100
    : 100;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Rewards Center
        </h1>
        <p className="text-gray-600">
          Earn and redeem eco-tokens for environmental impact
        </p>
      </div>

      {/* Token Balance & Tier */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="bg-gradient-to-br from-eco-500 to-nature-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-eco-100">Total Balance</p>
                <p className="text-3xl font-bold">
                  {currentTokens.toLocaleString()} ECO
                </p>
              </div>
              <Wallet className="h-12 w-12 text-eco-200" />
            </div>
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4" />
              <span className="text-sm text-eco-100">
                ≈ ${(currentTokens * 0.25).toFixed(2)} USD
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-yellow-600" />
              {currentTier?.name} Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextTier ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress to {nextTier.name}</span>
                  <span>{Math.round(progressToNextTier)}%</span>
                </div>
                <Progress value={progressToNextTier} className="h-2" />
                <p className="text-sm text-gray-600">
                  {nextTier.min - currentTokens} more tokens needed
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Star className="mx-auto h-8 w-8 text-yellow-600 mb-2" />
                <p className="font-semibold">Maximum Tier Reached!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Available Rewards */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="mr-2 h-5 w-5 text-purple-600" />
            Available Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {availableRewards.map((reward) => (
              <div
                key={reward.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{reward.icon}</div>
                  <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {reward.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {reward.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-eco-600">
                    <Coins className="h-4 w-4 mr-1" />
                    <span className="font-semibold">{reward.cost}</span>
                  </div>
                  <Button
                    size="sm"
                    disabled={currentTokens < reward.cost}
                    className="eco-gradient text-white"
                  >
                    Redeem
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      transaction.type === "earned"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-semibold ${
                    transaction.type === "earned"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "earned" ? "+" : ""}
                  {transaction.amount} ECO
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline">
              View All Transactions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How to Earn More */}
      <Card className="bg-gradient-to-br from-nature-50 to-eco-50 border-nature-200">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nature-100">
            <Zap className="h-8 w-8 text-nature-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Earn More Tokens
          </h3>
          <p className="text-gray-600 mb-6">
            Report waste, help clean your city, and earn rewards for your
            environmental impact.
          </p>
          <Button asChild className="eco-gradient text-white">
            <Link to="/report">
              Start Reporting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rewards;
