import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const { symbol, function: apiFunction = 'GLOBAL_QUOTE' } = await req.json()
        const apiKey = Deno.env.get('ALPHA_VANTAGE_KEY')

        if (!apiKey) {
            throw new Error('Alpha Vantage API key not configured')
        }

        if (!symbol) {
            throw new Error('Symbol is required')
        }

        console.log(`Fetching ${apiFunction} for ${symbol}`)

        const url = `https://www.alphavantage.co/query?function=${apiFunction}&symbol=${symbol}&apikey=${apiKey}`
        const response = await fetch(url)
        const data = await response.json()

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Error:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
