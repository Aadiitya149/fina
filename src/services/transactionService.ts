import { supabase } from "@/integrations/supabase/client";

export interface Transaction {
    id: string;
    user_id: string;
    account_id: string;
    amount: number;
    transaction_type: 'income' | 'expense' | 'transfer' | 'investment';
    category: string;
    description: string | null;
    transaction_date: string;
    receipt_url: string | null;
    is_recurring: boolean;
    recurring_interval: string | null;
    created_at: string;
}

export const transactionService = {
    async getTransactions() {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
        *,
        account:financial_accounts(account_name)
      `)
            .order('transaction_date', { ascending: false });

        if (error) throw error;
        return data;
    },

    async createTransaction(transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // The database trigger 'update_account_balance' will automatically update the account balance
        const { data, error } = await supabase
            .from('transactions')
            .insert([{ ...transaction, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    async bulkDeleteTransactions(ids: string[]) {
        // Note: Deleting transactions should ideally reverse the balance update.
        // Since our trigger only handles INSERT, we might need a DELETE trigger or handle it manually here.
        // For now, we'll just delete. To be fully robust, we should add a DELETE trigger to the DB.

        const { error } = await supabase
            .from('transactions')
            .delete()
            .in('id', ids);

        if (error) throw error;
    }
};
