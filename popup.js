document.getElementById("scan").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "detect" }, (response) => {
            const resultsList = document.getElementById("results");
            resultsList.innerHTML = ""; // Clear previous results

            if (response && response.detected.length > 0) {
                response.detected.forEach(tool => {
                    const li = document.createElement("li");
                    li.textContent = typeof tool === "string" ? tool : tool.name; // Ensure only the name is shown
                    resultsList.appendChild(li);
                });
            } else {
                resultsList.innerHTML = "<li>No session replay tools detected.</li>";
            }
        });
    });
});
