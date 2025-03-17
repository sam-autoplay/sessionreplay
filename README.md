# Session Replay Detector

This is a **Chrome Extension** that detects session replay tools used by websites, such as Hotjar, FullStory, PostHog, and more.

## 🚀 Features
- Detects session replay providers including Hotjar, FullStory, Microsoft Clarity, Pendo, and more.
- Checks for global objects, script tags, and network requests to identify session replay tools.
- Displays results in a simple popup.

---

## 🛠 Installation Guide

### **1. Clone the Repository**
```sh
git clone https://github.com/sam-autoplay/sessionreplay.git
cd sessionreplay
```

### **2. Load the Extension into Chrome**
1. Open **Google Chrome** and go to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** and select the folder where you cloned this repository.
4. The extension should now appear in your browser toolbar!

### **3. Usage**
1. Navigate to any website.
2. Click the **Session Replay Detector** extension icon.
3. Click the **Scan Website** button.
4. The extension will display detected session replay tools.

---

## 📌 Supported Session Replay Providers
This extension detects the following session replay providers:
- **Hotjar**
- **FullStory**
- **Microsoft Clarity**
- **LogRocket**
- **Lucky Orange**
- **Mouseflow**
- **Inspectlet**
- **Smartlook**
- **Crazy Egg**
- **PostHog**
- **Pendo**
- **Datadog RUM**
- **SessionCam**
- **Quantum Metric**
- **Heap Analytics**

---

## 🐛 Troubleshooting
- **Not detecting tools?** Try refreshing the website and scanning again.
- **Still not working?** Open **Developer Tools** (`F12` → Console) and check for errors.
- **Want to contribute?** Fork the repo and submit a PR!

---

## 🛠 Future Improvements
- Automatic updates to include new session replay tools.
- Better detection of obfuscated tracking scripts.
- Support for Firefox and Edge extensions.

Feel free to contribute and suggest improvements! 🚀
