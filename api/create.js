import fetch from 'node-fetch';

function randomString(len = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default async (req, res) => {
  for (let i = 0; i < 5; i++) {
    const mailbox = `${randomString()}@ilovetempmail.com`;
    const check = await fetch(`https://ilovetempmail.com/mailbox/${mailbox}`);
    if (check.status === 404) {
      res.status(200).json({ mailbox });
      return;
    }
  }
  res.status(500).json({ error: 'Failed to generate unique mailbox' });
};
