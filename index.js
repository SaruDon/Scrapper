import puppeteer from "puppeteer";

const getContacts = async () => {
  const browser = await puppeteer.launch({
    headless: false,  // Change to true if you want to run without seeing the browser
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // Navigate to the SalesQL dashboard (replace with your own login flow if required)
  await page.goto("https://app.salesql.com/dashboard/contacts?folders=c7a221e2-abd0-4c0e-85c7-c397a968883d&current_tab=1093748", {
    waitUntil: "domcontentloaded",
  });

  // Add login flow here if required (you can use page.type() to input credentials and page.click() to click login buttons)

  // Wait for the page to fully load contacts data
  await page.waitForSelector(".cell-container", { timeout: 120000 });

  // Extract data
  const persons = await page.evaluate(() => {
    const contactRows = document.querySelectorAll("tr"); // Assuming each contact is a table row

    // Convert NodeList to array and map over each row
    return Array.from(contactRows).map((row) => {
      const name = row.querySelector(".name")?.innerText || "";
      const company = row.querySelector(".company-info-container .name")?.innerText || "";
      const email = row.querySelector(".contact-info-item span")?.innerText || "";

      return {
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
      };
    });
  });

  console.log(persons);  // Output the collected contacts

  // Close the browser
  await browser.close();
};

// Start the scraping
getContacts();
