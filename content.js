console.log("Session Replay Detector script injected!");

const sessionReplayTools = [
    { name: "Hotjar", check: () => !!window.hj, script: "hotjar.com" },
    { name: "FullStory", check: () => !!window.FS, script: "fullstory.com" },
    { name: "Microsoft Clarity", check: () => !!window.clarity, script: "clarity.ms" },
    { name: "LogRocket", check: () => !!window.LogRocket, script: "logrocket.com" },
    { name: "Lucky Orange", check: () => !!window.__lo_site_id, script: "luckyorange.com" },
    { name: "Mouseflow", check: () => !!window._mfq, script: "mouseflow.com" },
    { name: "Inspectlet", check: () => !!window.__insp, script: "inspectlet.com" },
    { name: "Smartlook", check: () => !!window.smartlook, script: "smartlook.com" },
    { name: "Crazy Egg", check: () => !!window.CE2, script: "crazyegg.com" },
    { name: "PostHog", check: () => !!window.posthog, script: "posthog.com" },
    { name: "Pendo", check: () => !!window.pendo, script: "pendo.io" },
    { name: "Datadog RUM", check: () => !!window.DD_RUM, script: "datadoghq.com" },
    { name: "SessionCam", check: () => !!window.sessionCamRecorder, script: "sessioncam.com" },
    { name: "Quantum Metric", check: () => !!window.QuantumMetricAPI, script: "quantummetric.com" }
];

function detectSessionReplayTools() {
    console.log("Checking for session replay tools...");
    const detected = sessionReplayTools.filter(tool => {
        try {
            console.log(`Checking: ${tool.name}`);
            return tool.check();
        } catch (error) {
            console.error(`Error checking ${tool.name}:`, error);
            return false;
        }
    }).map(tool => tool.name);

    console.log("Detected tools:", detected);
    return detected;
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "detect") {
        console.log("Received detect request.");
        const results = detectSessionReplayTools();
        sendResponse({ detected: results });
    }
});
