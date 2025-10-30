const products: Array<Record<string, any>> = [
  {
    productId: 'fc65226e-f3f8-4291-be83-cafc5e9447a2',
    productKey: 'glam-armchair',
    productRef: 'glam-armchair',
    productTypeId: '5c30cb74-7641-4e08-89f2-e65ddb700bb4',
    version: '14',
    name: 'Glam Armchair',
    slug: 'glam-armchair',
    description:
      'A gold velvet chair with a brass frame is an elegant and luxurious piece of furniture. The soft, plush velvet material of the chair provides a comfortable and cozy seating experience. The gold color of the velvet fabric is soft and delicate, adding a touch of glamour to the overall look of the chair.  The brass frame of the chair is sturdy and durable, providing a solid foundation for the seating area. The brass color of the frame adds a touch of warmth and sophistication to the overall look of the chair. The combination of the gold velvet and brass frame creates a striking contrast, making this chair a statement piece in any room.  The chair features a high backrest with a curved design, providing support for the back and shoulders. The armrests are also curved, providing a comfortable place to rest the arms. The chair is designed for both style and comfort, making it a great addition to any living room, bedroom, or office space.',
    categories: [
      {
        categoryId: '130e22de-9eba-45dd-a64f-49e635e3de61',
        categoryKey: 'furniture',
        categoryRef: 'furniture',
        name: 'Furniture',
        slug: 'furniture',
        depth: 0,
        _url: {
          'en-GB': '/furniture',
          'en-US': '/furniture',
          'de-DE': '/furniture',
        },
      },
      {
        categoryId: '4909153a-d701-43d6-86f8-f5f1bfd53938',
        categoryKey: 'armchairs',
        categoryRef: 'armchairs',
        parentId: '645bed0a-9834-4e09-ba04-f68ac7a8deb8',
        parentKey: 'living-room-furniture',
        parentRef: 'living-room-furniture',
        name: 'Chairs',
        slug: 'armchairs',
        depth: 2,
        _url: {
          'en-GB': '/furniture/living-room-furniture/armchairs',
          'en-US': '/furniture/living-room-furniture/armchairs',
          'de-DE': '/furniture/living-room-furniture/chairs',
        },
      },
      {
        categoryId: '645bed0a-9834-4e09-ba04-f68ac7a8deb8',
        categoryKey: 'living-room-furniture',
        categoryRef: 'living-room-furniture',
        parentId: '130e22de-9eba-45dd-a64f-49e635e3de61',
        parentKey: 'furniture',
        parentRef: 'furniture',
        name: 'Living Room Furniture',
        slug: 'living-room-furniture',
        depth: 1,
        _url: {
          'en-GB': '/furniture/living-room-furniture',
          'en-US': '/furniture/living-room-furniture',
          'de-DE': '/furniture/living-room-furniture',
        },
      },
    ],
    variants: [
      {
        id: '1',
        sku: 'GARM-093',
        images: [
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Glam_Armchair-1.1.jpeg',
        ],
        attributes: {
          'search-finish': {
            key: 'gold',
            label: 'Gold',
          },
          'finish-code': '#FFD700',
          productspec: '- Dry clean only\n- Pillow included',
          'finish-label': 'Gold',
          'color-label': 'Golden Rod',
          'search-color': {
            key: 'yellow',
            label: 'Yellow',
          },
          'color-code': '#DAA520',
        },
        price: {
          fractionDigits: 2,
          centAmount: 59900,
          currencyCode: 'USD',
        },
        discountedPrice: {
          value: {
            fractionDigits: 2,
            centAmount: 50915,
            currencyCode: 'USD',
          },
          discount: {
            discountValue: {
              type: 'relative',
              value: 1500,
            },
            description: '15% Off All Armchairs',
            name: '15% Off All Armchairs',
          },
        },
        isMatchingVariant: true,
        isOnStock: true,
        availableQuantity: 90,
      },
    ],
    _url: '/glam-armchair/p/GARM-093',
  },
  {
    productId: 'fc435071-d0b5-4da7-8e18-99a49c3ecc87',
    productKey: 'gold-rimmed-champagne-glasses',
    productRef: 'gold-rimmed-champagne-glasses',
    productTypeId: '5c30cb74-7641-4e08-89f2-e65ddb700bb4',
    version: '3',
    name: 'Gold Rimmed Champagne Glasses',
    slug: 'gold-rimmed-champagne-glasses',
    description:
      "A set of gold rimmed champagne crystal glasses is a luxurious and elegant way to serve champagne or sparkling wine. These glasses are made of high-quality crystal, which gives them a clear and sparkling appearance that beautifully reflects the bubbles in the champagne.  The glasses feature a delicate and slender stem, which allows the drinker to hold the glass without warming the contents inside. The gold rimmed detail adds an extra touch of luxury and sophistication to the design, giving the glasses a glamorous and opulent appearance.  Overall, a set of gold rimmed champagne crystal glasses is a stunning and luxurious addition to any home bar or entertaining collection. Their elegant and timeless design, combined with their high-quality materials and intricate detailing, make them a perfect choice for celebrating life's special moments in style.",
    categories: [
      {
        categoryId: '3c495c8d-54b1-4489-8c65-8ce7f1b38de5',
        categoryKey: 'kitchen',
        categoryRef: 'kitchen',
        name: 'Kitchen',
        slug: 'kitchen',
        depth: 0,
        _url: {
          'en-GB': '/kitchen',
          'en-US': '/kitchen',
          'de-DE': '/kitchen',
        },
      },
      {
        categoryId: '1b4bac46-0343-4d46-a361-20d13aa9b60c',
        categoryKey: 'bar-and-glassware',
        categoryRef: 'bar-and-glassware',
        parentId: '3c495c8d-54b1-4489-8c65-8ce7f1b38de5',
        parentKey: 'kitchen',
        parentRef: 'kitchen',
        name: 'Bar and Glassware',
        slug: 'bar-and-glassware',
        depth: 1,
        _url: {
          'en-GB': '/kitchen/bar-and-glassware',
          'en-US': '/kitchen/bar-and-glassware',
          'de-DE': '/kitchen/bar-and-glassware',
        },
      },
      {
        categoryId: '036a8645-4e98-4b53-a84a-49da17ea945b',
        categoryKey: 'glassware',
        categoryRef: 'glassware',
        parentId: '1b4bac46-0343-4d46-a361-20d13aa9b60c',
        parentKey: 'bar-and-glassware',
        parentRef: 'bar-and-glassware',
        name: 'Glassware',
        slug: 'glassware',
        depth: 2,
        _url: {
          'en-GB': '/kitchen/bar-and-glassware/glassware',
          'en-US': '/kitchen/bar-and-glassware/glassware',
          'de-DE': '/kitchen/bar-and-glassware/glassware',
        },
      },
    ],
    variants: [
      {
        id: '1',
        sku: 'GRCG-01',
        images: [
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Gold_Rimmed_Champagne_Glasses-1.1.jpeg',
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Gold_Rimmed_Champagne_Glasses-1.2.jpeg',
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Gold_Rimmed_Champagne_Glasses-1.4.jpeg',
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Gold_Rimmed_Champagne_Glasses-1.3.jpeg',
        ],
        attributes: {
          'search-finish': {
            key: 'gold',
            label: 'Gold',
          },
          'finish-code': '#FFD700',
          productspec:
            '- Set of 5 glasses\n- Imported crystal\n- Gold polish on the rims',
          'finish-label': 'Gold',
          'color-label': 'Transparent',
          'search-color': {
            key: 'transparent',
            label: 'Transparent',
          },
          'color-code': 'transparent',
        },
        price: {
          fractionDigits: 2,
          centAmount: 3000,
          currencyCode: 'USD',
        },
        isMatchingVariant: true,
      },
    ],
    _url: '/gold-rimmed-champagne-glasses/p/GRCG-01',
  },
  {
    productId: 'f62b77fb-e885-404d-b467-72a97bb049c1',
    productKey: 'cocoa-pillow-cover',
    productRef: 'cocoa-pillow-cover',
    productTypeId: '5c30cb74-7641-4e08-89f2-e65ddb700bb4',
    version: '13',
    name: 'Cocoa Pillow Cover',
    slug: 'cocoa-pillow-cover',
    description:
      'A square linen pillowcase is a type of textile covering for a square-shaped pillow that is typically used to add visual interest and texture to a room. It is made from a natural linen fabric, which is known for its durability, breathability, and classic look.  The pillowcase is designed to fit over a standard size square pillow, usually around 18 inches square.  The linen fabric has a soft and slightly textured surface that adds a cozy and inviting feel to the pillow. The edges of the pillowcase are finished with a neat hem or piping, which adds a polished look to the overall design.  The pillowcase is used to add a touch of warmth and natural elegance to a room, whether it is placed on a bed, a sofa, or an accent chair. It can be used on its own or paired with other decorative pillows in different shapes and colors to create a layered and cohesive look.  Overall, a square linen pillowcase is a versatile and timeless accent piece that can enhance the comfort and style of any room in the home.',
    categories: [
      {
        categoryId: 'f010ad5e-969d-40a4-a600-2c4ec4361a08',
        categoryKey: 'bedding',
        categoryRef: 'bedding',
        parentId: '54b38a5e-60b1-46cd-bf52-0f26815111fa',
        parentKey: 'home-decor',
        parentRef: 'home-decor',
        name: 'Bedding',
        slug: 'bedding',
        depth: 1,
        _url: {
          'en-GB': '/home-decor/bedding',
          'en-US': '/home-decor/bedding',
          'de-DE': '/home-decor/bettwsche',
        },
      },
      {
        categoryId: '54b38a5e-60b1-46cd-bf52-0f26815111fa',
        categoryKey: 'home-decor',
        categoryRef: 'home-decor',
        name: 'Home Decor',
        slug: 'home-decor',
        depth: 0,
        _url: {
          'en-GB': '/home-decor',
          'en-US': '/home-decor',
          'de-DE': '/home-decor',
        },
      },
    ],
    variants: [
      {
        id: '1',
        sku: 'BLPC-09',
        images: [
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Cocoa_Pillow_Cover-1.1.jpeg',
        ],
        attributes: {
          productspec: '- Machine washable\n- Pillow not included',
          'search-color': {
            key: 'yellow',
            label: 'Yellow',
          },
          'color-label': 'Tan',
          'color-code': '#D2B48C',
        },
        price: {
          fractionDigits: 2,
          centAmount: 1099,
          currencyCode: 'USD',
        },
        isMatchingVariant: true,
        isOnStock: true,
        availableQuantity: 95,
      },
    ],
    _url: '/cocoa-pillow-cover/p/BLPC-09',
  },
  {
    productId: 'd6a41f21-770f-4354-9753-45d2dcd22dd5',
    productKey: 'cotton-silk-bedsheet',
    productRef: 'cotton-silk-bedsheet',
    productTypeId: '5c30cb74-7641-4e08-89f2-e65ddb700bb4',
    version: '1',
    name: 'Cotton Silk Bedsheet',
    slug: 'cotton-silk-bedsheet',
    description:
      'Cotton silk bed sheets are made from a blend of cotton and silk fibers. Cotton is known for its durability, breathability, and ease of care. Silk, on the other hand, is renowned for its smoothness, lustrous sheen, and luxurious feel. By combining the two, we offer a product that balances durability, breathability, and luxury.  Cotton silk bed sheets often have a subtle sheen from the silk, making them look more luxurious. ',
    categories: [
      {
        categoryId: 'f010ad5e-969d-40a4-a600-2c4ec4361a08',
        categoryKey: 'bedding',
        categoryRef: 'bedding',
        parentId: '54b38a5e-60b1-46cd-bf52-0f26815111fa',
        parentKey: 'home-decor',
        parentRef: 'home-decor',
        name: 'Bedding',
        slug: 'bedding',
        depth: 1,
        _url: {
          'en-GB': '/home-decor/bedding',
          'en-US': '/home-decor/bedding',
          'de-DE': '/home-decor/bettwsche',
        },
      },
      {
        categoryId: '54b38a5e-60b1-46cd-bf52-0f26815111fa',
        categoryKey: 'home-decor',
        categoryRef: 'home-decor',
        name: 'Home Decor',
        slug: 'home-decor',
        depth: 0,
        _url: {
          'en-GB': '/home-decor',
          'en-US': '/home-decor',
          'de-DE': '/home-decor',
        },
      },
    ],
    variants: [
      {
        id: '1',
        sku: 'CSKW-093',
        images: [
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Cotton_Silk_Bedsheet-1.1.jpeg',
        ],
        attributes: {
          size: {
            'en-GB': 'Queen',
          },
          productspec:
            '- Machine washable\n- 600 thread count\n- Includes 1 fitted sheet',
          'new-arrival': false,
          'color-label': 'White',
          'search-color': {
            key: 'white',
            label: 'White',
          },
          'color-code': '#FFFFFF',
        },
        price: {
          fractionDigits: 2,
          centAmount: 1599,
          currencyCode: 'USD',
        },
        isMatchingVariant: true,
      },
      {
        id: '2',
        sku: 'CSKW-0922',
        images: [
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Cotton_Silk_Bedsheet-2.1.jpeg',
        ],
        attributes: {
          size: {
            'en-GB': 'Twin',
          },
          productspec:
            '- Machine washable\n- 600 thread count\n- Includes 1 fitted sheet',
          'color-label': 'White',
          'search-color': {
            key: 'white',
            label: 'White',
          },
          'color-code': '#FFFFFF',
        },
        price: {
          fractionDigits: 2,
          centAmount: 1299,
          currencyCode: 'USD',
        },
        isMatchingVariant: true,
      },
      {
        id: '3',
        sku: 'CSKW-9822',
        images: [
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Cotton_Silk_Bedsheet-3.1.jpeg',
        ],
        attributes: {
          size: {
            'en-GB': 'King',
          },
          productspec:
            '- Machine washable\n- 600 thread count\n- Includes 1 fitted sheet',
          'color-label': 'White',
          'search-color': {
            key: 'white',
            label: 'White',
          },
          'color-code': '#FFFFFF',
        },
        price: {
          fractionDigits: 2,
          centAmount: 1899,
          currencyCode: 'USD',
        },
        isMatchingVariant: true,
      },
      {
        id: '4',
        sku: 'CSKP-0934',
        images: [
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Cotton_Silk_Bedsheet-4.1.jpeg',
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Cotton_Silk_Bedsheet-4.2.jpeg',
        ],
        attributes: {
          size: {
            'en-GB': 'Twin',
          },
          productspec:
            '- Machine washable\n- 600 thread count\n- Includes 1 fitted sheet',
          'color-label': 'Light Pink',
          'search-color': {
            key: 'pink',
            label: 'Pink',
          },
          'color-code': '#FFB6C1',
        },
        price: {
          fractionDigits: 2,
          centAmount: 1299,
          currencyCode: 'USD',
        },
        isMatchingVariant: true,
      },
      {
        id: '5',
        sku: 'CSKP-0932',
        images: [
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Cotton_Silk_Bedsheet-5.1.jpeg',
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Cotton_Silk_Bedsheet-5.2.jpeg',
        ],
        attributes: {
          size: {
            'en-GB': 'Queen',
          },
          productspec:
            '- Machine washable\n- 600 thread count\n- Includes 1 fitted sheet',
          'color-label': 'Light Pink',
          'search-color': {
            key: 'pink',
            label: 'Pink',
          },
          'color-code': '#FFB6C1',
        },
        price: {
          fractionDigits: 2,
          centAmount: 1599,
          currencyCode: 'USD',
        },
        isMatchingVariant: true,
      },
      {
        id: '6',
        sku: 'CSKP-083',
        images: [
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Cotton_Silk_Bedsheet-6.1.jpeg',
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Cotton_Silk_Bedsheet-6.2.jpeg',
        ],
        attributes: {
          size: {
            'en-GB': 'King',
          },
          productspec:
            '- Machine washable\n- 600 thread count\n- Includes 1 fitted sheet',
          'color-label': 'Light Pink',
          'search-color': {
            key: 'pink',
            label: 'Pink',
          },
          'color-code': '#FFB6C1',
        },
        price: {
          fractionDigits: 2,
          centAmount: 1899,
          currencyCode: 'USD',
        },
        isMatchingVariant: true,
      },
      {
        id: '7',
        sku: 'CSKG-92',
        images: [
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Cotton_Silk_Bedsheet-7.1.jpeg',
        ],
        attributes: {
          size: {
            'en-GB': 'Twin',
          },
          productspec:
            '- Machine washable\n- 600 thread count\n- Includes 1 fitted sheet',
          'color-label': 'Light Gray',
          'search-color': {
            key: 'gray',
            label: 'Gray',
          },
          'color-code': '#D3D3D3',
        },
        price: {
          fractionDigits: 2,
          centAmount: 1299,
          currencyCode: 'USD',
        },
        isMatchingVariant: true,
      },
      {
        id: '8',
        sku: 'CSKG-023',
        images: [
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Cotton_Silk_Bedsheet-8.1.jpeg',
        ],
        attributes: {
          size: {
            'en-GB': 'Queen',
          },
          productspec:
            '- Machine washable\n- 600 thread count\n- Includes 1 fitted sheet',
          'color-label': 'Light Gray',
          'search-color': {
            key: 'gray',
            label: 'Gray',
          },
          'color-code': '#D3D3D3',
        },
        price: {
          fractionDigits: 2,
          centAmount: 1599,
          currencyCode: 'USD',
        },
        isMatchingVariant: true,
      },
      {
        id: '9',
        sku: 'CSKG-2345',
        images: [
          'https://storage.googleapis.com/merchant-center-europe/sample-data/b2c-lifestyle/Cotton_Silk_Bedsheet-9.1.jpeg',
        ],
        attributes: {
          size: {
            'en-GB': 'King',
          },
          productspec:
            '- Machine washable\n- 600 thread count\n- Includes 1 fitted sheet',
          'color-label': 'Light Gray',
          'search-color': {
            key: 'gray',
            label: 'Gray',
          },
          'color-code': '#D3D3D3',
        },
        price: {
          fractionDigits: 2,
          centAmount: 1899,
          currencyCode: 'USD',
        },
        isMatchingVariant: true,
      },
    ],
    _url: '/cotton-silk-bedsheet/p/CSKW-093',
  },
];

