import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async (req, res) => {
  const { mailbox, id } = req.query;
  if (!mailbox || !id) return res.status(400).json({ error: 'mailbox & id required' });

  try {
    const executablePath = await chromium.executablePath;
    const browser = await puppeteer.launch({
      executablePath,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless
    });
    const page = await browser.newPage();
    await page.goto(`https://ilovetempmail.com/mailbox/${mailbox}/${id}`, {
      waitUntil: 'networkidle2'
    });

    const message = await page.evaluate(() => {
      const el = document.querySelector('.email-content');
      if (!el) return null;
      return { html: el.innerHTML, text: el.textContent };
    });
    await browser.close();

    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.status(200).json(message);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
