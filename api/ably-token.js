const Ably = require('ably');
const crypto = require('crypto');

export default async function handler(req, res) {
    // --- THIS IS THE FIX ---
    // These headers tell the browser: "I trust this request, let it through!"
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle the browser's "pre-flight" check
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { username, password } = req.query;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing credentials" });
        }

        // Generate ID
        const accountId = crypto.createHash('sha256')
            .update(username.toLowerCase() + password)
            .digest('hex')
            .substring(0, 12);

        // Check Admin
        const isAdminAccount = (
            username.toLowerCase() === process.env.ADMIN_USER?.toLowerCase() && 
            password === process.env.ADMIN_PASS
        );

        if (!process.env.ABLY_API_KEY) {
            return res.status(500).json({ error: "API Key Missing" });
        }

        const realtime = new Ably.Rest({ key: process.env.ABLY_API_KEY });

        const tokenParams = {
            clientId: accountId,
            capability: isAdminAccount 
                ? { "*": ["*"] } 
                : { "*": ["subscribe", "publish", "presence"] }
        };

        const tokenRequest = await realtime.auth.createTokenRequest(tokenParams);
        
        // Send the token back
        return res.status(200).json(tokenRequest);

    } catch (error) {
        return res.status(500).json({ error: "Internal Error", message: error.message });
    }
}
