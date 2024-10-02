import { launch } from 'puppeteer';
import { writeFileSync } from 'fs';
import { findDomainViaGoogle } from './helper/domain.js'; 
import dotenv from 'dotenv'; // Import dotenv

// Load environment variables from .env file
dotenv.config(); 

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeLinkedInProfile({ linkedInProfileUrl }) {
    const linkedInEmail = process.env.LINKEDIN_ID;
    const linkedInPassword = process.env.LINKEDIN_PASS;

    if (!linkedInEmail || !linkedInPassword) {
        throw new Error('LinkedIn email or password not set in environment variables');
    }

    const browser = await launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log("Starting LinkedIn scraping...");

        // Step 1: Login to LinkedIn
        console.log("Navigating to LinkedIn login page...");
        await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2', timeout: 90000 });
        console.log("LinkedIn login page loaded.");

        await page.type('#username', linkedInEmail);
        console.log("Entered LinkedIn email.");

        await page.type('#password', linkedInPassword);
        console.log("Entered LinkedIn password.");

        await delay(5000);

        await page.click('button[type="submit"]');
        console.log("Login button clicked, waiting for navigation...");

        await delay(5000);

        try {
          await page.waitForSelector('img.global-nav__me-photo', { timeout: 90000 });
          console.log("Login successful, profile icon found.");
      } catch (error) {
          throw new Error("Login failed, profile image not found.");
      }

        await delay(5000);

        // Step 2: Navigate to the LinkedIn profile URL
        console.log(`Navigating to LinkedIn profile URL: ${linkedInProfileUrl}`);
        await page.goto(linkedInProfileUrl);
        console.log("Navigated to LinkedIn profile page!");

        await delay(5000);

        // Step 3: Scrape Name, Job Title, and Company from the profile page
        const profileData = await page.evaluate(() => {
          const name = document.querySelector('.text-heading-xlarge')?.innerText || 'Name Not Found';
          const jobTitle = document.querySelector('.text-body-medium')?.innerText || 'Job Title Not Found';
          const companyElement = document.querySelector('div[class*="inline-show-more-text--is-collapsed"]');
          const company = companyElement?.innerText.trim() || 'Company Not Found';

          return { name, jobTitle, company };
        });

        console.log('Profile Data:', profileData);

        await delay(5000);

        // Step 4: Use findDomainViaGoogle to get the company's domain
        console.log(`Finding domain for company: ${profileData.company}`);
        const domain = await findDomainViaGoogle(profileData.company);

        if (!domain) {
            throw new Error('Unable to find company domain');
        }

        console.log(`Company domain: ${domain}`);

        // Step 5: Generate email patterns based on the scraped name and company domain
        console.log("Generating email patterns...");
        const emailPatterns = generateEmails(profileData.name, domain);

        console.log('Generated Email Patterns:', emailPatterns);

        // Step 6: Save the scraped data and email patterns to a JSON file
        console.log("Saving profile data and email patterns to JSON file...");
        const outputData = { profileData, emailPatterns };
        writeFileSync('linkedin_profile_data.json', JSON.stringify(outputData, null, 2));
        console.log('Profile data and email patterns saved to linkedin_profile_data.json');
        await delay(5000);

    } catch (error) {
        console.error('Error occurred:', error.message);
    } finally {
        // Step 7: Close the browser
        console.log("Closing browser...");
        await browser.close();
    }
}

function generateEmails(name, domain) {
    const nameParts = name.split(' ');

    if (nameParts.length < 2) {
        throw new Error('Full name is required for email generation.');
    }

    const firstName = nameParts[0].toLowerCase();
    const lastName = nameParts[nameParts.length - 1].toLowerCase();

    return [
        `${firstName}.${lastName}@${domain}`,
        `${firstName}${lastName}@${domain}`,
        `${firstName}@${domain}`,
        `${firstName[0]}${lastName}@${domain}`,
        `${firstName}.${lastName[0]}@${domain}`,
        `${firstName}${lastName[0]}@${domain}`,
        `${lastName}.${firstName}@${domain}`
    ];
}

// Example usage
const linkedInProfileUrl = 'https://www.linkedin.com/in/girish-sharma-708644158/'; // Replace with any LinkedIn profile URL

scrapeLinkedInProfile({ linkedInProfileUrl });
