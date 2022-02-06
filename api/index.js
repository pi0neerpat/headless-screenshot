const playwright = require("playwright-core");
const chromium = require("chrome-aws-lambda");

module.exports = async (req, res) => {
  let url = "https://duckduckgo.com";
  let width = 514;
  let height = 171;
  if (req.querytringParameters) {
    ({ width, height, url } = req.querytringParameters);
  }

  let browser = null;
  try {
    const browser = await playwright.chromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const context = await browser.newContext();

    const page = await context.newPage();
    await page.goto(url, {
      waitUntil: "networkidle",
    });
    const buffer = await page.screenshot();
    res.send({
      statusCode: 200,
      headers: { "Content-Type": "image/jpeg" },
      body: buffer,
    });
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      body: error,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
