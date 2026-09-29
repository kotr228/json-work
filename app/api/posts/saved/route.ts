import { fail, ok } from '@/lib/api';
import { FILES, readJSON } from '@/lib/jsonStore';
import type { Post } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET збережені пости
export async function GET() {
  try {
    const posts = await readJSON<Post[]>(FILES.posts);
    return ok({ posts });
  } catch (error) {
    return fail(error);
  }
}
