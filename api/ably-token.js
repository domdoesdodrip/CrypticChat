const Ably = require('ably');

export default async function handler(req, res) {
    const { clientId, fingerprint } = req.query;
    
    // 1. Get the user's IP from the request headers
    const forwarded = req.headers['x-forwarded-for'];
    const userIP = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;

    // 2. Compare against your 3 Secrets
    const isUIDMatch = (clientId === process.env.ADMIN_UID);
    const isFingerprintMatch = (fingerprint === process.env.ADMIN_FINGERPRINT);
    const isIPMatch = (userIP === process.env.ADMIN_IP);

    const isVerifiedAdmin = (isUIDMatch && isFingerprintMatch && isIPMatch);

    const realtime = new Ably.Rest(process.env.ABLY_API_KEY);

    const tokenParams = {
        clientId: clientId,
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
