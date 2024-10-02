# LinkedIn Profile Scraper

This project is a Node.js script that scrapes public information from a LinkedIn profile and generates possible email patterns based on the person's name and the company domain. The project uses Puppeteer for web scraping and dotenv to manage environment variables.

## Features

- Logs in to LinkedIn using the provided credentials.
- Scrapes a LinkedIn profile to retrieve the person's name, job title, and current company.
- Finds the company's domain using a helper function (`findDomainViaGoogle`).
- Generates potential email patterns using the person's name and company domain.
- Saves the scraped profile data and generated email patterns to a JSON file.

## Prerequisites

- **Node.js**: Make sure you have Node.js installed. You can download it from [here](https://nodejs.org/).
- **Puppeteer**: Puppeteer will launch a Chromium browser to interact with the LinkedIn website.
- **dotenv**: Environment variables are stored in a `.env` file for security.

## Setup

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install dependencies:**

    Run the following command to install the required packages:

    ```bash
    npm install
    ```

3. **Create a `.env` file:**

    Create a `.env` file in the root of your project with the following content:

    ```
    LINKEDIN_ID=your_linkedIn_email
    LINKEDIN_PASS=your_linkedIn_password
    ```

4. **Helper Script:**

    Ensure you have a helper script (`domain.js`) that exports the `findDomainViaGoogle` function, which searches for the company domain through a web search.

5. **Run the scraper:**

    You can run the scraper by executing the following command:

    ```bash
    node <script_name>.js
    ```

## How It Works

1. **Login to LinkedIn**: The script opens a headless Chromium browser, navigates to LinkedIn, and logs in using credentials stored in the `.env` file.
   
2. **Scrape Profile Data**: Once logged in, it navigates to the provided LinkedIn profile URL, scrapes the user's name, job title, and company.

3. **Find Company Domain**: The script uses the `findDomainViaGoogle` helper function to search for the company's domain.

4. **Generate Email Patterns**: Based on the person's name and company domain, it generates potential email patterns using common formats (e.g., `first.last@domain.com`, `firstlast@domain.com`).

5. **Save to JSON**: The scraped data and email patterns are saved in `linkedin_profile_data.json`.

## Example

To scrape the profile of a LinkedIn user, simply provide the profile URL in the script:

```javascript
const linkedInProfileUrl = 'https://www.linkedin.com/in/girish-sharma-708644158/';
scrapeLinkedInProfile({ linkedInProfileUrl });
