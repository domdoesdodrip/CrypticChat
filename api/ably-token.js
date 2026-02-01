const Ably = require('ably');
const crypto = require('crypto');

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { username, password } = req.query;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing credentials" });
        }

        // Keep your secure ID generation
        const accountId = crypto.createHash('sha256')
            .update(username.toLowerCase() + password)
            .digest('hex')
            .substring(0, 12);

        // Check Admin Status
        const isAdminAccount = (
            username.toLowerCase() === process.env.ADMIN_USER?.toLowerCase() && 
            password === process.env.ADMIN_PASS
        );

        if (!process.env.ABLY_API_KEY) {
            return res.status(500).json({ error: "ABLY_API_KEY missing in Vercel Environment Variables" });
        }

        const realtime = new Ably.Rest({ key: process.env.ABLY_API_KEY });

        // Define what users can do
        // We need 'publish', 'subscribe', and 'presence' for the VC to work
        const tokenParams = {
            clientId: accountId,
            capability: isAdminAccount 
                ? { "*": ["*"] } 
                : { "*": ["subscribe", "publish", "presence"] }
        };

        const tokenRequest = await new Promise((resolve, reject) => {
            realtime.auth.createTokenRequest(tokenParams, (err, tokenRequest) => {
                if (err) reject(err);
                else resolve(tokenRequest);
            });
        });

        return res.status(200).json(tokenRequest);

    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(500).json({ error: "Internal Auth Error", details: error.message });
    }
}
