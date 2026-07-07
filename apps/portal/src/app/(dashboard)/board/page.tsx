import { redirect } from 'next/navigation';

// The board is now a view mode of the tickets page. Keep this route for back-compat.
export default function BoardPage() {
  redirect('/?view=board');
}
