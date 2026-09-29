import { fail, ok } from '@/lib/api';
import { FILES, readJSON, writeJSON } from '@/lib/jsonStore';
import { nextId, validateUser } from '@/lib/logic';
import type { User } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET всіх користувачів
export async function GET() {
  try {
    const users = await readJSON<User[]>(FILES.users);
    return ok({ users });
  } catch (error) {
    return fail(error);
  }
}

// POST новий користувач
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<User>;
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();

    const users = await readJSON<User[]>(FILES.users);
    const validationError = validateUser(users, name, email);
    if (validationError) return fail(validationError, 400);

    const newUser: User = { id: nextId(users), name, email };
    users.push(newUser);
    await writeJSON(FILES.users, users);

    return ok({ user: newUser, total: users.length });
  } catch (error) {
    return fail(error);
  }
}
