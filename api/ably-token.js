const Ably = require('ably');
const crypto = require('crypto');

export default async function handler(req, res) {
    // Keep these headers so the browser doesn't trip up
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { username, password } = req.query;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing credentials" });
        }

        // Create the unique Client ID
        const accountId = crypto.createHash('sha256')
            .update(username.toLowerCase() + password)
            .digest('hex')
            .substring(0, 12);

        // Verify Admin against Vercel Environment Variables
        const isAdminAccount = (
            username.toLowerCase() === process.env.ADMIN_USER?.toLowerCase() && 
            password === process.env.ADMIN_PASS
        );

        if (!process.env.ABLY_API_KEY) {
            return res.status(500).json({ error: "ABLY_API_KEY missing in Vercel settings" });
        }

        const realtime = new Ably.Rest({ key: process.env.ABLY_API_KEY });

        const tokenParams = {
            clientId: accountId,
            capability: isAdminAccount 
                ? { "*": ["*"] } 
                : { "*": ["subscribe", "publish", "presence"] }
        };

        const tokenRequest = await realtime.auth.createTokenRequest(tokenParams);
        return res.status(200).json(tokenRequest);

    } catch (error) {
        return res.status(500).json({ error: "Internal Auth Error", details: error.message });
    }
}
