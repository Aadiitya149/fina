import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";
import { toast } from "sonner";
import { useState } from "react";
import { Plus } from "lucide-react";

const transactionSchema = z.object({
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be a positive number",
    }),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    transaction_date: z.string().min(1, "Date is required"),
    transaction_type: z.enum(["income", "expense"]),
    account_id: z.string().min(1, "Account is required"), // We'll need to fetch accounts to populate this
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function AddTransactionDrawer({ accounts }: { accounts: any[] }) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            transaction_type: "expense",
            transaction_date: new Date().toISOString().split('T')[0],
        }
    });

    const createTransactionMutation = useMutation({
        mutationFn: transactionService.createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['financialData'] }); // Refresh dashboard data
            toast.success("Transaction added successfully");
            setOpen(false);
            reset();
        },
        onError: (error) => {
            toast.error(`Failed to add transaction: ${error.message}`);
        }
    });

    const onSubmit = (data: TransactionFormValues) => {
        createTransactionMutation.mutate({
            amount: Number(data.amount),
            description: data.description,
            category: data.category,
            transaction_date: new Date(data.transaction_date).toISOString(),
            transaction_type: data.transaction_type,
            account_id: data.account_id,
            receipt_url: null,
            is_recurring: false,
            recurring_interval: null,
        });
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Add Transaction
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Add New Transaction</DrawerTitle>
                        <DrawerDescription>Record your income or expense.</DrawerDescription>
                    </DrawerHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select onValueChange={(val) => setValue("transaction_type", val as any)} defaultValue="expense">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">Income</SelectItem>
                                    <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input id="amount" type="number" step="0.01" placeholder="0.00" {...register("amount")} />
                            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" placeholder="e.g. Grocery Shopping" {...register("description")} />
                            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select onValueChange={(val) => setValue("category", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Food">Food</SelectItem>
                                    <SelectItem value="Transport">Transport</SelectItem>
                                    <SelectItem value="Utilities">Utilities</SelectItem>
                                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                                    <SelectItem value="Salary">Salary</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="account">Account</Label>
                            <Select onValueChange={(val) => setValue("account_id", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts?.map((acc) => (
                                        <SelectItem key={acc.id} value={acc.id}>{acc.account_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.account_id && <p className="text-sm text-destructive">{errors.account_id.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" {...register("transaction_date")} />
                        </div>

                        <DrawerFooter>
                            <Button type="submit" disabled={createTransactionMutation.isPending}>
                                {createTransactionMutation.isPending ? "Adding..." : "Add Transaction"}
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
