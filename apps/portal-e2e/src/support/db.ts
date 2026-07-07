import pg from 'pg';

import { getTestDbUrl } from './e2e.config';

export async function promoteToAdmin(email: string): Promise<void> {
  const pool = new pg.Pool({ connectionString: getTestDbUrl() });
  try {
    const { rows } = await pool.query(
      `UPDATE users SET role = 'admin', updated_at = now()
       WHERE email = $1
       RETURNING id`,
      [email],
    );
    if (rows.length === 0) {
      throw new Error(`Cannot promote: no user found with email ${email}`);
    }
  } finally {
    await pool.end();
  }
}
