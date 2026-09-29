/**
 * Завдання 3: Завантаження постів з JSONPlaceholder та збереження в JSON (CLI)
 *   npm run posts            # userId = 5
 *   npm run posts -- 3       # інший userId
 */
import path from 'path';
import { FILES, writeJSON } from '../lib/jsonStore';
import { POSTS_API_URL, errorMessage, fetchAllPosts, filterByUser } from '../lib/logic';
import type { Post } from '../lib/types';

const USER_ID = parseInt(process.argv[2] ?? '', 10) || 5;

function displayPost(post: Post, index: number): void {
  console.log(`\n━━━ Пост ${index + 1} ━━━`);
  console.log(`ID: ${post.id}`);
  console.log(`User ID: ${post.userId}`);
  console.log(`Заголовок: ${post.title}`);
  console.log('\nОпис:');
  console.log(post.body);
}

function displayStatistics(posts: Post[]): void {
  const avgTitle = posts.reduce((sum, p) => sum + p.title.length, 0) / posts.length;
  const avgBody = posts.reduce((sum, p) => sum + p.body.length, 0) / posts.length;
  const longest = posts.reduce((max, p) => (p.title.length > max.title.length ? p : max));
  const shortest = posts.reduce((min, p) => (p.title.length < min.title.length ? p : min));

  console.log('\n📊 Статистика:\n');
  console.log(`   Всього постів: ${posts.length}`);
  console.log(`   Середня довжина заголовка: ${avgTitle.toFixed(1)} символів`);
  console.log(`   Середня довжина тексту: ${avgBody.toFixed(1)} символів`);
  console.log(`   Найдовший заголовок: "${longest.title}" (${longest.title.length} символів)`);
  console.log(`   Найкоротший заголовок: "${shortest.title}" (${shortest.title.length} символів)`);
}

async function main(): Promise<void> {
  console.log(`🌐 Завантаження постів з ${POSTS_API_URL}...`);
  const allPosts = await fetchAllPosts();
  console.log(`✓ Завантажено ${allPosts.length} постів\n`);

  console.log(`🔍 Фільтрація постів для користувача з ID = ${USER_ID}...`);
  const userPosts = filterByUser(allPosts, USER_ID);
  console.log(`✓ Знайдено ${userPosts.length} постів\n`);

  if (userPosts.length === 0) return;

  console.log('═'.repeat(60));
  console.log('ПОСТИ КОРИСТУВАЧА');
  console.log('═'.repeat(60));
  userPosts.forEach(displayPost);
  console.log('\n' + '═'.repeat(60));

  displayStatistics(userPosts);

  await writeJSON(FILES.posts, userPosts);
  console.log(`\n✓ Дані збережено у файл ${path.basename(FILES.posts)}`);
  console.log('\n✅ Завдання виконано!\n');
}

main().catch((error) => {
  console.error('Критична помилка:', errorMessage(error));
  process.exit(1);
});