const facets: Array<Record<string, any>> = [
  {
    type: 'term',
    identifier: 'variants.attributes.color-code',
    label: 'Color Code',
    key: 'variants.attributes.color-code',
    selected: false,
    terms: [
      {
        identifier: '#000000',
        label: '#000000',
        count: 7,
        key: '#000000',
      },
      {
        identifier: '#008000',
        label: '#008000',
        count: 2,
        key: '#008000',
      },
      {
        identifier: '#00BFFF',
        label: '#00BFFF',
        count: 1,
        key: '#00BFFF',
      },
      {
        identifier: '#2E8B57',
        label: '#2E8B57',
        count: 1,
        key: '#2E8B57',
      },
      {
        identifier: '#2F4F4F',
        label: '#2F4F4F',
        count: 5,
        key: '#2F4F4F',
      },
      {
        identifier: '#3CB371',
        label: '#3CB371',
        count: 1,
        key: '#3CB371',
      },
      {
        identifier: '#4169E1',
        label: '#4169E1',
        count: 3,
        key: '#4169E1',
      },
      {
        identifier: '#778899',
        label: '#778899',
        count: 1,
        key: '#778899',
      },
      {
        identifier: '#800080',
        label: '#800080',
        count: 2,
        key: '#800080',
      },
      {
        identifier: '#808080',
        label: '#808080',
        count: 4,
        key: '#808080',
      },
    ],
  },
  {
    type: 'term',
    identifier: 'variants.attributes.finish-code',
    label: 'Finish Color Code',
    key: 'variants.attributes.finish-code',
    selected: false,
    terms: [
      {
        identifier: '#000000',
        label: '#000000',
        count: 5,
        key: '#000000',
      },
      {
        identifier: '#778899',
        label: '#778899',
        count: 1,
        key: '#778899',
      },
      {
        identifier: '#8b4513',
        label: '#8b4513',
        count: 9,
        key: '#8b4513',
      },
      {
        identifier: '#C0C0C0',
        label: '#C0C0C0',
        count: 9,
        key: '#C0C0C0',
      },
      {
        identifier: '#D2B48C',
        label: '#D2B48C',
        count: 5,
        key: '#D2B48C',
      },
      {
        identifier: '#D3D3D3',
        label: '#D3D3D3',
        count: 1,
        key: '#D3D3D3',
      },
      {
        identifier: '#F5F5DC',
        label: '#F5F5DC',
        count: 2,
        key: '#F5F5DC',
      },
      {
        identifier: '#FFD700',
        label: '#FFD700',
        count: 7,
        key: '#FFD700',
      },
      {
        identifier: '#a52a2a',
        label: '#a52a2a',
        count: 2,
        key: '#a52a2a',
      },
      {
        identifier: '#dcdcdc',
        label: '#dcdcdc',
        count: 1,
        key: '#dcdcdc',
      },
    ],
  },
  {
    type: 'term',
    identifier: 'variants.attributes.size',
    label: 'Size',
    key: 'variants.attributes.size',
    selected: false,
    terms: [],
  },
  {
    type: 'range',
    identifier: 'variants.prices',
    key: 'variants.prices',
    min: 0,
    max: 9007199254740991,
    selected: false,
  },
  {
    type: 'term',
    identifier: 'variants.attributes.search-color',
    label: 'Search Color',
    key: 'variants.attributes.search-color',
    selected: false,
    terms: [
      {
        identifier: 'black',
        label: 'Black',
        count: 7,
        key: 'black',
      },
      {
        identifier: 'blue',
        label: 'Blue',
        count: 7,
        key: 'blue',
      },
      {
        identifier: 'brown',
        label: 'Brown',
        count: 12,
        key: 'brown',
      },
      {
        identifier: 'gray',
        label: 'Gray',
        count: 15,
        key: 'gray',
      },
      {
        identifier: 'green',
        label: 'Green',
        count: 9,
        key: 'green',
      },
      {
        identifier: 'pink',
        label: 'Pink',
        count: 8,
        key: 'pink',
      },
      {
        identifier: 'purple',
        label: 'Purple',
        count: 3,
        key: 'purple',
      },
      {
        identifier: 'red',
        label: 'Red',
        count: 1,
        key: 'red',
      },
      {
        identifier: 'silver',
        label: 'Silver',
        count: 2,
        key: 'silver',
      },
      {
        identifier: 'transparent',
        label: 'Transparent',
        count: 12,
        key: 'transparent',
      },
    ],
  },
];

export const complexObject = {
  total: 117,
  items: products,
  count: 24,
  facets: facets,
  nextCursor: 'offset:24',
  query: {
    categories: [],
    productIds: [],
    productKeys: [],
    productRefs: [],
    skus: [],
    filters: [],
  },
};
