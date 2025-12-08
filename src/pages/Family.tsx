import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Heart, GraduationCap, Home, Shield, Plus } from "lucide-react";

const Family = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Family Wealth Hub</h1>
            <p className="text-muted-foreground text-lg">
              Plan, protect, and grow your family's financial future together
            </p>
          </div>
          <Button variant="gradient" size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add Family Member
          </Button>
        </div>

        {/* Family Overview */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-momentum text-white">
            <Users className="h-8 w-8 mb-3" />
            <p className="text-white/80 text-sm mb-1">Family Members</p>
            <p className="text-3xl font-bold">4</p>
          </Card>

          <Card className="p-6">
            <Heart className="h-8 w-8 text-success mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Shared Goals</p>
            <p className="text-3xl font-bold">5</p>
          </Card>

          <Card className="p-6">
            <Shield className="h-8 w-8 text-accent mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Insurance Coverage</p>
            <p className="text-3xl font-bold">₹2.5Cr</p>
          </Card>

          <Card className="p-6">
            <GraduationCap className="h-8 w-8 text-warning mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Education Fund</p>
            <p className="text-3xl font-bold">₹12L</p>
          </Card>
        </div>

        {/* Shared Goals */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Shared Family Goals</h2>
            <Button variant="outline">View All Goals</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-secondary/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Home className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Family Vacation Home</h3>
                  <p className="text-sm text-muted-foreground">Target: 2027</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold">32%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Saved</p>
                  <p className="text-2xl font-bold">₹48L</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-secondary/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Children's Higher Education</h3>
                  <p className="text-sm text-muted-foreground">Target: 2030</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold">18%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Saved</p>
                  <p className="text-2xl font-bold">₹14.4L</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Education Planner */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Child Education Planner</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-momentum text-white flex items-center justify-center font-bold">
                  AK
                </div>
                <div>
                  <p className="font-bold">Aarav Kumar</p>
                  <p className="text-sm text-muted-foreground">Age 8 • Grade 3</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Estimated Cost (Engineering)</p>
                <p className="text-xl font-bold">₹45L by 2033</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-success text-white flex items-center justify-center font-bold">
                  SK
                </div>
                <div>
                  <p className="font-bold">Siya Kumar</p>
                  <p className="text-sm text-muted-foreground">Age 5 • Kindergarten</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Estimated Cost (Medicine)</p>
                <p className="text-xl font-bold">₹65L by 2036</p>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-6">
            Customize Education Plans
          </Button>
        </Card>

        {/* Estate Planning */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-xl font-bold">Estate Planning Primer</h3>
              <p className="text-muted-foreground">
                Secure your family's future with proper estate planning. Learn about wills, trusts, 
                nomination of beneficiaries, and how to leave a lasting legacy. Our tools help you 
                organize important documents and understand the basics of succession planning.
              </p>
              <div className="flex gap-3">
                <Button variant="gradient">
                  Start Estate Planning
                </Button>
                <Button variant="outline">
                  Educational Resources
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Family Insights */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Insurance Review</h3>
            <p className="text-muted-foreground mb-4">
              Your family's insurance coverage is comprehensive. Consider reviewing life insurance 
              policies annually as your needs change.
            </p>
            <Button variant="outline" className="w-full">
              Review Coverage
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Tax Optimization</h3>
            <p className="text-muted-foreground mb-4">
              Maximize tax benefits by utilizing family members' exemption limits and investing 
              in tax-saving instruments strategically.
            </p>
            <Button variant="outline" className="w-full">
              View Tax Strategies
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Family;
