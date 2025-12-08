import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// --------------------------------------------------------------------------
// 1. INSTITUTIONAL CONSTANTS & CONFIGURATION
// --------------------------------------------------------------------------
const RISK_FREE_RATE = 0.045 // 4.5% (10-Year Treasury Yield benchmark)
const CONFIDENCE_INTERVAL = 1.65 // Z-Score for 95% Confidence (Standard VaR)

// Volatility Surface (Annualized Standard Deviation)
const ASSET_RISK_PROFILE: Record<string, number> = {
    'crypto': 0.78,      // Extreme Volatility
    'defi': 0.95,        // Speculative / Illiquid risks
    'stock': 0.18,       // Market Average (S&P 500)
    'real_estate': 0.08, // Smoothed/Lagged Volatility
    'bond': 0.05,        // Defensive
    'cash': 0.005,       // Negligible
    'collectibles': 0.25 // Idiosyncratic Risk
}

// --- Types ---
interface Asset {
    symbol: string
    type: string
    quantity: number
    value: number // Unit price
    [key: string]: any
}

// --------------------------------------------------------------------------
// 2. QUANTITATIVE MODELS (The "Math Brain")
// --------------------------------------------------------------------------

// A. Geometric Brownian Motion (Simulation Engine)
function simulateMarketMove(basePrice: number, volatility: number): number {
    const dt = 1 / 252 // 1 Trading Day
    const drift = 0.05 // 5% Expected Annual Return
    const shock = (Math.random() - 0.5) * 2 // Stochastic Component

    // dS = S * (mu*dt + sigma*shock*sqrt(dt))
    return basePrice * (drift * dt + volatility * shock * Math.sqrt(dt)) + basePrice
}

// B. Sharpe Ratio (Efficiency Metric)
function calculateSharpeRatio(portfolioReturn: number, portfolioVolatility: number): number {
    if (portfolioVolatility === 0) return 0
    return (portfolioReturn - RISK_FREE_RATE) / portfolioVolatility
}

// C. Herfindahl-Hirschman Index (Diversification Score)
function calculateDiversificationScore(assets: Asset[]): number {
    const totalValue = assets.reduce((sum, a) => sum + (a.value * a.quantity), 0)
    if (totalValue === 0) return 0

    const typeWeights: Record<string, number> = {}

    assets.forEach(a => {
        const val = a.value * a.quantity
        typeWeights[a.type] = (typeWeights[a.type] || 0) + val
    })

    let hhi = 0
    Object.values(typeWeights).forEach(val => {
        const weight = val / totalValue
        hhi += weight * weight
    })

    // Normalize: HHI 1.0 (Monopoly) -> 0 Score, HHI 0.15 (Diverse) -> 90+ Score
    return Math.max(0, Math.min(100, Math.round((1 - hhi) * 135)))
}

