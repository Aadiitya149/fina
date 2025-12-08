import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, TrendingUp, DollarSign, PieChart, Activity, BarChart3 } from "lucide-react";

const Business = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Business Finance Hub</h1>
          <p className="text-muted-foreground text-lg">
            Powerful tools for entrepreneurs and small business owners
          </p>
        </div>

        {/* Business Overview */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-momentum text-white">
            <Briefcase className="h-8 w-8 mb-3" />
            <p className="text-white/80 text-sm mb-1">Monthly Revenue</p>
            <p className="text-3xl font-bold">₹8.5L</p>
          </Card>

          <Card className="p-6">
            <TrendingUp className="h-8 w-8 text-success mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Profit Margin</p>
            <p className="text-3xl font-bold">24%</p>
          </Card>

          <Card className="p-6">
            <DollarSign className="h-8 w-8 text-accent mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Cash Flow</p>
            <p className="text-3xl font-bold">₹2.1L</p>
          </Card>

          <Card className="p-6">
            <PieChart className="h-8 w-8 text-warning mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Operating Costs</p>
            <p className="text-3xl font-bold">₹6.4L</p>
          </Card>
        </div>

        {/* Cash Flow Analysis */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Cash Flow Analysis</h2>
              <p className="text-muted-foreground">Income - Expenses = Cash Flow</p>
            </div>
            <Button variant="outline">Export Report</Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-success/10 border border-success/20">
              <Activity className="h-8 w-8 text-success mb-3" />
              <p className="text-sm text-muted-foreground mb-2">Total Income</p>
              <p className="text-3xl font-bold text-success">₹8,50,000</p>
              <p className="text-sm text-muted-foreground mt-2">This month</p>
            </div>

            <div className="p-6 rounded-lg bg-destructive/10 border border-destructive/20">
              <Activity className="h-8 w-8 text-destructive mb-3" />
              <p className="text-sm text-muted-foreground mb-2">Total Expenses</p>
              <p className="text-3xl font-bold text-destructive">₹6,40,000</p>
              <p className="text-sm text-muted-foreground mt-2">This month</p>
            </div>

            <div className="p-6 rounded-lg bg-accent/10 border border-accent/20">
              <Activity className="h-8 w-8 text-accent mb-3" />
              <p className="text-sm text-muted-foreground mb-2">Net Cash Flow</p>
              <p className="text-3xl font-bold text-accent">₹2,10,000</p>
              <p className="text-sm text-success mt-2">+15% vs last month</p>
            </div>
          </div>
        </Card>

        {/* Expense Breakdown */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Expense Breakdown</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Salaries & Wages</p>
                  <p className="text-sm text-muted-foreground">Employee compensation</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">₹3,20,000</p>
                <p className="text-sm text-muted-foreground">50% of expenses</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">Rent & Utilities</p>
                  <p className="text-sm text-muted-foreground">Office space & services</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">₹1,20,000</p>
                <p className="text-sm text-muted-foreground">19% of expenses</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-semibold">Marketing & Advertising</p>
                  <p className="text-sm text-muted-foreground">Customer acquisition</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">₹85,000</p>
                <p className="text-sm text-muted-foreground">13% of expenses</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold">Other Expenses</p>
                  <p className="text-sm text-muted-foreground">Miscellaneous costs</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">₹1,15,000</p>
                <p className="text-sm text-muted-foreground">18% of expenses</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Financial Calculators */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <h3 className="text-xl font-bold">Profit Margin Calculator</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Calculate your business profit margin: Net Income / Sales
            </p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Margin:</span>
                <span className="font-bold text-success">24%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Industry Average:</span>
                <span className="font-bold">18%</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Run Analysis
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Break-Even Analysis</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Determine the minimum sales needed to cover all costs
            </p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Break-Even Point:</span>
                <span className="font-bold text-accent">₹5.2L/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Sales:</span>
                <span className="font-bold text-success">₹8.5L/month</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Calculate Details
            </Button>
          </Card>
        </div>

        {/* AI Business Insights */}
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-xl font-bold">Business Intelligence Insights</h3>
              <p className="text-muted-foreground">
                Your business is performing well with a healthy profit margin of 24%, which is 
                above the industry average. Consider reinvesting 15% of profits into marketing 
                to accelerate growth, while maintaining a cash reserve of at least 3 months 
                of operating expenses for financial stability.
              </p>
              <Button variant="gradient">
                View Detailed Analysis
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Business;
