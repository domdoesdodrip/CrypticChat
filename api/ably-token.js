const Ably = require('ably');

export default async function handler(req, res) {
    const apiKey = process.env.ABLY_API_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ error: "Ably API Key not configured in Vercel." });
    }

    const client = new Ably.Rest(apiKey);
    const clientId = req.query.clientId || 'anonymous';

    try {
        // Create a temporary token so the user never sees your master key
        const tokenRequestData = await client.auth.createTokenRequest({ clientId });
        
        // Handle CORS so different domains can talk to this API
        const origin = req.headers.origin;
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        
        res.status(200).json(tokenRequestData);
    } catch (error) {
        res.status(500).json({ error: "Failed to generate Ably token" });
    }
}
