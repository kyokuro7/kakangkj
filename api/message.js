import fetch from 'node-fetch';

export default async (req, res) => {
  const { mailbox, id } = req.query;
  if (!mailbox || !id) {
    res.status(400).json({ error: 'mailbox and id required' });
    return;
  }
  const url = `https://ilovetempmail.com/mailbox/${mailbox}/${id}`;
  const resp = await fetch(url);
  if (resp.status !== 200) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  const data = await resp.json(); // message details
  res.status(200).json(data);
};
