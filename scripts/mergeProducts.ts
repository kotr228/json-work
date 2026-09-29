/**
 * Завдання 2: Злиття products1.json та products2.json (CLI)
 *   npm run merge
 */
import path from 'path';
import { FILES, readJSON, writeJSON } from '../lib/jsonStore';
import { errorMessage, mergeProducts, productStats } from '../lib/logic';
import type { Product } from '../lib/types';

async function readProducts(filePath: string): Promise<Product[]> {
  try {
    return await readJSON<Product[]>(filePath);
  } catch (error) {
    console.error(`Помилка читання файлу ${path.basename(filePath)}:`, errorMessage(error));
    return [];
  }
}

function displayProducts(products: Product[], title: string): void {
  console.log(`\n${title}\n`);
  console.log('ID | Назва                           | Ціна (грн)');
  console.log('---+---------------------------------+-----------');
  products.forEach((p) => {
    console.log(`${String(p.id).padEnd(2)} | ${p.name.padEnd(31)} | ${String(p.price).padStart(9)}`);
  });
  console.log();
}

async function main(): Promise<void> {
  console.log("🔄 Об'єднання файлів products1.json та products2.json\n");

  const products1 = await readProducts(FILES.products1);
  const products2 = await readProducts(FILES.products2);

  console.log(`📦 Завантажено з products1.json: ${products1.length} товарів`);
  console.log(`📦 Завантажено з products2.json: ${products2.length} товарів`);

  displayProducts(products1, '📋 Товари з products1.json:');
  displayProducts(products2, '📋 Товари з products2.json:');

  const merged = mergeProducts(products1, products2);
  const stats = productStats(merged, products1.length + products2.length);

  console.log(`\n🔗 Об'єднано товарів: ${stats.total}`);
  console.log(`♻️  Видалено дублікатів: ${stats.duplicatesRemoved}\n`);

  displayProducts(merged, '✨ Фінальний список (відсортовано за ціною):');

  await writeJSON(FILES.combined, merged);
  console.log(`✓ Дані записано у файл ${path.basename(FILES.combined)}`);

  if (merged.length > 0) {
    console.log('\n📊 Статистика:');
    console.log(`   Загальна вартість: ${stats.totalPrice} грн`);
    console.log(`   Середня ціна: ${stats.avgPrice.toFixed(2)} грн`);
    console.log(`   Найдешевший: ${merged[0].name} (${stats.minPrice} грн)`);
    console.log(`   Найдорожчий: ${merged[merged.length - 1].name} (${stats.maxPrice} грн)\n`);
  }
}

main().catch((error) => {
  console.error('Критична помилка:', errorMessage(error));
  process.exit(1);
});
