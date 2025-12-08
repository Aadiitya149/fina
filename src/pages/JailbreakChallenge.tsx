import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, ArrowRight, ShieldAlert, HeartCrack, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const JailbreakChallenge = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [impactAnalysis, setImpactAnalysis] = useState("");

    const goal = location.state?.goal;

    if (!goal) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-8 text-center space-y-4">
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                    <h2 className="text-xl font-bold">No Goal Selected</h2>
                    <p className="text-muted-foreground">Please select a goal to withdraw from.</p>
                    <Button onClick={() => navigate("/goals")}>Return to Goals</Button>
                </Card>
            </div>
        );
    }

    const handleProceed = async () => {
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else {
            // Final withdrawal logic
            setLoading(true);
            try {
                const { data, error } = await supabase.functions.invoke('process-jailbreak', {
                    body: {
                        goalId: goal.id,
                        amount: goal.current_amount, // For now, assuming full withdrawal or logic handles it
                        reason: reason
                    }
                });

                if (error) throw error;

                setImpactAnalysis(data.impact);

                toast({
                    title: "Withdrawal Processed",
                    description: "Funds have been released. The impact has been recorded.",
                    variant: "destructive"
                });

                navigate("/goals");

            } catch (error: any) {
                toast({
                    title: "Error Processing Withdrawal",
                    description: error.message || "Something went wrong.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCancel = () => {
        toast({
            title: "Crisis Averted!",
            description: "Your future self thanks you for staying on track.",
            variant: "default",
        });
        navigate("/goals");
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
            <div className="max-w-2xl w-full space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="mx-auto h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center animate-pulse">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>
                    <h1 className="text-4xl font-bold text-destructive">Financial Jailbreak Protocol</h1>
                    <p className="text-xl text-muted-foreground">
                        You are attempting to access locked funds from <span className="font-bold text-foreground">{goal.title}</span>.
                    </p>
                </div>

                {/* Dynamic Mortality Multiplier Card */}
                <Card className="p-8 border-destructive/50 bg-gradient-to-b from-background to-destructive/5">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Clock className="h-8 w-8 text-destructive" />
                            <h2 className="text-2xl font-bold">Dynamic Mortality Multiplier</h2>
                        </div>

                        <div className="p-6 bg-background/50 rounded-lg border border-destructive/20">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-muted-foreground">Withdrawal Amount</span>
                                <span className="font-bold text-xl">₹{goal.current_amount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="h-px bg-border my-4" />
                            <div className="flex items-center justify-between text-destructive">
                                <span className="font-semibold">Impact on Age of Ruin</span>
                                <span className="font-bold text-2xl">-2.4 Years</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">
                                Withdrawing this amount now will deplete your retirement funds
                                <span className="font-bold text-destructive"> 2 years and 5 months </span>
                                earlier than planned.
                            </p>
                        </div>

                        {step === 1 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Why are you breaking the seal?</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {["Medical Emergency", "Education Opportunity", "Impulse Purchase", "Other Investment"].map((r) => (
                                        <Button
                                            key={r}
                                            variant="outline"
                                            className={`justify-start h-12 ${reason === r ? 'border-destructive text-destructive bg-destructive/10' : ''}`}
                                            onClick={() => setReason(r)}
                                        >
                                            {r}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-3 text-warning">
                                    <ShieldAlert className="h-6 w-6" />
                                    <h3 className="text-lg font-semibold">Behavioral Check: Present Bias Detected</h3>
                                </div>
                                <p className="text-muted-foreground">
                                    Our analysis suggests you might be valuing immediate gratification over long-term security.
                                    If this is an "Impulse Purchase", waiting just 72 hours usually reduces the urge by 80%.
                                </p>
                                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                                    <p className="font-medium text-accent">
                                        Challenge: Can you wait 3 days?
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-3 text-destructive">
                                    <HeartCrack className="h-6 w-6" />
                                    <h3 className="text-lg font-semibold">Final Confirmation</h3>
                                </div>
                                <p className="text-muted-foreground">
                                    You are about to permanently impact your financial future. This action cannot be undone.
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel & Keep Momentum
                    </Button>

                    <Button
                        variant="destructive"
                        size="lg"
                        className="w-full sm:w-auto gap-2"
                        onClick={handleProceed}
                        disabled={(step === 1 && !reason) || loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {step === 3 ? "I Accept the Cost - Withdraw" : "Proceed Anyway"}
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default JailbreakChallenge;
