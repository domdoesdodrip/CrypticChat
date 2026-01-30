export default async function handler(req, res) {
    const apiKey = process.env.ABLY_API_KEY;
    
    // 1. Safety Check
    if (!apiKey) {
        return res.status(500).json({ error: "ABLY_API_KEY not found in Vercel Settings." });
    }

    // 2. Prepare the request
    const [keyId, keySecret] = apiKey.split(':');
    const clientId = req.query.clientId || 'anonymous';

    try {
        // 3. Talk directly to Ably (No libraries needed)
        const response = await fetch(`https://rest.ably.io/keys/${keyId}/requestToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(apiKey)}`
            },
            body: JSON.stringify({
                clientId: clientId,
                timestamp: Date.now()
            })
        });

        const tokenData = await response.json();

        // 4. Send back to your chat
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (response.ok) {
            res.status(200).json(tokenData);
        } else {
            res.status(response.status).json({ error: "Ably Rejected Key", details: tokenData });
        }
    } catch (err) {
        res.status(500).json({ error: "Fetch Error", details: err.message });
    }
}
