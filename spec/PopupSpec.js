const PopupModule = require("../popup.js");

function runCases(testCases) {
  for (const { url, want } of testCases) {
    it(`simplifies ${url}`, () => {
      expect(PopupModule.mungeUrl(url)).toBe(want);
    });
  }
}

describe("Linksnip", () => {
  describe("for amazon.com", () => {
    runCases([
      {
        url: "https://smile.amazon.com/CloudValley-W3-0-6mm-Thin-Sticker-Surfcase/dp/B07B66VZ97/?_encoding=UTF8&pd_rd_w=uwL9y&pf_rd_p=43ea9b7e-4160-4f68-b311-3810df065596&pf_rd_r=XJFX332VNAJR169AXHSV&pd_rd_r=304deadc-8bb7-4064-a762-cabc8d26fba0&pd_rd_wg=Ytr6e&ref_=pd_gw_cr_cartx",
        want: "https://amzn.com/dp/B07B66VZ97",
      },
      {
        url: "https://smile.amazon.com/dp/B07B66VZ97/?_encoding=UTF8&pd_rd_w=uwL9y&pf_rd_p=43ea9b7e-4160-4f68-b311-3810df065596&pf_rd_r=XJFX332VNAJR169AXHSV&pd_rd_r=304deadc-8bb7-4064-a762-cabc8d26fba0&pd_rd_wg=Ytr6e&ref_=pd_gw_cr_cartx",
        want: "https://amzn.com/dp/B07B66VZ97",
      },
      {
        url: "https://www.amazon.com/gp/product/0593230574/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1",
        want: "https://amzn.com/dp/0593230574",
      },
      {
        url: "https://smile.amazon.com/dp/B08SZ26WF9/ref=ods_gw_ha_d_dc_gg_040821?pf_rd_r=34MREQJKH[…]228-a6c995319870&pd_rd_w=2IDIn&pd_rd_wg=a9Mfl&ref_=pd_gw_unk",
        want: "https://amzn.com/dp/B08SZ26WF9",
      },
    ]);
  });

  describe("for youtube.com", () => {
    runCases([
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        want: "https://youtu.be/dQw4w9WgXcQ",
      },
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30",
        want: "https://youtu.be/dQw4w9WgXcQ?t=30",
      },
      {
        url: "https://www.youtube.com/watch?t=30&v=dQw4w9WgXcQ",
        want: "https://youtu.be/dQw4w9WgXcQ?t=30",
      },
    ]);
  });

  describe("for reddit.com", () => {
    runCases([
      {
        url: "https://www.reddit.com/r/pics/comments/haucpf/ive_found_a_few_funny_memories_during_lockdown/",
        want: "https://redd.it/haucpf",
      },
    ]);
  });

  describe("for stackoverflow.com and stackexchange.com", () => {
    runCases([
      {
        url: "https://stackoverflow.com/questions/62425775/inner-joins-2-tables-in-mongoose",
        want: "https://stackoverflow.com/q/62425775",
      },
      {
        url: "https://stackoverflow.com/questions/62425775/inner-joins-2-tables-in-mongoose/67008177#67008177",
        want: "https://stackoverflow.com/a/67008177",
      },
      {
        url: "https://physics.stackexchange.com/questions/629128/why-did-we-expect-gravitational-mass-and-inertial-mass-to-be-different",
        want: "https://physics.stackexchange.com/q/629128",
      },
      {
        url: "https://physics.stackexchange.com/questions/629128/why-did-we-expect-gravitational-mass-and-inertial-mass-to-be-different/629140#629140",
        want: "https://physics.stackexchange.com/a/629140",
      },
    ]);
  });

  describe("for google.com", () => {
    runCases([
      {
        url: "https://www.google.com/search?q=%22foo%22&sxsrf=ALeKk03frJQez7V8QwZ0el3GsVHQRPxrJA%3A1618504852560&ei=lGx4YOLbIcHl_Qaur5vwCw&oq=%22foo%22&gs_lcp=Cgdnd3Mtd2l6EAMyBAgjECcyBwguELEDEEMyBwgAELEDEEMyBwgAELEDEEMyBAguEEMyBAguEEMyBAgAEEMyBwguELEDEEMyBAguEEMyBAguEEM6BwgjELADECc6BwgAEEcQsAM6CgguELADEMgDEEM6EAguEMcBEKMCELADEMgDEEM6AggAOgQIABAKOgQIABAeOgYIABAKEB46BggAEAUQHjoKCC4QhwIQsQMQFDoFCAAQyQM6BQgAEJIDOgsILhCxAxDHARCjAjoNCAAQhwIQsQMQgwEQFDoHCC4QhwIQFDoFCC4QsQM6DQguELEDEMcBEKMCEEM6CAgAELEDEIMBOgcIIxDqAhAnOgUIABCxA0oFCDgSATFQ3cAJWOncCWDC4gloBHACeACAAc8CiAHNDJIBBzYuNy4wLjGYAQCgAQGqAQdnd3Mtd2l6sAEKyAEOwAEB&sclient=gws-wiz&ved=0ahUKEwji9ba22IDwAhXBct8KHa7XBr4Q4dUDCA0&uact=5",
        want: "https://goo.gl/search/%22foo%22",
      },
      {
        url: "https://www.google.com/search?q=%22foo%22&sxsrf=ALeKk02zqj1mcj3ox6qV_tNHTbgbfO6qpA:1618505013923&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjwv6-D2YDwAhVRmeAKHZaaC44Q_AUoA3oECAIQBQ&biw=1920&bih=950",
        want: "https://google.com/search?q=%22foo%22&tbm=isch",
      },
    ]);
  });

  describe("for flickr.com", () => {
    runCases([
      {
        url: "https://flickr.com/photos/peter-arn/49334688706/in/photostream/",
        want: "https://flic.kr/p/2iaxba9",
      },
    ]);
  });

  describe("for newegg.com", () => {
    runCases([
      {
        url: "https://www.newegg.com/exterior-interior-black-thermaltake-view-37-argb-edition-mid-tower-chassis-mid-tower/p/N82E16811133389?Item=N82E16811133389",
        want: "https://newegg.com/p/N82E16811133389",
      },
      {
        url: "https://www.newegg.com/cyberlink-884799004155-suite-version/p/N82E16832117215",
        want: "https://newegg.com/p/N82E16832117215",
      },
    ]);
  });

  describe("for autotrader.com", () => {
    runCases([
      {
        url: "https://www.autotrader.com/cars-for-sale/vehicledetails.xhtml?listingId=579353652&allListingType=all-cars&zip=02474&state=MA&city=Arlington&dma=&searchRadius=25&isNewSearch=false&referrer=%2Fcars-for-sale%2Fall-cars%3Fzip%3D02474&clickType=spotlight",
        want: "https://autotrader.com/cars-for-sale/vehicledetails.xhtml?listingId=579353652",
      },
    ]);
  });

  describe("for homedepot.com", () => {
    runCases([
      {
        url: "https://www.homedepot.com/p/American-Standard-Champion-Tall-Height-2-Piece-High-Efficiency-1-28-GPF-Single-Flush-Elongated-Toilet-in-White-Seat-Included-747AA107SC-020/312442216?MERCH=REC-_-sp-_-pip_sponsored-_-2-_-n/a-_-HDProdPage-_-n/a-_-n/a-_-n/a&ITC=AUC-161279-23-12030",
        want: "https://homedepot.com/p/312442216",
      },
    ]);
  });

    describe("for dophin-emu", () => {
      runCases([
        {
          url: "https://bugs.dolphin-emu.org/issues/12345",
          want: "https://dolp.in/i12345",
        },
        {
          url: "https://www.github.com/dolphin-emu/dolphin/pull/12345",
          want: "https://dolp.in/pr12345",
        },
      ]);
    });
  describe("for golang", () => {
    runCases([
      {
          url: "https://github.com/golang/go/issues/12345",
          want: "https://go.dev/issues/12345",
      },
      {
          url: "https://go-review.googlesource.com/c/go/+/12345",
          want: "https://go.dev/cl/12345",
      },
    ]);
  });

  describe("for kubernetes github repo", () => {
    runCases([
      {
          url: "https://github.com/kubernetes/kubernetes/issues/12345#issue-54321",
          want: "https://issues.k8s.io/12345#issue-54321",
      },
      {
          url: "https://github.com/kubernetes/kubernetes/pull/12345#issue-54321",
          want: "https://pr.k8s.io/12345#issue-54321",
      },
      {
          url: "https://github.com/kubernetes/enhancements/issues/3582#issue-54321",
          want: "https://kep.k8s.io/3582#issue-54321",
      },
    ]);
  });

  describe("for generic URLs", () => {
    runCases([
      {
        url: "https://example.com/foo?fbclid=23842384238742",
        want: "https://example.com/foo",
      },
      {
        url: "https://example.com/foo?utm_source=foo&utm_medium=tests&utm_campaign=epic",
        want: "https://example.com/foo",
      },
    ]);
  });
});
