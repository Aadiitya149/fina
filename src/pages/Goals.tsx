import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, PiggyBank, TrendingUp, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GoalDialog } from "@/components/goals/GoalDialog";
import { GoalCard } from "@/components/goals/GoalCard";
import { AddFundsDialog } from "@/components/goals/AddFundsDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Goals = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [addFundsGoal, setAddFundsGoal] = useState<any>(null);
  const [deleteGoal, setDeleteGoal] = useState<any>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading goals",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (goal: any) => {
    setSelectedGoal(goal);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedGoal(null);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteGoal) return;

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', deleteGoal.id);

      if (error) throw error;

      toast({ title: "Goal deleted successfully" });
      fetchGoals();
    } catch (error: any) {
      toast({
        title: "Error deleting goal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteGoal(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Financial Goals</h1>
            <p className="text-muted-foreground text-lg">
              Track your progress toward the life you envision
            </p>
          </div>
          <Button variant="gradient" size="lg" className="gap-2" onClick={handleAddNew}>
            <Plus className="h-5 w-5" />
            Add New Goal
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-momentum text-white">
            <div className="space-y-2">
              <Target className="h-8 w-8" />
              <p className="text-white/80 text-sm">Active Goals</p>
              <p className="text-3xl font-bold">{goals.length}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-2">
              <TrendingUp className="h-8 w-8 text-success" />
              <p className="text-sm text-muted-foreground">Total Target</p>
              <p className="text-2xl font-bold">
                ₹{(goals.reduce((acc, g) => acc + g.target_amount, 0) / 10000000).toFixed(1)}Cr
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-2">
              <PiggyBank className="h-8 w-8 text-accent" />
              <p className="text-sm text-muted-foreground">Current Savings</p>
              <p className="text-2xl font-bold">
                ₹{(goals.reduce((acc, g) => acc + g.current_amount, 0) / 10000000).toFixed(1)}Cr
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-2">
              <Target className="h-8 w-8 text-warning" />
              <p className="text-sm text-muted-foreground">Monthly Contribution</p>
              <p className="text-2xl font-bold">
                ₹{goals.reduce((acc, g) => acc + g.monthly_contribution, 0).toLocaleString('en-IN')}
              </p>
            </div>
          </Card>
        </div>

        {goals.length === 0 ? (
          <Card className="p-12 text-center">
            <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Goals Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start your financial journey by creating your first goal
            </p>
            <Button variant="gradient" onClick={handleAddNew}>
              Create Your First Goal
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={() => handleEdit(goal)}
                onDelete={() => setDeleteGoal(goal)}
                onAddFunds={() => setAddFundsGoal(goal)}
              />
            ))}
          </div>
        )}

        {goals.length > 0 && (
          <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-bold">AI-Powered Goal Analysis</h3>
                <p className="text-muted-foreground">
                  Click "View Analysis" on any goal to get personalized AI-powered insights including probability forecasts, 
                  risk assessment, and recommendations to improve your chances of success.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <GoalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        goal={selectedGoal}
        onSuccess={fetchGoals}
      />

      {addFundsGoal && (
        <AddFundsDialog
          open={!!addFundsGoal}
          onOpenChange={(open) => !open && setAddFundsGoal(null)}
          goal={addFundsGoal}
          onSuccess={fetchGoals}
        />
      )}

      <AlertDialog open={!!deleteGoal} onOpenChange={(open) => !open && setDeleteGoal(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteGoal?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Goals;
