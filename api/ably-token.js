const Ably = require('ably');

module.exports = async (req, res) => {
    // 1. Grab the key
    const apiKey = process.env.ABLY_API_KEY;

    // 2. Immediate check: Is the key even there?
    if (!apiKey) {
        return res.status(500).json({ 
            error: "Environment Variable Missing", 
            details: "ABLY_API_KEY is not set in Vercel Settings." 
        });
    }

    // api/ably-token.js
try {
    const Ably = require('ably');

    module.exports = async (req, res) => {
        const apiKey = process.env.ABLY_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: "API Key missing in Vercel Settings." });
        }

        const client = new Ably.Rest(apiKey);
        
        try {
            const tokenRequestData = await client.auth.createTokenRequest({ 
                clientId: req.query.clientId || 'anonymous' 
            });
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).json(tokenRequestData);
        } catch (err) {
            res.status(500).json({ error: "Ably Auth Failed", details: err.message });
        }
    };
} catch (e) {
    module.exports = (req, res) => {
        res.status(500).json({ error: "Module Loading Error", message: e.message });
    };
}
