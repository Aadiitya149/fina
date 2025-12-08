import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: any;
  onSuccess: () => void;
}

export const GoalDialog = ({ open, onOpenChange, goal, onSuccess }: GoalDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: goal?.title || "",
    description: goal?.description || "",
    goal_type: goal?.goal_type || "retirement",
    target_amount: goal?.target_amount || "",
    current_amount: goal?.current_amount || "0",
    monthly_contribution: goal?.monthly_contribution || "",
    target_date: goal?.target_date || "",
    priority: goal?.priority || "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const goalData = {
        ...formData,
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount),
        monthly_contribution: parseFloat(formData.monthly_contribution),
        user_id: user.id,
        status: 'active',
      };

      if (goal?.id) {
        const { error } = await supabase
          .from('goals')
          .update(goalData)
          .eq('id', goal.id);
        if (error) throw error;
        toast({ title: "Goal updated successfully!" });
      } else {
        const { error } = await supabase
          .from('goals')
          .insert([goalData]);
        if (error) throw error;
        toast({ title: "Goal created successfully!" });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
          <DialogDescription>
            Set your financial goal and track your progress toward achieving it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Dream Home, Retirement Fund"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add details about your goal"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal_type">Goal Type</Label>
              <Select
                value={formData.goal_type}
                onValueChange={(value) => setFormData({ ...formData, goal_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retirement">Retirement</SelectItem>
                  <SelectItem value="home">Home Purchase</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="emergency">Emergency Fund</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_amount">Target Amount (₹)</Label>
              <Input
                id="target_amount"
                type="number"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                placeholder="5000000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_amount">Current Amount (₹)</Label>
              <Input
                id="current_amount"
                type="number"
                value={formData.current_amount}
                onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_contribution">Monthly Contribution (₹)</Label>
              <Input
                id="monthly_contribution"
                type="number"
                value={formData.monthly_contribution}
                onChange={(e) => setFormData({ ...formData, monthly_contribution: e.target.value })}
                placeholder="25000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_date">Target Date</Label>
              <Input
                id="target_date"
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="gradient" disabled={loading} className="flex-1">
              {loading ? "Saving..." : goal ? "Update Goal" : "Create Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};