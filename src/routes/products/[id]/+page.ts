import { error } from '@sveltejs/kit';
import { getProduct, products } from '#lib/domain/catalog.ts';
export const entries = () => products.map((p) => ({ id: p.id }));
export function load({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) error(404, 'This everyday is still unwritten.');
  return { product };
}
