import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import aiAdvisorIcon from "@/assets/icon-ai-advisor.png";
import investmentIcon from "@/assets/icon-investment.png";
import retirementIcon from "@/assets/icon-retirement.png";
import accountsIcon from "@/assets/icon-accounts.png";
import assetsIcon from "@/assets/icon-assets.png";
import insightsIcon from "@/assets/icon-insights.png";

import { useState } from "react";
import { AddAccountDialog } from "@/components/accounts/AddAccountDialog";

const Services = () => {
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const services = [
    {
      icon: aiAdvisorIcon,
      title: "Wealth Management",
      description: "AI-powered advisor that analyzes your financial behavior and provides personalized recommendations to optimize your wealth growth.",
      cta: "Try our AI Advisor",
      link: "/dashboard",
      gradient: "from-accent to-primary",
    },
    {
      icon: investmentIcon,
      title: "Investment Planning",
      description: "Set and track financial goals with advanced Monte Carlo simulations showing probability-based outcomes for your investment strategies.",
      cta: "Try Investment Planning",
      link: "/goals",
      gradient: "from-success to-accent",
    },
    {
      icon: retirementIcon,
      title: "Retirement Planning",
      description: "Comprehensive retirement planning with behavioral interventions to keep you on track through our unique Financial Jailbreak mechanism.",
      cta: "Learn More",
      link: "/goals",
      gradient: "from-warning to-destructive",
    },
    {
      icon: accountsIcon,
      title: "Account Aggregation",
      description: "Connect all your financial accounts—traditional banks, crypto wallets, and DeFi positions—in one unified dashboard.",
      cta: "Learn More",
      link: "/dashboard",
      gradient: "from-primary to-accent",
    },
    {
      icon: assetsIcon,
      title: "Holistic Asset Management",
      description: "Comprehensive view of your entire portfolio across all asset classes with real-time valuations and performance tracking.",
      cta: "Learn More",
      link: "/holistic-management",
      gradient: "from-accent to-success",
    },
    {
      icon: insightsIcon,
      title: "Economic Insights",
      description: "Access real-time market intelligence and expert analysis to make informed investment decisions.",
      cta: "Learn More",
      link: "/markets",
      gradient: "from-primary to-primary-light",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-card via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Comprehensive Financial <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to build, manage, and grow your wealth—all in one powerful platform.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => {
                  if (service.title === "Account Aggregation") {
                    setShowAccountDialog(true);
                  }
                }}
              >
                <div className="p-8 space-y-6">
                  {/* Gradient Background */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-10 rounded-full blur-3xl -z-10 group-hover:opacity-20 transition-opacity`} />

                  {/* Icon */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-card to-secondary/20 p-3">
                      <img
                        src={service.icon}
                        alt={service.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  {service.title !== "Account Aggregation" ? (
                    <Link to={service.link}>
                      <Button
                        variant="ghost"
                        className="group/btn w-full justify-between hover:bg-secondary"
                      >
                        <span>{service.cta}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      className="group/btn w-full justify-between hover:bg-secondary"
                    >
                      <span>{service.cta}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose Momentum?
            </h2>
            <p className="text-lg text-muted-foreground">
              Our platform combines cutting-edge AI technology with proven behavioral science
              to create a truly personalized financial experience. From beginners to experts,
              Momentum adapts to your unique needs and grows with you on your financial journey.
            </p>
            <div className="pt-4">
              <Link to="/dashboard">
                <Button variant="gradient" size="lg" className="gap-2">
                  View Your Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AddAccountDialog open={showAccountDialog} onOpenChange={setShowAccountDialog} />
    </div>
  );
};

export default Services;
