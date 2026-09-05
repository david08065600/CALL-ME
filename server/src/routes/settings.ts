import express from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { query } from '../db/init.js';

const router = express.Router();

router.get('/', async (req: AuthRequest, res: express.Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const result = await query(
      'SELECT * FROM user_settings WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      // Create default settings
      const created = await query(
        'INSERT INTO user_settings (user_id) VALUES ($1) RETURNING *',
        [req.user.id]
      );
      return res.json(created.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.patch('/', async (req: AuthRequest, res: express.Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { default_camera, default_microphone, default_resolution, dark_mode, effect_intensity } = req.body;

    const result = await query(
      `UPDATE user_settings SET 
        default_camera = COALESCE($1, default_camera),
        default_microphone = COALESCE($2, default_microphone),
        default_resolution = COALESCE($3, default_resolution),
        dark_mode = COALESCE($4, dark_mode),
        effect_intensity = COALESCE($5, effect_intensity),
        updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $6
       RETURNING *`,
      [default_camera, default_microphone, default_resolution, dark_mode, effect_intensity, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
