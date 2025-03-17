console.log("Session Replay Detector script injected!");

// List of known session replay providers
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
    { name: "Quantum Metric", check: () => !!window.QuantumMetricAPI, script: "quantummetric.com" },  // ← **Comma added**
    { name: "Heap Analytics", check: () => !!window.heap, script: "cdn.heapanalytics.com" }  // ← **Now valid**
];

// **Step 1: Detect known tools via global variables**
function detectSessionReplayTools() {
    console.log("Checking for session replay tools...");
    let detected = [];

    sessionReplayTools.forEach(tool => {
        try {
            if (tool.check()) {
                detected.push({ name: tool.name, method: "window object" });
                console.log(`Detected ${tool.name} via global variable.`);
            }
        } catch (error) {
            console.error(`Error checking ${tool.name}:`, error);
        }
    });

    return detected;
}

// **Step 2: Detect script tags dynamically**
function detectUnknownReplayTools() {
    let unknownTools = [];
    document.querySelectorAll("script").forEach(script => {
        if (
            script.src &&
            !sessionReplayTools.some(tool => script.src.includes(tool.script)) && // Ignore known tools
            /analytics|tracking|session|replay|rum|heatmap|behavior/i.test(script.src) // Heuristic check
        ) {
            unknownTools.push({ name: "Unknown Tool", script: script.src });
            console.log(`Possible unknown session replay script found: ${script.src}`);
        }
    });

    return unknownTools;
}

// **Step 3: Monitor network requests dynamically**
const detectedRequests = new Set();
const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        if (!detectedRequests.has(entry.name)) {
            detectedRequests.add(entry.name);
            if (/analytics|tracking|session|replay|rum|heatmap|behavior/i.test(entry.name)) {
                console.log(`Possible session replay provider detected via network request: ${entry.name}`);
            }
        }
    });
});

observer.observe({ entryTypes: ["resource"] });

// **Step 4: Run detection with a delay**
setTimeout(() => {
    console.log("Running delayed detection...");
    let knownTools = detectSessionReplayTools();
    let unknownTools = detectUnknownReplayTools();
    
    let allDetected = [...knownTools, ...unknownTools];

    if (allDetected.length > 0) {
        console.log("Detected session replay tools:", allDetected);
    } else {
        console.log("No session replay tools detected.");
    }
}, 5000);

// **Step 5: Listen for popup.js requests**
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "detect") {
        console.log("Received detect request.");
        let knownTools = detectSessionReplayTools();
        let unknownTools = detectUnknownReplayTools();
        
        sendResponse({ detected: [...knownTools, ...unknownTools] });
    }
});
