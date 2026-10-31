import { randomBytes } from 'crypto';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async (req, res) => {
  const prefix = randomBytes(6).toString('hex');
  const mailbox = `${prefix}@ilovetempmail.com`;

  try {
    const executablePath = await chromium.executablePath;
    const browser = await puppeteer.launch({
      executablePath,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless
    });
    const page = await browser.newPage();
    const response = await page.goto(
      `https://ilovetempmail.com/mailbox/${mailbox}`,
      { waitUntil: 'networkidle2' }
    );
    await browser.close();

    if (response.status() === 404) {
      res.status(200).json({ mailbox });
    } else {
      res.status(500).json({ error: 'Mailbox collision' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
