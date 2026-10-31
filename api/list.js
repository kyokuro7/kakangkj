const { cors, upstream } = require('./_lib');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { mailbox } = req.query || {};
  if (!mailbox) return res.status(400).json({ error: 'mailbox query required' });

  try {
    const resp = await upstream(`/mailbox/${encodeURIComponent(mailbox)}`);
    if (resp.status !== 200) return res.status(404).json({ error: 'Mailbox not found' });
    const data = await resp.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Upstream error', detail: String(err && err.message || err) });
  }
};
