const rules = [
    {pattern: /^https?:\/\/(?:www\.)?youtube.com\/watch\?v=([0-9a-zA-Z]+)/, sub: "https://youtu.be/$1"},
    {pattern: /^https?:\/\/(?:www\.)?reddit.com\/r\/[^\/]+\/comments\/([0-9a-z]+)/, sub: "https://redd.it/$1"},
    {pattern: /^https?:\/\/(?:www\.|smile\.)?amazon.com\/(?:.*?\/)?(?:dp|gp\/product|d)\/([0-9A-Z]+)/, sub: "https://amzn.com/$1"},
    {pattern: /^https?:\/\/(?:www\.)?ebay.com\/itm\/[^\/]+\/([0-9]+)/, sub: "https://ebay.com/itm/$1"},
    {pattern: /^https?:\/\/(?:www\.)?ebay.com\/itm\/([0-9]+)/, sub: "https://ebay.com/itm/$1"},
    {pattern: /^https?:\/\/(?:www\.)?stackoverflow.com\/questions\/([0-9]+)/, sub: "https://stackoverflow.com/q/$1"},
    {pattern: /^https?:\/\/([^.]+)\.stackexchange.com\/questions\/([0-9]+)/, sub: "https://$1.stackexchange.com/q/$2"},
];

function mungeUrl(oURLstr) {
    for (let rule of rules) {
        const match = oURLstr.match(rule.pattern);
        if (!match) {
            continue;
        }
        return rule.sub.replaceAll(/\$([0-9]+)/g, (_, num) => {
            return match[parseInt(num)];
        });
    }
    return oURLstr;
}

function delay(ms) {
    return function(x) {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
}

const statusDiv = document.getElementById("status");
chrome.tabs.query({ active: true, currentWindow: true }).then(
    function (result) {
        const tab = result[0];
        const url = mungeUrl(tab.url || tab.pendingUrl);
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
