import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Economic Assumptions (India Context based on your currency usage)
const INFLATION_RATE = 0.06 // 6% Inflation
const MARKET_MEAN_RETURN = 0.12 // 12% Equity Return (Nifty 50 avg)
const MARKET_VOLATILITY = 0.15 // 15% Standard Deviation

// --- Helper: Monte Carlo Simulation Engine ---
// Runs 1,000 parallel universes to see how many times the user wins
function runMonteCarlo(
  currentPrincipal: number,
  monthlyContribution: number,
  years: number,
  targetAmount: number
) {
  const simulations = 1000
  const months = Math.floor(years * 12)
  let successCount = 0
  const outcomes: number[] = []

  // Generate Year-by-Year "Cone of Uncertainty" for charts
  const chartData: { year: number, balance: number }[] = []

  for (let i = 0; i < simulations; i++) {
    let balance = currentPrincipal
    const yearlyBalances = [currentPrincipal]

    for (let m = 1; m <= months; m++) {
      // Monthly Random Walk (Geometric Brownian Motion logic)
      const drift = (MARKET_MEAN_RETURN - 0.5 * Math.pow(MARKET_VOLATILITY, 2)) / 12
      const shock = MARKET_VOLATILITY * Math.sqrt(1 / 12) * (Math.random() - 0.5) * 2 // Simplified Gaussian

      const monthlyReturn = drift + shock
      balance = balance * (1 + monthlyReturn) + monthlyContribution

      if (m % 12 === 0) yearlyBalances.push(balance)
    }

    outcomes.push(balance)
    if (balance >= targetAmount) successCount++

    // Store only the first simulation for the UI line chart (Optimized for payload size)
    if (i === 0) {
      chartData.push(...yearlyBalances.map((b, idx) => ({ year: idx, balance: Math.round(b) })))
    }
  }

  outcomes.sort((a, b) => a - b)

  return {
    probability: (successCount / simulations) * 100,
    optimistic_scenario: outcomes[Math.floor(simulations * 0.9)], // 90th Percentile
    median_scenario: outcomes[Math.floor(simulations * 0.5)],     // 50th Percentile
    pessimistic_scenario: outcomes[Math.floor(simulations * 0.1)], // 10th Percentile (Crash scenario)
    chart_trajectory: chartData
  }
}

// --- Helper: Calculate Required Monthly Savings (PMT Formula) ---
function calculateRequiredMonthly(target: number, current: number, years: number, rate: number): number {
  const months = years * 12
  const monthlyRate = rate / 12
  // FV = P * (1+r)^n + PMT * [((1+r)^n - 1) / r]
  // Solve for PMT
  const futureValuePrincipal = current * Math.pow(1 + monthlyRate, months)
  const shortfall = target - futureValuePrincipal
  if (shortfall <= 0) return 0

  const denominator = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate
  return shortfall / denominator
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS })

  try {
    const { goalTitle, targetAmount, currentAmount, monthlyContribution, targetDate, goalType } = await req.json()
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

    // 1. Time Horizon Calculation
    const today = new Date()
    const target = new Date(targetDate)
    const yearsToGoal = Math.max(1, (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 365))

    // 2. Run The Math (Hard Quantitative Analysis)
    // ----------------------------------------------------
    const simulation = runMonteCarlo(currentAmount, monthlyContribution, yearsToGoal, targetAmount)
    const requiredMonthly = calculateRequiredMonthly(targetAmount, currentAmount, yearsToGoal, MARKET_MEAN_RETURN)
    const inflationAdjustedTarget = targetAmount * Math.pow(1 + INFLATION_RATE, yearsToGoal)
    const gap = targetAmount - simulation.median_scenario

    // 3. AI Advisory Layer (Gemini 2.5 Flash)
    // ----------------------------------------------------
    let aiInsight = {
      verdict: "Analysis Pending",
      recommendations: [] as string[],
      investment_strategy_suggestion: "Review inputs",
      tone: "neutral"
    }

    if (geminiApiKey) {
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiApiKey

      const prompt = `
        Act as a Senior Wealth Manager. Analyze this client's '${goalTitle}' goal.
        
        **Quantitative Data:**
        - Goal Type: ${goalType}
        - Time Horizon: ${yearsToGoal.toFixed(1)} Years
        - Success Probability: ${simulation.probability.toFixed(1)}% (via Monte Carlo)
        - Current SIP: ₹${monthlyContribution.toLocaleString()}
        - Required SIP: ₹${Math.round(requiredMonthly).toLocaleString()}
        - Projected Shortfall: ₹${Math.abs(Math.round(gap)).toLocaleString()} (${gap < 0 ? "Surplus" : "Deficit"})
        - Inflation Impact: Target of ₹${targetAmount.toLocaleString()} will cost ₹${Math.round(inflationAdjustedTarget).toLocaleString()} in future value.

        **Task:**
        1. Give a 1-sentence "Verdict" (e.g., "On Track", "Critical Shortfall", "Needs Optimization").
        2. Provide 3 specific, math-backed recommendations to fix the plan.
        3. Be direct. If they need to increase savings, say exactly by how much.

        **Output JSON:**
        {
          "verdict": "string",
          "recommendations": ["string", "string", "string"],
          "investment_strategy_suggestion": "string"
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
        if (data.candidates?.[0]?.content) {
          const text = data.candidates[0].content.parts[0].text
          // Clean up markdown code blocks if present
          const jsonStr = text.replace(/```json\n|\n```/g, '')
          aiInsight = JSON.parse(jsonStr)
        }
      } catch (e) {
        console.error("AI Error:", e)
      }
    } else {
      aiInsight = {
        verdict: "API Key Missing",
        recommendations: ["Please configure GEMINI_API_KEY in Supabase Secrets."],
        investment_strategy_suggestion: "System Alert",
        tone: "warning"
      }
    }

    // 4. Return the "Industry Level" Payload
    // ----------------------------------------------------
    return new Response(JSON.stringify({
      metrics: {
        success_probability: Math.round(simulation.probability),
        projected_value: Math.round(simulation.median_scenario),
        worst_case_value: Math.round(simulation.pessimistic_scenario),
        required_monthly_savings: Math.round(requiredMonthly),
        inflation_adjusted_target: Math.round(inflationAdjustedTarget),
        gap_value: Math.round(gap)
      },
      chart_data: simulation.chart_trajectory,
      ai_analysis: aiInsight
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