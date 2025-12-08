import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity, BarChart3, LineChart, Globe, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Markets = () => {
  // Fetch Market Indices
  const { data: marketIndices, isLoading: indicesLoading } = useQuery({
    queryKey: ['marketIndices'],
    queryFn: async () => {
      // In a real app, we'd fetch multiple indices. 
      // For demo/quota reasons, we'll fetch one real one and mock the rest or fetch a few if possible.
      // Alpha Vantage free tier is 25 requests/day. Let's be careful.
      // We'll fetch IBM as a proxy for a "Global Tech" index for now to test the connection.
      const { data, error } = await supabase.functions.invoke('fetch-market-data', {
        body: { symbol: 'IBM', function: 'GLOBAL_QUOTE' }
      });

      if (error) throw error;

      const quote = data['Global Quote'];
      if (!quote) return [];

      // Transform to our UI format
      return [
        {
          name: "Global Tech (IBM)",
          value: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          trend: parseFloat(quote['09. change']) >= 0 ? "up" : "down"
        },
        // Keep some mocks for visual completeness if API limit is hit or for other indices
        { name: "NIFTY 50", value: 21847.50, change: 234.75, changePercent: 1.09, trend: "up" },
        { name: "SENSEX", value: 72240.26, change: 782.18, changePercent: 1.09, trend: "up" },
      ];
    }
  });

  // Fetch Watchlist/Top Stocks
  const { data: topStocks, isLoading: stocksLoading } = useQuery({
    queryKey: ['topStocks'],
    queryFn: async () => {
      // Mocking the list for now, but in a real scenario we'd fetch from the 'market_watchlist' table
      // and then call the API for each.
      return [
        { symbol: "RELIANCE", name: "Reliance Industries", price: 2456.80, change: 2.34 },
        { symbol: "TCS", name: "Tata Consultancy", price: 3789.45, change: 1.82 },
        { symbol: "HDFCBANK", name: "HDFC Bank", price: 1645.20, change: -0.45 },
        { symbol: "INFY", name: "Infosys", price: 1523.60, change: 3.21 },
        { symbol: "ICICIBANK", name: "ICICI Bank", price: 1089.75, change: 1.56 },
      ];
    }
  });

  if (indicesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Market Overview</h1>
          <p className="text-muted-foreground text-lg">
            Real-time market data and comprehensive financial analysis
          </p>
        </div>

        {/* Market Indices */}
        <div className="grid md:grid-cols-3 gap-6">
          {marketIndices?.map((index) => (
            <Card key={index.name} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-muted-foreground">{index.name}</h3>
                  {index.trend === "up" ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <p className="text-3xl font-bold">
                  {index.name.includes("Global") ? "$" : "₹"}
                  {index.value.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${index.trend === "up" ? "text-success" : "text-destructive"
                      }`}
                  >
                    {index.change > 0 ? "+" : ""}
                    {index.change.toFixed(2)} ({index.changePercent > 0 ? "+" : ""}
                    {index.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Global Market Context */}
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-xl font-bold">Global Market Sentiment</h3>
              <p className="text-muted-foreground">
                Asian markets are trading mixed today, while US futures indicate a positive opening.
                The banking sector is showing resilience amidst global economic updates.
              </p>
              <Button variant="gradient" className="gap-2">
                <Activity className="h-4 w-4" />
                View Global Indices
              </Button>
            </div>
          </div>
        </Card>

        {/* Stock Analysis Tabs */}
        <Tabs defaultValue="top-movers" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="top-movers">Top Movers</TabsTrigger>
            <TabsTrigger value="watchlist">Your Watchlist</TabsTrigger>
          </TabsList>

          <TabsContent value="top-movers" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Market Movers</h2>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent" />
                  <span className="text-sm text-muted-foreground">Updated 5 mins ago</span>
                </div>
              </div>

              <div className="space-y-3">
                {topStocks?.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <LineChart className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">{stock.symbol}</p>
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-bold">₹{stock.price.toFixed(2)}</p>
                        <p
                          className={`text-sm ${stock.change > 0 ? "text-success" : "text-destructive"
                            }`}
                        >
                          {stock.change > 0 ? "+" : ""}
                          {stock.change.toFixed(2)}%
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="gradient" size="sm">
                          Analyze
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="watchlist">
            <Card className="p-12 text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Your Watchlist is Empty</h3>
              <p className="text-muted-foreground mb-6">
                Start adding stocks to track their performance.
              </p>
              <Button variant="gradient">
                Add Stocks to Watchlist
              </Button>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Analysis Tools */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-success" />
              </div>
              <h3 className="text-xl font-bold">Fundamental Analysis</h3>
            </div>
            <p className="text-muted-foreground">
              Deep dive into company financials: P/E ratios, ROE, profit margins, debt levels,
              and comprehensive balance sheet analysis.
            </p>
            <Button variant="outline" className="w-full">
              Explore Fundamentals
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Technical Analysis</h3>
            </div>
            <p className="text-muted-foreground">
              Chart patterns, moving averages, RSI, MACD, and other technical indicators
              to identify optimal entry and exit points.
            </p>
            <Button variant="outline" className="w-full">
              View Technical Charts
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Markets;
