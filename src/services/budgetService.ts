import { supabase } from "@/integrations/supabase/client";

export interface Budget {
    id: string;
    user_id: string;
    amount: number;
    last_alert_sent: string | null;
    created_at: string;
}

export const budgetService = {
    async getBudget() {
        const { data, error } = await supabase
            .from('budgets')
            .select('*')
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore 'Row not found'
        return data as Budget | null;
    },

    async updateBudget(amount: number) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Upsert: Update if exists, Insert if not
        const { data, error } = await supabase
            .from('budgets')
            .upsert({
                user_id: user.id,
                amount: amount,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' }) // Assuming one budget per user for now, or we need a unique constraint
            .select()
            .single();

        if (error) throw error;
        return data as Budget;
    }
};
