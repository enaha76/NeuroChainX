import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Recycle, Menu, Coins, MapPin, FileBarChart } from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Recycle },
  { name: "Report Waste", href: "/report", icon: MapPin },
  { name: "My Reports", href: "/dashboard", icon: FileBarChart },
  { name: "Rewards", href: "/rewards", icon: Coins },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-eco-500 opacity-20 animate-pulse-glow"></div>
            <Recycle className="h-8 w-8 text-eco-600 relative z-10" />
          </div>
          <span className="font-display text-xl font-semibold text-gray-900">
            Eco<span className="text-eco-600">Clean</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-eco-50 ${
                  isActive
                    ? "text-eco-700 bg-eco-50"
                    : "text-gray-600 hover:text-eco-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
                {isActive && (
                  <div className="absolute inset-x-0 -bottom-px h-0.5 bg-eco-500 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            asChild
            size="sm"
            className="eco-gradient text-white shadow-glow"
          >
            <Link to="/report">Report Now</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col space-y-4 mt-8">
              <div className="flex items-center space-x-2 mb-6">
                <Recycle className="h-6 w-6 text-eco-600" />
                <span className="font-display text-lg font-semibold">
                  Eco<span className="text-eco-600">Clean</span>
                </span>
              </div>

              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-eco-700 bg-eco-50"
                        : "text-gray-600 hover:text-eco-700 hover:bg-eco-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t">
                <Button asChild className="w-full eco-gradient text-white">
                  <Link to="/report" onClick={() => setOpen(false)}>
                    Report Waste Now
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
