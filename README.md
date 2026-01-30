# 🔓 CrypticChat Protocol

![Status](https://img.shields.io/badge/Status-Operational-9667f4?style=for-the-badge)
![Encryption](https://img.shields.io/badge/Encryption-AES--256-blueviolet?style=for-the-badge)

A secure, real-time messaging terminal designed for ephemeral communication. No logs, no tracking, just data.

---

## 🚀 Quick Start (For the Impatient)

1. **Access the Terminal:** Go to [domdoesdodrip.github.io/CrypticChat](https://domdoesdodrip.github.io/CrypticChat/)
2. **Read the Protocol:** Click through the documentation home page.
3. **Connect:** Hit **ENTER TERMINAL**.
4. **Identify:** Enter a Username and a Room ID.

---

## 📖 Usage Protocol (Tutorial)

### 1. Identity Creation
Your **Username** is your public callsign. 
* **Limit:** 12 Characters.
* **Advice:** Use a pseudonym. This network is designed for anonymity.

### 2. Frequency (Room) Selection
The **Room ID** determines which encrypted sub-channel you enter.
* **Global Access:** Leave the Room ID blank to enter the public lobby.
* **Private Frequency:** Enter a specific string (e.g., `GAMMA-7`) to create a hidden room. 
* **Crucial:** Only users with the *exact* same Room ID can see your messages.

### 3. Connection States
* **Hanging/Slow Load:** If the "Join" button spins, the cloud-hosted backend is waking up. Give it 15-30 seconds.
* **Active Nodes:** Once inside, check the sidebar. It displays how many "nodes" (users) are currently active on your frequency.

### 4. Secure Termination
To leave the network, click **DISCONNECT**. 
> **Warning:** Closing the browser tab without clicking disconnect may leave a "ghost" session active in the room for up to 30 seconds.

---

## 🛠 Technical Architecture

* **Frontend:** HTML5 / Tailwind CSS (Hosted on GitHub Pages)
* **Backend:** Node.js / Express (Hosted on Cloud)
* **Network:** Ably Realtime Pub/Sub Protocol
* **Logs:** Real-time event piping to Discord via Webhooks

---

## ⚠️ Troubleshooting

**"I can't see my friend's messages!"**
1. Check that you both spelled the **Room ID** exactly the same (it is case-sensitive).
2. Ensure you both have a stable internet connection to the Ably cluster.

**"The site won't load!"**
Ensure you are using a modern browser (Chrome, Firefox, Edge, or Safari). Internet Explorer is not supported.

---

&copy; 2026 CrypticChat Protocol | *Stay hidden.*
