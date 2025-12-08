import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Layers, Activity, Brain, PieChart, TrendingUp, ShieldAlert, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const HolisticManagement = () => {
    const [showAddAsset, setShowAddAsset] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [rebalancing, setRebalancing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [rebalanceResult, setRebalanceResult] = useState<any>(null);

    // Mock data for visualizations (Initial state)
    const [assetAllocation, setAssetAllocation] = useState([
        { name: "Public Markets", value: 45, color: "#3b82f6" },
        { name: "Real Estate", value: 25, color: "#10b981" },
        { name: "Private Equity", value: 15, color: "#8b5cf6" },
        { name: "Crypto & DeFi", value: 10, color: "#f59e0b" },
        { name: "Collectibles", value: 5, color: "#ec4899" },
    ]);

    const riskData = [
        { name: "Real Estate", risk: 30, return: 12 },
        { name: "Stocks", risk: 65, return: 18 },
        { name: "Crypto", risk: 85, return: 45 },
        { name: "Bonds", risk: 10, return: 4 },
    ];

    const handleAnalyze = async () => {
        setAnalyzing(true);
        try {
            const { data, error } = await supabase.functions.invoke('analyze-portfolio', {
                body: { assets: assetAllocation }
            });

            if (error) throw error;
            setAnalysisResult(data);
            toast.success("Portfolio analysis complete");
        } catch (error: any) {
            toast.error("Analysis failed: " + error.message);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleRebalance = async () => {
        setRebalancing(true);
        try {
            const { data, error } = await supabase.functions.invoke('rebalance-portfolio', {
                body: { portfolio: assetAllocation }
            });

            if (error) throw error;
            setRebalanceResult(data);
            toast.success("Risk Officer evaluation complete");
        } catch (error: any) {
            toast.error("Rebalancing check failed: " + error.message);
        } finally {
            setRebalancing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                            <Layers className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-primary">Total Wealth Integration</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            Holistic Assets <span className="gradient-text">Management</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Beyond simple aggregation. Experience full multi-asset integration, real-time risk engines,
                            and AI-driven cross-portfolio optimization for your entire net worth.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Features Grid */}
            <section className="py-16 container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1: Multi-Asset Integration */}
                    <Card className="p-8 space-y-6 border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
                        <div className="flex justify-between items-start">
                            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                <PieChart className="h-7 w-7 text-blue-500" />
                            </div>
                            <Dialog open={showAddAsset} onOpenChange={setShowAddAsset}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <Plus className="h-4 w-4" /> Add Asset
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Asset</DialogTitle>
                                        <DialogDescription>Integrate a new asset class into your holistic view.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Asset Type</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="crypto">Crypto & DeFi</SelectItem>
                                                    <SelectItem value="real_estate">Real Estate</SelectItem>
                                                    <SelectItem value="pe">Private Equity</SelectItem>
                                                    <SelectItem value="collectibles">Collectibles</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Identifier / Symbol</Label>
                                            <Input placeholder="e.g. BTC, Property Address" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Estimated Value (USD)</Label>
                                            <Input type="number" placeholder="0.00" />
                                        </div>
                                        <Button className="w-full" onClick={() => {
                                            toast.success("Asset added to normalization layer");
                                            setShowAddAsset(false);
                                        }}>Integrate Asset</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <h3 className="text-2xl font-bold">Multi-Asset Integration</h3>
                        <p className="text-muted-foreground">
                            Integrate public markets, private equity, real estate, crypto, DeFi, and collectibles.
                        </p>

                        <div className="h-48 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={assetAllocation}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {assetAllocation.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>

                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={handleAnalyze}
                            disabled={analyzing}
                        >
                            {analyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
                            Analyze Portfolio
                        </Button>

                        {analysisResult && analysisResult.risk_officer_insight && (
                            <div className="bg-secondary/20 p-3 rounded text-sm mt-4">
                                <p className="font-semibold text-primary">Executive Summary:</p>
                                <p className="text-muted-foreground text-xs mt-1">
                                    {analysisResult.risk_officer_insight.executive_summary}
                                </p>
                                {analysisResult.risk_officer_insight.vulnerabilities?.length > 0 && (
                                    <div className="mt-2">
                                        <p className="font-semibold text-red-400 text-xs">Vulnerabilities:</p>
                                        <ul className="list-disc pl-4 text-xs text-muted-foreground">
                                            {analysisResult.risk_officer_insight.vulnerabilities.map((v: string, i: number) => (
                                                <li key={i}>{v}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Feature 2: Real-Time Risk Engine */}
                    <Card className="p-8 space-y-6 border-red-500/20 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
                        <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                            <Activity className="h-7 w-7 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold">Real-Time Risk Engine</h3>
                        <p className="text-muted-foreground">
                            Continuous risk analysis and NAV updates across all positions.
                            Live diversification scores and correlation modeling.
                        </p>

                        {analysisResult?.metrics && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between bg-red-500/10 px-3 py-2 rounded-lg">
                                    <div className="flex items-center gap-2 text-red-400">
                                        <Activity className="h-4 w-4" />
                                        <span className="text-sm font-medium">Portfolio Volatility</span>
                                    </div>
                                    <span className="font-mono font-bold text-red-500">
                                        {(analysisResult.metrics.volatility_annual * 100).toFixed(1)}%
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-background/50 p-2 rounded text-center">
                                        <span className="block text-xs text-muted-foreground">Sharpe Ratio</span>
                                        <span className="font-mono font-bold text-lg">{analysisResult.metrics.sharpe_ratio}</span>
                                    </div>
                                    <div className="bg-background/50 p-2 rounded text-center">
                                        <span className="block text-xs text-muted-foreground">Diversification</span>
                                        <span className="font-mono font-bold text-lg">{analysisResult.metrics.diversification_score}/100</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="h-48 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={riskData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="risk" fill="#ef4444" radius={[4, 4, 0, 0]} name="Risk Score" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Feature 3: Intelligent Rebalancing */}
                    <Card className="p-8 space-y-6 border-purple-500/20 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
                        <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                            <Brain className="h-7 w-7 text-purple-500" />
                        </div>
                        <h3 className="text-2xl font-bold">Intelligent Rebalancing</h3>
                        <p className="text-muted-foreground">
                            AI "Risk Officer" identifies allocation drift and suggests tax-optimized rebalancing moves with safety circuit breakers.
                        </p>

                        <Button
                            variant="outline"
                            className="w-full border-purple-500/50 text-purple-500 hover:bg-purple-500/10"
                            onClick={handleRebalance}
                            disabled={rebalancing}
                        >
                            {rebalancing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
                            Check Rebalancing
                        </Button>

                        {rebalanceResult && rebalanceResult.risk_officer_insight && (
                            <div className="bg-secondary/20 p-4 rounded-lg space-y-4 mt-4 border border-purple-500/20">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-purple-400">Risk Assessment</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${rebalanceResult.risk_officer_insight.risk_assessment === 'Critical' || rebalanceResult.risk_officer_insight.risk_assessment === 'High'
                                        ? 'bg-red-500/20 text-red-500'
                                        : 'bg-green-500/20 text-green-500'
                                        }`}>
                                        {rebalanceResult.risk_officer_insight.risk_assessment}
                                    </span>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    <p className="font-semibold text-foreground mb-1">Executive Summary:</p>
                                    {rebalanceResult.risk_officer_insight.executive_summary}
                                </div>

                                {rebalanceResult.metrics && (
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-background/50 p-2 rounded">
                                            <span className="block text-muted-foreground">Sharpe Ratio</span>
                                            <span className="font-mono font-bold">{rebalanceResult.metrics.sharpe_ratio}</span>
                                        </div>
                                        <div className="bg-background/50 p-2 rounded">
                                            <span className="block text-muted-foreground">VaR (95%)</span>
                                            <span className="font-mono font-bold text-red-400">
                                                ${Math.round(rebalanceResult.metrics.var_95_monthly).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {rebalanceResult.risk_officer_insight.tactical_actions?.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-purple-400">Tactical Actions:</p>
                                        <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                                            {rebalanceResult.risk_officer_insight.tactical_actions.map((action: string, i: number) => (
                                                <li key={i}>{action}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-16 bg-card/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Holistic Management?</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full max-w-4xl mx-auto border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Feature</th>
                                    <th className="text-left py-4 px-6 text-primary font-bold">Holistic Management</th>
                                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Traditional Advisory</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border/50">
                                    <td className="py-4 px-6 font-medium">Asset Coverage</td>
                                    <td className="py-4 px-6 text-foreground">All (Public, Private, Crypto, Real Estate)</td>
                                    <td className="py-4 px-6 text-muted-foreground">Public Markets Only</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-4 px-6 font-medium">Risk Monitoring</td>
                                    <td className="py-4 px-6 text-foreground">Real-Time & Cross-Asset</td>
                                    <td className="py-4 px-6 text-muted-foreground">Periodic Reviews</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-4 px-6 font-medium">Rebalancing</td>
                                    <td className="py-4 px-6 text-foreground">AI-Driven & Tax-Optimized</td>
                                    <td className="py-4 px-6 text-muted-foreground">Manual / Annual</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Entire Portfolio?</h2>
                    <Link to="/dashboard">
                        <Button size="lg" variant="gradient" className="gap-2 text-lg">
                            Go to Dashboard
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HolisticManagement;
