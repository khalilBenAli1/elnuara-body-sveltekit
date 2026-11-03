import type { Product } from '../domain/types';
export const products: readonly Product[] = [
  {
    id: 'citrus-veil',
    name: 'Citrus Veil Wash',
    category: 'Wash',
    type: 'Body wash',
    scent: 'Citrus',
    texture: 'Gel',
    dayparts: ['morning', 'evening'],
    preferred: 'morning',
    slot: 'cleanse',
    packaging:
      'Tall cylindrical amber-glass bottle, matte charcoal pump, restrained thin cream band; no printed words or certification marks.',
    variants: [
      {
        id: '250',
        size: '250 ml',
        priceCents: 2400,
        stock: 8,
        image: 'citrus-veil-250.webp'
      },
      {
        id: '500',
        size: '500 ml',
        priceCents: 3800,
        stock: 5,
        image: 'citrus-veil-500.webp'
      }
    ],
    story:
      'A bright beginning, without the hurry. A clear gel wash with a citrus-scented finish.',
    feel: 'A fluid gel, a light lather, a fresh citrus note.',
    materialNote:
      'Amber glass catches the morning light; a charcoal pump makes the familiar gesture simple.'
  },
  {
    id: 'still-water',
    name: 'Still Water Wash',
    category: 'Wash',
    type: 'Body wash',
    scent: 'Unfragranced',
    texture: 'Gel',
    dayparts: ['morning', 'evening'],
    preferred: 'both',
    slot: 'cleanse',
    packaging:
      'Opaque cream softly squared bottle, rounded shoulders and ivory pump; no visible coloured liquid or printed words.',
    variants: [
      {
        id: '250',
        size: '250 ml',
        priceCents: 2400,
        stock: 6,
        image: 'still-water-250.webp'
      },
      {
        id: '500',
        size: '500 ml',
        priceCents: 3800,
        stock: 4,
        image: 'still-water-500.webp'
      }
    ],
    story:
      'For those who like their everyday a little quieter. A simple, unfragranced wash with a soft gel texture.',
    feel: 'A smooth gel with no added fragrance story.',
    materialNote:
      'An opaque cream bottle with rounded shoulders and an ivory pump.'
  },
  {
    id: 'leaf-milk',
    name: 'Leaf Milk Lotion',
    category: 'Lotion',
    type: 'Body lotion',
    scent: 'Herbal',
    texture: 'Light',
    dayparts: ['morning', 'evening'],
    preferred: 'morning',
    slot: 'body',
    packaging:
      'Matte muted-sage oval bottle, slender brushed aluminium pump with cream collar, visibly different from either wash.',
    variants: [
      {
        id: '200',
        size: '200 ml',
        priceCents: 3200,
        stock: 6,
        image: 'leaf-milk-200.webp'
      },
      {
        id: '400',
        size: '400 ml',
        priceCents: 4900,
        stock: 4,
        image: 'leaf-milk-400.webp'
      }
    ],
    story:
      'A light layer for the moments between getting ready and getting on with the day.',
    feel: 'A light lotion texture with an herbal scent.',
    materialNote: 'Muted sage, brushed aluminium and a small cream collar.'
  },
  {
    id: 'quiet-dune',
    name: 'Quiet Dune Balm',
    category: 'Lotion',
    type: 'Body balm',
    scent: 'Unfragranced',
    texture: 'Rich',
    dayparts: ['morning', 'evening'],
    preferred: 'evening',
    slot: 'body',
    packaging:
      'Low wide opaque cream ceramic-like jar, shallow amber-brown lid, soft cylindrical profile, no inscriptions.',
    variants: [
      {
        id: '150',
        size: '150 ml',
        priceCents: 3600,
        stock: 5,
        image: 'quiet-dune-150.webp'
      },
      {
        id: '300',
        size: '300 ml',
        priceCents: 5200,
        stock: 3,
        image: 'quiet-dune-300.webp'
      }
    ],
    story:
      'A richer texture for a slower finish. Quiet Dune brings an unfragranced, balm-like feel to the ritual.',
    feel: 'A rich balm texture, without a fragrance note.',
    materialNote: 'A low cream vessel and a shallow amber-brown lid.'
  },
  {
    id: 'amber-current',
    name: 'Amber Current Oil',
    category: 'Oil',
    type: 'Body oil',
    scent: 'Woods',
    texture: 'Oil',
    dayparts: ['evening'],
    preferred: 'evening',
    slot: 'body',
    packaging:
      'Flattened oval amber-glass bottle with charcoal dropper cap and slender brass collar, no label text.',
    variants: [
      {
        id: '100',
        size: '100 ml',
        priceCents: 3800,
        stock: 7,
        image: 'amber-current-100.webp'
      },
      {
        id: '200',
        size: '200 ml',
        priceCents: 5800,
        stock: 4,
        image: 'amber-current-200.webp'
      }
    ],
    story: 'A warm, woody note for the last quiet minutes of the day.',
    feel: 'An oil texture with a warm woods scent.',
    materialNote:
      'A flat amber silhouette, a charcoal dropper and a fine brass collar.'
  },
  {
    id: 'stone-grain',
    name: 'Stone Grain Polish',
    category: 'Scrub',
    type: 'Body scrub',
    scent: 'Citrus',
    texture: 'Grain',
    dayparts: ['evening'],
    preferred: 'evening',
    slot: 'polish',
    packaging:
      'Broad frosted-sage glass jar with rounded wooden lid, tactile grain-like contents subtly visible, distinct from Quiet Dune.',
    variants: [
      {
        id: '200',
        size: '200 g',
        priceCents: 3400,
        stock: 4,
        image: 'stone-grain-200.webp'
      },
      {
        id: '350',
        size: '350 g',
        priceCents: 4800,
        stock: 0,
        image: 'stone-grain-350.webp'
      }
    ],
    story:
      'A tactile addition when your evening calls for a different texture.',
    feel: 'A grain-textured polish with a citrus note.',
    materialNote:
      'Frosted sage glass, a rounded wooden lid and visible texture.'
  },
  {
    id: 'palm-leaf',
    name: 'Palm Leaf Hand Wash',
    category: 'Hand care',
    type: 'Hand wash',
    scent: 'Herbal',
    texture: 'Gel',
    dayparts: ['morning', 'evening'],
    preferred: 'both',
    slot: 'hands',
    packaging:
      'Squat wide amber-glass pump bottle, cream pump and broad shoulders, shorter and wider than Citrus Veil.',
    variants: [
      {
        id: '300',
        size: '300 ml',
        priceCents: 2600,
        stock: 8,
        image: 'palm-leaf-300.webp'
      },
      {
        id: '500',
        size: '500 ml',
        priceCents: 3600,
        stock: 5,
        image: 'palm-leaf-500.webp'
      }
    ],
    story:
      'A small pause at the sink. Herbal notes and a familiar, easy-to-use gel.',
    feel: 'A gel texture with a green, herbal scent.',
    materialNote:
      'Broad amber shoulders and a cream pump, made for the everyday setting.'
  },
  {
    id: 'soft-palm',
    name: 'Soft Palm Hand Cream',
    category: 'Hand care',
    type: 'Hand cream',
    scent: 'Unfragranced',
    texture: 'Cream',
    dayparts: ['morning', 'evening'],
    preferred: 'both',
    slot: 'hands',
    packaging:
      'Warm ecru aluminium tube with folded base, brushed metal screw cap and a narrow amber accent band; no printed labels.',
    variants: [
      {
        id: '50',
        size: '50 ml',
        priceCents: 1800,
        stock: 8,
        image: 'soft-palm-50.webp'
      },
      {
        id: '100',
        size: '100 ml',
        priceCents: 2800,
        stock: 6,
        image: 'soft-palm-100.webp'
      }
    ],
    story:
      'For the hands that do a little of everything. A quiet, unfragranced cream texture.',
    feel: 'An unfragranced cream with a softly substantial feel.',
    materialNote:
      'An ecru aluminium tube with a folded base and a narrow amber band.'
  }
];
