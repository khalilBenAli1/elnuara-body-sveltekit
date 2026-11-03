import { products } from '../data/catalog';
export { products };
export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
export function getVariant(productId: string, variantId: string) {
  const product = getProduct(productId);
  const variant = product?.variants.find((v) => v.id === variantId);
  return product && variant ? { product, variant } : undefined;
}
