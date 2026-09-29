import type { NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { FILES, writeJSON } from '@/lib/jsonStore';
import { fetchAllPosts, filterByUser } from '@/lib/logic';

export const dynamic = 'force-dynamic';

// GET пости з JSONPlaceholder, відфільтровані за userId, зі збереженням у файл
export async function GET(request: NextRequest) {
  const userId = parseInt(request.nextUrl.searchParams.get('userId') ?? '', 10) || 5;

  try {
    const posts = filterByUser(await fetchAllPosts(), userId);
    await writeJSON(FILES.posts, posts);
    return ok({ posts, stats: { total: posts.length, userId } });
  } catch (error) {
    return fail(error);
  }
}
