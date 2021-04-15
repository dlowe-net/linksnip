const rules = [
    {pattern: /^https?:\/\/(?:www\.)?youtube.com\/watch/, params: ["v", "t"], sub: "https://youtu.be/${v}?t=${t}"},
    {pattern: /^https?:\/\/(?:www\.)?youtube.com\/watch/, params: ["v"], sub: "https://youtu.be/${v}"},
    {pattern: /^https?:\/\/(?:www\.)?reddit.com\/r\/[^\/]+\/comments\/([0-9a-z]+)/, sub: "https://redd.it/$1"},
    {pattern: /^https?:\/\/(?:www\.|smile\.)?amazon.com\/(?:.*?\/)?(?:dp|gp\/product|d)\/([0-9A-Z]+)/, sub: "https://amzn.com/$1"},
    {pattern: /^https?:\/\/(?:www\.)?ebay.com\/itm\/[^\/]+\/([0-9]+)/, sub: "https://ebay.com/itm/$1"},
    {pattern: /^https?:\/\/(?:www\.)?ebay.com\/itm\/([0-9]+)/, sub: "https://ebay.com/itm/$1"},
    {pattern: /^https?:\/\/(?:www\.)?stackoverflow.com\/questions\/[0-9]+\/[^\/]+\/([0-9]+)/, sub: "https://stackoverflow.com/a/$1"},
    {pattern: /^https?:\/\/(?:www\.)?stackoverflow.com\/questions\/([0-9]+)/, sub: "https://stackoverflow.com/q/$1"},
    {pattern: /^https?:\/\/([^.]+)\.stackexchange.com\/questions\/[0-9]+\/[^\/]+\/([0-9]+)/, sub: "https://$1.stackexchange.com/a/$2"},
    {pattern: /^https?:\/\/([^.]+)\.stackexchange.com\/questions\/([0-9]+)/, sub: "https://$1.stackexchange.com/q/$2"},
];

function mungeUrl(oURLstr) {
    const params = new URL(oURLstr).searchParams;

    toNextRule:
    for (let rule of rules) {
        const match = oURLstr.match(rule.pattern);
        if (!match) {
            continue toNextRule;
        }
        if (rule.params) {
            for (let param of rule.params) {
                if (!params.has(param)) {
                    continue toNextRule;
                }
            }
        }
        return rule.sub.replaceAll(/\$([0-9]+)/g, (_, num) => {
            return match[parseInt(num)];
        }).replaceAll(/\${([^}]+)}/g, (_, param) => {
            return params.get(param)
        });
    }
    return oURLstr;
}

function delay(ms) {
    return function(x) {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
}

function popup() {
    const statusDiv = document.getElementById("status");
    chrome.tabs.query({ active: true, currentWindow: true }).then(
        function (result) {
            const tab = result[0];
            const url = mungeUrl(tab.url || tab.pendingUrl);
            navigator.clipboard.writeText(url).then(
                function() {
                    statusDiv.innerHTML = url;
                },
                function(err) {
                    const textArea = document.createElement('textarea');
                    document.body.append(textArea);
                    textArea.textContent = url;
                    textArea.select();
                    document.execCommand('copy');
                    textArea.remove();
                    statusDiv.innerHTML = url;

                });
        },
        function(result) {
            statusDiv.innerHTML = "Failed to acquire tab";
        }
    ).then(delay(2000)).then(
        function() {
            window.close();
        });
}

if (document.body && document.body.id == "linksnip-popup-body") {
    popup();
}
