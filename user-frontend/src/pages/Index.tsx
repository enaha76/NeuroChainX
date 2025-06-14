import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Recycle,
  MapPin,
  Camera,
  Coins,
  Users,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  Smartphone,
  QrCode,
  Image,
  Play,
  Award,
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Smart Detection",
    description:
      "AI-powered image analysis to determine waste urgency and type automatically",
    color: "eco",
  },
  {
    icon: MapPin,
    title: "Location Tracking",
    description:
      "GPS-based bin detection and QR code scanning for precise reporting",
    color: "nature",
  },
  {
    icon: Coins,
    title: "Token Rewards",
    description:
      "Earn eco-tokens for verified waste reports using Hedera blockchain",
    color: "eco",
  },
  {
    icon: Shield,
    title: "Smart Contracts",
    description:
      "Only the first citizen to report gets rewarded until bin is cleaned",
    color: "nature",
  },
];

const steps = [
  {
    icon: QrCode,
    title: "Scan or Locate",
    description: "Find a waste bin using QR code or GPS location",
  },
  {
    icon: Image,
    title: "Report & Photo",
    description: "Take a photo and submit your waste report",
  },
  {
    icon: Zap,
    title: "AI Analysis",
    description: "Our AI determines urgency and validates the report",
  },
  {
    icon: Coins,
    title: "Earn Rewards",
    description: "Receive eco-tokens if you're the first to report",
  },
];

const stats = [
  { value: "10K+", label: "Reports Submitted" },
  { value: "2.5K", label: "Active Users" },
  { value: "500+", label: "Bins Cleaned" },
  { value: "25K", label: "Tokens Distributed" },
];

const Index = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-eco-50 via-white to-nature-50 opacity-60"></div>
        <div className="container relative px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 px-3 py-1 text-sm">
              <Recycle className="mr-1 h-3 w-3" />
              Powered by Hedera Blockchain
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
              Clean Cities, <span className="gradient-text">Earn Rewards</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
              Report waste, help clean your city, and earn crypto rewards. Our
              AI-powered platform makes environmental action profitable and fun.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="eco-gradient text-white shadow-glow hover:shadow-lg transition-all duration-300"
              >
                <Link to="/report" className="flex items-center">
                  Start Reporting
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-eco-200 text-eco-700 hover:bg-eco-50"
              >
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="rounded-full bg-eco-100 p-3">
            <Recycle className="h-6 w-6 text-eco-600" />
          </div>
        </div>
        <div
          className="absolute top-32 right-16 animate-float"
          style={{ animationDelay: "2s" }}
        >
          <div className="rounded-full bg-nature-100 p-3">
            <Coins className="h-6 w-6 text-nature-600" />
          </div>
        </div>
        <div
          className="absolute bottom-20 left-20 animate-float"
          style={{ animationDelay: "4s" }}
        >
          <div className="rounded-full bg-eco-100 p-2">
            <MapPin className="h-4 w-4 text-eco-600" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-white/50 backdrop-blur-sm">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-eco-600 md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Revolutionary Waste Management
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Combining AI, blockchain, and community action for a cleaner
              future
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div
                      className={`mb-4 inline-flex rounded-full bg-${feature.color}-100 p-3`}
                    >
                      <Icon className={`h-6 w-6 text-${feature.color}-600`} />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                  <div
                    className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-${feature.color}-400 to-${feature.color}-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                  ></div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-eco-50 to-nature-50 py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple steps to make a difference and earn rewards
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                    <Icon className="h-8 w-8 text-eco-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>

                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-8 left-full hidden w-full lg:block">
                      <div className="mx-4 border-t-2 border-dashed border-eco-200"></div>
                    </div>
                  )}

                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-eco-500 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-eco-500 to-nature-500 text-white">
            <CardContent className="relative p-12 text-center md:p-20">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Ready to Make a Difference?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
                Join thousands of eco-warriors earning rewards while cleaning
                our cities. Every report counts towards a cleaner future.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-eco-700 hover:bg-gray-50 shadow-lg"
                >
                  <Link to="/report" className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Start Reporting Now
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-eco-700 transition-all duration-300 backdrop-blur-md font-semibold shadow-lg"
                >
                  <Link to="/rewards" className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    View Rewards
                  </Link>
                </Button>
              </div>

              {/* Background Decoration */}
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/10"></div>
              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/10"></div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
