import { asset } from '$app/paths';
const imagePaths = [
  'images/citrus-veil-250.webp',
  'images/citrus-veil-250-640.webp',
  'images/citrus-veil-500.webp',
  'images/citrus-veil-500-640.webp',
  'images/still-water-250.webp',
  'images/still-water-250-640.webp',
  'images/still-water-500.webp',
  'images/still-water-500-640.webp',
  'images/leaf-milk-200.webp',
  'images/leaf-milk-200-640.webp',
  'images/leaf-milk-400.webp',
  'images/leaf-milk-400-640.webp',
  'images/quiet-dune-150.webp',
  'images/quiet-dune-150-640.webp',
  'images/quiet-dune-300.webp',
  'images/quiet-dune-300-640.webp',
  'images/amber-current-100.webp',
  'images/amber-current-100-640.webp',
  'images/amber-current-200.webp',
  'images/amber-current-200-640.webp',
  'images/stone-grain-200.webp',
  'images/stone-grain-200-640.webp',
  'images/stone-grain-350.webp',
  'images/stone-grain-350-640.webp',
  'images/palm-leaf-300.webp',
  'images/palm-leaf-300-640.webp',
  'images/palm-leaf-500.webp',
  'images/palm-leaf-500-640.webp',
  'images/soft-palm-50.webp',
  'images/soft-palm-50-640.webp',
  'images/soft-palm-100.webp',
  'images/soft-palm-100-640.webp',
  'images/ritual-still-life.webp',
  'images/ritual-still-life-640.webp',
  'images/botanical-textures.webp',
  'images/botanical-textures-640.webp',
  'images/amber-light.webp',
  'images/amber-light-640.webp'
] as const;
export function photoUrl(filename: string, small = false) {
  const wanted =
    'images/' + (small ? filename.replace('.webp', '-640.webp') : filename);
  const path = imagePaths.find((path) => path === wanted);
  if (!path) throw Error('Unknown Elnuara image.');
  return asset(path);
}
