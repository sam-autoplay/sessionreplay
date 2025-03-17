document.getElementById("scan").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "detect" }, (response) => {
            const resultsList = document.getElementById("results");
            resultsList.innerHTML = ""; // Clear previous results

            if (response && response.detected && response.detected.length > 0) {
                response.detected.forEach(tool => {
                    const li = document.createElement("li");
                    li.textContent = tool;
                    resultsList.appendChild(li);
                });
            } else {
                resultsList.innerHTML = "<li>No session replay tools detected.</li>";
            }
        });
    });
});
