console.log("Session Replay Detector script injected!");

// Known session replay providers
const sessionReplayTools = [
    { name: "Hotjar", check: () => !!window.hj, script: "hotjar.com" },
    { name: "FullStory", check: () => !!window.FS, script: "fullstory.com" },
    { name: "Microsoft Clarity", check: () => !!window.clarity, script: "clarity.ms" },
    { name: "LogRocket", check: () => !!window.LogRocket, script: "logrocket.com" },
    { name: "Heap Analytics", check: () => !!window.heap, script: "heapanalytics.com" },
    { name: "Google Tag Manager", check: () => !!window.dataLayer, script: "googletagmanager.com" }
];

let detectedTools = new Set();
let potentialTools = new Set();

// Function to detect known session replay tools
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
        if (!detectedTools.has(script.src) && /analytics|tracking|session|replay|rum/i.test(script.src)) {
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
        if (/analytics|tracking|session|replay|rum/i.test(entry.name)) {
            potentialTools.add(entry.name);
        }
    });
});

observer.observe({ entryTypes: ["resource"] });

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "detect") {
        console.log("Received detect request.");
        const results = detectSessionReplayTools();
        sendResponse(results);
    }
});
