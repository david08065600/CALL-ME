import express from 'express';
import { AuthRequest, requireAdmin } from '../middleware/auth.js';
import { query } from '../db/init.js';

const router = express.Router();

router.get('/stats', requireAdmin as any, async (req: AuthRequest, res: express.Response) => {
  try {
    const usersResult = await query('SELECT COUNT(*) as total FROM users');
    const callsResult = await query('SELECT COUNT(*) as total FROM calls WHERE status = \'active\'');
    const creditsResult = await query('SELECT SUM(amount) as total FROM credit_transactions WHERE type = \'usage\'');

    res.json({
      total_users: parseInt(usersResult.rows[0].total),
      active_calls: parseInt(callsResult.rows[0].total),
      total_credits_used: parseInt(creditsResult.rows[0].total || 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/users', requireAdmin as any, async (req: AuthRequest, res: express.Response) => {
  try {
    const result = await query(
      'SELECT id, name, email, credits, role, created_at FROM users ORDER BY created_at DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.patch('/users/:id', requireAdmin as any, async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    const { credits, role } = req.body;

    const result = await query(
      'UPDATE users SET credits = COALESCE($1, credits), role = COALESCE($2, role) WHERE id = $3 RETURNING *',
      [credits, role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
