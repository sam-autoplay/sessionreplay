console.log("Session Replay Detector script injected!");

// List of known session replay providers
const sessionReplayTools = [
    { name: "Hotjar", check: () => !!window.hj, script: "hotjar.com" },
    { name: "FullStory", check: () => !!window.FS, script: "fullstory.com" }, // FullStory detection
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
    { name: "Quantum Metric", check: () => !!window.QuantumMetricAPI, script: "quantummetric.com" },
    { name: "Heap Analytics", check: () => !!window.heap, script: "cdn.heapanalytics.com" }
];

// Function to detect session replay tools
function detectSessionReplayTools() {
    console.log("Checking for session replay tools...");
    let detected = [];

    // Check for global variables
    sessionReplayTools.forEach(tool => {
        try {
            if (tool.check()) {
                detected.push(tool.name);
                console.log(`Detected ${tool.name} via global variable.`);
            }
        } catch (error) {
            console.error(`Error checking ${tool.name}:`, error);
        }
    });

    // Check for script tags in the HTML
    document.querySelectorAll("script").forEach(script => {
        sessionReplayTools.forEach(tool => {
            if (script.src.includes(tool.script) && !detected.includes(tool.name)) {
                detected.push(tool.name);
                console.log(`Detected ${tool.name} via script tag: ${script.src}`);
            }
        });
    });

    return detected;
}

// Monitor network requests dynamically
const detectedRequests = new Set();
const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        if (!detectedRequests.has(entry.name)) {
            detectedRequests.add(entry.name);
            sessionReplayTools.forEach(tool => {
                if (entry.name.includes(tool.script) && !detectedRequests.has(tool.name)) {
                    detectedRequests.add(tool.name);
                    console.log(`Detected ${tool.name} via network request: ${entry.name}`);
                }
            });
        }
    });
});

observer.observe({ entryTypes: ["resource"] });

// **Recheck FullStory after 5 seconds** (for delayed loading)
setTimeout(() => {
    console.log("Running delayed detection for FullStory...");
    if (!!window.FS && !detectedRequests.has("FullStory")) {
        detectedRequests.add("FullStory");
        console.log("Detected FullStory via delayed check.");
    }
}, 5000);

// Listen for popup.js requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "detect") {
        console.log("Received detect request.");
        const results = detectSessionReplayTools();
        sendResponse({ detected: Array.from(detectedRequests) });
    }
});
