const Ably = require('ably');
const crypto = require('crypto');

export default async function handler(req, res) {
    try {
        const { username, password } = req.query;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing credentials" });
        }

        // 1. Generate the ClientID based on credentials
        const accountId = crypto.createHash('sha256')
            .update(username.toLowerCase() + password)
            .digest('hex')
            .substring(0, 12);

        // 2. Check Admin Status against Vercel Env Vars
        const isAdminAccount = (
            username.toLowerCase() === process.env.ADMIN_USER?.toLowerCase() && 
            password === process.env.ADMIN_PASS
        );

        // 3. Initialize Ably
        if (!process.env.ABLY_API_KEY) {
            return res.status(500).json({ error: "ABLY_API_KEY is not set in Vercel" });
        }

        const realtime = new Ably.Rest({ key: process.env.ABLY_API_KEY });

        const tokenParams = {
            clientId: accountId,
            capability: isAdminAccount 
                ? { "*": ["*"] } 
                : { "*": ["subscribe", "publish", "presence"] }
        };

        // 4. Create and return the token
        const tokenRequest = await realtime.auth.createTokenRequest(tokenParams);
        return res.status(200).json(tokenRequest);

    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(500).json({ error: "Internal Auth Error", details: error.message });
    }
}
