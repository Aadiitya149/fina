import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Home, GraduationCap, Plane, Target, TrendingUp, Pencil, Trash2, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoalAnalysisDialog } from "./GoalAnalysisDialog";

interface GoalCardProps {
  goal: any;
  onEdit: () => void;
  onDelete: () => void;
  onAddFunds: () => void;
}

const goalIcons: Record<string, any> = {
  retirement: PiggyBank,
  home: Home,
  education: GraduationCap,
  travel: Plane,
  emergency: Target,
  other: TrendingUp,
};

export const GoalCard = ({ goal, onEdit, onDelete, onAddFunds }: GoalCardProps) => {
  const navigate = useNavigate();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const Icon = goalIcons[goal.goal_type] || Target;
  const progress = goal.target_amount > 0
    ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
    : 0;

  const getStatusColor = () => {
    if (progress >= 75) return "text-success bg-success/10 border-success/20";
    if (progress >= 50) return "text-accent bg-accent/10 border-accent/20";
    if (progress >= 25) return "text-warning bg-warning/10 border-warning/20";
    return "text-muted-foreground bg-muted/10 border-muted/20";
  };

  const getStatusText = () => {
    if (progress >= 75) return "Ahead of Schedule";
    if (progress >= 50) return "On Track";
    if (progress >= 25) return "Making Progress";
    return "Needs Attention";
  };

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
        {/* Lock Indicator for visual flair */}
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Lock className="h-24 w-24" />
        </div>

        <div className="space-y-6 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{goal.title}</h3>
                <p className="text-muted-foreground">
                  Target: {new Date(goal.target_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
            {getStatusText()}
          </span>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Amount</p>
              <p className="text-xl font-bold">
                ₹{(goal.current_amount / 100000).toFixed(1)}L
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Target Amount</p>
              <p className="text-xl font-bold">
                ₹{(goal.target_amount / 100000).toFixed(1)}L
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Monthly SIP</p>
              <p className="text-xl font-bold">
                ₹{goal.monthly_contribution.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {goal.description && (
            <p className="text-sm text-muted-foreground pt-2">{goal.description}</p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowAnalysis(true)}>
              View Analysis
            </Button>
            <Button variant="gradient" className="flex-1" onClick={onAddFunds}>
              Add Funds
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => navigate('/jailbreak', { state: { goal } })}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </Card>

      <GoalAnalysisDialog
        open={showAnalysis}
        onOpenChange={setShowAnalysis}
        goal={goal}
      />
    </>
  );
};