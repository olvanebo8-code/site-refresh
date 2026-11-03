const express = require('express');
const Database = require('better-sqlite3');
const fs = require('node:fs');
const path = require('node:path');

const app = express();
const port = Number(process.env.PORT) || 3000;
const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'ana-yurt.sqlite'));
db.pragma('journal_mode = WAL');
db.exec(fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8'));

app.use(express.json({ limit: '10kb' }));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/app.js', (_req, res) => res.sendFile(path.join(__dirname, 'app.js')));
app.get('/checkout', (_req, res) => res.sendFile(path.join(__dirname, 'checkout.html')));
app.get('/checkout.html', (_req, res) => res.sendFile(path.join(__dirname, 'checkout.html')));
app.get('/checkout.js', (_req, res) => res.sendFile(path.join(__dirname, 'checkout.js')));
app.get(['/tisch', '/tisch.html'], (_req, res) => res.sendFile(path.join(__dirname, 'tisch.html')));
app.get('/tisch.js', (_req, res) => res.sendFile(path.join(__dirname, 'tisch.js')));
app.get('/ordering.js', (_req, res) => res.sendFile(path.join(__dirname, 'ordering.js')));
app.get('/supabase-config.js', (_req, res) => res.sendFile(path.join(__dirname, 'supabase-config.js')));
app.get('/kueche', (_req, res) => res.redirect(301, '/kueche/'));
app.get(['/kueche/', '/kueche/index.html'], (_req, res) => res.sendFile(path.join(__dirname, 'kueche', 'index.html')));
app.get('/kueche/kueche.js', (_req, res) => res.sendFile(path.join(__dirname, 'kueche', 'kueche.js')));
app.get('/admin', (_req, res) => res.redirect(301, '/admin/'));
app.get(['/admin/', '/admin/index.html'], (_req, res) => res.sendFile(path.join(__dirname, 'admin', 'index.html')));
app.get('/admin/admin.js', (_req, res) => res.sendFile(path.join(__dirname, 'admin', 'admin.js')));
app.get('/admin/tische.html', (_req, res) => res.sendFile(path.join(__dirname, 'admin', 'tische.html')));
app.get('/admin/tische.js', (_req, res) => res.sendFile(path.join(__dirname, 'admin', 'tische.js')));
app.get('/qr-codes', (_req, res) => res.redirect(301, '/qr-codes/'));
app.get(['/qr-codes/', '/qr-codes/index.html'], (_req, res) => res.sendFile(path.join(__dirname, 'qr-codes', 'index.html')));
app.get('/qr-codes/qr-codes.js', (_req, res) => res.sendFile(path.join(__dirname, 'qr-codes', 'qr-codes.js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.post('/api/reservations', (req, res) => {
  const { name, email, phone, guests, date, time, requests = '' } = req.body || {};
  const values = [name, email, phone, guests, date, time];
  if (values.some(value => typeof value !== 'string' || !value.trim())) {
    return res.status(400).json({ error: 'Bitte füllen Sie alle Pflichtfelder aus.' });
  }
  if (typeof requests !== 'string') {
    return res.status(400).json({ error: 'Bitte prüfen Sie Ihre Angaben.' });
  }
  if (name.length > 120 || email.length > 254 || phone.length > 40 ||
      guests.length > 40 || requests.length > 2000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return res.status(400).json({ error: 'Bitte prüfen Sie Ihre Angaben.' });
  }
  const result = db.prepare(`
    INSERT INTO reservations (name, email, phone, guests, reservation_date, reservation_time, requests)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name.trim(), email.trim(), phone.trim(), guests.trim(), date, time, requests.trim());
  res.status(201).json({ ok: true, id: result.lastInsertRowid });
});

app.listen(port, () => {
  console.log(`Ana Yurt läuft unter http://localhost:${port}`);
});

function closeDatabase() {
  db.close();
  process.exit(0);
}
process.on('SIGINT', closeDatabase);
process.on('SIGTERM', closeDatabase);
