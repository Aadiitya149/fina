import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountService } from "@/services/accountService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const accountSchema = z.object({
    account_name: z.string().min(1, "Bank Name is required"),
    account_number: z.string().optional(), // Using this as 'description' or note internally if needed, or just a placeholder
    balance: z.string().refine((val) => !isNaN(Number(val)), {
        message: "Amount must be a number",
    }),
});

type AccountFormValues = z.infer<typeof accountSchema>;

interface AddAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddAccountDialog({ open, onOpenChange }: AddAccountDialogProps) {
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
    });

    const createAccountMutation = useMutation({
        mutationFn: accountService.createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['financialData'] });
            toast.success("Account added successfully");
            onOpenChange(false);
            reset();
        },
        onError: (error) => {
            toast.error(`Failed to add account: ${error.message}`);
        }
    });

    const onSubmit = (data: AccountFormValues) => {
        // Mapping form fields to DB schema
        // 'account_number' from form isn't in our schema, so we'll append it to name or ignore it.
        // Let's assume the user wants it stored. We can put it in the name like "HDFC - 1234"
        // or we can add a column. For now, let's append to name for simplicity as per schema constraints.
        const fullName = data.account_number
            ? `${data.account_name} (${data.account_number})`
            : data.account_name;

        createAccountMutation.mutate({
            account_name: fullName,
            account_type: 'checking', // Defaulting to checking for this generic form
            balance: Number(data.balance),
            is_default: false,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Financial Account</DialogTitle>
                    <DialogDescription>
                        Enter your account details to track your wealth.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input id="bankName" placeholder="e.g. HDFC Bank" {...register("account_name")} />
                        {errors.account_name && <p className="text-sm text-destructive">{errors.account_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number (Last 4 digits)</Label>
                        <Input id="accountNumber" placeholder="e.g. 4567" {...register("account_number")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount">Current Balance</Label>
                        <Input id="amount" type="number" placeholder="0.00" {...register("balance")} />
                        {errors.balance && <p className="text-sm text-destructive">{errors.balance.message}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={createAccountMutation.isPending}>
                            {createAccountMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Account
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
