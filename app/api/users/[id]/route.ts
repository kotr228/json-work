import { fail, ok } from '@/lib/api';
import { FILES, readJSON, writeJSON } from '@/lib/jsonStore';
import type { User } from '@/lib/types';

// DELETE користувача
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = parseInt((await params).id, 10);
    const users = await readJSON<User[]>(FILES.users);
    const remaining = users.filter((u) => u.id !== id);

    if (remaining.length === users.length) return fail('Користувача не знайдено', 404);

    await writeJSON(FILES.users, remaining);
    return ok({ total: remaining.length });
  } catch (error) {
    return fail(error);
  }
}
