const { cors, upstream } = require('./_lib');

function randomString(len = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    for (let i = 0; i < 5; i++) {
      const mailbox = `${randomString()}@ilovetempmail.com`;
      try {
        const check = await upstream(`/mailbox/${mailbox}`);
        if (check.status === 404) {
          return res.status(200).json({ mailbox });
        }
      } catch (e) {
        // coba lagi dengan alamat lain
      }
    }
    // fallback: alamat acak tanpa verifikasi (jarang bentrok)
    return res.status(200).json({ mailbox: `${randomString(14)}@ilovetempmail.com`, verified: false });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error', detail: String(err && err.message || err) });
  }
};
