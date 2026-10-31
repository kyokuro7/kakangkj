import fetch from 'node-fetch';

export default async (req, res) => {
  const { mailbox } = req.query;
  if (!mailbox) {
    res.status(400).json({ error: 'mailbox query required' });
    return;
  }
  const resp = await fetch(`https://ilovetempmail.com/mailbox/${mailbox}`);
  if (resp.status !== 200) {
    res.status(404).json({ error: 'Mailbox not found' });
    return;
  }
  const data = await resp.json(); // { messages: [...] }
  res.status(200).json(data);
};
