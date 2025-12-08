import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Home, LayoutGrid, Target, LineChart, Users, Briefcase } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/services", label: "Services", icon: LayoutGrid },
    { path: "/goals", label: "Goals", icon: Target },
    { path: "/markets", label: "Markets", icon: LineChart },
    { path: "/family", label: "Family", icon: Users },
    { path: "/business", label: "Business", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      {!isHomePage && (
        <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-lg shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-accent" />
                <span className="text-2xl font-bold gradient-text">Momentum</span>
              </Link>
              
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className="gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>

              <Button variant="gradient" size="sm">
                Get Started
              </Button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
