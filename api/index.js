const playwright = require("playwright-aws-lambda");

exports.handler = async (event, context) => {
  let url = "https://duckduckgo.com";
  let width = 514;
  let height = 171;
  if (event.querytringParameters) {
    ({ width, height, url } = event.querytringParameters);
  }

  let browser = null;
  try {
    const browser = await playwright.launchChromium();
    const context = await browser.newContext();

    const page = await context.newPage();
    await page.goto(url, {
      waitUntil: "networkidle",
    });
    const buffer = await page.screenshot();
    return {
      statusCode: 200,
      headers: { "Content-Type": "image/jpeg" },
      body: buffer,
    };
  } catch (error) {
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
