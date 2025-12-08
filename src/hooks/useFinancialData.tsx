import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FinancialData {
    netWorth: number;
    monthlyChange: number;
    goalsProgress: number;
    activeGoals: number;
    monthlySavings: number;
    savingsTargetProgress: number;
}

export const useFinancialData = () => {
    return useQuery({
        queryKey: ["financialData"],
        queryFn: async (): Promise<FinancialData> => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            // 1. Fetch Accounts for Net Worth
            const { data: accounts, error: accountsError } = await supabase
                .from("financial_accounts")
                .select("balance")
                .eq("user_id", user.id);

            if (accountsError) throw accountsError;

            const netWorth = accounts?.reduce((sum, acc) => sum + Number(acc.balance), 0) || 0;

            // 2. Fetch Goals for Progress
            const { data: goals, error: goalsError } = await supabase
                .from("goals")
                .select("target_amount, current_amount, status")
                .eq("user_id", user.id)
                .eq("status", "active");

            if (goalsError) throw goalsError;

            const activeGoals = goals?.length || 0;
            const totalTarget = goals?.reduce((sum, g) => sum + Number(g.target_amount), 0) || 0;
            const totalCurrent = goals?.reduce((sum, g) => sum + Number(g.current_amount), 0) || 0;
            const goalsProgress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

            // 3. Fetch Transactions for Monthly Savings (Income - Expenses)
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const { data: transactions, error: txError } = await supabase
                .from("transactions")
                .select("amount, transaction_type")
                .eq("user_id", user.id)
                .gte("transaction_date", startOfMonth.toISOString());

            if (txError) throw txError;

            const income = transactions
                ?.filter((t) => t.transaction_type === "income")
                .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

            const expenses = transactions
                ?.filter((t) => t.transaction_type === "expense")
                .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

            const monthlySavings = income - expenses;

            // Mocking monthly change % and savings target progress for now
            // In a real app, you'd compare with last month's data
            const monthlyChange = 2.5;
            const savingsTargetProgress = 15; // 15% above target

            return {
                netWorth,
                monthlyChange,
                goalsProgress,
                activeGoals,
                monthlySavings,
                savingsTargetProgress,
            };
        },
    });
};
