const playwright = require("playwright-aws-lambda");

exports.handler = async (event, context) => {
  let url = "https://duckduckgo.com";
  if (event.querytringParameters) {
    ({ url } = event.querytringParameters);
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
