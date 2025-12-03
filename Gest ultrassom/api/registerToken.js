export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const { perfilId, token } = req.body || {};
    if (!perfilId || !token) {
      res.status(400).json({ error: 'perfilId e token são obrigatórios' });
      return;
    }
    console.log('Register token', { perfilId, token });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'internal_error' });
  }
}
