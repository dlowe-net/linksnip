function delay(ms) {
    return function(x) {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
}
const statusDiv = document.getElementById("status");
chrome.tabs.query({ active: true, currentWindow: true }).then(
    function (result) {
        const tab = result[0];
        const url = tab.url || tab.pendingUrl;
        navigator.clipboard.writeText(url).then(
            function() {
                statusDiv.innerHTML = "Copied " + url;
            },
            function(err) {
                const textArea = document.createElement('textarea');
                document.body.append(textArea);
                textArea.textContent = url;
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
                statusDiv.innerHTML = "Copied " + url;
                
            });
    },
    function(result) {
        statusDiv.innerHTML = "Failed to acquire tab";
    }
).then(delay(1000)).then(
    function() {
        window.close();
    });
