import { fail, ok } from '@/lib/api';
import { PRODUCT_FILES, readJSON } from '@/lib/jsonStore';
import type { Product, ProductFile } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET товари з файлу: products1, products2 або combined
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  try {
    const { file } = await params;
    if (!(file in PRODUCT_FILES)) return fail('Невірний файл', 400);

    const products = await readJSON<Product[]>(PRODUCT_FILES[file as ProductFile]);
    return ok({ products });
  } catch (error) {
    return fail(error);
  }
}
