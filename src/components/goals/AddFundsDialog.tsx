import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface AddFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: any;
  onSuccess: () => void;
}

export const AddFundsDialog = ({ open, onOpenChange, goal, onSuccess }: AddFundsDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const addAmount = parseFloat(amount);
      if (addAmount <= 0) throw new Error("Amount must be greater than 0");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // 1. Update Goal Amount
      const newAmount = goal.current_amount + addAmount;
      const { error: goalError } = await supabase
        .from('goals')
        .update({ current_amount: newAmount })
        .eq('id', goal.id);

      if (goalError) throw goalError;

      // 2. Create Transaction Record
      // This will trigger the database function to update the linked financial account balance if needed
      // For now, we just log it as an 'expense' (contribution to goal) or 'transfer'
      const { error: txnError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: addAmount,
          transaction_type: 'expense', // Treating goal contribution as an expense from main account
          category: 'Goal Contribution',
          description: `Contribution to ${goal.title}`,
          transaction_date: new Date().toISOString()
        });

      if (txnError) throw txnError;

      toast({ title: "Funds added successfully!" });

      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["financialData"] });

      onSuccess();
      onOpenChange(false);
      setAmount("");
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Funds to {goal?.title}</DialogTitle>
          <DialogDescription>
            Current balance: ₹{goal?.current_amount.toLocaleString('en-IN')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Add (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10000"
              required
              min="1"
            />
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">New balance will be:</p>
              <p className="text-2xl font-bold">
                ₹{(goal.current_amount + parseFloat(amount)).toLocaleString('en-IN')}
              </p>
            </div>
          )}

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
              {loading ? "Adding..." : "Add Funds"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};