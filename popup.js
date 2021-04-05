const patterns = [
    {host: "youtube.com", path: /^\/watch/,
     shorten:(url) => {
         if (url.searchParams.get('v')) {
             return `https://youtu.be/${url.searchParams.get('v')}`;
         }
         return url.href;
     }},
    {host: "amazon.com", path: /\/dp\//,
     shorten:(url) => {
         const parts = url.pathname.split('/')
         const idx = parts.indexOf('dp')
         if (idx) {
             return `https://amzn.com/${parts[idx+1]}`;
         }
         return url.href;
     }},
    {host: "reddit.com", path: /^\/r\/[^/]+\/comments/,
     shorten:(url) => {
         const parts = url.pathname.split('/')
         if (parts.length == 7) {
             // article pages only
             return `https://redd.it/${parts[4]}`
         }
         return url.href;
     }}
];

const removeParams = [
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"
];

function mungeUrl(oURLstr) {
    const url = new URL(oURLstr);
    for (let pattern of patterns) {
        if (!url.hostname.endsWith(pattern.host)) {
            continue;
        }
        if (!url.pathname.match(pattern.path)) {
            continue;
        }
        for (let param of removeParams) {
            url.searchParams.delete(param);
        }
        return pattern.shorten(url)
    }
    for (let param of removeParams) {
        url.searchParams.delete(param);
    }
    return url.href;
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
