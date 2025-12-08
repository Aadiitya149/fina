import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// --- Configuration & Constants ---
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 10-Year Treasury Yield (Risk-Free Rate Benchmark)
const RISK_FREE_RATE = 0.045

// --- Types ---
interface Asset {
    symbol: string
    type: 'crypto' | 'stock' | 'real_estate' | 'cash' | 'defi' | 'bond'
    quantity: number
    value: number // Unit price
}

// --- Helper: Geometric Brownian Motion (Simulation Engine) ---
// Generates realistic market scenarios if live data fails, ensuring the dashboard never looks "dead"
function simulateMarketMove(basePrice: number, volatility: number): number {
    const dt = 1 / 252 // 1 Day
    const drift = 0.05 // 5% Annual Drift
    const shock = (Math.random() - 0.5) * 2
    return basePrice * (drift * dt + volatility * shock * Math.sqrt(dt)) + basePrice
}

// --- Helper: Advanced Financial Metrics ---
function calculateSharpeRatio(portfolioReturn: number, portfolioVolatility: number): number {
    if (portfolioVolatility === 0) return 0
    return (portfolioReturn - RISK_FREE_RATE) / portfolioVolatility
}

// --- Helper: HHI Diversification Score ---
// Calculates concentration risk using Herfindahl-Hirschman Index logic
function calculateDiversificationScore(assets: Asset[]): number {
    const totalValue = assets.reduce((sum, a) => sum + (a.value * a.quantity), 0)
    if (totalValue === 0) return 0

    const typeWeights: Record<string, number> = {}

    // Group by Asset Class
    assets.forEach(a => {
        const val = a.value * a.quantity
        typeWeights[a.type] = (typeWeights[a.type] || 0) + val
    })

    // Calculate Sum of Squared Weights
    let hhi = 0
    Object.values(typeWeights).forEach(val => {
        const weight = val / totalValue
        hhi += weight * weight
    })

    // Invert HHI: 1 (single asset) -> 0 score, 0 (infinite assets) -> 100 score
    // We map HHI 1.0 to 0 and HHI 0.2 (5 assets) to ~80
    return Math.max(0, Math.min(100, Math.round((1 - hhi) * 125)))
}

// --- Main Edge Function ---
serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS })

    try {
        // Frontend sends 'portfolio', but this code expects 'assets'. We alias it.
        const { portfolio: assets } = await req.json()
        const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

        // 1. Valuation & Volatility Layer
        // ---------------------------------------------------------
        let totalNAV = 0
        let weightedVolatility = 0

        const processedAssets = assets.map((asset: Asset) => {
            // Institutional Volatility Assumptions (Annualized Standard Deviation)
            const volatilityMap: Record<string, number> = {
                'crypto': 0.78,      // Very High
                'defi': 0.95,        // Extreme
                'stock': 0.18,       // Moderate
                'real_estate': 0.08, // Low (Smoothed)
                'bond': 0.05,        // Very Low
                'cash': 0.005        // Negligible
            }

            const volatility = volatilityMap[asset.type] || 0.20

            // Simulation: Generate "Live" price movement for demo purposes
            // (In production, you would fetch real Alpha Vantage data here)
            const simulatedPrice = simulateMarketMove(asset.value, volatility)
            const totalValue = simulatedPrice * asset.quantity

            totalNAV += totalValue
            weightedVolatility += (totalValue * volatility)

            return {
                ...asset,
                price: simulatedPrice,
                value_total: totalValue,
                volatility: volatility
            }
        })

        // 2. Portfolio-Level Math
        // ---------------------------------------------------------
        const portfolioVolatility = totalNAV > 0 ? weightedVolatility / totalNAV : 0
        const diversificationScore = calculateDiversificationScore(assets)

        // Sharpe Ratio (Assuming 8% expected portfolio return)
        const sharpeRatio = calculateSharpeRatio(0.08, portfolioVolatility)

        // Value at Risk (VaR) - 95% Confidence Interval (Monthly)
        // "What is the maximum I might lose in a bad month?"
        const monthlyVolatility = portfolioVolatility / Math.sqrt(12)
        const valueAtRisk = totalNAV * 1.65 * monthlyVolatility

        // 3. The "Chief Risk Officer" Analysis (Gemini 2.5 Flash)
        // ---------------------------------------------------------
        let aiAnalysis = {
            executive_summary: "Analysis pending...",
            risk_assessment: "Unknown",
            vulnerabilities: [],
            tactical_actions: []
        }

        if (geminiApiKey) {
            // Using Gemini 2.5 Flash for high-speed, cost-efficient reasoning
            const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiApiKey

            const prompt = `
        You are the Chief Risk Officer (CRO) for a sophisticated wealth management firm.
        Analyze this client portfolio based on the following computed metrics.

        **Portfolio Data:**
        - Total NAV: $${totalNAV.toLocaleString()}
        - Diversification Score: ${diversificationScore}/100 (HHI Based)
        - Portfolio Volatility: ${(portfolioVolatility * 100).toFixed(1)}%
        - Sharpe Ratio: ${sharpeRatio.toFixed(2)} (Benchmark: >1.0 is good)
        - 95% Monthly VaR (Value at Risk): $${valueAtRisk.toLocaleString()}
        - Assets: ${JSON.stringify(processedAssets.map((a: any) => ({ s: a.symbol, t: a.type, v: a.value_total })))}

        **Your Task:**
        1. **Executive Summary:** A concise, professional assessment of the portfolio's health.
        2. **Critical Vulnerabilities:** Identify specific risks (e.g., "Liquidity Trap" in real estate, "Correlation Risk" in crypto).
        3. **Tactical Moves:** Suggest 2 specific rebalancing actions to improve the Sharpe Ratio.

        **Output JSON Format (Strict):**
        {
          "executive_summary": "string",
          "risk_assessment": "Low" | "Moderate" | "High" | "Critical",
          "vulnerabilities": ["string", "string"],
          "tactical_actions": ["string", "string"]
        }
      `

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { response_mime_type: "application/json" } // Enforce valid JSON output
                    })
                })

                const data = await response.json()
                if (data.candidates && data.candidates[0].content) {
                    const text = data.candidates[0].content.parts[0].text
                    aiAnalysis = JSON.parse(text)
                }
            } catch (e) {
                console.error("Gemini AI Error:", e)
                aiAnalysis.executive_summary = "AI Risk Analysis currently unavailable."
            }
        } else {
            aiAnalysis.executive_summary = "⚠️ System Alert: Gemini API Key is missing. Please configure it in Supabase Secrets to enable AI analysis."
            aiAnalysis.risk_assessment = "High"
            aiAnalysis.tactical_actions = ["Run: npx supabase secrets set GEMINI_API_KEY=..."]
        }

        // 4. Return the "Heavy" Payload
        // ---------------------------------------------------------
        return new Response(JSON.stringify({
            metrics: {
                total_nav: totalNAV,
                sharpe_ratio: sharpeRatio.toFixed(2),
                var_95_monthly: valueAtRisk,
                volatility_annual: portfolioVolatility,
                diversification_score: diversificationScore
            },
            assets: processedAssets,
            risk_officer_insight: aiAnalysis
        }), {
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
            status: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        })
    }
})
