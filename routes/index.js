var express = require("express");
var https = require("https");

var router = express.Router();
router.get("/getTimeStories", async function (_req, res, _next) {
  const respData = [];
  await new Promise((resolve, _reject) => {
    https.get("https://time.com", (resp) => {
      let data = "";

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", () => {
        const rgx = /<div class="partial latest-stories"([\S\s]*?)div>/;
        const rslt = rgx.exec(data)[1];
        const splitter = /<li([\S\s]*?)li>/;
        const rsltSplit = rslt.split(splitter);

        for (const str of rsltSplit) {
          const titleRgx = /headline">([\S\s]*?)</;
          const title = titleRgx.exec(str);

          const linkRgx = /<a href="([\S\s]*?)">/;
          const link = linkRgx.exec(str);

          title &&
            respData.push({
              title: title[1],
              link: `https://time.com${link[1]}`,
            });
        }
        resolve();
      });
    });
  });

  res.send(respData);
});

module.exports = router;
