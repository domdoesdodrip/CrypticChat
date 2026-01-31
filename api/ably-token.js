const Ably = require('ably');

export default async function handler(req, res) {
    const { clientId, fingerprint } = req.query;
    
    // Read the secrets you set in Vercel settings
    const masterAdminID = process.env.ADMIN_UID;
    const masterFingerprint = process.env.ADMIN_FINGERPRINT;

    const realtime = new Ably.Rest(process.env.ABLY_API_KEY);

    // SERVER-SIDE CHECK: Only the real admin gets "Delete/Kick" powers
    const isVerifiedAdmin = (clientId === masterAdminID && fingerprint === masterFingerprint);

    const tokenParams = {
        clientId: clientId,
        // If verified, grant wildcard [*] permissions. 
        // If not, only allow basic chat functions.
        capability: isVerifiedAdmin 
            ? { "*": ["*"] } 
            : { "*": ["subscribe", "publish", "presence"] }
    };

    try {
        const tokenRequest = await realtime.auth.createTokenRequest(tokenParams);
        res.status(200).json(tokenRequest);
    } catch (error) {
        res.status(500).send("Error creating token");
    }
}
