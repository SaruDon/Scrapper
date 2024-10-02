import { launch } from "puppeteer";

export async function findDomainViaGoogle(companyName) {
  const query = `${companyName} official site`;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  const browser = await launch({ headless: false, defaultViewport: null }); 
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
  );

  try {
    await page.goto(searchUrl);

    const citeSelector = "cite.tjvcx.GvPZzd.cHaqb"; 
    await page.waitForSelector(citeSelector); 

    let citation = await page.evaluate((selector) => {
      const citeElement = document.querySelector(selector);
      return citeElement ? citeElement.textContent : null; 
    }, citeSelector);

    console.log(`Extracted citation: ${citation}`);

    let tldMatch = citation.match(/\.([a-z]{2,63})$/); 
    console.log('tldMatch', tldMatch)
    let tld = tldMatch ? tldMatch[0] : null;

    if (tld) {
      console.log(`The TLD (extension) is: ${tld}`);
    } else {
      console.log("TLD not found.");
    }

    return tld;
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return null;
  } finally {
    await browser.close();
  }
}
