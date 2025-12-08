import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinancialData } from "@/hooks/useFinancialData";
import { ArrowUpRight, ArrowDownRight, Wallet, Target, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { AddTransactionDrawer } from "@/components/transactions/AddTransactionDrawer";
import { useQuery } from "@tanstack/react-query";
import { accountService } from "@/services/accountService";
import { transactionService } from "@/services/transactionService";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { data: financialData, isLoading: financialLoading } = useFinancialData();

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.getAccounts
  });

  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: transactionService.getTransactions
  });

  if (financialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate recent spending for chart
  const chartData = transactions?.slice(0, 7).reverse().map((t: any) => ({
    name: new Date(t.transaction_date).toLocaleDateString('en-IN', { weekday: 'short' }),
    amount: t.amount
  })) || [];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Financial Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Welcome back! Here's your financial overview.
            </p>
          </div>
          <div className="flex gap-4">
            <AddTransactionDrawer accounts={accounts || []} />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Net Worth</span>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">
              ₹{(financialData?.netWorth || 0).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center text-sm text-success">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +2.5% from last month
            </div>
          </Card>

          <Card className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monthly Savings</span>
              <DollarSign className="h-4 w-4 text-success" />
            </div>
            <div className="text-2xl font-bold">
              ₹{(financialData?.monthlySavings || 0).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center text-sm text-success">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +12% from last month
            </div>
          </Card>

          <Card className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Goals</span>
              <Target className="h-4 w-4 text-accent" />
            </div>
            <div className="text-2xl font-bold">{financialData?.activeGoals || 0}</div>
            <div className="text-sm text-muted-foreground">
              {financialData?.goalsProgress}% average completion
            </div>
          </Card>

          <Card className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monthly Change</span>
              <TrendingUp className="h-4 w-4 text-warning" />
            </div>
            <div className="text-2xl font-bold">
              ₹{(financialData?.monthlyChange || 0).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              vs last month
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Spending Chart */}
          <Card className="md:col-span-2 p-6">
            <h3 className="text-xl font-bold mb-6">Recent Spending</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {transactions?.slice(0, 5).map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${t.transaction_type === 'income' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                      }`}>
                      {t.transaction_type === 'income' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(t.transaction_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${t.transaction_type === 'income' ? 'text-success' : 'text-foreground'
                    }`}>
                    {t.transaction_type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
              {(!transactions || transactions.length === 0) && (
                <p className="text-center text-muted-foreground py-4">No recent transactions</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
