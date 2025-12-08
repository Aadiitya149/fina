import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const AuthPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigate("/dashboard");
            }
            setLoading(false);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                navigate("/dashboard");
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="mx-auto h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome to Momentum</h1>
                    <p className="text-muted-foreground">Sign in to access your financial dashboard</p>
                </div>

                <Card className="p-6 border-accent/20">
                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: 'hsl(var(--primary))',
                                        brandAccent: 'hsl(var(--primary))',
                                    },
                                },
                            },
                        }}
                        providers={[]}
                        theme="dark"
                    />
                </Card>
            </div>
        </div>
    );
};

export default AuthPage;
