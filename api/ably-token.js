const Ably = require('ably');
const crypto = require('crypto');

export default async function handler(req, res) {
    const { username, password } = req.query;

    if (!username || !password) return res.status(400).send("Missing credentials");

    // Generate a unique ID for this account (Name + Pass)
    const accountId = crypto.createHash('sha256')
        .update(username.toLowerCase() + password)
        .digest('hex')
        .substring(0, 12);

    // Verify Admin status against your Vercel Environment Variables
    const isAdminAccount = (
        username === process.env.ADMIN_USER && 
        password === process.env.ADMIN_PASS
    );

    const realtime = new Ably.Rest(process.env.ABLY_API_KEY);

    const tokenParams = {
        clientId: accountId,
        capability: isAdminAccount 
            ? { "*": ["*"] } 
            : { "*": ["subscribe", "publish", "presence"] }
    };

    try {
        const tokenRequest = await realtime.auth.createTokenRequest(tokenParams);
        res.status(200).json(tokenRequest);
    } catch (error) {
        res.status(500).send("Internal Auth Error");
    }
}
