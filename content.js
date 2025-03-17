console.log("Session Replay Detector script injected!");

// Expanded list of known session replay and digital experience analytics providers
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
    { name: "Quantum Metric", check: () => !!window.QuantumMetricAPI, script: "quantummetric.com" },
    { name: "Heap Analytics", check: () => !!window.heap, script: "heapanalytics.com" },
    { name: "Amplitude", check: () => !!window.amplitude, script: "amplitude.com" },
    { name: "Glassbox", check: () => !!window.glassbox, script: "glassboxdigital.com" },
    { name: "UXCam", check: () => !!window.UXCAM, script: "uxcam.com" },
    { name: "OpenReplay", check: () => !!window.openReplay, script: "openreplay.com" },
    { name: "Rookout", check: () => !!window.Rookout, script: "rookout.com" },
    { name: "ContentSquare", check: () => !!window.CS_CONF, script: "contentsquare.net" },
    { name: "SessionStack", check: () => !!window.SessionStack, script: "sessionstack.com" },
    { name: "VWO Insights", check: () => !!window._vwo, script: "visualwebsiteoptimizer.com" },
    { name: "Crazy Egg", check: () => !!window.CE2, script: "crazyegg.com" }
];

let detectedTools = new Set();
let potentialTools = new Set();

// Function to detect session replay tools
function detectSessionReplayTools() {
    sessionReplayTools.forEach(tool => {
        try {
            if (tool.check()) {
                detectedTools.add(tool.name);
            }
        } catch (error) {
            console.error(`Error checking ${tool.name}:`, error);
        }
    });

    // Check for script tags
    document.querySelectorAll("script").forEach(script => {
        sessionReplayTools.forEach(tool => {
            if (script.src.includes(tool.script)) {
                detectedTools.add(tool.name);
            }
        });

        // Capture unknown tracking scripts
        if (/analytics|tracking|session|replay|rum|fullstory/i.test(script.src)) {
            potentialTools.add(script.src);
        }
    });

    return {
        detected: Array.from(detectedTools),
        potential: Array.from(potentialTools)
    };
}

// Monitor network requests for additional session replay tools
const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        sessionReplayTools.forEach(tool => {
            if (entry.name.includes(tool.script)) {
                detectedTools.add(tool.name);
            }
        });

        // Capture potential session replay-related network requests
        if (/analytics|tracking|session|replay|rum|fullstory/i.test(entry.name)) {
            potentialTools.add(entry.name);
        }
    });
});

observer.observe({ entryTypes: ["resource"] });

// **Monitor dynamically loaded scripts**
const scriptObserver = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.tagName === "SCRIPT" && node.src) {
                sessionReplayTools.forEach(tool => {
                    if (node.src.includes(tool.script)) {
                        detectedTools.add(tool.name);
                    }
                });

                // Capture additional unknown session tracking scripts
                if (/analytics|tracking|session|replay|rum|fullstory/i.test(node.src)) {
                    potentialTools.add(node.src);
                }
            }
        });
    });
});

// Observe script elements being added
scriptObserver.observe(document.documentElement, { childList: true, subtree: true });

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "detect") {
        console.log("Received detect request.");
        const results = detectSessionReplayTools();
        sendResponse(results);
    }
});
