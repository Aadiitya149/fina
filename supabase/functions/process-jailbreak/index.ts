import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS })

    try {
        const { goalId, amount, reason } = await req.json()

        // In a real app, you would:
        // 1. Verify user session
        // 2. Update the goal amount in the database
        // 3. Log the "Jailbreak" event in audit logs

        // For now, we return a simulated impact analysis
        const impactMessage = `Withdrawal of ₹${amount.toLocaleString()} processed for ${reason}. This action has been recorded.`

        return new Response(JSON.stringify({
            success: true,
            impact: impactMessage
        }), {
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        })
    }
})
