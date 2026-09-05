import express from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { query } from '../db/init.js';

const router = express.Router();

router.get('/', async (req: AuthRequest, res: express.Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const result = await query(
      'SELECT * FROM calls WHERE creator_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calls' });
  }
});

router.post('/', async (req: AuthRequest, res: express.Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const result = await query(
      'INSERT INTO calls (creator_id, status) VALUES ($1, $2) RETURNING *',
      [req.user.id, 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create call' });
  }
});

router.get('/:id', async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM calls WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Call not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch call' });
  }
});

router.post('/:id/join', async (req: AuthRequest, res: express.Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    // Update call status
    await query(
      'UPDATE calls SET status = $1 WHERE id = $2',
      ['active', id]
    );

    // Add participant
    const result = await query(
      'INSERT INTO call_participants (call_id, user_id) VALUES ($1, $2) RETURNING *',
      [id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to join call' });
  }
});

router.post('/:id/end', async (req: AuthRequest, res: express.Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const result = await query(
      'UPDATE calls SET status = $1, ended_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['ended', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Call not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to end call' });
  }
});

export default router;
