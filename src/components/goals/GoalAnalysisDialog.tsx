import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, DollarSign, Percent } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GoalAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: any;
}

export const GoalAnalysisDialog = ({ open, onOpenChange, goal }: GoalAnalysisDialogProps) => {
  const [projections, setProjections] = useState<any[]>([]);

  useEffect(() => {
    if (open && goal) {
      calculateProjections();
    }
  }, [open, goal]);

  const calculateProjections = () => {
    if (!goal) return;

    const currentAmount = Number(goal.current_amount);
    const monthlyContribution = Number(goal.monthly_contribution);
    const annualReturnRate = 0.08; // Assuming 8% annual return for investment recommendations
    const monthlyReturnRate = annualReturnRate / 12;

    const periods = [
      { label: "3 Months (Quarter)", months: 3 },
      { label: "6 Months (Half Year)", months: 6 },
      { label: "1 Year", months: 12 },
      { label: "2 Years", months: 24 },
      { label: "5 Years", months: 60 },
      { label: "10 Years", months: 120 },
    ];

    const calculated = periods.map(period => {
      // Future Value of a Series formula: FV = P * ((1 + r)^n - 1) / r
      // Plus Future Value of initial amount: FV_initial = PV * (1 + r)^n

      const n = period.months;
      const r = monthlyReturnRate;

      const fvContributions = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
      const fvInitial = currentAmount * Math.pow(1 + r, n);
      const totalProjected = fvInitial + fvContributions;

      const totalInvested = currentAmount + (monthlyContribution * n);
      const percentIncrease = ((totalProjected - currentAmount) / currentAmount) * 100;
      const amountToSave = monthlyContribution * n;

      return {
        label: period.label,
        amountToSave: amountToSave,
        projectedAmount: totalProjected,
        percentIncrease: percentIncrease,
        investmentGain: totalProjected - totalInvested
      };
    });

    setProjections(calculated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Goal Projections & Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-secondary/10 p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2">Analysis for: {goal?.title}</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Amount:</span>
                <p className="font-medium">₹{Number(goal?.current_amount).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Monthly Contribution:</span>
                <p className="font-medium">₹{Number(goal?.monthly_contribution).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Target Amount:</span>
                <p className="font-medium">₹{Number(goal?.target_amount).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Time Period</TableHead>
                  <TableHead>Amount to Save</TableHead>
                  <TableHead>Projected Value (8% Return)</TableHead>
                  <TableHead>Growth %</TableHead>
                  <TableHead className="text-right">Investment Gain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projections.map((proj, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {proj.label}
                    </TableCell>
                    <TableCell>₹{proj.amountToSave.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</TableCell>
                    <TableCell className="font-bold text-primary">
                      ₹{proj.projectedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="text-success">
                      <div className="flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        {proj.percentIncrease.toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-success font-medium">
                      +₹{proj.investmentGain.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close Analysis
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};