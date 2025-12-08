import { supabase } from "@/integrations/supabase/client";

export interface Account {
    id: string;
    user_id: string;
    account_name: string;
    account_type: 'checking' | 'savings' | 'investment' | 'retirement' | 'crypto';
    balance: number;
    is_default: boolean;
    created_at: string;
}

export const accountService = {
    async getAccounts() {
        const { data, error } = await supabase
            .from('financial_accounts')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as Account[];
    },

    async createAccount(account: Omit<Account, 'id' | 'user_id' | 'created_at'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('financial_accounts')
            .insert([{ ...account, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        return data as Account;
    },

    async updateAccount(id: string, updates: Partial<Account>) {
        const { data, error } = await supabase
            .from('financial_accounts')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Account;
    }
};
