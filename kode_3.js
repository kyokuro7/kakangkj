import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async (req, res) => {
  const { mailbox } = req.query;
  if (!mailbox) return res.status(400).json({ error: 'mailbox required' });

  try {
    const executablePath = await chromium.executablePath;
    const browser = await puppeteer.launch({
      executablePath,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless
    });
    const page = await browser.newPage();
    await page.goto(`https://ilovetempmail.com/mailbox/${mailbox}`, {
      waitUntil: 'networkidle2'
    });

    const messages = await page.evaluate(() => {
      return window.__INITIAL_STATE__?.messages || [];
    });
    await browser.close();

    if (messages.length === 0)
      return res.status(404).json({ error: 'Mailbox empty or not found' });

    res.status(200).json({ messages });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
