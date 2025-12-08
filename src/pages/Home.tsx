import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, Shield, Brain, Zap } from "lucide-react";
import heroImage from "@/assets/hero-momentum.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-momentum opacity-5" />

        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-accent">Your Universal Financial Co-Pilot</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Build <span className="gradient-text">Unstoppable</span>
                <br />
                Financial Momentum
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl">
                Transform every penny into prosperity. From your first savings to lasting wealth,
                Momentum guides you on a journey from financial uncertainty to mastery.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/auth">
                  <Button variant="gradient" size="lg" className="gap-2 text-lg">
                    Start Your Journey
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="text-lg">
                    View Dashboard
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8 pt-8">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-success" />
                  <div>
                    <p className="font-semibold">Bank-Level Security</p>
                    <p className="text-sm text-muted-foreground">256-bit encryption</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="h-8 w-8 text-accent" />
                  <div>
                    <p className="font-semibold">AI-Powered Insights</p>
                    <p className="text-sm text-muted-foreground">Personalized guidance</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-warning" />
                  <div>
                    <p className="font-semibold">Real-Time Updates</p>
                    <p className="text-sm text-muted-foreground">Live market data</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-float">
                <img
                  src={heroImage}
                  alt="Financial Growth Visualization"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Democratizing Financial Well-Being for Everyone
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Whether you're a student saving your first rupee or a CEO managing a complex portfolio,
              Momentum adapts to your unique journey. We believe that sophisticated financial tools
              and behavioral science should be accessible to everyone—from a rickshaw puller
              building a future for their family to a professional optimizing their wealth.
            </p>
            <div className="pt-6">
              <Link to="/services">
                <Button variant="gradient" size="lg">
                  Explore All Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Momentum?</h2>
            <p className="text-xl text-muted-foreground">Every penny matters. Every decision counts.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card p-8 rounded-xl shadow-md border border-border hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Universal Access</h3>
              <p className="text-muted-foreground">
                Designed for everyone, from complete beginners to financial experts.
                Our adaptive interface grows with you.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-md border border-border hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-bold mb-3">Behavioral Science</h3>
              <p className="text-muted-foreground">
                AI-powered interventions help you overcome biases and make better
                financial decisions for your future.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-md border border-border hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lifetime Partner</h3>
              <p className="text-muted-foreground">
                From your first savings to retirement planning, we're with you
                every step of your financial journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-momentum relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 text-white">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands who are building unstoppable momentum toward their financial goals.
            </p>
            <Link to="/services">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-xl text-lg"
              >
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