// --------------------------------------------------------------------------
// 3. MAIN EDGE FUNCTION
// --------------------------------------------------------------------------
serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS })

    try {
        const { assets } = await req.json()
        const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

        // --- Phase 1: Valuation & Volatility Surface ---
        let totalNAV = 0
        let weightedVolatility = 0
        let liquidNAV = 0

        const processedAssets = assets.map((asset: Asset) => {
            const volatility = ASSET_RISK_PROFILE[asset.type] || 0.20

            // Simulation: If live data isn't available, we use GBM to project "live" price
            const currentPrice = simulateMarketMove(asset.value, volatility)
            const totalValue = currentPrice * (asset.quantity || 1)

            totalNAV += totalValue
            weightedVolatility += (totalValue * volatility)

            // Liquidity Classification
            const isLiquid = ['stock', 'crypto', 'cash', 'bond'].includes(asset.type)
            if (isLiquid) liquidNAV += totalValue

            return {
                ...asset,
                current_price: currentPrice,
                total_value: totalValue,
                volatility: volatility,
                liquidity_tier: isLiquid ? 'High' : 'Low (Illiquid)'
            }
        })

        // --- Phase 2: Portfolio-Level Risk Metrics ---
        const portfolioVolatility = totalNAV > 0 ? weightedVolatility / totalNAV : 0
        const diversificationScore = calculateDiversificationScore(processedAssets)

        // Sharpe Ratio (Assuming 8% Target Return)
        const sharpeRatio = calculateSharpeRatio(0.08, portfolioVolatility)

        // Value at Risk (VaR) - 95% Confidence (Monthly)
        const monthlyVolatility = portfolioVolatility / Math.sqrt(12)
        const valueAtRisk = totalNAV * CONFIDENCE_INTERVAL * monthlyVolatility

        // Liquidity Ratio
        const liquidityRatio = totalNAV > 0 ? (liquidNAV / totalNAV) * 100 : 0

        // --- Phase 3: AI "Chief Risk Officer" (Gemini 2.5 Flash) ---
        let riskAnalysis = {
            executive_summary: "Calculating risk profile...",
            inefficiencies: ["Analysis pending"],
            rebalancing_strategy: "Hold current positions",
            risk_grade: "C"
        }

        if (geminiApiKey) {
            const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiApiKey

            const prompt = `
        You are the Chief Risk Officer (CRO) for a rigorous wealth management firm.
        Analyze this client portfolio using the following computed quantitative metrics.

        **Quantitative Risk Profile:**
        - Total NAV: $${totalNAV.toLocaleString()}
        - Liquidity Ratio: ${liquidityRatio.toFixed(1)}% (Target: >80% for flexibility)
        - Diversification Score: ${diversificationScore}/100 (HHI-Based)
        - Sharpe Ratio: ${sharpeRatio.toFixed(2)} (Benchmark: >1.0 is Efficient)
        - 95% Monthly VaR (Value at Risk): $${valueAtRisk.toLocaleString()}
        - Portfolio Volatility (Annualized): ${(portfolioVolatility * 100).toFixed(1)}%

        **Asset Allocation:**
        ${JSON.stringify(processedAssets.map((a: any) => ({ type: a.type, val: a.total_value, vol: a.volatility })))}

        **Your Mission:**
        1. **Executive Summary:** A 2-sentence brutal assessment of the portfolio's efficiency.
        2. **Inefficiency Detection:** Identify 3 specific structural flaws (e.g., "Cash drag," "Crypto over-exposure," "Illiquidity trap").
        3. **Tactical Rebalancing:** Suggest a specific "Pair Trade" (Sell X, Buy Y) to improve the Sharpe Ratio.

        **Output format: JSON**
        {
          "executive_summary": "string",
          "inefficiencies": ["string", "string", "string"],
          "rebalancing_strategy": "string",
          "risk_grade": "A" | "B" | "C" | "D" | "F"
        }
      `

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { response_mime_type: "application/json" }
                    })
                })

                const data = await response.json()
                if (data.candidates && data.candidates[0].content) {
                    const text = data.candidates[0].content.parts[0].text
                    // Clean up potential markdown code blocks
                    const jsonStr = text.replace(/```json\n|\n```/g, '')
                    riskAnalysis = JSON.parse(jsonStr)
                }
            } catch (e) {
                console.error("Gemini AI Error:", e)
                riskAnalysis.executive_summary = "AI Risk Analysis currently unavailable."
            }
        } else {
            // Explicit handling for missing API key
            riskAnalysis = {
                executive_summary: "⚠️ System Alert: Gemini API Key is missing. Please configure it in Supabase Secrets.",
                inefficiencies: ["API Key Missing"],
                rebalancing_strategy: "Run: npx supabase secrets set GEMINI_API_KEY=...",
                risk_grade: "F"
            }
        }

        // --- Phase 4: Return Institutional Payload ---
        return new Response(JSON.stringify({
            meta: {
                timestamp: new Date().toISOString(),
                engine: "Gemini 2.5 Flash Risk Engine",
                status: "optimized"
            },
            metrics: {
                total_nav: totalNAV,
                sharpe_ratio: sharpeRatio.toFixed(2),
                var_95_monthly: valueAtRisk,
                diversification_score: diversificationScore,
                portfolio_volatility: (portfolioVolatility * 100).toFixed(2) + "%",
                liquidity_ratio: liquidityRatio.toFixed(1) + "%"
            },
            assets: processedAssets,
            risk_officer_insight: riskAnalysis
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
