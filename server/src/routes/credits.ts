import express from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { query } from '../db/init.js';

const router = express.Router();

router.get('/', async (req: AuthRequest, res: express.Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const result = await query(
      'SELECT credits FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ balance: result.rows[0].credits });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});

router.get('/transactions', async (req: AuthRequest, res: express.Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const result = await query(
      'SELECT * FROM credit_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100',
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;
