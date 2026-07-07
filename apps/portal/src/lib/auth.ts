import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const auth: ReturnType<typeof createAuthClient> = createAuthClient({
  baseURL: API_URL,
  plugins: [adminClient()],
});
