const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const DEFAULTS = [
  ['Salary', 'INCOME'], ['Freelance', 'INCOME'], ['Investment', 'INCOME'], ['Gift', 'INCOME'], ['Other income', 'INCOME'],
  ['Food', 'EXPENSE'], ['Housing', 'EXPENSE'], ['Transport', 'EXPENSE'], ['Shopping', 'EXPENSE'], ['Bills', 'EXPENSE'],
  ['Education', 'EXPENSE'], ['Entertainment', 'EXPENSE'], ['Healthcare', 'EXPENSE'], ['Other', 'EXPENSE']
];

const tokenFor = u => jwt.sign(
  { id: u.id, email: u.email },
  process.env.JWT_SECRET || 'finora_fallback_jwt_secret_dev_2026',
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

const safeUser = u => ({ id: u.id, name: u.name, email: u.email, currency: u.currency || 'INR' });

async function ensureCategories(userId, conn = db) {
  for (const [name, type] of DEFAULTS) {
    await conn.execute(
      'INSERT IGNORE INTO categories (user_id, name, type, is_default) VALUES (?, ?, ?, 1)',
      [userId, name, type]
    );
  }
}

router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
    return res.status(400).json({ message: 'Name, email and password (at least 8 characters) are required.' });
  }
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  const [found] = await db.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
  if (found.length) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const hash = await bcrypt.hash(password, 12);
  const [r] = await db.execute(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [cleanName, cleanEmail, hash]
  );

  await ensureCategories(r.insertId);

  const user = { id: r.insertId, name: cleanName, email: cleanEmail, currency: 'INR' };
  res.status(201).json({ token: tokenFor(user), user: safeUser(user) });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();
  const [rows] = await db.execute(
    'SELECT id, name, email, password_hash, currency FROM users WHERE email = ?',
    [cleanEmail]
  );

  if (!rows.length || !(await bcrypt.compare(password || '', rows[0].password_hash))) {
    return res.status(401).json({ message: 'Incorrect email or password.' });
  }

  await ensureCategories(rows[0].id);
  res.json({ token: tokenFor(rows[0]), user: safeUser(rows[0]) });
}));

module.exports = router;
