import express, { Request } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { query } from '../db/init.js';

const router = express.Router();

router.get('/', async (req: AuthRequest, res: express.Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const result = await query(
      'SELECT * FROM face_effects WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch effects' });
  }
});

router.post('/', async (req: AuthRequest, res: express.Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { name, image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({ error: 'Image URL required' });
    }

    const result = await query(
      'INSERT INTO face_effects (user_id, name, image_url) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, name || 'Unnamed Effect', image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create effect' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: express.Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const result = await query(
      'DELETE FROM face_effects WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Effect not found' });
    }

    res.json({ message: 'Effect deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete effect' });
  }
});

export default router;
