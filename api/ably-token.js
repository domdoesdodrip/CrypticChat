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

    try {
        const client = new Ably.Rest(apiKey);
        const tokenRequestData = await client.auth.createTokenRequest({ 
            clientId: req.query.clientId || 'anonymous' 
        });
        
        // CORS Headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(tokenRequestData);

    } catch (error) {
        // 3. Send the REAL error back to the browser
        res.status(500).json({ 
            error: "Ably SDK Error", 
            message: error.message,
            stack: error.stack 
        });
    }
};
