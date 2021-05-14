const rules = [
    {pattern: /^https?:\/\/(?:www\.)?youtube\.com\/watch/, params: ["v", "t"], sub: "https://youtu.be/${v}?t=${t}"},
    {pattern: /^https?:\/\/(?:www\.)?youtube\.com\/watch/, params: ["v"], sub: "https://youtu.be/${v}"},
    {pattern: /^https?:\/\/(?:www\.)?reddit\.com\/r\/[^\/]+\/comments\/([0-9a-z]+)/, sub: "https://redd.it/$1"},
    {pattern: /^https?:\/\/(?:www\.|smile\.)?amazon\.com\/(?:.*?\/)?(?:dp|gp\/product|d)\/([0-9A-Z]+)/, sub: "https://amzn.com/$1"},
    {pattern: /^https?:\/\/(?:www\.)?ebay\.com\/itm\/[^\/]+\/([0-9]+)/, sub: "https://ebay.com/itm/$1"},
    {pattern: /^https?:\/\/(?:www\.)?ebay\.com\/itm\/([0-9]+)/, sub: "https://ebay.com/itm/$1"},
    {pattern: /^https?:\/\/(?:www\.)?stackoverflow\.com\/questions\/[0-9]+\/[^\/]+\/([0-9]+)/, sub: "https://stackoverflow.com/a/$1"},
    {pattern: /^https?:\/\/(?:www\.)?stackoverflow\.com\/questions\/([0-9]+)/, sub: "https://stackoverflow.com/q/$1"},
    {pattern: /^https?:\/\/([^.]+)\.stackexchange\.com\/questions\/[0-9]+\/[^\/]+\/([0-9]+)/, sub: "https://$1.stackexchange.com/a/$2"},
    {pattern: /^https?:\/\/([^.]+)\.stackexchange\.com\/questions\/([0-9]+)/, sub: "https://$1.stackexchange.com/q/$2"},
    {pattern: /^https:\/\/chrome\.google\.com\/webstore\/detail\/linksnip\/okaihadjplgpflaomekmidjaepnbbceo/, sub: "https://linksnip.app/"},
    {pattern: /^https:\/\/github\.com\/dlowe-net\/linksnip\/?(.*)$/, sub: "https://source.linksnip.app/$1"},
    {pattern: /^https?:\/\/(?:www\.)?instagram\.com\/([^\?]+)/, sub: "https://instagr.am/$1"},
    {pattern: /^https?:\/\/flickr\.com\/photos\/[^\/]+\/([0-9]+)/, func: flickrUrl},
    {pattern: /^https?:\/\/(?:www\.)?google.com\/search/, params: ["q", "tbm"], sub: "https://google.com/search?q=${q}&tbm=${tbm}"},
    {pattern: /^https?:\/\/(?:www\.)?google.com\/search/, params: ["q"], sub: "https://goo.gl/search/${q}"},
    {pattern: /^https?:\/\/(?:www\.)?autotrader.com\/cars-for-sale\/vehicledetails.xhtml/, params: ["listingId"], sub: "https://autotrader.com/cars-for-sale/vehicledetails.xhtml?listingId=${listingId}"},
];

const surplusParams = [
    "ICID", "_hsenc", "_hsmi", "fbclid", "gclid", "icid", "igshid",
    "mc_cid", "mc_eid", "mkt_tok", "ncid", "nr_email_referer",
    "ns_campaign", "ns_fee", "ns_linkname", "ns_mchannel",
    "ns_source", "ocid", "ref", "source", "spm", "sr_share", "srcid",
    "utm_campaign", "utm_cid", "utm_content", "utm_content",
    "utm_medium", "utm_name", "utm_pubreferrer", "utm_reader",
    "utm_source", "utm_swu", "utm_term", "utm_viz_id", "vero_conv",
    "vero_id"
];

function flickrUrl(m) {
    const codeTable = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
    var num = parseInt(m[1]);
    var id = '';
    while (num > 0) {
        id = codeTable[num % 58] + id;
        num = Math.floor(num / 58);
    }
    return `https://flic.kr/p/${id}`
}

function mungeUrl(oURLstr) {
    const url = new URL(oURLstr)
    const params = url.searchParams;

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
        if (rule.func) {
            return rule.func(match)
        }
        return rule.sub.replaceAll(/\$(?:([0-9]+)|{([^}]+)})/g,
                                   (_, num, param) => {
                                       if (num) {
                                           return match[parseInt(num)];
                                       }
                                       return encodeURI(params.get(param))
                                   });
    }

    // The rules will generate the minimal url, but if none of those
    // match, we can still remove unnecessary parameters.
    for (let param of surplusParams) {
        params.delete(param)
    }
    return url.toString();
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
