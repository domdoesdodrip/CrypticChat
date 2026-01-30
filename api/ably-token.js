export default async function handler(req, res) {
    const apiKey = process.env.ABLY_API_KEY;
    
    if (!apiKey || !apiKey.includes(':')) {
        return res.status(500).json({ error: "Invalid or missing ABLY_API_KEY in Vercel." });
    }

    // Split the key into ID and Secret
    const [keyName, keySecret] = apiKey.split(':');
    const clientId = req.query.clientId || 'anonymous';

    try {
        const response = await fetch(`https://rest.ably.io/keys/${keyName}/requestToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(apiKey)}`
            },
            body: JSON.stringify({
                keyName: keyName, // <--- This was the missing piece!
                clientId: clientId,
                timestamp: Date.now()
            })
        });

        const tokenData = await response.json();

        res.setHeader('Access-Control-Allow-Origin', '*');
        
        if (response.ok) {
            res.status(200).json(tokenData);
        } else {
            res.status(response.status).json({ error: "Ably Rejected Request", details: tokenData });
        }
    } catch (err) {
        res.status(500).json({ error: "Fetch Error", details: err.message });
    }
}
