document.addEventListener("DOMContentLoaded", () => {
    const scanButton = document.getElementById("scan");
    const detectedTab = document.getElementById("detectedTab");
    const potentialTab = document.getElementById("potentialTab");
    const detectedContent = document.getElementById("detectedContent");
    const potentialContent = document.getElementById("potentialContent");

    // Handle tab switching
    function switchTab(tab) {
        if (tab === "detected") {
            detectedContent.classList.remove("hidden");
            potentialContent.classList.add("hidden");
            detectedTab.classList.add("active");
            potentialTab.classList.remove("active");
        } else {
            detectedContent.classList.add("hidden");
            potentialContent.classList.remove("hidden");
            detectedTab.classList.remove("active");
            potentialTab.classList.add("active");
        }
    }

    detectedTab.addEventListener("click", () => switchTab("detected"));
    potentialTab.addEventListener("click", () => switchTab("potential"));

    // Send message to content script to detect session replay tools
    scanButton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "detect" }, (response) => {
                const resultsList = document.getElementById("results");
                resultsList.innerHTML = "";

                if (response && response.detected.length > 0) {
                    response.detected.forEach(tool => {
                        const li = document.createElement("li");
                        li.textContent = tool;
                        resultsList.appendChild(li);
                    });
                } else {
                    resultsList.innerHTML = "<li>No session replay tools detected.</li>";
                }

                // Display potential session replay providers
                const potentialList = document.getElementById("potentialResults");
                potentialList.innerHTML = "";

                if (response && response.potential.length > 0) {
                    response.potential.forEach(provider => {
                        const li = document.createElement("li");
                        li.textContent = provider;
                        potentialList.appendChild(li);
                    });
                } else {
                    potentialList.innerHTML = "<li>No additional session replay scripts found.</li>";
                }
            });
        });
    });
});
