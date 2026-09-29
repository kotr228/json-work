import { fail, ok } from '@/lib/api';
import { FILES, readJSON, writeJSON } from '@/lib/jsonStore';
import { mergeProducts, productStats } from '@/lib/logic';
import type { Product } from '@/lib/types';

// POST злиття товарів
export async function POST() {
  try {
    const [products1, products2] = await Promise.all([
      readJSON<Product[]>(FILES.products1),
      readJSON<Product[]>(FILES.products2),
    ]);

    const merged = mergeProducts(products1, products2);
    await writeJSON(FILES.combined, merged);

    return ok({ products: merged, stats: productStats(merged, products1.length + products2.length) });
  } catch (error) {
    return fail(error);
  }
}
