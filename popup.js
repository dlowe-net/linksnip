const rules = [
    {pattern: /^https?:\/\/(?:www\.)?youtube\.com\/watch/, params: ["v", "t"], sub: "https://youtu.be/${v}?t=${t}"},
    {pattern: /^https?:\/\/(?:www\.)?youtube\.com\/watch/, params: ["v"], sub: "https://youtu.be/${v}"},
    {pattern: /^https?:\/\/(?:www\.)?reddit\.com\/r\/[^\/]+\/comments\/([0-9a-z]+)/, sub: "https://redd.it/$1"},
    {pattern: /^https?:\/\/(?:[^.]+\.)?amazon\.com\/(?:.*?\/)?(?:dp|gp\/product|d)\/([0-9A-Z]+)/, sub: "https://amazon.com/dp/$1"},
    {pattern: /^https?:\/\/(?:[^.]+\.)?amazon\.com\/hz\/(?:.*?\/)?(?:gp\/registry\/wishlist|wishlist\/genericItemsPage|wishlist\/ls)\/([0-9A-Z]+)/, sub: "https://amazon.com/wishlist/$1"},
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
    {pattern: /^https?:\/\/(?:www\.)?newegg.com\/[0-9a-z\-]+\/p\/N([0-9A-Z]+)/, sub: "https://newegg.com/p/N$1"},
    {pattern: /^https?:\/\/(?:www\.)?homedepot.com\/p\/[0-9a-zA-Z_-]+\/([0-9]+)/, sub: "https://homedepot.com/p/$1"},
    {pattern: /^https?:\/\/bugs.dolphin-emu.org\/issues\/([0-9]+)(.*)/, sub: "https://dolp.in/i$1$2"},
    {pattern: /^https?:\/\/(?:www\.)?github.com\/dolphin-emu\/dolphin\/pull\/([0-9]+)(.*)/, sub: "https://dolp.in/pr$1$2"},
    {pattern: /^https?:\/\/(?:www\.)?github.com\/golang\/go\/issues\/([0-9]+)(.*)/, sub: "https://go.dev/issues/$1$2"},
    {pattern: /^https?:\/\/go-review.googlesource.com\/c\/go\/\+\/([0-9]+)/, sub: "https://go.dev/cl/$1"},
    {pattern: /^https?:\/\/(?:www\.)?github.com\/kubernetes\/enhancements\/issues\/([0-9]+)(.*)/, sub: "https://kep.k8s.io/$1$2"},
    {pattern: /^https?:\/\/(?:www\.)?github.com\/kubernetes\/kubernetes\/issues\/([0-9]+)(.*)/, sub: "https://issues.k8s.io/$1$2"},
    {pattern: /^https?:\/\/(?:www\.)?github.com\/kubernetes\/kubernetes\/pull\/([0-9]+)(.*)/, sub: "https://pr.k8s.io/$1$2"},
];

const surplusParams = [
    "ICID", "_hsenc", "_hsmi", "_openstat", "dclid", "fbclid",
    "gclid", "gclsrc", "icid", "igshid", "mc_cid", "mc_eid",
    "mkt_tok", "msclkid", "ncid", "nr_email_referer", "ns_campaign",
    "ns_fee", "ns_linkname", "ns_mchannel", "ns_source", "ocid",
    "ref", "source", "spm", "sr_share", "srcid", "utm_campaign",
    "utm_cid", "utm_content", "utm_content", "utm_medium", "utm_name",
    "utm_pubreferrer", "utm_reader", "utm_source", "utm_swu",
    "utm_term", "utm_viz_id", "vero_conv", "vero_id", "zanpid"
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

        return rule.sub.replace(/\$(?:([0-9]+)|{([^}]+)})/g,
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
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function popup() {
    try {
        const statusDiv = document.getElementById("status");
        const result = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = result[0];
        const url = mungeUrl(tab.url || tab.pendingUrl);
        const textArea = document.createElement('textarea');
        document.body.append(textArea);
        textArea.textContent = url;
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        statusDiv.innerHTML = url;
    } catch (err) {
        statusDiv.innerHTML = "Error: "+err;
    }
    await delay(2000);
    window.close();
}

// In the context of nodejs (such as in our Jasmine tests,) we should not
// attempt to execute the popup function, since it will not work.
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', popup);
}

// Ensure that we can import this as a module from nodejs, again, such as
// in our Jasmine tests.
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = {mungeUrl};
  }
  exports.mungeUrl = mungeUrl;
}
