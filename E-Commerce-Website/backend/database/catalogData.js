'use strict';
/**
 * Authoritative Single Source of Truth for E-Commerce Catalog
 * Products: 525
 * Categories: 6
 */

const CATEGORIES = [
  {
    "name": "Electronics",
    "slug": "electronics",
    "description": "Smartphones, laptops, audio systems, smartwatches, cameras, and premium tech gear.",
    "image": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80"
  },
  {
    "name": "Fashion",
    "slug": "fashion",
    "description": "Designer apparel, footwear, luxury timepieces, leather bags, and tailored accessories.",
    "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80"
  },
  {
    "name": "Home & Living",
    "slug": "home-living",
    "description": "Ergonomic office furniture, gourmet kitchenware, smart home climate, and luxury decor.",
    "image": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80"
  },
  {
    "name": "Beauty & Health",
    "slug": "beauty-health",
    "description": "Dermatologist-tested skincare, professional haircare, luxury fragrances, and grooming.",
    "image": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80"
  },
  {
    "name": "Sports & Fitness",
    "slug": "sports-fitness",
    "description": "Adjustable home gym weights, professional yoga mats, percussive therapy, and outdoor gear.",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80"
  },
  {
    "name": "Books",
    "slug": "books",
    "description": "Bestselling software engineering guides, startup masterclasses, psychology, and fine stationery.",
    "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80"
  }
];

const PRODUCTS_DATA = [
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple iPhone 16 Pro Max 256GB",
    "slug": "apple-apple-iphone-16-pro-max-256gb",
    "description": "Titanium design with A18 Pro chip, 48MP Fusion camera system, and industry-leading battery life.",
    "price": 144900,
    "discount_price": 139900,
    "stock": 24,
    "sku": "ELEC-APP-100",
    "featured": true,
    "rating": 4.8,
    "review_count": 392,
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple iPhone 16 Pro 128GB",
    "slug": "apple-apple-iphone-16-pro-128gb",
    "description": "Grade 5 titanium chassis, ProMotion 120Hz Super Retina XDR display, and Camera Control button.",
    "price": 119900,
    "discount_price": 114900,
    "stock": 32,
    "sku": "ELEC-APP-101",
    "featured": true,
    "rating": 4.3,
    "review_count": 409,
    "images": [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple iPhone 16 128GB",
    "slug": "apple-apple-iphone-16-128gb",
    "description": "A18 chip with Apple Intelligence, 48MP 2-in-1 Fusion camera, Action Button, and vibrant aerospace aluminum.",
    "price": 79900,
    "discount_price": 74900,
    "stock": 45,
    "sku": "ELEC-APP-102",
    "featured": false,
    "rating": 4.4,
    "review_count": 426,
    "images": [
      "https://images.unsplash.com/photo-1530319067432-f2a729c03db5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple iPhone 15 128GB",
    "slug": "apple-apple-iphone-15-128gb",
    "description": "Dynamic Island, 48MP main camera, USB-C connectivity, and durable color-infused back glass.",
    "price": 69900,
    "discount_price": 62900,
    "stock": 50,
    "sku": "ELEC-APP-103",
    "featured": false,
    "rating": 4.5,
    "review_count": 443,
    "images": [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple iPhone 14 Plus 128GB",
    "slug": "apple-apple-iphone-14-plus-128gb",
    "description": "Expansive 6.7-inch Super Retina XDR display with all-day battery life and cinematic video mode.",
    "price": 59900,
    "discount_price": 54900,
    "stock": 28,
    "sku": "ELEC-APP-104",
    "featured": false,
    "rating": 4.6,
    "review_count": 460,
    "images": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Samsung",
    "name": "Samsung Galaxy S25 Ultra 5G 256GB",
    "slug": "samsung-samsung-galaxy-s25-ultra-5g-256gb",
    "description": "Snapdragon 8 Elite, built-in S Pen, 200MP quad-telephoto system, and titanium armor frame.",
    "price": 129999,
    "discount_price": 121999,
    "stock": 18,
    "sku": "ELEC-SAM-105",
    "featured": true,
    "rating": 4.7,
    "review_count": 27,
    "images": [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Samsung",
    "name": "Samsung Galaxy S25+ 5G 256GB",
    "slug": "samsung-samsung-galaxy-s25-5g-256gb",
    "description": "Dynamic AMOLED 2X 120Hz display, ProVisual camera engine, and intelligent Galaxy AI features.",
    "price": 99999,
    "discount_price": 92999,
    "stock": 25,
    "sku": "ELEC-SAM-106",
    "featured": false,
    "rating": 4.8,
    "review_count": 44,
    "images": [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530319067432-f2a729c03db5?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Samsung",
    "name": "Samsung Galaxy S24 FE 128GB",
    "slug": "samsung-samsung-galaxy-s24-fe-128gb",
    "description": "Flagship camera performance, Galaxy AI photo assist, and brilliant 6.7-inch AMOLED screen.",
    "price": 59999,
    "discount_price": 52999,
    "stock": 40,
    "sku": "ELEC-SAM-107",
    "featured": false,
    "rating": 4.3,
    "review_count": 61,
    "images": [
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Samsung",
    "name": "Samsung Galaxy Z Fold6 256GB",
    "slug": "samsung-samsung-galaxy-z-fold6-256gb",
    "description": "Next-gen dual-screen foldable with symmetrical hinge, IP48 water resistance, and S Pen support.",
    "price": 164999,
    "discount_price": 154999,
    "stock": 12,
    "sku": "ELEC-SAM-108",
    "featured": true,
    "rating": 4.4,
    "review_count": 78,
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Samsung",
    "name": "Samsung Galaxy Z Flip6 256GB",
    "slug": "samsung-samsung-galaxy-z-flip6-256gb",
    "description": "Compact pocket foldable with FlexWindow cover screen, 50MP dual camera, and vapor chamber cooling.",
    "price": 109999,
    "discount_price": 99999,
    "stock": 20,
    "sku": "ELEC-SAM-109",
    "featured": false,
    "rating": 4.5,
    "review_count": 95,
    "images": [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Samsung",
    "name": "Samsung Galaxy A55 5G 128GB",
    "slug": "samsung-samsung-galaxy-a55-5g-128gb",
    "description": "Metal frame design, Knox Vault security, 50MP OIS camera, and two-day battery life.",
    "price": 39999,
    "discount_price": 34999,
    "stock": 65,
    "sku": "ELEC-SAM-110",
    "featured": false,
    "rating": 4.6,
    "review_count": 112,
    "images": [
      "https://images.unsplash.com/photo-1530319067432-f2a729c03db5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Google",
    "name": "Google Pixel 9 Pro XL 256GB",
    "slug": "google-google-pixel-9-pro-xl-256gb",
    "description": "Google Tensor G4 processor with Gemini Nano AI, pro triple-camera setup, and Super Actua display.",
    "price": 124999,
    "discount_price": 116999,
    "stock": 16,
    "sku": "ELEC-GOO-111",
    "featured": true,
    "rating": 4.7,
    "review_count": 129,
    "images": [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Google",
    "name": "Google Pixel 9 128GB",
    "slug": "google-google-pixel-9-128gb",
    "description": "Signature camera visor, advanced computational photography, Magic Editor, and 7 years of OS updates.",
    "price": 79999,
    "discount_price": 72999,
    "stock": 30,
    "sku": "ELEC-GOO-112",
    "featured": false,
    "rating": 4.8,
    "review_count": 146,
    "images": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Google",
    "name": "Google Pixel 8a 128GB",
    "slug": "google-google-pixel-8a-128gb",
    "description": "Tensor G3 power in a pocket-friendly package with best-in-class AI camera features.",
    "price": 52999,
    "discount_price": 46999,
    "stock": 42,
    "sku": "ELEC-GOO-113",
    "featured": false,
    "rating": 4.3,
    "review_count": 163,
    "images": [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "OnePlus",
    "name": "OnePlus 12 5G 256GB",
    "slug": "oneplus-oneplus-12-5g-256gb",
    "description": "Snapdragon 8 Gen 3, 4th Gen Hasselblad camera, 5400mAh battery with 100W SUPERVOOC charging.",
    "price": 64999,
    "discount_price": 59999,
    "stock": 35,
    "sku": "ELEC-ONE-114",
    "featured": false,
    "rating": 4.4,
    "review_count": 180,
    "images": [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530319067432-f2a729c03db5?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "OnePlus",
    "name": "OnePlus 12R 5G 128GB",
    "slug": "oneplus-oneplus-12r-5g-128gb",
    "description": "1.5K 120Hz ProXDR display, Snapdragon 8 Gen 2, and 5500mAh high-capacity battery.",
    "price": 39999,
    "discount_price": 36999,
    "stock": 48,
    "sku": "ELEC-ONE-115",
    "featured": false,
    "rating": 4.5,
    "review_count": 197,
    "images": [
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "OnePlus",
    "name": "OnePlus Nord 4 5G 128GB",
    "slug": "oneplus-oneplus-nord-4-5g-128gb",
    "description": "All-metal unibody craftsmanship, Snapdragon 7+ Gen 3, and ultra-smooth OxygenOS 14.",
    "price": 29999,
    "discount_price": 27999,
    "stock": 55,
    "sku": "ELEC-ONE-116",
    "featured": false,
    "rating": 4.6,
    "review_count": 214,
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Xiaomi",
    "name": "Xiaomi 14 Ultra 512GB",
    "slug": "xiaomi-xiaomi-14-ultra-512gb",
    "description": "Leica Summilux quad 50MP optical system with 1-inch variable aperture main sensor.",
    "price": 99999,
    "discount_price": 89999,
    "stock": 15,
    "sku": "ELEC-XIA-117",
    "featured": true,
    "rating": 4.7,
    "review_count": 231,
    "images": [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple MacBook Pro 16\" M3 Max 1TB",
    "slug": "apple-apple-macbook-pro-16-m3-max-1tb",
    "description": "16-core CPU, 40-core GPU, Liquid Retina XDR display, up to 22 hours battery for creators.",
    "price": 349900,
    "discount_price": 329900,
    "stock": 8,
    "sku": "ELEC-APP-118",
    "featured": true,
    "rating": 4.8,
    "review_count": 248,
    "images": [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple MacBook Pro 14\" M3 Pro 512GB",
    "slug": "apple-apple-macbook-pro-14-m3-pro-512gb",
    "description": "Compact powerhouse with M3 Pro silicon, hardware-accelerated ray tracing, and studio mics.",
    "price": 199900,
    "discount_price": 184900,
    "stock": 14,
    "sku": "ELEC-APP-119",
    "featured": true,
    "rating": 4.3,
    "review_count": 265,
    "images": [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple MacBook Air 15\" M3 256GB",
    "slug": "apple-apple-macbook-air-15-m3-256gb",
    "description": "Impossibly thin 11.5mm aluminum chassis with 15.3-inch Liquid Retina display and silent fanless design.",
    "price": 134900,
    "discount_price": 124900,
    "stock": 22,
    "sku": "ELEC-APP-120",
    "featured": false,
    "rating": 4.4,
    "review_count": 282,
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple MacBook Air 13\" M2 256GB",
    "slug": "apple-apple-macbook-air-13-m2-256gb",
    "description": "M2 chip performance with MagSafe charging, 1080p FaceTime HD camera, and 18-hour battery life.",
    "price": 99900,
    "discount_price": 89900,
    "stock": 35,
    "sku": "ELEC-APP-121",
    "featured": false,
    "rating": 4.5,
    "review_count": 299,
    "images": [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Dell",
    "name": "Dell XPS 15 9530 Core i9 1TB",
    "slug": "dell-dell-xps-15-9530-core-i9-1tb",
    "description": "13th Gen Intel Core i9, NVIDIA RTX 4070, 3.5K OLED InfinityEdge touch display.",
    "price": 214990,
    "discount_price": 199990,
    "stock": 10,
    "sku": "ELEC-DEL-122",
    "featured": true,
    "rating": 4.6,
    "review_count": 316,
    "images": [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Dell",
    "name": "Dell XPS 13 Plus Core i7 512GB",
    "slug": "dell-dell-xps-13-plus-core-i7-512gb",
    "description": "Zero-lattice keyboard, capacitive touch function row, and invisible haptic glass touchpad.",
    "price": 159990,
    "discount_price": 147990,
    "stock": 15,
    "sku": "ELEC-DEL-123",
    "featured": false,
    "rating": 4.7,
    "review_count": 333,
    "images": [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Dell",
    "name": "Dell Inspiron 16 Plus 512GB SSD",
    "slug": "dell-dell-inspiron-16-plus-512gb-ssd",
    "description": "16-inch 2.5K 16:10 display, Intel Core i7, 16GB DDR5 RAM, tailored for productivity.",
    "price": 84990,
    "discount_price": 76990,
    "stock": 25,
    "sku": "ELEC-DEL-124",
    "featured": false,
    "rating": 4.8,
    "review_count": 350,
    "images": [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Lenovo",
    "name": "Lenovo ThinkPad X1 Carbon Gen 12",
    "slug": "lenovo-lenovo-thinkpad-x1-carbon-gen-12",
    "description": "Mil-spec tested ultralight carbon fiber body, Intel Core Ultra 7, legendary ThinkPad keyboard.",
    "price": 189990,
    "discount_price": 174990,
    "stock": 12,
    "sku": "ELEC-LEN-125",
    "featured": false,
    "rating": 4.3,
    "review_count": 367,
    "images": [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Lenovo",
    "name": "Lenovo Legion Pro 7i RTX 4080",
    "slug": "lenovo-lenovo-legion-pro-7i-rtx-4080",
    "description": "Intel Core i9-14900HX, RTX 4080 12GB graphics, Coldfront 5.0 vapor chamber cooling.",
    "price": 249990,
    "discount_price": 229990,
    "stock": 9,
    "sku": "ELEC-LEN-126",
    "featured": true,
    "rating": 4.4,
    "review_count": 384,
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Lenovo",
    "name": "Lenovo Yoga 9i 2-in-1 Dual OLED",
    "slug": "lenovo-lenovo-yoga-9i-2-in-1-dual-oled",
    "description": "Dual 13.3-inch 2.8K OLED screens with Bowers & Wilkins soundbar hinge and smart digital pen.",
    "price": 169990,
    "discount_price": 156990,
    "stock": 14,
    "sku": "ELEC-LEN-127",
    "featured": false,
    "rating": 4.5,
    "review_count": 401,
    "images": [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "ASUS",
    "name": "ASUS ROG Zephyrus G16 OLED Gaming",
    "slug": "asus-asus-rog-zephyrus-g16-oled-gaming",
    "description": "CNC aluminum unibody with Slash Lighting, 2.5K 240Hz ROG Nebula OLED display, RTX 4070.",
    "price": 199990,
    "discount_price": 184990,
    "stock": 11,
    "sku": "ELEC-ASU-128",
    "featured": true,
    "rating": 4.6,
    "review_count": 418,
    "images": [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "ASUS",
    "name": "ASUS Zenbook 14 OLED Ultra 7",
    "slug": "asus-asus-zenbook-14-oled-ultra-7",
    "description": "Intel Core Ultra 7 with dedicated NPU for AI, 1.2kg weight, and vivid 120Hz 3K Lumina OLED.",
    "price": 104990,
    "discount_price": 94990,
    "stock": 28,
    "sku": "ELEC-ASU-129",
    "featured": false,
    "rating": 4.7,
    "review_count": 435,
    "images": [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "ASUS",
    "name": "ASUS TUF Gaming A15 Ryzen 7",
    "slug": "asus-asus-tuf-gaming-a15-ryzen-7",
    "description": "AMD Ryzen 7 7735HS, RTX 4060 GPU, 144Hz FHD panel with military-grade drop resistance.",
    "price": 78990,
    "discount_price": 69990,
    "stock": 32,
    "sku": "ELEC-ASU-130",
    "featured": false,
    "rating": 4.8,
    "review_count": 452,
    "images": [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "HP",
    "name": "HP Spectre x360 16 2-in-1 Touch",
    "slug": "hp-hp-spectre-x360-16-2-in-1-touch",
    "description": "Nightfall black gem-cut chassis, 4K OLED touch display, 9MP AI camera with auto-framing.",
    "price": 179990,
    "discount_price": 164990,
    "stock": 12,
    "sku": "ELEC-HP-131",
    "featured": false,
    "rating": 4.3,
    "review_count": 469,
    "images": [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "HP",
    "name": "HP OMEN Transcend 14 Slim Gaming",
    "slug": "hp-hp-omen-transcend-14-slim-gaming",
    "description": "Worlds lightest 14-inch gaming laptop with IMAX Enhanced OLED and HyperX tuned audio.",
    "price": 149990,
    "discount_price": 139990,
    "stock": 15,
    "sku": "ELEC-HP-132",
    "featured": false,
    "rating": 4.4,
    "review_count": 36,
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Acer",
    "name": "Acer Swift Go 14 OLED EVO",
    "slug": "acer-acer-swift-go-14-oled-evo",
    "description": "13th Gen Intel Core i5, 2.8K 90Hz OLED display, dual fan TwinAir cooling, 100% DCI-P3.",
    "price": 69990,
    "discount_price": 61990,
    "stock": 30,
    "sku": "ELEC-ACE-133",
    "featured": false,
    "rating": 4.5,
    "review_count": 53,
    "images": [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Sony",
    "name": "Sony WH-1000XM5 Wireless ANC Headphones",
    "slug": "sony-sony-wh-1000xm5-wireless-anc-headphones",
    "description": "Industry-leading noise cancellation with two processors and 8 microphones, LDAC Hi-Res audio.",
    "price": 29990,
    "discount_price": 26990,
    "stock": 38,
    "sku": "ELEC-SON-134",
    "featured": true,
    "rating": 4.6,
    "review_count": 70,
    "images": [
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Sony",
    "name": "Sony WH-1000XM4 Wireless Headphones",
    "slug": "sony-sony-wh-1000xm4-wireless-headphones",
    "description": "Legendary ANC performance, 30-hour battery, Speak-to-Chat, and foldable travel design.",
    "price": 22990,
    "discount_price": 19990,
    "stock": 45,
    "sku": "ELEC-SON-135",
    "featured": false,
    "rating": 4.7,
    "review_count": 87,
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Sony",
    "name": "Sony WF-1000XM5 True Wireless Earbuds",
    "slug": "sony-sony-wf-1000xm5-true-wireless-earbuds",
    "description": "Ultra-compact high-res earbuds with dynamic driver X, deep bass, and bone-conduction mic sensors.",
    "price": 24990,
    "discount_price": 21990,
    "stock": 40,
    "sku": "ELEC-SON-136",
    "featured": false,
    "rating": 4.8,
    "review_count": 104,
    "images": [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple AirPods Max Over-Ear Headphones",
    "slug": "apple-apple-airpods-max-over-ear-headphones",
    "description": "Custom acoustic design, H1 chip in each cup, spatial audio with dynamic head tracking.",
    "price": 59900,
    "discount_price": 54900,
    "stock": 15,
    "sku": "ELEC-APP-137",
    "featured": true,
    "rating": 4.3,
    "review_count": 121,
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple AirPods Pro 2 with USB-C",
    "slug": "apple-apple-airpods-pro-2-with-usb-c",
    "description": "Up to 2x more active noise cancellation, Adaptive Audio, Transparency mode, and MagSafe case.",
    "price": 24900,
    "discount_price": 21900,
    "stock": 60,
    "sku": "ELEC-APP-138",
    "featured": true,
    "rating": 4.4,
    "review_count": 138,
    "images": [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple AirPods (3rd generation)",
    "slug": "apple-apple-airpods-3rd-generation",
    "description": "Personalized spatial audio, contoured ergonomic fit, force sensor controls, sweat and water resistant.",
    "price": 19900,
    "discount_price": 16900,
    "stock": 50,
    "sku": "ELEC-APP-139",
    "featured": false,
    "rating": 4.5,
    "review_count": 155,
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Bose",
    "name": "Bose QuietComfort Ultra Headphones",
    "slug": "bose-bose-quietcomfort-ultra-headphones",
    "description": "Breakthrough spatialized audio, world-class quiet, and CustomTune technology for personalized sound.",
    "price": 35900,
    "discount_price": 32900,
    "stock": 20,
    "sku": "ELEC-BOS-140",
    "featured": true,
    "rating": 4.6,
    "review_count": 172,
    "images": [
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Bose",
    "name": "Bose QuietComfort Ultra Earbuds",
    "slug": "bose-bose-quietcomfort-ultra-earbuds",
    "description": "Immersive audio earbuds with world-class noise cancellation and 9 customizable eartip/band fits.",
    "price": 25900,
    "discount_price": 22900,
    "stock": 26,
    "sku": "ELEC-BOS-141",
    "featured": false,
    "rating": 4.7,
    "review_count": 189,
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Sennheiser",
    "name": "Sennheiser Momentum 4 Wireless",
    "slug": "sennheiser-sennheiser-momentum-4-wireless",
    "description": "Audiophile-inspired 42mm transducer system with incredible 60-hour marathon battery life.",
    "price": 29990,
    "discount_price": 24990,
    "stock": 22,
    "sku": "ELEC-SEN-142",
    "featured": false,
    "rating": 4.8,
    "review_count": 206,
    "images": [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Sennheiser",
    "name": "Sennheiser HD 660S2 Open-Back Reference",
    "slug": "sennheiser-sennheiser-hd-660s2-open-back-reference",
    "description": "Precision engineered open-back headphones delivering sub-bass depth and transparent acoustics.",
    "price": 49990,
    "discount_price": 44990,
    "stock": 10,
    "sku": "ELEC-SEN-143",
    "featured": false,
    "rating": 4.3,
    "review_count": 223,
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "JBL",
    "name": "JBL Live 770NC Over-Ear Wireless",
    "slug": "jbl-jbl-live-770nc-over-ear-wireless",
    "description": "True adaptive noise cancelling with Smart Ambient, JBL Signature Sound, and 65-hour battery.",
    "price": 12999,
    "discount_price": 9999,
    "stock": 45,
    "sku": "ELEC-JBL-144",
    "featured": false,
    "rating": 4.4,
    "review_count": 240,
    "images": [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "JBL",
    "name": "JBL Flip 6 Portable Bluetooth Speaker",
    "slug": "jbl-jbl-flip-6-portable-bluetooth-speaker",
    "description": "2-way speaker system with racetrack woofer, IP67 waterproof/dustproof, and 12-hour playtime.",
    "price": 11999,
    "discount_price": 8999,
    "stock": 55,
    "sku": "ELEC-JBL-145",
    "featured": false,
    "rating": 4.5,
    "review_count": 257,
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "JBL",
    "name": "JBL Charge 5 Powerbank Bluetooth Speaker",
    "slug": "jbl-jbl-charge-5-powerbank-bluetooth-speaker",
    "description": "Long-excursion driver, separate tweeter, built-in USB powerbank to charge mobile devices.",
    "price": 15999,
    "discount_price": 13499,
    "stock": 40,
    "sku": "ELEC-JBL-146",
    "featured": false,
    "rating": 4.6,
    "review_count": 274,
    "images": [
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Marshall",
    "name": "Marshall Major IV Wireless On-Ear",
    "slug": "marshall-marshall-major-iv-wireless-on-ear",
    "description": "Iconic vintage Marshall design with 80+ solid hours of wireless playtime and wireless charging.",
    "price": 12999,
    "discount_price": 10999,
    "stock": 30,
    "sku": "ELEC-MAR-147",
    "featured": false,
    "rating": 4.7,
    "review_count": 291,
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Marshall",
    "name": "Marshall Stanmore III Bluetooth Speaker",
    "slug": "marshall-marshall-stanmore-iii-bluetooth-speaker",
    "description": "Room-filling soundstage with outward-angled tweeters and updated waveguides in classic textured vinyl.",
    "price": 34999,
    "discount_price": 31999,
    "stock": 16,
    "sku": "ELEC-MAR-148",
    "featured": false,
    "rating": 4.8,
    "review_count": 308,
    "images": [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Audio-Technica",
    "name": "Audio-Technica ATH-M50xBT2 Wireless",
    "slug": "audio-technica-audio-technica-ath-m50xbt2-wireless",
    "description": "Legendary M50x studio sonic signature with 45mm large-aperture drivers and 50-hour battery.",
    "price": 18990,
    "discount_price": 16490,
    "stock": 25,
    "sku": "ELEC-AUD-149",
    "featured": false,
    "rating": 4.3,
    "review_count": 325,
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple Watch Ultra 2 GPS + Cellular 49mm",
    "slug": "apple-apple-watch-ultra-2-gps-cellular-49mm",
    "description": "Rugged titanium case, 3000-nit display, precision dual-frequency GPS, and 36-hour battery.",
    "price": 89900,
    "discount_price": 84900,
    "stock": 16,
    "sku": "ELEC-APP-150",
    "featured": true,
    "rating": 4.4,
    "review_count": 342,
    "images": [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple Watch Series 10 GPS 46mm",
    "slug": "apple-apple-watch-series-10-gps-46mm",
    "description": "Thinnest Apple Watch ever with largest display area, depth gauge, and ECG/blood oxygen monitors.",
    "price": 46900,
    "discount_price": 43900,
    "stock": 28,
    "sku": "ELEC-APP-151",
    "featured": false,
    "rating": 4.5,
    "review_count": 359,
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple Watch SE 2nd Gen GPS 44mm",
    "slug": "apple-apple-watch-se-2nd-gen-gps-44mm",
    "description": "Core fitness tracking, Crash Detection, Heart Rate notifications, and swim-proof 50m casing.",
    "price": 29900,
    "discount_price": 26900,
    "stock": 35,
    "sku": "ELEC-APP-152",
    "featured": false,
    "rating": 4.6,
    "review_count": 376,
    "images": [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Samsung",
    "name": "Samsung Galaxy Watch Ultra 47mm LTE",
    "slug": "samsung-samsung-galaxy-watch-ultra-47mm-lte",
    "description": "Titanium cushion design, 100m water resistance, dual-frequency GPS, and BioActive sensor.",
    "price": 59999,
    "discount_price": 54999,
    "stock": 18,
    "sku": "ELEC-SAM-153",
    "featured": true,
    "rating": 4.7,
    "review_count": 393,
    "images": [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Samsung",
    "name": "Samsung Galaxy Watch 7 44mm Bluetooth",
    "slug": "samsung-samsung-galaxy-watch-7-44mm-bluetooth",
    "description": "3nm processor, advanced AI sleep analysis, body composition analysis, and sapphire crystal.",
    "price": 32999,
    "discount_price": 29999,
    "stock": 32,
    "sku": "ELEC-SAM-154",
    "featured": false,
    "rating": 4.8,
    "review_count": 410,
    "images": [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Garmin",
    "name": "Garmin Fenix 7 Pro Solar Multisport GPS",
    "slug": "garmin-garmin-fenix-7-pro-solar-multisport-gps",
    "description": "Solar charging lens, built-in LED flashlight, Hill Score, Endurance Score, and TopoActive maps.",
    "price": 89990,
    "discount_price": 81990,
    "stock": 12,
    "sku": "ELEC-GAR-155",
    "featured": true,
    "rating": 4.3,
    "review_count": 427,
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Garmin",
    "name": "Garmin Forerunner 965 AMOLED Triathlon",
    "slug": "garmin-garmin-forerunner-965-amoled-triathlon",
    "description": "Brilliant 1.4-inch AMOLED touchscreen, titanium bezel, advanced training metrics, and full maps.",
    "price": 67990,
    "discount_price": 62990,
    "stock": 15,
    "sku": "ELEC-GAR-156",
    "featured": false,
    "rating": 4.4,
    "review_count": 444,
    "images": [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Garmin",
    "name": "Garmin Venu 3 Fitness Smartwatch",
    "slug": "garmin-garmin-venu-3-fitness-smartwatch",
    "description": "Sleep coach with HRV status, voice calls from wrist, wheelchair mode, and 14-day battery.",
    "price": 45990,
    "discount_price": 41990,
    "stock": 20,
    "sku": "ELEC-GAR-157",
    "featured": false,
    "rating": 4.5,
    "review_count": 461,
    "images": [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Fitbit",
    "name": "Fitbit Sense 2 Advanced Health Watch",
    "slug": "fitbit-fitbit-sense-2-advanced-health-watch",
    "description": "All-day body response tracking for stress management, ECG app, SpO2, and built-in GPS.",
    "price": 24999,
    "discount_price": 20999,
    "stock": 25,
    "sku": "ELEC-FIT-158",
    "featured": false,
    "rating": 4.6,
    "review_count": 28,
    "images": [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Amazfit",
    "name": "Amazfit Cheetah Pro Running Watch",
    "slug": "amazfit-amazfit-cheetah-pro-running-watch",
    "description": "MaxTrack dual-band circularly-polarized GPS antenna with AI coaching and titanium alloy bezel.",
    "price": 29999,
    "discount_price": 24999,
    "stock": 30,
    "sku": "ELEC-AMA-159",
    "featured": false,
    "rating": 4.7,
    "review_count": 45,
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Amazfit",
    "name": "Amazfit GTR 4 Vintage Smartwatch",
    "slug": "amazfit-amazfit-gtr-4-vintage-smartwatch",
    "description": "1.43-inch HD AMOLED, dual-band GPS, 150+ sports modes, and 14-day ultra-long battery life.",
    "price": 18999,
    "discount_price": 15999,
    "stock": 38,
    "sku": "ELEC-AMA-160",
    "featured": false,
    "rating": 4.8,
    "review_count": 62,
    "images": [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "OnePlus",
    "name": "OnePlus Watch 2 Dual-Engine Architecture",
    "slug": "oneplus-oneplus-watch-2-dual-engine-architecture",
    "description": "Dual-engine architecture with Wear OS 4, Snapdragon W5 + BES2700, and 100-hour smart battery.",
    "price": 24999,
    "discount_price": 21999,
    "stock": 26,
    "sku": "ELEC-ONE-161",
    "featured": false,
    "rating": 4.3,
    "review_count": 79,
    "images": [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Sony",
    "name": "Sony Alpha 7 IV Full-Frame Mirrorless Body",
    "slug": "sony-sony-alpha-7-iv-full-frame-mirrorless-body",
    "description": "33MP Exmor R sensor, BIONZ XR engine, 4K 60p 10-bit 4:2:2 video, and Real-time Eye AF.",
    "price": 219990,
    "discount_price": 204990,
    "stock": 8,
    "sku": "ELEC-SON-162",
    "featured": true,
    "rating": 4.4,
    "review_count": 96,
    "images": [
      "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Sony",
    "name": "Sony Alpha 7R V 61MP High-Res Body",
    "slug": "sony-sony-alpha-7r-v-61mp-high-res-body",
    "description": "61.0MP full-frame back-illuminated sensor with revolutionary dedicated AI processing unit.",
    "price": 349990,
    "discount_price": 329990,
    "stock": 5,
    "sku": "ELEC-SON-163",
    "featured": true,
    "rating": 4.5,
    "review_count": 113,
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Sony",
    "name": "Sony ZV-E10 Vlogging Camera with 16-50mm",
    "slug": "sony-sony-zv-e10-vlogging-camera-with-16-50mm",
    "description": "Interchangeable lens vlogger camera with directional 3-capsule mic and product showcase setting.",
    "price": 61490,
    "discount_price": 54990,
    "stock": 24,
    "sku": "ELEC-SON-164",
    "featured": false,
    "rating": 4.6,
    "review_count": 130,
    "images": [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Canon",
    "name": "Canon EOS R6 Mark II Mirrorless Body",
    "slug": "canon-canon-eos-r6-mark-ii-mirrorless-body",
    "description": "24.2MP full-frame CMOS sensor, 40 fps electronic shutter, 6K oversampled uncropped 4K 60p.",
    "price": 215995,
    "discount_price": 199995,
    "stock": 7,
    "sku": "ELEC-CAN-165",
    "featured": true,
    "rating": 4.7,
    "review_count": 147,
    "images": [
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Canon",
    "name": "Canon EOS R50 Content Creator Kit",
    "slug": "canon-canon-eos-r50-content-creator-kit",
    "description": "Compact APS-C mirrorless kit with RF-S 18-45mm lens, tripod grip, and stereo microphone.",
    "price": 74995,
    "discount_price": 66995,
    "stock": 18,
    "sku": "ELEC-CAN-166",
    "featured": false,
    "rating": 4.8,
    "review_count": 164,
    "images": [
      "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Fujifilm",
    "name": "Fujifilm X-T5 Mirrorless Body Black",
    "slug": "fujifilm-fujifilm-x-t5-mirrorless-body-black",
    "description": "40.2MP X-Trans CMOS 5 HR sensor with classic tactile analog dials and 7-stop IBIS.",
    "price": 169999,
    "discount_price": 159999,
    "stock": 9,
    "sku": "ELEC-FUJ-167",
    "featured": false,
    "rating": 4.3,
    "review_count": 181,
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Fujifilm",
    "name": "Fujifilm X100VI Digital Camera Silver",
    "slug": "fujifilm-fujifilm-x100vi-digital-camera-silver",
    "description": "Fixed 23mm F2 lens, hybrid optical/electronic viewfinder, 20 film simulation modes, and IBIS.",
    "price": 179999,
    "discount_price": 169999,
    "stock": 6,
    "sku": "ELEC-FUJ-168",
    "featured": true,
    "rating": 4.4,
    "review_count": 198,
    "images": [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Nikon",
    "name": "Nikon Z8 Full-Frame Mirrorless Body",
    "slug": "nikon-nikon-z8-full-frame-mirrorless-body",
    "description": "Mini Z9 engineering with 45.7MP stacked sensor, blackout-free Real-Live viewfinder, 8K video.",
    "price": 343995,
    "discount_price": 319995,
    "stock": 5,
    "sku": "ELEC-NIK-169",
    "featured": true,
    "rating": 4.5,
    "review_count": 215,
    "images": [
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "DJI",
    "name": "DJI Mini 4 Pro Drone with RC 2 Controller",
    "slug": "dji-dji-mini-4-pro-drone-with-rc-2-controller",
    "description": "Under 249g ultralight foldable drone with omnidirectional obstacle sensing and 4K 60fps HDR.",
    "price": 104990,
    "discount_price": 96990,
    "stock": 14,
    "sku": "ELEC-DJI-170",
    "featured": true,
    "rating": 4.6,
    "review_count": 232,
    "images": [
      "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "DJI",
    "name": "DJI Osmo Pocket 3 Creator Combo",
    "slug": "dji-dji-osmo-pocket-3-creator-combo",
    "description": "1-inch CMOS gimbal camera with 2-inch rotatable OLED touchscreen and ActiveTrack 6.0.",
    "price": 68990,
    "discount_price": 62990,
    "stock": 16,
    "sku": "ELEC-DJI-171",
    "featured": false,
    "rating": 4.7,
    "review_count": 249,
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "DJI",
    "name": "DJI Osmo Action 4 Adventure Combo",
    "slug": "dji-dji-osmo-action-4-adventure-combo",
    "description": "1/1.3-inch sensor action camera with 10-bit D-Log M color, 18m waterproof without case.",
    "price": 39990,
    "discount_price": 34990,
    "stock": 22,
    "sku": "ELEC-DJI-172",
    "featured": false,
    "rating": 4.8,
    "review_count": 266,
    "images": [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Sony",
    "name": "PlayStation 5 Slim Console Disc Edition",
    "slug": "sony-playstation-5-slim-console-disc-edition",
    "description": "Custom AMD Zen 2 CPU, RDNA 2 GPU, ultra-fast 1TB NVMe SSD, Ray Tracing, and 4K 120Hz output.",
    "price": 54990,
    "discount_price": 49990,
    "stock": 20,
    "sku": "ELEC-SON-173",
    "featured": true,
    "rating": 4.3,
    "review_count": 283,
    "images": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Sony",
    "name": "PS5 DualSense Edge Wireless Controller",
    "slug": "sony-ps5-dualsense-edge-wireless-controller",
    "description": "Ultra-customizable controls, swappable stick modules, back buttons, and braided USB cable.",
    "price": 18990,
    "discount_price": 16990,
    "stock": 25,
    "sku": "ELEC-SON-174",
    "featured": false,
    "rating": 4.4,
    "review_count": 300,
    "images": [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Microsoft",
    "name": "Xbox Series X 1TB Gaming Console",
    "slug": "microsoft-xbox-series-x-1tb-gaming-console",
    "description": "12 teraflops of raw graphic processing power, Quick Resume, DirectX ray tracing, and 4K gaming.",
    "price": 55990,
    "discount_price": 49990,
    "stock": 16,
    "sku": "ELEC-MIC-175",
    "featured": true,
    "rating": 4.5,
    "review_count": 317,
    "images": [
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Microsoft",
    "name": "Xbox Elite Wireless Controller Series 2",
    "slug": "microsoft-xbox-elite-wireless-controller-series-2",
    "description": "Adjustable-tension thumbsticks, wrap-around rubberized grip, and 40 hours of rechargeable battery.",
    "price": 15990,
    "discount_price": 13990,
    "stock": 28,
    "sku": "ELEC-MIC-176",
    "featured": false,
    "rating": 4.6,
    "review_count": 334,
    "images": [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Nintendo",
    "name": "Nintendo Switch OLED Model Mario Red",
    "slug": "nintendo-nintendo-switch-oled-model-mario-red",
    "description": "Vibrant 7-inch OLED screen, wide adjustable stand, wired LAN port, and 64GB internal storage.",
    "price": 34999,
    "discount_price": 31999,
    "stock": 30,
    "sku": "ELEC-NIN-177",
    "featured": false,
    "rating": 4.7,
    "review_count": 351,
    "images": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Razer",
    "name": "Razer BlackWidow V4 Pro Mechanical Keyboard",
    "slug": "razer-razer-blackwidow-v4-pro-mechanical-keyboard",
    "description": "Green clicky mechanical switches with Command Dial, 8 dedicated macro keys, and Chroma RGB underglow.",
    "price": 22999,
    "discount_price": 19999,
    "stock": 20,
    "sku": "ELEC-RAZ-178",
    "featured": false,
    "rating": 4.8,
    "review_count": 368,
    "images": [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Razer",
    "name": "Razer DeathAdder V3 Pro Wireless Gaming Mouse",
    "slug": "razer-razer-deathadder-v3-pro-wireless-gaming-mouse",
    "description": "Ultra-lightweight 63g ergonomic design with Focus Pro 30K Optical Sensor and 90-hour battery.",
    "price": 14999,
    "discount_price": 12999,
    "stock": 35,
    "sku": "ELEC-RAZ-179",
    "featured": false,
    "rating": 4.3,
    "review_count": 385,
    "images": [
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Logitech",
    "name": "Logitech G PRO X SUPERLIGHT 2 Mouse",
    "slug": "logitech-logitech-g-pro-x-superlight-2-mouse",
    "description": "60g tournament-proven wireless gaming mouse with HERO 2 sensor and LIGHTFORCE hybrid switches.",
    "price": 15995,
    "discount_price": 13995,
    "stock": 32,
    "sku": "ELEC-LOG-180",
    "featured": true,
    "rating": 4.4,
    "review_count": 402,
    "images": [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Logitech",
    "name": "Logitech G915 LIGHTSPEED Wireless RGB Keyboard",
    "slug": "logitech-logitech-g915-lightspeed-wireless-rgb-keyboard",
    "description": "Low-profile GL tactile mechanical switches, aircraft-grade 5052 aluminum alloy top plate.",
    "price": 21995,
    "discount_price": 18995,
    "stock": 22,
    "sku": "ELEC-LOG-181",
    "featured": false,
    "rating": 4.5,
    "review_count": 419,
    "images": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Logitech",
    "name": "Logitech MX Master 3S Performance Mouse",
    "slug": "logitech-logitech-mx-master-3s-performance-mouse",
    "description": "MagSpeed electromagnetic scrolling, 8K DPI track-on-glass sensor, and 90% quieter clicks.",
    "price": 10995,
    "discount_price": 8995,
    "stock": 65,
    "sku": "ELEC-LOG-182",
    "featured": true,
    "rating": 4.6,
    "review_count": 436,
    "images": [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "SteelSeries",
    "name": "SteelSeries Arctis Nova Pro Wireless Headset",
    "slug": "steelseries-steelseries-arctis-nova-pro-wireless-headset",
    "description": "Multi-system dual wireless with active noise cancellation, OLED base station, hot-swap batteries.",
    "price": 34999,
    "discount_price": 29999,
    "stock": 15,
    "sku": "ELEC-STE-183",
    "featured": false,
    "rating": 4.7,
    "review_count": 453,
    "images": [
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Keychron",
    "name": "Keychron Q1 Pro Wireless Custom Mechanical",
    "slug": "keychron-keychron-q1-pro-wireless-custom-mechanical",
    "description": "CNC machined 6063 aluminum body, double-gasket acoustic design, QMK/VIA programmable.",
    "price": 19999,
    "discount_price": 17499,
    "stock": 24,
    "sku": "ELEC-KEY-184",
    "featured": false,
    "rating": 4.8,
    "review_count": 470,
    "images": [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple iPad Pro 13\" M4 OLED 256GB",
    "slug": "apple-apple-ipad-pro-13-m4-oled-256gb",
    "description": "Breakthrough Ultra Retina XDR tandem OLED display, M4 silicon chip, and ultra-thin 5.1mm body.",
    "price": 129900,
    "discount_price": 119900,
    "stock": 18,
    "sku": "ELEC-APP-185",
    "featured": true,
    "rating": 4.3,
    "review_count": 37,
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Apple",
    "name": "Apple iPad Air 11\" M2 128GB",
    "slug": "apple-apple-ipad-air-11-m2-128gb",
    "description": "M2 performance with landscape front camera, Touch ID, Apple Pencil Pro support, and Wi-Fi 6E.",
    "price": 59900,
    "discount_price": 54900,
    "stock": 35,
    "sku": "ELEC-APP-186",
    "featured": false,
    "rating": 4.4,
    "review_count": 54,
    "images": [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Samsung",
    "name": "Samsung Galaxy Tab S9 Ultra 256GB Wi-Fi",
    "slug": "samsung-samsung-galaxy-tab-s9-ultra-256gb-wi-fi",
    "description": "Monumental 14.6-inch Dynamic AMOLED 2X display, IP68 water-resistant S Pen included, Armor Aluminum.",
    "price": 108999,
    "discount_price": 97999,
    "stock": 14,
    "sku": "ELEC-SAM-187",
    "featured": true,
    "rating": 4.5,
    "review_count": 71,
    "images": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Amazon",
    "name": "Kindle Paperwhite Signature Edition 32GB",
    "slug": "amazon-kindle-paperwhite-signature-edition-32gb",
    "description": "6.8-inch 300 ppi glare-free display with auto-adjusting warm front light and wireless charging.",
    "price": 17999,
    "discount_price": 14999,
    "stock": 45,
    "sku": "ELEC-AMA-188",
    "featured": false,
    "rating": 4.6,
    "review_count": 88,
    "images": [
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "LG",
    "name": "LG 27\" UltraFine 4K UHD IPS Monitor",
    "slug": "lg-lg-27-ultrafine-4k-uhd-ips-monitor",
    "description": "3840x2160 resolution with HDR10, DCI-P3 95%, USB-C with 90W power delivery, and ergonomic stand.",
    "price": 34999,
    "discount_price": 29999,
    "stock": 25,
    "sku": "ELEC-LG-189",
    "featured": false,
    "rating": 4.7,
    "review_count": 105,
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "LG",
    "name": "LG UltraGear 34\" Curved WQHD OLED Monitor",
    "slug": "lg-lg-ultragear-34-curved-wqhd-oled-monitor",
    "description": "800R curved OLED panel, 240Hz refresh rate, 0.03ms response time, NVIDIA G-SYNC compatible.",
    "price": 99999,
    "discount_price": 89999,
    "stock": 10,
    "sku": "ELEC-LG-190",
    "featured": true,
    "rating": 4.8,
    "review_count": 122,
    "images": [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Dell",
    "name": "Dell UltraSharp 32 4K USB-C Hub Monitor",
    "slug": "dell-dell-ultrasharp-32-4k-usb-c-hub-monitor",
    "description": "IPS Black technology with 2000:1 contrast ratio, 98% DCI-P3, and built-in RJ45 Ethernet.",
    "price": 74990,
    "discount_price": 66990,
    "stock": 15,
    "sku": "ELEC-DEL-191",
    "featured": false,
    "rating": 4.3,
    "review_count": 139,
    "images": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Anker",
    "name": "Anker Prime 20000mAh 200W Power Bank",
    "slug": "anker-anker-prime-20000mah-200w-power-bank",
    "description": "Two high-power USB-C ports with 100W each, digital display screen, and ultra-compact form.",
    "price": 12999,
    "discount_price": 9999,
    "stock": 40,
    "sku": "ELEC-ANK-192",
    "featured": false,
    "rating": 4.4,
    "review_count": 156,
    "images": [
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Anker",
    "name": "Anker 737 GaNPrime 120W Wall Charger",
    "slug": "anker-anker-737-ganprime-120w-wall-charger",
    "description": "GaNPrime fast charger powering 3 devices simultaneously with Dynamic Power Distribution.",
    "price": 6999,
    "discount_price": 5499,
    "stock": 60,
    "sku": "ELEC-ANK-193",
    "featured": false,
    "rating": 4.5,
    "review_count": 173,
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "electronics",
    "brand": "Belkin",
    "name": "Belkin BoostCharge Pro 3-in-1 MagSafe Stand",
    "slug": "belkin-belkin-boostcharge-pro-3-in-1-magsafe-stand",
    "description": "Official 15W MagSafe wireless charging stand for iPhone, Apple Watch Ultra fast charging, AirPods.",
    "price": 14999,
    "discount_price": 12499,
    "stock": 28,
    "sku": "ELEC-BEL-194",
    "featured": false,
    "rating": 4.6,
    "review_count": 190,
    "images": [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Ralph Lauren",
    "name": "Custom Slim Fit Oxford Shirt",
    "slug": "ralph-lauren-custom-slim-fit-oxford-shirt",
    "description": "Garment-dyed woven cotton with signature embroidered pony at chest.",
    "price": 9990,
    "discount_price": 8490,
    "stock": 30,
    "sku": "FASH-RAL-195",
    "featured": true,
    "rating": 4.7,
    "review_count": 116,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Ralph Lauren",
    "name": "Iconic Mesh Polo Shirt Navy",
    "slug": "ralph-lauren-iconic-mesh-polo-shirt-navy",
    "description": "Breathable cotton mesh with ribbed polo collar and tennis tail hem.",
    "price": 7990,
    "discount_price": 6790,
    "stock": 31,
    "sku": "FASH-RAL-196",
    "featured": false,
    "rating": 4.8,
    "review_count": 129,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Tommy Hilfiger",
    "name": "Organic Cotton Oxford Button-Down",
    "slug": "tommy-hilfiger-organic-cotton-oxford-button-down",
    "description": "Crisp organic cotton button-up with understated flag embroidery on pocket.",
    "price": 5499,
    "discount_price": 4499,
    "stock": 32,
    "sku": "FASH-TOM-197",
    "featured": false,
    "rating": 4.3,
    "review_count": 142,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Tommy Hilfiger",
    "name": "Classic Fit Essential Crewneck Tee",
    "slug": "tommy-hilfiger-classic-fit-essential-crewneck-tee",
    "description": "Pure combed jersey cotton with ribbed neckband and timeless regular fit.",
    "price": 2999,
    "discount_price": 2299,
    "stock": 33,
    "sku": "FASH-TOM-198",
    "featured": false,
    "rating": 4.4,
    "review_count": 155,
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Levi's",
    "name": "Barstow Western Denim Shirt Rinse",
    "slug": "levis-barstow-western-denim-shirt-rinse",
    "description": "Heritage curved Western yoke, pearl snap closures, and dual chest flap pockets.",
    "price": 4499,
    "discount_price": 3499,
    "stock": 34,
    "sku": "FASH-LEV-199",
    "featured": false,
    "rating": 4.5,
    "review_count": 168,
    "images": [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Levi's",
    "name": "Housemark Classic Graphic Tee White",
    "slug": "levis-housemark-classic-graphic-tee-white",
    "description": "Soft 100% cotton crewneck featuring iconic Levi's batwing chest logo.",
    "price": 1499,
    "discount_price": 1199,
    "stock": 35,
    "sku": "FASH-LEV-200",
    "featured": false,
    "rating": 4.6,
    "review_count": 181,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Zara",
    "name": "Tailored French Linen Shirt White",
    "slug": "zara-tailored-french-linen-shirt-white",
    "description": "Breathable 100% European linen with spread collar and clean front placket.",
    "price": 3990,
    "discount_price": null,
    "stock": 36,
    "sku": "FASH-ZAR-201",
    "featured": false,
    "rating": 4.7,
    "review_count": 194,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Zara",
    "name": "Structured Heavyweight Oversized Tee",
    "slug": "zara-structured-heavyweight-oversized-tee",
    "description": "280 GSM premium cotton jersey with dropped shoulders and relaxed modern boxy cut.",
    "price": 2290,
    "discount_price": 1890,
    "stock": 37,
    "sku": "FASH-ZAR-202",
    "featured": false,
    "rating": 4.8,
    "review_count": 207,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Uniqlo",
    "name": "Extra Fine Merino Crew Neck Sweater",
    "slug": "uniqlo-extra-fine-merino-crew-neck-sweater",
    "description": "19.5 micron ultra-fine Australian Merino wool with anti-pilling treatment.",
    "price": 3490,
    "discount_price": 2990,
    "stock": 38,
    "sku": "FASH-UNI-203",
    "featured": false,
    "rating": 4.3,
    "review_count": 220,
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Uniqlo",
    "name": "Supima Cotton Crew Neck Short Sleeve",
    "slug": "uniqlo-supima-cotton-crew-neck-short-sleeve",
    "description": "Rare long-staple Supima cotton delivering silky smooth feel and rich color depth.",
    "price": 1490,
    "discount_price": 1190,
    "stock": 39,
    "sku": "FASH-UNI-204",
    "featured": false,
    "rating": 4.4,
    "review_count": 233,
    "images": [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Calvin Klein",
    "name": "Slim Fit Performance Stretch Dress Shirt",
    "slug": "calvin-klein-slim-fit-performance-stretch-dress-shirt",
    "description": "Moisture-wicking stretch poplin engineered for boardroom comfort all day.",
    "price": 5999,
    "discount_price": 4799,
    "stock": 40,
    "sku": "FASH-CAL-205",
    "featured": false,
    "rating": 4.5,
    "review_count": 246,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Calvin Klein",
    "name": "Liquid Touch Short Sleeve Polo Black",
    "slug": "calvin-klein-liquid-touch-short-sleeve-polo-black",
    "description": "Crafted from ultra-soft liquid touch cotton with refined spread polo collar.",
    "price": 4999,
    "discount_price": 3999,
    "stock": 41,
    "sku": "FASH-CAL-206",
    "featured": false,
    "rating": 4.6,
    "review_count": 259,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Patagonia",
    "name": "Better Sweater Fleece Jacket Stonewash",
    "slug": "patagonia-better-sweater-fleece-jacket-stonewash",
    "description": "100% recycled polyester sweater-knit fleece dyed with a low-impact process.",
    "price": 14990,
    "discount_price": 12990,
    "stock": 42,
    "sku": "FASH-PAT-207",
    "featured": false,
    "rating": 4.7,
    "review_count": 272,
    "images": [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Patagonia",
    "name": "P-6 Logo Responsibili-Tee Shirt",
    "slug": "patagonia-p-6-logo-responsibili-tee-shirt",
    "description": "100% recycled fabric blend made with 4.8 plastic bottles and 0.26 pounds of fabric scrap.",
    "price": 3990,
    "discount_price": null,
    "stock": 43,
    "sku": "FASH-PAT-208",
    "featured": false,
    "rating": 4.8,
    "review_count": 285,
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Massimo Dutti",
    "name": "Italian Pure Cashmere V-Neck Jumper",
    "slug": "massimo-dutti-italian-pure-cashmere-v-neck-jumper",
    "description": "Luxurious two-ply Mongolian cashmere with ribbed cuffs and refined neckline.",
    "price": 12990,
    "discount_price": 10990,
    "stock": 44,
    "sku": "FASH-MAS-209",
    "featured": true,
    "rating": 4.3,
    "review_count": 298,
    "images": [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Levi's",
    "name": "501 Original Fit Jeans Dark Stonewash",
    "slug": "levis-501-original-fit-jeans-dark-stonewash",
    "description": "The original straight leg blue jean with authentic copper rivets and signature button fly.",
    "price": 4999,
    "discount_price": 3999,
    "stock": 45,
    "sku": "FASH-LEV-210",
    "featured": false,
    "rating": 4.4,
    "review_count": 311,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Levi's",
    "name": "511 Slim Fit Stretch Jeans Black Stone",
    "slug": "levis-511-slim-fit-stretch-jeans-black-stone",
    "description": "Modern slim fit with added stretch for all-day mobility from hip to ankle.",
    "price": 4499,
    "discount_price": 3699,
    "stock": 46,
    "sku": "FASH-LEV-211",
    "featured": false,
    "rating": 4.5,
    "review_count": 324,
    "images": [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Levi's",
    "name": "512 Slim Taper Fit Jeans Blue Rhythm",
    "slug": "levis-512-slim-taper-fit-jeans-blue-rhythm",
    "description": "The perfect balance of slim and tapered cut for a clean tailor-made silhouette.",
    "price": 4799,
    "discount_price": 3899,
    "stock": 47,
    "sku": "FASH-LEV-212",
    "featured": false,
    "rating": 4.6,
    "review_count": 337,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Dockers",
    "name": "Signature Khaki Straight Fit Flat Front",
    "slug": "dockers-signature-khaki-straight-fit-flat-front",
    "description": "No-wrinkle lux cotton twill with Individual Fit waistband offering 1 inch of comfort.",
    "price": 3999,
    "discount_price": 3199,
    "stock": 48,
    "sku": "FASH-DOC-213",
    "featured": false,
    "rating": 4.7,
    "review_count": 350,
    "images": [
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Dockers",
    "name": "Alpha Khaki Slim Tapered Chino Pants",
    "slug": "dockers-alpha-khaki-slim-tapered-chino-pants",
    "description": "Garment-washed stretch twill trousers blending casual style with sharp tailoring.",
    "price": 3799,
    "discount_price": 2999,
    "stock": 49,
    "sku": "FASH-DOC-214",
    "featured": false,
    "rating": 4.8,
    "review_count": 363,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Zara",
    "name": "Pleated Relaxed Fit Smart Trousers Charcoal",
    "slug": "zara-pleated-relaxed-fit-smart-trousers-charcoal",
    "description": "Fluid drape bi-stretch fabric with front double pleats and concealed button tab.",
    "price": 4590,
    "discount_price": 3690,
    "stock": 50,
    "sku": "FASH-ZAR-215",
    "featured": false,
    "rating": 4.3,
    "review_count": 26,
    "images": [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Zara",
    "name": "Tailored Slim Fit Chinos Navy Blue",
    "slug": "zara-tailored-slim-fit-chinos-navy-blue",
    "description": "Sleek cotton-elastane blend chinos with side slant pockets and rear welt pockets.",
    "price": 3590,
    "discount_price": 2890,
    "stock": 51,
    "sku": "FASH-ZAR-216",
    "featured": false,
    "rating": 4.4,
    "review_count": 39,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Lee",
    "name": "Extreme Motion Straight Fit Stretch Jeans",
    "slug": "lee-extreme-motion-straight-fit-stretch-jeans",
    "description": "Innovative flexible waistband and four-way stretch denim designed for maximum movement.",
    "price": 3499,
    "discount_price": 2699,
    "stock": 52,
    "sku": "FASH-LEE-217",
    "featured": false,
    "rating": 4.5,
    "review_count": 52,
    "images": [
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Uniqlo",
    "name": "Smart Ankle Pants 2-Way Stretch Grey",
    "slug": "uniqlo-smart-ankle-pants-2-way-stretch-grey",
    "description": "Clean tapered ankle length cut with wool-like refined texture and elastic waistband.",
    "price": 2990,
    "discount_price": 2490,
    "stock": 53,
    "sku": "FASH-UNI-218",
    "featured": false,
    "rating": 4.6,
    "review_count": 65,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Uniqlo",
    "name": "Selvedge Regular Fit Straight Jeans Indigo",
    "slug": "uniqlo-selvedge-regular-fit-straight-jeans-indigo",
    "description": "Authentic Japanese Kaihara selvedge denim crafted to develop unique personal fades.",
    "price": 3990,
    "discount_price": 3290,
    "stock": 54,
    "sku": "FASH-UNI-219",
    "featured": false,
    "rating": 4.7,
    "review_count": 78,
    "images": [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Calvin Klein",
    "name": "Slim Fit Refined Stretch Twill Trousers",
    "slug": "calvin-klein-slim-fit-refined-stretch-twill-trousers",
    "description": "Premium micro-twill weave with clean pressed creases and tonal hardware.",
    "price": 6499,
    "discount_price": 5199,
    "stock": 55,
    "sku": "FASH-CAL-220",
    "featured": false,
    "rating": 4.8,
    "review_count": 91,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Tommy Hilfiger",
    "name": "Bleecker Slim Fit Chino Trousers Beige",
    "slug": "tommy-hilfiger-bleecker-slim-fit-chino-trousers-beige",
    "description": "Tailored stretch cotton chinos with signature tape detailing inside the waistband.",
    "price": 6999,
    "discount_price": 5499,
    "stock": 56,
    "sku": "FASH-TOM-221",
    "featured": false,
    "rating": 4.3,
    "review_count": 104,
    "images": [
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "The North Face",
    "name": "1996 Retro Nuptse Down Jacket Black",
    "slug": "the-north-face-1996-retro-nuptse-down-jacket-black",
    "description": "700-fill goose down warmth with shiny ripstop shell and stowable hood.",
    "price": 29990,
    "discount_price": 26990,
    "stock": 57,
    "sku": "FASH-THE-222",
    "featured": false,
    "rating": 4.4,
    "review_count": 117,
    "images": [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "The North Face",
    "name": "Resolve 2 Waterproof Rain Jacket Olive",
    "slug": "the-north-face-resolve-2-waterproof-rain-jacket-olive",
    "description": "Seam-sealed DryVent 2L shell with windproof fabric and mesh interior lining.",
    "price": 10990,
    "discount_price": 8990,
    "stock": 58,
    "sku": "FASH-THE-223",
    "featured": true,
    "rating": 4.5,
    "review_count": 130,
    "images": [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Columbia",
    "name": "Watertight II Packable Rain Jacket Blue",
    "slug": "columbia-watertight-ii-packable-rain-jacket-blue",
    "description": "Omni-Tech waterproof/breathable protection that packs down into its own hand pocket.",
    "price": 6999,
    "discount_price": 5499,
    "stock": 59,
    "sku": "FASH-COL-224",
    "featured": false,
    "rating": 4.6,
    "review_count": 143,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Columbia",
    "name": "Steens Mountain Full Zip 2.0 Fleece",
    "slug": "columbia-steens-mountain-full-zip-20-fleece",
    "description": "Classic 250g MTR filament fleece providing lightweight warmth for outdoor chilly mornings.",
    "price": 4499,
    "discount_price": 3499,
    "stock": 60,
    "sku": "FASH-COL-225",
    "featured": false,
    "rating": 4.7,
    "review_count": 156,
    "images": [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Schott NYC",
    "name": "Classic Leather Motorcycle Biker Jacket",
    "slug": "schott-nyc-classic-leather-motorcycle-biker-jacket",
    "description": "Heavyweight hand-cut cowhide leather with asymmetrical zipper and star stud lapels.",
    "price": 49990,
    "discount_price": 44990,
    "stock": 61,
    "sku": "FASH-SCH-226",
    "featured": false,
    "rating": 4.8,
    "review_count": 169,
    "images": [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Barbour",
    "name": "Bedale Waxed Cotton Tartan Jacket Sage",
    "slug": "barbour-bedale-waxed-cotton-tartan-jacket-sage",
    "description": "Traditional 6oz Thornproof waxed cotton with corduroy sit-down collar and tartan lining.",
    "price": 34990,
    "discount_price": 31490,
    "stock": 62,
    "sku": "FASH-BAR-227",
    "featured": false,
    "rating": 4.3,
    "review_count": 182,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Zara",
    "name": "Faux Suede Overshirt Bomber Camel",
    "slug": "zara-faux-suede-overshirt-bomber-camel",
    "description": "Velvety faux suede jacket with spread collar and metallic snap button front.",
    "price": 5590,
    "discount_price": 4490,
    "stock": 63,
    "sku": "FASH-ZAR-228",
    "featured": false,
    "rating": 4.4,
    "review_count": 195,
    "images": [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Massimo Dutti",
    "name": "Nappa Leather Bomber Jacket Dark Brown",
    "slug": "massimo-dutti-nappa-leather-bomber-jacket-dark-brown",
    "description": "100% sheepskin nappa leather with ribbed wool trims and interior satin lining.",
    "price": 27990,
    "discount_price": 24990,
    "stock": 64,
    "sku": "FASH-MAS-229",
    "featured": false,
    "rating": 4.5,
    "review_count": 208,
    "images": [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Levi's",
    "name": "Original Sherpa Trucker Jacket Faux Fur",
    "slug": "levis-original-sherpa-trucker-jacket-faux-fur",
    "description": "Timeless denim trucker lined with plush warm sherpa on collar and body.",
    "price": 8999,
    "discount_price": 7199,
    "stock": 65,
    "sku": "FASH-LEV-230",
    "featured": false,
    "rating": 4.6,
    "review_count": 221,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Uniqlo",
    "name": "Ultra Light Down Jacket Packable Black",
    "slug": "uniqlo-ultra-light-down-jacket-packable-black",
    "description": "750+ fill power down with water-repellent coating, folding into a pocket-sized pouch.",
    "price": 5990,
    "discount_price": 4990,
    "stock": 66,
    "sku": "FASH-UNI-231",
    "featured": false,
    "rating": 4.7,
    "review_count": 234,
    "images": [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Reformation",
    "name": "Kourtney Floral Silk Midi Dress Emerald",
    "slug": "reformation-kourtney-floral-silk-midi-dress-emerald",
    "description": "Fitted sweetheart bodice with high side slit and adjustable tie straps in pure silk.",
    "price": 24990,
    "discount_price": 21990,
    "stock": 67,
    "sku": "FASH-REF-232",
    "featured": false,
    "rating": 4.8,
    "review_count": 247,
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Reformation",
    "name": "Tagliatelle Linen Sundress White Flora",
    "slug": "reformation-tagliatelle-linen-sundress-white-flora",
    "description": "Square neckline with lace trim detailing and button-front skirt in sustainable linen.",
    "price": 21990,
    "discount_price": 18990,
    "stock": 68,
    "sku": "FASH-REF-233",
    "featured": false,
    "rating": 4.3,
    "review_count": 260,
    "images": [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Mango",
    "name": "Pleated Satin Halter Evening Maxi Dress",
    "slug": "mango-pleated-satin-halter-evening-maxi-dress",
    "description": "Lustrous pleated satin with elegant halter neck and flowing floor-length hemline.",
    "price": 8990,
    "discount_price": 6990,
    "stock": 69,
    "sku": "FASH-MAN-234",
    "featured": false,
    "rating": 4.4,
    "review_count": 273,
    "images": [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Mango",
    "name": "Belted Linen Blend Safari Jumpsuit Khaki",
    "slug": "mango-belted-linen-blend-safari-jumpsuit-khaki",
    "description": "Utility flap pockets with notched lapels and tortoise-shell buckle waist belt.",
    "price": 7990,
    "discount_price": 5990,
    "stock": 70,
    "sku": "FASH-MAN-235",
    "featured": false,
    "rating": 4.5,
    "review_count": 286,
    "images": [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Zara",
    "name": "Printed Tiered Ruffle Midi Dress Floral",
    "slug": "zara-printed-tiered-ruffle-midi-dress-floral",
    "description": "V-neck dress with voluminous long sleeves and tiered ruffled A-line silhouette.",
    "price": 4990,
    "discount_price": 3990,
    "stock": 71,
    "sku": "FASH-ZAR-236",
    "featured": false,
    "rating": 4.6,
    "review_count": 299,
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Zara",
    "name": "Draped Satin Asymmetrical Slip Dress Plum",
    "slug": "zara-draped-satin-asymmetrical-slip-dress-plum",
    "description": "Bias-cut liquid satin with cowl neckline and delicate criss-cross back straps.",
    "price": 4590,
    "discount_price": 3590,
    "stock": 72,
    "sku": "FASH-ZAR-237",
    "featured": true,
    "rating": 4.7,
    "review_count": 312,
    "images": [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "H&M",
    "name": "Ribbed Knit Bodycon Dress Oatmeal Melange",
    "slug": "hm-ribbed-knit-bodycon-dress-oatmeal-melange",
    "description": "Stretchy ribbed knit contouring the figure with round neck and side seam slit.",
    "price": 2999,
    "discount_price": 2299,
    "stock": 73,
    "sku": "FASH-HM-238",
    "featured": false,
    "rating": 4.8,
    "review_count": 325,
    "images": [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "H&M",
    "name": "Tie-Belt Linen Blend Shirt Dress Olive",
    "slug": "hm-tie-belt-linen-blend-shirt-dress-olive",
    "description": "Crisp woven linen blend with collar, chest patch pockets, and removable waist sash.",
    "price": 3499,
    "discount_price": 2799,
    "stock": 74,
    "sku": "FASH-HM-239",
    "featured": false,
    "rating": 4.3,
    "review_count": 338,
    "images": [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Everlane",
    "name": "The Grade-A Cashmere Crewneck Rose",
    "slug": "everlane-the-grade-a-cashmere-crewneck-rose",
    "description": "100% premium Grade-A cashmere from Inner Mongolia with ribbed hem and cuffs.",
    "price": 14990,
    "discount_price": 12490,
    "stock": 15,
    "sku": "FASH-EVE-240",
    "featured": false,
    "rating": 4.4,
    "review_count": 351,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Everlane",
    "name": "The Organic Cotton Box-Cut Tee Sage",
    "slug": "everlane-the-organic-cotton-box-cut-tee-sage",
    "description": "Casual boxy silhouette made from certified organic non-GMO soft cotton.",
    "price": 2990,
    "discount_price": null,
    "stock": 16,
    "sku": "FASH-EVE-241",
    "featured": false,
    "rating": 4.5,
    "review_count": 364,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "COS",
    "name": "Relaxed Mulberry Silk Blouse Cream",
    "slug": "cos-relaxed-mulberry-silk-blouse-cream",
    "description": "Pure mulberry silk with concealed placket and fluid dropped-shoulder tailoring.",
    "price": 11990,
    "discount_price": 9990,
    "stock": 17,
    "sku": "FASH-COS-242",
    "featured": false,
    "rating": 4.6,
    "review_count": 27,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "COS",
    "name": "Structured Knitted Cardigan Navy Blue",
    "slug": "cos-structured-knitted-cardigan-navy-blue",
    "description": "Milano-stitch dense organic cotton knit with clean tonal horn buttons.",
    "price": 9990,
    "discount_price": 8490,
    "stock": 18,
    "sku": "FASH-COS-243",
    "featured": false,
    "rating": 4.7,
    "review_count": 40,
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Nike",
    "name": "Air Jordan 1 Retro High OG Lost & Found",
    "slug": "nike-air-jordan-1-retro-high-og-lost-found",
    "description": "Classic 1985 silhouette with vintage cracked leather accents and iconic Wings branding.",
    "price": 16995,
    "discount_price": 15495,
    "stock": 19,
    "sku": "FASH-NIK-244",
    "featured": false,
    "rating": 4.8,
    "review_count": 53,
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Nike",
    "name": "Air Max 270 React Triple Black Sneakers",
    "slug": "nike-air-max-270-react-triple-black-sneakers",
    "description": "Large volume Max Air 270 unit in heel delivering plush all-day springy cushioning.",
    "price": 13995,
    "discount_price": 11995,
    "stock": 20,
    "sku": "FASH-NIK-245",
    "featured": false,
    "rating": 4.3,
    "review_count": 66,
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Nike",
    "name": "Dunk Low Retro White Black Panda Edition",
    "slug": "nike-dunk-low-retro-white-black-panda-edition",
    "description": "Crisp monochrome leather overlays with padded low-cut collar for timeless hardwood style.",
    "price": 8695,
    "discount_price": null,
    "stock": 21,
    "sku": "FASH-NIK-246",
    "featured": false,
    "rating": 4.4,
    "review_count": 79,
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Nike",
    "name": "Air Zoom Pegasus 41 Road Running Shoes",
    "slug": "nike-air-zoom-pegasus-41-road-running-shoes",
    "description": "Dual Air Zoom units with ReactX foam midsole for energized, responsive daily miles.",
    "price": 11895,
    "discount_price": 9995,
    "stock": 22,
    "sku": "FASH-NIK-247",
    "featured": false,
    "rating": 4.5,
    "review_count": 92,
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Adidas",
    "name": "Samba Classic Indoor Leather Shoes White",
    "slug": "adidas-samba-classic-indoor-leather-shoes-white",
    "description": "Full-grain leather upper with suede T-toe overlay and iconic gum rubber outsole.",
    "price": 10999,
    "discount_price": 9499,
    "stock": 23,
    "sku": "FASH-ADI-248",
    "featured": false,
    "rating": 4.6,
    "review_count": 105,
    "images": [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Adidas",
    "name": "Ultraboost Light Running Shoes Core Black",
    "slug": "adidas-ultraboost-light-running-shoes-core-black",
    "description": "Lightest Boost cushioning ever with Primeknit+ forged textile upper.",
    "price": 17999,
    "discount_price": 14999,
    "stock": 24,
    "sku": "FASH-ADI-249",
    "featured": false,
    "rating": 4.7,
    "review_count": 118,
    "images": [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Adidas",
    "name": "Stan Smith Classic Leather Shoes Green/White",
    "slug": "adidas-stan-smith-classic-leather-shoes-greenwhite",
    "description": "Minimalist tennis silhouette with perforated 3-Stripes and clean rubber cupsole.",
    "price": 8999,
    "discount_price": 7199,
    "stock": 25,
    "sku": "FASH-ADI-250",
    "featured": false,
    "rating": 4.8,
    "review_count": 131,
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Adidas",
    "name": "Gazelle Indoor Suede Sneakers Blue Bird",
    "slug": "adidas-gazelle-indoor-suede-sneakers-blue-bird",
    "description": "Supple pigskin suede upper with translucent gum sole and contrasting serrated stripes.",
    "price": 11999,
    "discount_price": 9999,
    "stock": 26,
    "sku": "FASH-ADI-251",
    "featured": true,
    "rating": 4.3,
    "review_count": 144,
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "New Balance",
    "name": "550 Heritage Basketball Lifestyle White/Navy",
    "slug": "new-balance-550-heritage-basketball-lifestyle-whitenavy",
    "description": "Streamlined homage to 1989 pro basketball sneakers with durable leather upper.",
    "price": 11999,
    "discount_price": 9999,
    "stock": 27,
    "sku": "FASH-NEW-252",
    "featured": false,
    "rating": 4.4,
    "review_count": 157,
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "New Balance",
    "name": "990v6 Made in USA Running Shoes Grey",
    "slug": "new-balance-990v6-made-in-usa-running-shoes-grey",
    "description": "FuelCell foam midsole with ENCAP cushioning and premium pigskin suede overlays.",
    "price": 23999,
    "discount_price": 21499,
    "stock": 28,
    "sku": "FASH-NEW-253",
    "featured": false,
    "rating": 4.5,
    "review_count": 170,
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Clarks",
    "name": "Originals Desert Boots Beeswax Brown Leather",
    "slug": "clarks-originals-desert-boots-beeswax-brown-leather",
    "description": "Nathan Clark's 1950 pioneering design with genuine natural crepe rubber sole.",
    "price": 12999,
    "discount_price": 10999,
    "stock": 29,
    "sku": "FASH-CLA-254",
    "featured": false,
    "rating": 4.6,
    "review_count": 183,
    "images": [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Clarks",
    "name": "Wallabee Moccasin Suede Shoes Maple",
    "slug": "clarks-wallabee-moccasin-suede-shoes-maple",
    "description": "Classic moccasin construction with clean lines and water-resistant suede upper.",
    "price": 13999,
    "discount_price": 11999,
    "stock": 30,
    "sku": "FASH-CLA-255",
    "featured": false,
    "rating": 4.7,
    "review_count": 196,
    "images": [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Timberland",
    "name": "6-Inch Premium Waterproof Boot Wheat Nubuck",
    "slug": "timberland-6-inch-premium-waterproof-boot-wheat-nubuck",
    "description": "Seam-sealed waterproof direct-attach construction with 400g PrimaLoft insulation.",
    "price": 16999,
    "discount_price": 14999,
    "stock": 31,
    "sku": "FASH-TIM-256",
    "featured": false,
    "rating": 4.8,
    "review_count": 209,
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Dr. Martens",
    "name": "1460 Smooth Leather 8-Eye Boot Cherry Red",
    "slug": "dr-martens-1460-smooth-leather-8-eye-boot-cherry-red",
    "description": "Air-cushioned bouncing sole with signature yellow welt stitching and grooved edges.",
    "price": 15999,
    "discount_price": 13999,
    "stock": 32,
    "sku": "FASH-DR--257",
    "featured": false,
    "rating": 4.3,
    "review_count": 222,
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Converse",
    "name": "Chuck 70 High Top Vintage Canvas Black",
    "slug": "converse-chuck-70-high-top-vintage-canvas-black",
    "description": "Upgraded heavy 12oz canvas with OrthoLite insole and glossy egret foxing tape.",
    "price": 5999,
    "discount_price": 4999,
    "stock": 33,
    "sku": "FASH-CON-258",
    "featured": false,
    "rating": 4.4,
    "review_count": 235,
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Vans",
    "name": "Old Skool Classic Skate Shoes Black/White",
    "slug": "vans-old-skool-classic-skate-shoes-blackwhite",
    "description": "Canvas and suede upper with iconic leather side stripe and signature waffle outsole.",
    "price": 4999,
    "discount_price": 3999,
    "stock": 34,
    "sku": "FASH-VAN-259",
    "featured": false,
    "rating": 4.5,
    "review_count": 248,
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Seiko",
    "name": "5 Sports Automatic Black Dial Watch SRPD55K1",
    "slug": "seiko-5-sports-automatic-black-dial-watch-srpd55k1",
    "description": "Calibre 4R36 automatic movement with day/date display and 100m water resistance.",
    "price": 24500,
    "discount_price": 21900,
    "stock": 35,
    "sku": "FASH-SEI-260",
    "featured": false,
    "rating": 4.6,
    "review_count": 261,
    "images": [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Seiko",
    "name": "Prospex Turtle Diver 200m Automatic SRPE93",
    "slug": "seiko-prospex-turtle-diver-200m-automatic-srpe93",
    "description": "ISO 6425 certified diver with cushion steel case, Lumibrite hands, and silicone strap.",
    "price": 39900,
    "discount_price": 35900,
    "stock": 36,
    "sku": "FASH-SEI-261",
    "featured": false,
    "rating": 4.7,
    "review_count": 274,
    "images": [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Tissot",
    "name": "PRX Powermatic 80 Blue Dial Steel 40mm",
    "slug": "tissot-prx-powermatic-80-blue-dial-steel-40mm",
    "description": "Integrated bracelet with waffle dial, Nivachron balance spring, and 80-hour power reserve.",
    "price": 62500,
    "discount_price": 57500,
    "stock": 37,
    "sku": "FASH-TIS-262",
    "featured": false,
    "rating": 4.8,
    "review_count": 287,
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Tissot",
    "name": "Gentleman Swiss Automatic Silver Dial",
    "slug": "tissot-gentleman-swiss-automatic-silver-dial",
    "description": "Silicon balance spring for magnetic resistance with sapphire crystal and exhibition caseback.",
    "price": 74500,
    "discount_price": 68500,
    "stock": 38,
    "sku": "FASH-TIS-263",
    "featured": false,
    "rating": 4.3,
    "review_count": 300,
    "images": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Casio",
    "name": "G-Shock GA-2100-1A1 All Black CasiOak",
    "slug": "casio-g-shock-ga-2100-1a1-all-black-casioak",
    "description": "Carbon Core Guard structure with minimalist octagonal bezel and 200m water resistance.",
    "price": 8995,
    "discount_price": 7695,
    "stock": 39,
    "sku": "FASH-CAS-264",
    "featured": false,
    "rating": 4.4,
    "review_count": 313,
    "images": [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Casio",
    "name": "Vintage Digital Stainless Steel A168WEM-1DF",
    "slug": "casio-vintage-digital-stainless-steel-a168wem-1df",
    "description": "ElectroLuminescence backlight with daily alarm, 1/100s stopwatch, and retro metal band.",
    "price": 3295,
    "discount_price": 2695,
    "stock": 40,
    "sku": "FASH-CAS-265",
    "featured": true,
    "rating": 4.5,
    "review_count": 326,
    "images": [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Citizen",
    "name": "Tsuyosa Automatic Yellow Dial NJ0150-81Z",
    "slug": "citizen-tsuyosa-automatic-yellow-dial-nj0150-81z",
    "description": "Integrated steel sports watch with striking sunray dial and magnified date cyclops.",
    "price": 29900,
    "discount_price": 26500,
    "stock": 41,
    "sku": "FASH-CIT-266",
    "featured": false,
    "rating": 4.6,
    "review_count": 339,
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Citizen",
    "name": "Eco-Drive Promaster Diver 200M BN0150-28E",
    "slug": "citizen-eco-drive-promaster-diver-200m-bn0150-28e",
    "description": "Powered by any light source never needing battery replacement with one-way rotating bezel.",
    "price": 27900,
    "discount_price": 24500,
    "stock": 42,
    "sku": "FASH-CIT-267",
    "featured": false,
    "rating": 4.7,
    "review_count": 352,
    "images": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Fossil",
    "name": "Grant Chronograph Light Brown Leather FS4813",
    "slug": "fossil-grant-chronograph-light-brown-leather-fs4813",
    "description": "Roman numeral hour markers with three subdials and supple vegetable-tanned leather strap.",
    "price": 12495,
    "discount_price": 9995,
    "stock": 43,
    "sku": "FASH-FOS-268",
    "featured": false,
    "rating": 4.8,
    "review_count": 365,
    "images": [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Timex",
    "name": "Marlon 1960s Hand-Wound Mechanical Black",
    "slug": "timex-marlon-1960s-hand-wound-mechanical-black",
    "description": "Mid-century dress watch with dome acrylic crystal and genuine leather strap.",
    "price": 17995,
    "discount_price": 15495,
    "stock": 44,
    "sku": "FASH-TIM-269",
    "featured": false,
    "rating": 4.3,
    "review_count": 28,
    "images": [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Bellroy",
    "name": "Hide & Seek RFID Slim Leather Wallet Black",
    "slug": "bellroy-hide-seek-rfid-slim-leather-wallet-black",
    "description": "Full-grain certified leather with hidden coin pouch and flat bill section.",
    "price": 7990,
    "discount_price": 6990,
    "stock": 45,
    "sku": "FASH-BEL-270",
    "featured": false,
    "rating": 4.4,
    "review_count": 41,
    "images": [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Bellroy",
    "name": "Classic Backpack Plus 24L Charcoal",
    "slug": "bellroy-classic-backpack-plus-24l-charcoal",
    "description": "Dedicated dual-compartment laptop work zone with contoured lumbar back support.",
    "price": 15990,
    "discount_price": 13990,
    "stock": 46,
    "sku": "FASH-BEL-271",
    "featured": false,
    "rating": 4.5,
    "review_count": 54,
    "images": [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Fossil",
    "name": "Derrick RFID Leather Bifold Wallet Brown",
    "slug": "fossil-derrick-rfid-leather-bifold-wallet-brown",
    "description": "Rich genuine leather with 8 card slots, flip ID window, and sliding bill compartments.",
    "price": 4495,
    "discount_price": 3595,
    "stock": 47,
    "sku": "FASH-FOS-272",
    "featured": false,
    "rating": 4.6,
    "review_count": 67,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Fossil",
    "name": "Rachel Leather Tote Bag Handbag Brown",
    "slug": "fossil-rachel-leather-tote-bag-handbag-brown",
    "description": "Spacious structured leather tote with dual top handles and exterior slip pockets.",
    "price": 17995,
    "discount_price": 14995,
    "stock": 48,
    "sku": "FASH-FOS-273",
    "featured": false,
    "rating": 4.7,
    "review_count": 80,
    "images": [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "American Tourister",
    "name": "Curio Spinner 75cm Hard Luggage Yellow",
    "slug": "american-tourister-curio-spinner-75cm-hard-luggage-yellow",
    "description": "Scratch-resistant polypropylene shell with 360-degree dual spinner wheels and TSA lock.",
    "price": 11500,
    "discount_price": 8990,
    "stock": 49,
    "sku": "FASH-AME-274",
    "featured": false,
    "rating": 4.8,
    "review_count": 93,
    "images": [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Samsonite",
    "name": "Proxis Hardside Large Suitcase Matte Petrol",
    "slug": "samsonite-proxis-hardside-large-suitcase-matte-petrol",
    "description": "Roxkin multi-layered material offering maximum bounce-back impact resilience.",
    "price": 34990,
    "discount_price": 29990,
    "stock": 50,
    "sku": "FASH-SAM-275",
    "featured": false,
    "rating": 4.3,
    "review_count": 106,
    "images": [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Ray-Ban",
    "name": "Original Wayfarer Classic Sunglasses RB2140",
    "slug": "ray-ban-original-wayfarer-classic-sunglasses-rb2140",
    "description": "Green G-15 crystal lenses with classic black acetate frame and 100% UV protection.",
    "price": 9990,
    "discount_price": 8490,
    "stock": 51,
    "sku": "FASH-RAY-276",
    "featured": false,
    "rating": 4.4,
    "review_count": 119,
    "images": [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Ray-Ban",
    "name": "Aviator Classic Gold Frame Green G-15 Lenses",
    "slug": "ray-ban-aviator-classic-gold-frame-green-g-15-lenses",
    "description": "First designed in 1937 for US aviators with lightweight gold metal frame.",
    "price": 10490,
    "discount_price": 8990,
    "stock": 52,
    "sku": "FASH-RAY-277",
    "featured": false,
    "rating": 4.5,
    "review_count": 132,
    "images": [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Ralph Lauren",
    "name": "Custom Slim Fit Oxford Shirt (Slim Fit)",
    "slug": "ralph-lauren-custom-slim-fit-oxford-shirt-slim-fit",
    "description": "Garment-dyed woven cotton with signature embroidered pony at chest. Custom tailored slim fit variation designed for contemporary everyday styling.",
    "price": 10589,
    "discount_price": 9318,
    "stock": 48,
    "sku": "FASH-RAL-278",
    "featured": true,
    "rating": 4.3,
    "review_count": 89,
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Ralph Lauren",
    "name": "Iconic Mesh Polo Shirt Navy (Relaxed Cut)",
    "slug": "ralph-lauren-iconic-mesh-polo-shirt-navy-relaxed-cut",
    "description": "Breathable cotton mesh with ribbed polo collar and tennis tail hem. Custom tailored relaxed cut variation designed for contemporary everyday styling.",
    "price": 8949,
    "discount_price": null,
    "stock": 50,
    "sku": "FASH-RAL-279",
    "featured": false,
    "rating": 4.4,
    "review_count": 111,
    "images": [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Tommy Hilfiger",
    "name": "Organic Cotton Oxford Button-Down (Premium Linen)",
    "slug": "tommy-hilfiger-organic-cotton-oxford-button-down-premium-linen",
    "description": "Crisp organic cotton button-up with understated flag embroidery on pocket. Custom tailored premium linen variation designed for contemporary everyday styling.",
    "price": 6489,
    "discount_price": 5710,
    "stock": 52,
    "sku": "FASH-TOM-280",
    "featured": false,
    "rating": 4.5,
    "review_count": 133,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Tommy Hilfiger",
    "name": "Classic Fit Essential Crewneck Tee (Vintage Wash)",
    "slug": "tommy-hilfiger-classic-fit-essential-crewneck-tee-vintage-wash",
    "description": "Pure combed jersey cotton with ribbed neckband and timeless regular fit. Custom tailored vintage wash variation designed for contemporary everyday styling.",
    "price": 3179,
    "discount_price": null,
    "stock": 54,
    "sku": "FASH-TOM-281",
    "featured": false,
    "rating": 4.6,
    "review_count": 155,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Levi's",
    "name": "Barstow Western Denim Shirt Rinse (Limited Colorway)",
    "slug": "levis-barstow-western-denim-shirt-rinse-limited-colorway",
    "description": "Heritage curved Western yoke, pearl snap closures, and dual chest flap pockets. Custom tailored limited colorway variation designed for contemporary everyday styling.",
    "price": 5039,
    "discount_price": 4434,
    "stock": 56,
    "sku": "FASH-LEV-282",
    "featured": true,
    "rating": 4.7,
    "review_count": 177,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Levi's",
    "name": "Housemark Classic Graphic Tee White (Signature Weave)",
    "slug": "levis-housemark-classic-graphic-tee-white-signature-weave",
    "description": "Soft 100% cotton crewneck featuring iconic Levi's batwing chest logo. Custom tailored signature weave variation designed for contemporary everyday styling.",
    "price": 1769,
    "discount_price": null,
    "stock": 58,
    "sku": "FASH-LEV-283",
    "featured": false,
    "rating": 4.8,
    "review_count": 199,
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "fashion",
    "brand": "Zara",
    "name": "Tailored French Linen Shirt White (Tailored Cut)",
    "slug": "zara-tailored-french-linen-shirt-white-tailored-cut",
    "description": "Breathable 100% European linen with spread collar and clean front placket. Custom tailored tailored cut variation designed for contemporary everyday styling.",
    "price": 4229,
    "discount_price": 3722,
    "stock": 60,
    "sku": "FASH-ZAR-284",
    "featured": false,
    "rating": 4.3,
    "review_count": 221,
    "images": [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Herman Miller",
    "name": "Aeron Ergonomic Office Chair Carbon",
    "slug": "herman-miller-aeron-ergonomic-office-chair-carbon",
    "description": "Pellicle 8Z mesh suspension with PostureFit SL adjustable sacral spinal support.",
    "price": 115000,
    "discount_price": 104900,
    "stock": 62,
    "sku": "HOME-HER-500",
    "featured": false,
    "rating": 4.6,
    "review_count": 339,
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Herman Miller",
    "name": "Embody Ergonomic Gaming Chair Cyan",
    "slug": "herman-miller-embody-ergonomic-gaming-chair-cyan",
    "description": "Pixelated matrix back support that automatically adjusts to subtle spine movements.",
    "price": 145000,
    "discount_price": 134900,
    "stock": 63,
    "sku": "HOME-HER-501",
    "featured": false,
    "rating": 4.7,
    "review_count": 358,
    "images": [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Steelcase",
    "name": "Gesture Ergonomic Executive Chair Black",
    "slug": "steelcase-gesture-ergonomic-executive-chair-black",
    "description": "360-degree rotating arms designed to support smart devices, laptops, and monitors.",
    "price": 98000,
    "discount_price": 89900,
    "stock": 64,
    "sku": "HOME-STE-502",
    "featured": false,
    "rating": 4.8,
    "review_count": 377,
    "images": [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Steelcase",
    "name": "Series 1 Compact Work Chair Licorice",
    "slug": "steelcase-series-1-compact-work-chair-licorice",
    "description": "Integrated LiveBack technology with intuitive weight-activated mechanism.",
    "price": 46000,
    "discount_price": 41900,
    "stock": 65,
    "sku": "HOME-STE-503",
    "featured": true,
    "rating": 4.3,
    "review_count": 396,
    "images": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Autonomous",
    "name": "SmartDesk Pro Motorized Standing Desk 53\"",
    "slug": "autonomous-smartdesk-pro-motorized-standing-desk-53",
    "description": "Dual-motor frame lifting up to 310 lbs smoothly with 4 programmable height presets.",
    "price": 54999,
    "discount_price": 48999,
    "stock": 66,
    "sku": "HOME-AUT-504",
    "featured": false,
    "rating": 4.4,
    "review_count": 415,
    "images": [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Autonomous",
    "name": "ErgoChair Pro Breathable Mesh High-Back",
    "slug": "autonomous-ergochair-pro-breathable-mesh-high-back",
    "description": "Adjustable headrest, lumbar cushion, and 22-degree recline with 5 lockable positions.",
    "price": 38999,
    "discount_price": 34999,
    "stock": 67,
    "sku": "HOME-AUT-505",
    "featured": false,
    "rating": 4.5,
    "review_count": 34,
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "West Elm",
    "name": "Mid-Century Acorn Solid Wood Coffee Table",
    "slug": "west-elm-mid-century-acorn-solid-wood-coffee-table",
    "description": "FSC-certified kiln-dried eucalyptus wood with pop-up hidden storage compartment.",
    "price": 39990,
    "discount_price": 34990,
    "stock": 68,
    "sku": "HOME-WES-506",
    "featured": false,
    "rating": 4.6,
    "review_count": 53,
    "images": [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "West Elm",
    "name": "Booker Velvet Swivel Accent Armchair Rust",
    "slug": "west-elm-booker-velvet-swivel-accent-armchair-rust",
    "description": "Curved tub silhouette wrapped in plush performance velvet on 360 brass swivel base.",
    "price": 52990,
    "discount_price": 46990,
    "stock": 69,
    "sku": "HOME-WES-507",
    "featured": false,
    "rating": 4.7,
    "review_count": 72,
    "images": [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "IKEA",
    "name": "Markus High-Back Mesh Desk Chair Dark Grey",
    "slug": "ikea-markus-high-back-mesh-desk-chair-dark-grey",
    "description": "Breathable mesh back with synchronized tilt lock and built-in lumbar support cushion.",
    "price": 14990,
    "discount_price": null,
    "stock": 70,
    "sku": "HOME-IKE-508",
    "featured": false,
    "rating": 4.8,
    "review_count": 91,
    "images": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "IKEA",
    "name": "Poang Armchair with Glose Dark Brown Leather",
    "slug": "ikea-poang-armchair-with-glose-dark-brown-leather",
    "description": "Bentwood layer-glued oak frame providing resilient, comfortable rocking motion.",
    "price": 17990,
    "discount_price": 15490,
    "stock": 71,
    "sku": "HOME-IKE-509",
    "featured": false,
    "rating": 4.3,
    "review_count": 110,
    "images": [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "IKEA",
    "name": "Bekant 160x80cm Office Desk Oak Veneer",
    "slug": "ikea-bekant-160x80cm-office-desk-oak-veneer",
    "description": "Stain-resistant oak veneer tabletop with under-desk mesh cable organizer net.",
    "price": 18990,
    "discount_price": 16490,
    "stock": 72,
    "sku": "HOME-IKE-510",
    "featured": false,
    "rating": 4.4,
    "review_count": 129,
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "IKEA",
    "name": "Kallax 4x4 Cube Shelving Unit White",
    "slug": "ikea-kallax-4x4-cube-shelving-unit-white",
    "description": "Iconic versatile cube organizer compatible with baskets, drawers, and display inserts.",
    "price": 11990,
    "discount_price": 9990,
    "stock": 73,
    "sku": "HOME-IKE-511",
    "featured": false,
    "rating": 4.5,
    "review_count": 148,
    "images": [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Breville",
    "name": "Barista Touch Espresso Machine Stainless",
    "slug": "breville-barista-touch-espresso-machine-stainless",
    "description": "Automated touchscreen menu with ThermoJet 3-second heating and microfoam steam wand.",
    "price": 94990,
    "discount_price": 86990,
    "stock": 74,
    "sku": "HOME-BRE-512",
    "featured": false,
    "rating": 4.6,
    "review_count": 167,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Breville",
    "name": "Smart Oven Air Fryer Pro 1 Cu. Ft.",
    "slug": "breville-smart-oven-air-fryer-pro-1-cu-ft",
    "description": "Element iQ heating system with 13 cooking functions including dehydration and roasting.",
    "price": 39990,
    "discount_price": 34990,
    "stock": 75,
    "sku": "HOME-BRE-513",
    "featured": false,
    "rating": 4.7,
    "review_count": 186,
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "De'Longhi",
    "name": "Magnifica S Automatic Bean-to-Cup Coffee",
    "slug": "delonghi-magnifica-s-automatic-bean-to-cup-coffee",
    "description": "Built-in conical burr grinder with 13 grind settings and manual Cappuccino milk frother.",
    "price": 49990,
    "discount_price": 44990,
    "stock": 76,
    "sku": "HOME-DEL-514",
    "featured": false,
    "rating": 4.8,
    "review_count": 205,
    "images": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "De'Longhi",
    "name": "Dedica Deluxe Slim Espresso Machine Red",
    "slug": "delonghi-dedica-deluxe-slim-espresso-machine-red",
    "description": "Ultra-slim 6-inch width with 15-bar professional pressure and 3-in-1 filter holder.",
    "price": 21990,
    "discount_price": 18990,
    "stock": 77,
    "sku": "HOME-DEL-515",
    "featured": true,
    "rating": 4.3,
    "review_count": 224,
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "KitchenAid",
    "name": "Artisan 4.8L Stand Mixer Empire Red",
    "slug": "kitchenaid-artisan-48l-stand-mixer-empire-red",
    "description": "Planetary 59-point mixing action with stainless steel bowl, dough hook, and wire whip.",
    "price": 59990,
    "discount_price": 52990,
    "stock": 78,
    "sku": "HOME-KIT-516",
    "featured": false,
    "rating": 4.4,
    "review_count": 243,
    "images": [
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "KitchenAid",
    "name": "Cordless 7-Speed Hand Mixer Matte Black",
    "slug": "kitchenaid-cordless-7-speed-hand-mixer-matte-black",
    "description": "Rechargeable lithium-ion battery blending up to 200 cookies on a single charge.",
    "price": 11990,
    "discount_price": 9990,
    "stock": 79,
    "sku": "HOME-KIT-517",
    "featured": false,
    "rating": 4.5,
    "review_count": 262,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Le Creuset",
    "name": "Signature Enameled Cast Iron Dutch Oven 5.5L",
    "slug": "le-creuset-signature-enameled-cast-iron-dutch-oven-55l",
    "description": "Vibrant enameled cast iron distributing heat evenly for braises, stews, and sourdough.",
    "price": 34990,
    "discount_price": 31490,
    "stock": 80,
    "sku": "HOME-LE--518",
    "featured": false,
    "rating": 4.6,
    "review_count": 281,
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Le Creuset",
    "name": "Stoneware 3-Piece Rectangular Baking Dish Set",
    "slug": "le-creuset-stoneware-3-piece-rectangular-baking-dish-set",
    "description": "Durable non-porous ceramic stoneware resistant to chips, scratches, and thermal shock.",
    "price": 14990,
    "discount_price": 12490,
    "stock": 81,
    "sku": "HOME-LE--519",
    "featured": false,
    "rating": 4.7,
    "review_count": 300,
    "images": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Lodge",
    "name": "Pre-Seasoned Cast Iron Skillet 10.25 Inch",
    "slug": "lodge-pre-seasoned-cast-iron-skillet-1025-inch",
    "description": "Foundry-seasoned with 100% natural vegetable oil for natural easy-release nonstick finish.",
    "price": 3499,
    "discount_price": 2899,
    "stock": 82,
    "sku": "HOME-LOD-520",
    "featured": false,
    "rating": 4.8,
    "review_count": 319,
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Lodge",
    "name": "Reversible Cast Iron Grill and Griddle Pan",
    "slug": "lodge-reversible-cast-iron-grill-and-griddle-pan",
    "description": "Smooth griddle side for pancakes and ridged grill side for searing steaks on two burners.",
    "price": 5499,
    "discount_price": 4499,
    "stock": 83,
    "sku": "HOME-LOD-521",
    "featured": false,
    "rating": 4.3,
    "review_count": 338,
    "images": [
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Vitamix",
    "name": "E310 Explorian Professional Grade Blender",
    "slug": "vitamix-e310-explorian-professional-grade-blender",
    "description": "2.0 HP aircraft-grade stainless steel blades pulverizing whole foods and frozen fruit.",
    "price": 39990,
    "discount_price": 34990,
    "stock": 84,
    "sku": "HOME-VIT-522",
    "featured": false,
    "rating": 4.4,
    "review_count": 357,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Instant Pot",
    "name": "Duo Plus 9-in-1 Electric Pressure Cooker 6L",
    "slug": "instant-pot-duo-plus-9-in-1-electric-pressure-cooker-6l",
    "description": "Replaces pressure cooker, slow cooker, rice cooker, yogurt maker, steamer, and warmer.",
    "price": 10999,
    "discount_price": 8999,
    "stock": 85,
    "sku": "HOME-INS-523",
    "featured": false,
    "rating": 4.5,
    "review_count": 376,
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Philips",
    "name": "Airfryer XXL with Twin TurboStar Technology",
    "slug": "philips-airfryer-xxl-with-twin-turbostar-technology",
    "description": "Fat removal technology extracts and captures excess fat with no preheating required.",
    "price": 18999,
    "discount_price": 15499,
    "stock": 86,
    "sku": "HOME-PHI-524",
    "featured": false,
    "rating": 4.6,
    "review_count": 395,
    "images": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Wusthof",
    "name": "Classic 8-Inch Forged High-Carbon Chef Knife",
    "slug": "wusthof-classic-8-inch-forged-high-carbon-chef-knife",
    "description": "Precision forged from a single blank of German high-carbon stainless steel at 58 HRC.",
    "price": 16500,
    "discount_price": 14200,
    "stock": 12,
    "sku": "HOME-WUS-525",
    "featured": false,
    "rating": 4.7,
    "review_count": 414,
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Wusthof",
    "name": "Classic Ikon 7-Piece Knife Block Set Ash",
    "slug": "wusthof-classic-ikon-7-piece-knife-block-set-ash",
    "description": "Double-bolster design offering ideal balance with paring, bread, santoku, and sharpening steel.",
    "price": 64990,
    "discount_price": 58990,
    "stock": 13,
    "sku": "HOME-WUS-526",
    "featured": false,
    "rating": 4.8,
    "review_count": 33,
    "images": [
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Victorinox",
    "name": "Fibrox Pro 8-Inch Extra Broad Chef's Knife",
    "slug": "victorinox-fibrox-pro-8-inch-extra-broad-chefs-knife",
    "description": "Ergonomic non-slip TPE handle chosen by commercial culinary chefs worldwide.",
    "price": 4490,
    "discount_price": 3690,
    "stock": 14,
    "sku": "HOME-VIC-527",
    "featured": true,
    "rating": 4.3,
    "review_count": 52,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Zwilling",
    "name": "Four Star 8-Inch Chef Knife Made in Germany",
    "slug": "zwilling-four-star-8-inch-chef-knife-made-in-germany",
    "description": "SIGMAFORGE one-piece precision forging with FRIODUR ice-hardened blade.",
    "price": 11990,
    "discount_price": 9990,
    "stock": 15,
    "sku": "HOME-ZWI-528",
    "featured": false,
    "rating": 4.4,
    "review_count": 71,
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "All-Clad",
    "name": "D3 3-Ply Stainless Steel 10-Piece Cookware Set",
    "slug": "all-clad-d3-3-ply-stainless-steel-10-piece-cookware-set",
    "description": "Tri-ply bonded construction with responsive aluminum core between heavy stainless layers.",
    "price": 79990,
    "discount_price": 72990,
    "stock": 16,
    "sku": "HOME-ALL-529",
    "featured": false,
    "rating": 4.5,
    "review_count": 90,
    "images": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Dyson",
    "name": "Purifier Hot+Cool Formaldehyde HP09 Air Purifier",
    "slug": "dyson-purifier-hotcool-formaldehyde-hp09-air-purifier",
    "description": "HEPA H13 filtration capturing 99.95% of particles with catalytic formaldehyde destruction.",
    "price": 68900,
    "discount_price": 61900,
    "stock": 17,
    "sku": "HOME-DYS-530",
    "featured": false,
    "rating": 4.6,
    "review_count": 109,
    "images": [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Dyson",
    "name": "V15 Detect Extra Cordless Vacuum Cleaner",
    "slug": "dyson-v15-detect-extra-cordless-vacuum-cleaner",
    "description": "Laser reveals invisible microscopic dust with piezo sensor counting particles in real time.",
    "price": 64900,
    "discount_price": 57900,
    "stock": 18,
    "sku": "HOME-DYS-531",
    "featured": false,
    "rating": 4.7,
    "review_count": 128,
    "images": [
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Coway",
    "name": "Airmega 200M HEPA Air Purifier White",
    "slug": "coway-airmega-200m-hepa-air-purifier-white",
    "description": "Green True HEPA 4-stage filtration with real-time particle air quality ring light.",
    "price": 17990,
    "discount_price": 14490,
    "stock": 19,
    "sku": "HOME-COW-532",
    "featured": false,
    "rating": 4.8,
    "review_count": 147,
    "images": [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Xiaomi",
    "name": "Smart Air Purifier 4 Pro High CADR Filter",
    "slug": "xiaomi-smart-air-purifier-4-pro-high-cadr-filter",
    "description": "High-efficiency 500m3/h CADR purifying up to 60 sq.m rooms with voice assistant support.",
    "price": 14999,
    "discount_price": 12999,
    "stock": 20,
    "sku": "HOME-XIA-533",
    "featured": false,
    "rating": 4.3,
    "review_count": 166,
    "images": [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Roborock",
    "name": "S8 Pro Ultra Robot Vacuum and Sonic Mop",
    "slug": "roborock-s8-pro-ultra-robot-vacuum-and-sonic-mop",
    "description": "All-in-one RockDock washing, drying, emptying, refilling, with 6000Pa extreme suction.",
    "price": 119999,
    "discount_price": 104999,
    "stock": 21,
    "sku": "HOME-ROB-534",
    "featured": false,
    "rating": 4.4,
    "review_count": 185,
    "images": [
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Philips Hue",
    "name": "White & Color Ambiance Starter Kit E27",
    "slug": "philips-hue-white-color-ambiance-starter-kit-e27",
    "description": "3 smart bulbs with Hue Bridge, offering 16 million colors synchronized with movies and music.",
    "price": 14999,
    "discount_price": 12499,
    "stock": 22,
    "sku": "HOME-PHI-535",
    "featured": false,
    "rating": 4.5,
    "review_count": 204,
    "images": [
      "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Philips Hue",
    "name": "Play Light Bar 2-Pack Base Extension Set",
    "slug": "philips-hue-play-light-bar-2-pack-base-extension-set",
    "description": "Compact versatile light bars for mounting behind monitors or ambient TV backlighting.",
    "price": 13999,
    "discount_price": 11499,
    "stock": 23,
    "sku": "HOME-PHI-536",
    "featured": false,
    "rating": 4.6,
    "review_count": 223,
    "images": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "BenQ",
    "name": "ScreenBar Plus Auto-Dimming LED Monitor Light",
    "slug": "benq-screenbar-plus-auto-dimming-led-monitor-light",
    "description": "Patented asymmetric optical design illuminating desk space with zero screen glare.",
    "price": 13990,
    "discount_price": 11990,
    "stock": 24,
    "sku": "HOME-BEN-537",
    "featured": false,
    "rating": 4.7,
    "review_count": 242,
    "images": [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Diptyque",
    "name": "Baies Scented Luxury Candle 190g Glass",
    "slug": "diptyque-baies-scented-luxury-candle-190g-glass",
    "description": "Signature Parisian bouquet of freshly picked blackcurrant berries and wild rose petals.",
    "price": 6990,
    "discount_price": null,
    "stock": 25,
    "sku": "HOME-DIP-538",
    "featured": false,
    "rating": 4.8,
    "review_count": 261,
    "images": [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Diptyque",
    "name": "Figuier Scented Home Candle 190g",
    "slug": "diptyque-figuier-scented-home-candle-190g",
    "description": "Warm woody fragrance evoking sun-warmed fig bark, green leaves, and milky sap.",
    "price": 6990,
    "discount_price": null,
    "stock": 26,
    "sku": "HOME-DIP-539",
    "featured": true,
    "rating": 4.3,
    "review_count": 280,
    "images": [
      "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Brooklinen",
    "name": "Luxe Sateen 4-Piece Sheet Set Queen White",
    "slug": "brooklinen-luxe-sateen-4-piece-sheet-set-queen-white",
    "description": "480 thread count long-staple cotton offering an ultra-soft, luminous buttery sheen.",
    "price": 16990,
    "discount_price": 14490,
    "stock": 27,
    "sku": "HOME-BRO-540",
    "featured": false,
    "rating": 4.4,
    "review_count": 299,
    "images": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Casper",
    "name": "Original Foam Supportive Pillow Standard",
    "slug": "casper-original-foam-supportive-pillow-standard",
    "description": "Innovative pillow-in-a-pillow design providing balanced supportive fluff for neck alignment.",
    "price": 6490,
    "discount_price": 5490,
    "stock": 28,
    "sku": "HOME-CAS-541",
    "featured": false,
    "rating": 4.5,
    "review_count": 318,
    "images": [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Herman Miller",
    "name": "Aeron Ergonomic Office Chair Carbon (Pro Edition)",
    "slug": "herman-miller-aeron-ergonomic-office-chair-carbon-pro-edition",
    "description": "Pellicle 8Z mesh suspension with PostureFit SL adjustable sacral spinal support. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 115000,
    "discount_price": 101200,
    "stock": 72,
    "sku": "HOME-HER-542",
    "featured": false,
    "rating": 4.6,
    "review_count": 38,
    "images": [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Herman Miller",
    "name": "Embody Ergonomic Gaming Chair Cyan (Plus)",
    "slug": "herman-miller-embody-ergonomic-gaming-chair-cyan-plus",
    "description": "Pixelated matrix back support that automatically adjusts to subtle spine movements. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 156600,
    "discount_price": null,
    "stock": 74,
    "sku": "HOME-HER-543",
    "featured": false,
    "rating": 4.8,
    "review_count": 60,
    "images": [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Steelcase",
    "name": "Gesture Ergonomic Executive Chair Black (Special Edition)",
    "slug": "steelcase-gesture-ergonomic-executive-chair-black-special-edition",
    "description": "360-degree rotating arms designed to support smart devices, laptops, and monitors. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 113680,
    "discount_price": 100038,
    "stock": 76,
    "sku": "HOME-STE-544",
    "featured": false,
    "rating": 4.3,
    "review_count": 82,
    "images": [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Steelcase",
    "name": "Series 1 Compact Work Chair Licorice (Series II)",
    "slug": "steelcase-series-1-compact-work-chair-licorice-series-ii",
    "description": "Integrated LiveBack technology with intuitive weight-activated mechanism. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 57040,
    "discount_price": null,
    "stock": 78,
    "sku": "HOME-STE-545",
    "featured": false,
    "rating": 4.5,
    "review_count": 104,
    "images": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Autonomous",
    "name": "SmartDesk Pro Motorized Standing Desk 53\" (Carbon Black)",
    "slug": "autonomous-smartdesk-pro-motorized-standing-desk-53-carbon-black",
    "description": "Dual-motor frame lifting up to 310 lbs smoothly with 4 programmable height presets. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 72599,
    "discount_price": 63887,
    "stock": 80,
    "sku": "HOME-AUT-546",
    "featured": false,
    "rating": 4.7,
    "review_count": 126,
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Autonomous",
    "name": "ErgoChair Pro Breathable Mesh High-Back (Minimalist Edition)",
    "slug": "autonomous-ergochair-pro-breathable-mesh-high-back-minimalist-edition",
    "description": "Adjustable headrest, lumbar cushion, and 22-degree recline with 5 lockable positions. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 38999,
    "discount_price": null,
    "stock": 82,
    "sku": "HOME-AUT-547",
    "featured": false,
    "rating": 4.2,
    "review_count": 148,
    "images": [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "West Elm",
    "name": "Mid-Century Acorn Solid Wood Coffee Table (Midnight Blue)",
    "slug": "west-elm-mid-century-acorn-solid-wood-coffee-table-midnight-blue",
    "description": "FSC-certified kiln-dried eucalyptus wood with pop-up hidden storage compartment. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 43189,
    "discount_price": 38006,
    "stock": 84,
    "sku": "HOME-WES-548",
    "featured": true,
    "rating": 4.4,
    "review_count": 170,
    "images": [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "West Elm",
    "name": "Booker Velvet Swivel Accent Armchair Rust (Signature Series)",
    "slug": "west-elm-booker-velvet-swivel-accent-armchair-rust-signature-series",
    "description": "Curved tub silhouette wrapped in plush performance velvet on 360 brass swivel base. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 61468,
    "discount_price": null,
    "stock": 86,
    "sku": "HOME-WES-549",
    "featured": false,
    "rating": 4.6,
    "review_count": 192,
    "images": [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "IKEA",
    "name": "Markus High-Back Mesh Desk Chair Dark Grey (Classic Edition)",
    "slug": "ikea-markus-high-back-mesh-desk-chair-dark-grey-classic-edition",
    "description": "Breathable mesh back with synchronized tilt lock and built-in lumbar support cushion. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 18588,
    "discount_price": 16357,
    "stock": 88,
    "sku": "HOME-IKE-550",
    "featured": false,
    "rating": 4.8,
    "review_count": 214,
    "images": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "IKEA",
    "name": "Poang Armchair with Glose Dark Brown Leather (Studio Model)",
    "slug": "ikea-poang-armchair-with-glose-dark-brown-leather-studio-model",
    "description": "Bentwood layer-glued oak frame providing resilient, comfortable rocking motion. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 23747,
    "discount_price": null,
    "stock": 10,
    "sku": "HOME-IKE-551",
    "featured": false,
    "rating": 4.3,
    "review_count": 236,
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "IKEA",
    "name": "Bekant 160x80cm Office Desk Oak Veneer (Pro Edition)",
    "slug": "ikea-bekant-160x80cm-office-desk-oak-veneer-pro-edition",
    "description": "Stain-resistant oak veneer tabletop with under-desk mesh cable organizer net. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 18990,
    "discount_price": 16711,
    "stock": 12,
    "sku": "HOME-IKE-552",
    "featured": false,
    "rating": 4.5,
    "review_count": 258,
    "images": [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "IKEA",
    "name": "Kallax 4x4 Cube Shelving Unit White (Plus)",
    "slug": "ikea-kallax-4x4-cube-shelving-unit-white-plus",
    "description": "Iconic versatile cube organizer compatible with baskets, drawers, and display inserts. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 12949,
    "discount_price": null,
    "stock": 14,
    "sku": "HOME-IKE-553",
    "featured": false,
    "rating": 4.7,
    "review_count": 280,
    "images": [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Breville",
    "name": "Barista Touch Espresso Machine Stainless (Special Edition)",
    "slug": "breville-barista-touch-espresso-machine-stainless-special-edition",
    "description": "Automated touchscreen menu with ThermoJet 3-second heating and microfoam steam wand. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 110188,
    "discount_price": 96965,
    "stock": 16,
    "sku": "HOME-BRE-554",
    "featured": false,
    "rating": 4.2,
    "review_count": 302,
    "images": [
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Breville",
    "name": "Smart Oven Air Fryer Pro 1 Cu. Ft. (Series II)",
    "slug": "breville-smart-oven-air-fryer-pro-1-cu-ft-series-ii",
    "description": "Element iQ heating system with 13 cooking functions including dehydration and roasting. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 49588,
    "discount_price": null,
    "stock": 18,
    "sku": "HOME-BRE-555",
    "featured": false,
    "rating": 4.4,
    "review_count": 324,
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "De'Longhi",
    "name": "Magnifica S Automatic Bean-to-Cup Coffee (Carbon Black)",
    "slug": "delonghi-magnifica-s-automatic-bean-to-cup-coffee-carbon-black",
    "description": "Built-in conical burr grinder with 13 grind settings and manual Cappuccino milk frother. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 65987,
    "discount_price": 58069,
    "stock": 20,
    "sku": "HOME-DEL-556",
    "featured": false,
    "rating": 4.6,
    "review_count": 346,
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "De'Longhi",
    "name": "Dedica Deluxe Slim Espresso Machine Red (Minimalist Edition)",
    "slug": "delonghi-dedica-deluxe-slim-espresso-machine-red-minimalist-edition",
    "description": "Ultra-slim 6-inch width with 15-bar professional pressure and 3-in-1 filter holder. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 21990,
    "discount_price": null,
    "stock": 22,
    "sku": "HOME-DEL-557",
    "featured": false,
    "rating": 4.8,
    "review_count": 18,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "KitchenAid",
    "name": "Artisan 4.8L Stand Mixer Empire Red (Midnight Blue)",
    "slug": "kitchenaid-artisan-48l-stand-mixer-empire-red-midnight-blue",
    "description": "Planetary 59-point mixing action with stainless steel bowl, dough hook, and wire whip. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 64789,
    "discount_price": 57014,
    "stock": 24,
    "sku": "HOME-KIT-558",
    "featured": false,
    "rating": 4.3,
    "review_count": 40,
    "images": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "KitchenAid",
    "name": "Cordless 7-Speed Hand Mixer Matte Black (Signature Series)",
    "slug": "kitchenaid-cordless-7-speed-hand-mixer-matte-black-signature-series",
    "description": "Rechargeable lithium-ion battery blending up to 200 cookies on a single charge. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 13908,
    "discount_price": null,
    "stock": 26,
    "sku": "HOME-KIT-559",
    "featured": false,
    "rating": 4.5,
    "review_count": 62,
    "images": [
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Le Creuset",
    "name": "Signature Enameled Cast Iron Dutch Oven 5.5L (Classic Edition)",
    "slug": "le-creuset-signature-enameled-cast-iron-dutch-oven-55l-classic-edition",
    "description": "Vibrant enameled cast iron distributing heat evenly for braises, stews, and sourdough. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 43388,
    "discount_price": 38181,
    "stock": 28,
    "sku": "HOME-LE--560",
    "featured": false,
    "rating": 4.7,
    "review_count": 84,
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Le Creuset",
    "name": "Stoneware 3-Piece Rectangular Baking Dish Set (Studio Model)",
    "slug": "le-creuset-stoneware-3-piece-rectangular-baking-dish-set-studio-model",
    "description": "Durable non-porous ceramic stoneware resistant to chips, scratches, and thermal shock. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 19787,
    "discount_price": null,
    "stock": 30,
    "sku": "HOME-LE--561",
    "featured": false,
    "rating": 4.2,
    "review_count": 106,
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Lodge",
    "name": "Pre-Seasoned Cast Iron Skillet 10.25 Inch (Pro Edition)",
    "slug": "lodge-pre-seasoned-cast-iron-skillet-1025-inch-pro-edition",
    "description": "Foundry-seasoned with 100% natural vegetable oil for natural easy-release nonstick finish. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 3499,
    "discount_price": 3079,
    "stock": 32,
    "sku": "HOME-LOD-562",
    "featured": false,
    "rating": 4.4,
    "review_count": 128,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Lodge",
    "name": "Reversible Cast Iron Grill and Griddle Pan (Plus)",
    "slug": "lodge-reversible-cast-iron-grill-and-griddle-pan-plus",
    "description": "Smooth griddle side for pancakes and ridged grill side for searing steaks on two burners. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 5939,
    "discount_price": null,
    "stock": 34,
    "sku": "HOME-LOD-563",
    "featured": true,
    "rating": 4.6,
    "review_count": 150,
    "images": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Vitamix",
    "name": "E310 Explorian Professional Grade Blender (Special Edition)",
    "slug": "vitamix-e310-explorian-professional-grade-blender-special-edition",
    "description": "2.0 HP aircraft-grade stainless steel blades pulverizing whole foods and frozen fruit. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 46388,
    "discount_price": 40821,
    "stock": 36,
    "sku": "HOME-VIT-564",
    "featured": false,
    "rating": 4.8,
    "review_count": 172,
    "images": [
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Instant Pot",
    "name": "Duo Plus 9-in-1 Electric Pressure Cooker 6L (Series II)",
    "slug": "instant-pot-duo-plus-9-in-1-electric-pressure-cooker-6l-series-ii",
    "description": "Replaces pressure cooker, slow cooker, rice cooker, yogurt maker, steamer, and warmer. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 13639,
    "discount_price": null,
    "stock": 38,
    "sku": "HOME-INS-565",
    "featured": false,
    "rating": 4.3,
    "review_count": 194,
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Philips",
    "name": "Airfryer XXL with Twin TurboStar Technology (Carbon Black)",
    "slug": "philips-airfryer-xxl-with-twin-turbostar-technology-carbon-black",
    "description": "Fat removal technology extracts and captures excess fat with no preheating required. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 25079,
    "discount_price": 22070,
    "stock": 40,
    "sku": "HOME-PHI-566",
    "featured": false,
    "rating": 4.5,
    "review_count": 216,
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Wusthof",
    "name": "Classic 8-Inch Forged High-Carbon Chef Knife (Minimalist Edition)",
    "slug": "wusthof-classic-8-inch-forged-high-carbon-chef-knife-minimalist-edition",
    "description": "Precision forged from a single blank of German high-carbon stainless steel at 58 HRC. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 16500,
    "discount_price": null,
    "stock": 42,
    "sku": "HOME-WUS-567",
    "featured": false,
    "rating": 4.7,
    "review_count": 238,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Wusthof",
    "name": "Classic Ikon 7-Piece Knife Block Set Ash (Midnight Blue)",
    "slug": "wusthof-classic-ikon-7-piece-knife-block-set-ash-midnight-blue",
    "description": "Double-bolster design offering ideal balance with paring, bread, santoku, and sharpening steel. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 70189,
    "discount_price": 61766,
    "stock": 44,
    "sku": "HOME-WUS-568",
    "featured": false,
    "rating": 4.2,
    "review_count": 260,
    "images": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Victorinox",
    "name": "Fibrox Pro 8-Inch Extra Broad Chef's Knife (Signature Series)",
    "slug": "victorinox-fibrox-pro-8-inch-extra-broad-chefs-knife-signature-series",
    "description": "Ergonomic non-slip TPE handle chosen by commercial culinary chefs worldwide. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 5208,
    "discount_price": null,
    "stock": 46,
    "sku": "HOME-VIC-569",
    "featured": false,
    "rating": 4.4,
    "review_count": 282,
    "images": [
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Zwilling",
    "name": "Four Star 8-Inch Chef Knife Made in Germany (Classic Edition)",
    "slug": "zwilling-four-star-8-inch-chef-knife-made-in-germany-classic-edition",
    "description": "SIGMAFORGE one-piece precision forging with FRIODUR ice-hardened blade. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 14868,
    "discount_price": 13084,
    "stock": 48,
    "sku": "HOME-ZWI-570",
    "featured": false,
    "rating": 4.6,
    "review_count": 304,
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "All-Clad",
    "name": "D3 3-Ply Stainless Steel 10-Piece Cookware Set (Studio Model)",
    "slug": "all-clad-d3-3-ply-stainless-steel-10-piece-cookware-set-studio-model",
    "description": "Tri-ply bonded construction with responsive aluminum core between heavy stainless layers. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 105587,
    "discount_price": null,
    "stock": 50,
    "sku": "HOME-ALL-571",
    "featured": false,
    "rating": 4.8,
    "review_count": 326,
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Dyson",
    "name": "Purifier Hot+Cool Formaldehyde HP09 Air Purifier (Pro Edition)",
    "slug": "dyson-purifier-hotcool-formaldehyde-hp09-air-purifier-pro-edition",
    "description": "HEPA H13 filtration capturing 99.95% of particles with catalytic formaldehyde destruction. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 68900,
    "discount_price": 60632,
    "stock": 52,
    "sku": "HOME-DYS-572",
    "featured": false,
    "rating": 4.3,
    "review_count": 348,
    "images": [
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Dyson",
    "name": "V15 Detect Extra Cordless Vacuum Cleaner (Plus)",
    "slug": "dyson-v15-detect-extra-cordless-vacuum-cleaner-plus",
    "description": "Laser reveals invisible microscopic dust with piezo sensor counting particles in real time. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 70092,
    "discount_price": null,
    "stock": 54,
    "sku": "HOME-DYS-573",
    "featured": false,
    "rating": 4.5,
    "review_count": 20,
    "images": [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Coway",
    "name": "Airmega 200M HEPA Air Purifier White (Special Edition)",
    "slug": "coway-airmega-200m-hepa-air-purifier-white-special-edition",
    "description": "Green True HEPA 4-stage filtration with real-time particle air quality ring light. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 20868,
    "discount_price": 18364,
    "stock": 56,
    "sku": "HOME-COW-574",
    "featured": false,
    "rating": 4.7,
    "review_count": 42,
    "images": [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Xiaomi",
    "name": "Smart Air Purifier 4 Pro High CADR Filter (Series II)",
    "slug": "xiaomi-smart-air-purifier-4-pro-high-cadr-filter-series-ii",
    "description": "High-efficiency 500m3/h CADR purifying up to 60 sq.m rooms with voice assistant support. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 18599,
    "discount_price": null,
    "stock": 58,
    "sku": "HOME-XIA-575",
    "featured": false,
    "rating": 4.2,
    "review_count": 64,
    "images": [
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Roborock",
    "name": "S8 Pro Ultra Robot Vacuum and Sonic Mop (Carbon Black)",
    "slug": "roborock-s8-pro-ultra-robot-vacuum-and-sonic-mop-carbon-black",
    "description": "All-in-one RockDock washing, drying, emptying, refilling, with 6000Pa extreme suction. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 158399,
    "discount_price": 139391,
    "stock": 60,
    "sku": "HOME-ROB-576",
    "featured": false,
    "rating": 4.4,
    "review_count": 86,
    "images": [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Philips Hue",
    "name": "White & Color Ambiance Starter Kit E27 (Minimalist Edition)",
    "slug": "philips-hue-white-color-ambiance-starter-kit-e27-minimalist-edition",
    "description": "3 smart bulbs with Hue Bridge, offering 16 million colors synchronized with movies and music. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 14999,
    "discount_price": null,
    "stock": 62,
    "sku": "HOME-PHI-577",
    "featured": false,
    "rating": 4.6,
    "review_count": 108,
    "images": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Philips Hue",
    "name": "Play Light Bar 2-Pack Base Extension Set (Midnight Blue)",
    "slug": "philips-hue-play-light-bar-2-pack-base-extension-set-midnight-blue",
    "description": "Compact versatile light bars for mounting behind monitors or ambient TV backlighting. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 15119,
    "discount_price": 13305,
    "stock": 64,
    "sku": "HOME-PHI-578",
    "featured": true,
    "rating": 4.8,
    "review_count": 130,
    "images": [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "BenQ",
    "name": "ScreenBar Plus Auto-Dimming LED Monitor Light (Signature Series)",
    "slug": "benq-screenbar-plus-auto-dimming-led-monitor-light-signature-series",
    "description": "Patented asymmetric optical design illuminating desk space with zero screen glare. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 16228,
    "discount_price": null,
    "stock": 66,
    "sku": "HOME-BEN-579",
    "featured": false,
    "rating": 4.3,
    "review_count": 152,
    "images": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Diptyque",
    "name": "Baies Scented Luxury Candle 190g Glass (Classic Edition)",
    "slug": "diptyque-baies-scented-luxury-candle-190g-glass-classic-edition",
    "description": "Signature Parisian bouquet of freshly picked blackcurrant berries and wild rose petals. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 8668,
    "discount_price": 7628,
    "stock": 68,
    "sku": "HOME-DIP-580",
    "featured": false,
    "rating": 4.5,
    "review_count": 174,
    "images": [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Diptyque",
    "name": "Figuier Scented Home Candle 190g (Studio Model)",
    "slug": "diptyque-figuier-scented-home-candle-190g-studio-model",
    "description": "Warm woody fragrance evoking sun-warmed fig bark, green leaves, and milky sap. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 9227,
    "discount_price": null,
    "stock": 70,
    "sku": "HOME-DIP-581",
    "featured": false,
    "rating": 4.7,
    "review_count": 196,
    "images": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Brooklinen",
    "name": "Luxe Sateen 4-Piece Sheet Set Queen White (Pro Edition)",
    "slug": "brooklinen-luxe-sateen-4-piece-sheet-set-queen-white-pro-edition",
    "description": "480 thread count long-staple cotton offering an ultra-soft, luminous buttery sheen. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 16990,
    "discount_price": 14951,
    "stock": 72,
    "sku": "HOME-BRO-582",
    "featured": false,
    "rating": 4.2,
    "review_count": 218,
    "images": [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Casper",
    "name": "Original Foam Supportive Pillow Standard (Plus)",
    "slug": "casper-original-foam-supportive-pillow-standard-plus",
    "description": "Innovative pillow-in-a-pillow design providing balanced supportive fluff for neck alignment. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 7009,
    "discount_price": null,
    "stock": 74,
    "sku": "HOME-CAS-583",
    "featured": false,
    "rating": 4.4,
    "review_count": 240,
    "images": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Herman Miller",
    "name": "Aeron Ergonomic Office Chair Carbon (Special Edition)",
    "slug": "herman-miller-aeron-ergonomic-office-chair-carbon-special-edition",
    "description": "Pellicle 8Z mesh suspension with PostureFit SL adjustable sacral spinal support. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 133400,
    "discount_price": 117392,
    "stock": 76,
    "sku": "HOME-HER-584",
    "featured": false,
    "rating": 4.6,
    "review_count": 262,
    "images": [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Herman Miller",
    "name": "Embody Ergonomic Gaming Chair Cyan (Series II)",
    "slug": "herman-miller-embody-ergonomic-gaming-chair-cyan-series-ii",
    "description": "Pixelated matrix back support that automatically adjusts to subtle spine movements. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 179800,
    "discount_price": null,
    "stock": 78,
    "sku": "HOME-HER-585",
    "featured": false,
    "rating": 4.8,
    "review_count": 284,
    "images": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Steelcase",
    "name": "Gesture Ergonomic Executive Chair Black (Carbon Black)",
    "slug": "steelcase-gesture-ergonomic-executive-chair-black-carbon-black",
    "description": "360-degree rotating arms designed to support smart devices, laptops, and monitors. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 129360,
    "discount_price": 113837,
    "stock": 80,
    "sku": "HOME-STE-586",
    "featured": false,
    "rating": 4.3,
    "review_count": 306,
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Steelcase",
    "name": "Series 1 Compact Work Chair Licorice (Minimalist Edition)",
    "slug": "steelcase-series-1-compact-work-chair-licorice-minimalist-edition",
    "description": "Integrated LiveBack technology with intuitive weight-activated mechanism. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 46000,
    "discount_price": null,
    "stock": 82,
    "sku": "HOME-STE-587",
    "featured": false,
    "rating": 4.5,
    "review_count": 328,
    "images": [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Autonomous",
    "name": "SmartDesk Pro Motorized Standing Desk 53\" (Midnight Blue)",
    "slug": "autonomous-smartdesk-pro-motorized-standing-desk-53-midnight-blue",
    "description": "Dual-motor frame lifting up to 310 lbs smoothly with 4 programmable height presets. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 59399,
    "discount_price": 52271,
    "stock": 84,
    "sku": "HOME-AUT-588",
    "featured": false,
    "rating": 4.7,
    "review_count": 350,
    "images": [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "home-living",
    "brand": "Autonomous",
    "name": "ErgoChair Pro Breathable Mesh High-Back (Signature Series)",
    "slug": "autonomous-ergochair-pro-breathable-mesh-high-back-signature-series",
    "description": "Adjustable headrest, lumbar cushion, and 22-degree recline with 5 lockable positions. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 45239,
    "discount_price": null,
    "stock": 86,
    "sku": "HOME-AUT-589",
    "featured": false,
    "rating": 4.2,
    "review_count": 22,
    "images": [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "Niacinamide 10% + Zinc 1% Blemish Serum",
    "slug": "the-ordinary-niacinamide-10-zinc-1-blemish-serum",
    "description": "High-strength vitamin and mineral blemish formula reducing skin congestion and sebum.",
    "price": 650,
    "discount_price": null,
    "stock": 77,
    "sku": "BEAU-THE-590",
    "featured": false,
    "rating": 4.6,
    "review_count": 49,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "Hyaluronic Acid 2% + B5 Hydration Serum",
    "slug": "the-ordinary-hyaluronic-acid-2-b5-hydration-serum",
    "description": "Multi-depth hydration combining low, medium, and high molecular weight HA with provitamin B5.",
    "price": 790,
    "discount_price": null,
    "stock": 78,
    "sku": "BEAU-THE-591",
    "featured": false,
    "rating": 4.7,
    "review_count": 68,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "AHA 30% + BHA 2% Peeling Solution 30ml",
    "slug": "the-ordinary-aha-30-bha-2-peeling-solution-30ml",
    "description": "10-minute exfoliating facial peeling solution that refines pore texture and boosts radiance.",
    "price": 950,
    "discount_price": null,
    "stock": 79,
    "sku": "BEAU-THE-592",
    "featured": false,
    "rating": 4.8,
    "review_count": 87,
    "images": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "Retinol 0.5% in Squalane Anti-Aging Drops",
    "slug": "the-ordinary-retinol-05-in-squalane-anti-aging-drops",
    "description": "Stable water-free solution with 0.5% pure retinol for fine line and photo-damage reduction.",
    "price": 890,
    "discount_price": null,
    "stock": 80,
    "sku": "BEAU-THE-593",
    "featured": false,
    "rating": 4.3,
    "review_count": 106,
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Paula's Choice",
    "name": "Skin Perfecting 2% BHA Liquid Exfoliant",
    "slug": "paulas-choice-skin-perfecting-2-bha-liquid-exfoliant",
    "description": "Salicylic acid toner clearing enlarged pores, shedding dead skin cells, and smoothing wrinkles.",
    "price": 2900,
    "discount_price": 2490,
    "stock": 81,
    "sku": "BEAU-PAU-594",
    "featured": false,
    "rating": 4.4,
    "review_count": 125,
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Paula's Choice",
    "name": "C15 Super Booster 15% Vitamin C Treatment",
    "slug": "paulas-choice-c15-super-booster-15-vitamin-c-treatment",
    "description": "15% pure stabilized L-ascorbic acid blended with ferulic acid to brighten dull complexion.",
    "price": 4400,
    "discount_price": 3890,
    "stock": 82,
    "sku": "BEAU-PAU-595",
    "featured": false,
    "rating": 4.5,
    "review_count": 144,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "CeraVe",
    "name": "Resurfacing Retinol Serum with Ceramides",
    "slug": "cerave-resurfacing-retinol-serum-with-ceramides",
    "description": "Encapsulated retinol with licorice root extract smoothing acne marks and evening skin tone.",
    "price": 1999,
    "discount_price": 1699,
    "stock": 83,
    "sku": "BEAU-CER-596",
    "featured": false,
    "rating": 4.6,
    "review_count": 163,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "CeraVe",
    "name": "Hydrating Facial Cleanser for Normal to Dry Skin",
    "slug": "cerave-hydrating-facial-cleanser-for-normal-to-dry-skin",
    "description": "Non-foaming lotion with hyaluronic acid and 3 essential ceramides preserving moisture barrier.",
    "price": 1250,
    "discount_price": 1050,
    "stock": 84,
    "sku": "BEAU-CER-597",
    "featured": false,
    "rating": 4.7,
    "review_count": 182,
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "CeraVe",
    "name": "Moisturizing Cream Body & Face 453g Tub",
    "slug": "cerave-moisturizing-cream-body-face-453g-tub",
    "description": "Rich patented MVE delivery technology releasing nourishing ceramides all day long.",
    "price": 1650,
    "discount_price": 1399,
    "stock": 85,
    "sku": "BEAU-CER-598",
    "featured": false,
    "rating": 4.8,
    "review_count": 201,
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "La Roche-Posay",
    "name": "Anthelios UVmune 400 Invisible Fluid SPF 50+",
    "slug": "la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf-50",
    "description": "Ultra-long UVA filter protection with non-greasy invisible finish resistant to sweat and sand.",
    "price": 2150,
    "discount_price": 1850,
    "stock": 86,
    "sku": "BEAU-LA--599",
    "featured": true,
    "rating": 4.3,
    "review_count": 220,
    "images": [
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "La Roche-Posay",
    "name": "Hyalu B5 Pure Hyaluronic Acid Repair Serum",
    "slug": "la-roche-posay-hyalu-b5-pure-hyaluronic-acid-repair-serum",
    "description": "Two pure hyaluronic acids with vitamin B5 and madecassoside plumping aging skin.",
    "price": 3450,
    "discount_price": 2990,
    "stock": 12,
    "sku": "BEAU-LA--600",
    "featured": false,
    "rating": 4.4,
    "review_count": 239,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "La Roche-Posay",
    "name": "Effaclar Duo+ Anti-Blemish Treatment Cream",
    "slug": "la-roche-posay-effaclar-duo-anti-blemish-treatment-cream",
    "description": "Niacinamide, procerad, and LHA targeting severe blemishes and preventing red post-acne marks.",
    "price": 1750,
    "discount_price": 1490,
    "stock": 13,
    "sku": "BEAU-LA--601",
    "featured": false,
    "rating": 4.5,
    "review_count": 258,
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Estee Lauder",
    "name": "Advanced Night Repair Synchronized Multi-Recovery",
    "slug": "estee-lauder-advanced-night-repair-synchronized-multi-recovery",
    "description": "Patented Chronolux Power Signal technology igniting natural night-time cellular repair.",
    "price": 8200,
    "discount_price": 7290,
    "stock": 14,
    "sku": "BEAU-EST-602",
    "featured": false,
    "rating": 4.6,
    "review_count": 277,
    "images": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "SkinCeuticals",
    "name": "C E Ferulic Antioxidant Serum 30ml",
    "slug": "skinceuticals-c-e-ferulic-antioxidant-serum-30ml",
    "description": "Gold standard vitamin C antioxidant serum clinically proven to reduce oxidative environmental damage.",
    "price": 14500,
    "discount_price": 12900,
    "stock": 15,
    "sku": "BEAU-SKI-603",
    "featured": false,
    "rating": 4.7,
    "review_count": 296,
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Cetaphil",
    "name": "Gentle Skin Cleanser Soap-Free 500ml",
    "slug": "cetaphil-gentle-skin-cleanser-soap-free-500ml",
    "description": "Dermatologist backed creamy cleanser containing soothing niacinamide and panthenol.",
    "price": 1099,
    "discount_price": 899,
    "stock": 16,
    "sku": "BEAU-CET-604",
    "featured": false,
    "rating": 4.8,
    "review_count": 315,
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Bioderma",
    "name": "Sensibio H2O Micellar Water Cleanser 500ml",
    "slug": "bioderma-sensibio-h2o-micellar-water-cleanser-500ml",
    "description": "Physiological pH biomimetic micellar formula removing 99% of makeup without rinsing.",
    "price": 1695,
    "discount_price": 1395,
    "stock": 17,
    "sku": "BEAU-BIO-605",
    "featured": false,
    "rating": 4.3,
    "review_count": 334,
    "images": [
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Laneige",
    "name": "Lip Sleeping Mask Berry Antioxidant 20g",
    "slug": "laneige-lip-sleeping-mask-berry-antioxidant-20g",
    "description": "Moisture Wrap technology with shea butter and berry fruit complex melting dead flakes.",
    "price": 1450,
    "discount_price": 1190,
    "stock": 18,
    "sku": "BEAU-LAN-606",
    "featured": false,
    "rating": 4.4,
    "review_count": 353,
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Olaplex",
    "name": "No. 3 Hair Perfector At-Home Bond Builder",
    "slug": "olaplex-no-3-hair-perfector-at-home-bond-builder",
    "description": "Patented Bis-Aminopropyl Diglycol Dimaleate rebuilding broken disulfide bonds in dry hair.",
    "price": 2950,
    "discount_price": 2490,
    "stock": 19,
    "sku": "BEAU-OLA-607",
    "featured": false,
    "rating": 4.5,
    "review_count": 372,
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Olaplex",
    "name": "No. 7 Bonding Oil Weightless Shine Styler",
    "slug": "olaplex-no-7-bonding-oil-weightless-shine-styler",
    "description": "Ultra-nourishing golden styling oil providing heat protection up to 450 degrees Fahrenheit.",
    "price": 2950,
    "discount_price": 2490,
    "stock": 20,
    "sku": "BEAU-OLA-608",
    "featured": false,
    "rating": 4.6,
    "review_count": 391,
    "images": [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Moroccanoil",
    "name": "Treatment Original Argan Oil 100ml",
    "slug": "moroccanoil-treatment-original-argan-oil-100ml",
    "description": "Argan oil infused with antioxidant-rich vitamins improving detangling, shine, and softness.",
    "price": 3800,
    "discount_price": 3290,
    "stock": 21,
    "sku": "BEAU-MOR-609",
    "featured": false,
    "rating": 4.7,
    "review_count": 410,
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Dyson",
    "name": "Airwrap Multi-Styler Complete Long Nickel/Copper",
    "slug": "dyson-airwrap-multi-styler-complete-long-nickelcopper",
    "description": "Enhanced Coanda airflow styling hair with air instead of extreme heat, curling and drying.",
    "price": 49900,
    "discount_price": 45900,
    "stock": 22,
    "sku": "BEAU-DYS-610",
    "featured": false,
    "rating": 4.8,
    "review_count": 29,
    "images": [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Philips",
    "name": "OneBlade Pro Hybrid Electric Styler & Shaver",
    "slug": "philips-oneblade-pro-hybrid-electric-styler-shaver",
    "description": "Fast-moving cutter with dual protection system trimming, edging, and shaving any length hair.",
    "price": 4999,
    "discount_price": 3999,
    "stock": 23,
    "sku": "BEAU-PHI-611",
    "featured": true,
    "rating": 4.3,
    "review_count": 48,
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Braun",
    "name": "Series 9 Pro Electric Shaver with SmartCare Center",
    "slug": "braun-series-9-pro-electric-shaver-with-smartcare-center",
    "description": "ProLift trimmer lifting tough flat hairs with sonic technology shaving in fewer strokes.",
    "price": 32999,
    "discount_price": 28999,
    "stock": 24,
    "sku": "BEAU-BRA-612",
    "featured": false,
    "rating": 4.4,
    "review_count": 67,
    "images": [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Dior",
    "name": "Sauvage Eau de Parfum Pour Homme 100ml",
    "slug": "dior-sauvage-eau-de-parfum-pour-homme-100ml",
    "description": "Calabrian bergamot infused with smoky Papua New Guinean vanilla absolute accents.",
    "price": 11500,
    "discount_price": 10200,
    "stock": 25,
    "sku": "BEAU-DIO-613",
    "featured": false,
    "rating": 4.5,
    "review_count": 86,
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Chanel",
    "name": "Bleu de Chanel Eau de Parfum Spray 100ml",
    "slug": "chanel-bleu-de-chanel-eau-de-parfum-spray-100ml",
    "description": "Aromatic woody fragrance trailing cedar, New Caledonian sandalwood, and fresh citrus.",
    "price": 12900,
    "discount_price": 11500,
    "stock": 26,
    "sku": "BEAU-CHA-614",
    "featured": false,
    "rating": 4.6,
    "review_count": 105,
    "images": [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Tom Ford",
    "name": "Tobacco Vanille Eau de Parfum Luxury 50ml",
    "slug": "tom-ford-tobacco-vanille-eau-de-parfum-luxury-50ml",
    "description": "Opulent warm artisanal scent with rich tobacco leaf, aromatic spices, and tonka bean.",
    "price": 22000,
    "discount_price": 19800,
    "stock": 27,
    "sku": "BEAU-TOM-615",
    "featured": false,
    "rating": 4.7,
    "review_count": 124,
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Giorgio Armani",
    "name": "Acqua Di Gio Profondo Eau de Parfum 75ml",
    "slug": "giorgio-armani-acqua-di-gio-profondo-eau-de-parfum-75ml",
    "description": "Marine notes blending green mandarin, rosemary, and woody patchouli minerals.",
    "price": 8900,
    "discount_price": 7700,
    "stock": 28,
    "sku": "BEAU-GIO-616",
    "featured": false,
    "rating": 4.8,
    "review_count": 143,
    "images": [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "Niacinamide 10% + Zinc 1% Blemish Serum (Pro Edition)",
    "slug": "the-ordinary-niacinamide-10-zinc-1-blemish-serum-pro-edition",
    "description": "High-strength vitamin and mineral blemish formula reducing skin congestion and sebum. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 650,
    "discount_price": 572,
    "stock": 67,
    "sku": "BEAU-THE-617",
    "featured": false,
    "rating": 4.4,
    "review_count": 163,
    "images": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "Hyaluronic Acid 2% + B5 Hydration Serum (Plus)",
    "slug": "the-ordinary-hyaluronic-acid-2-b5-hydration-serum-plus",
    "description": "Multi-depth hydration combining low, medium, and high molecular weight HA with provitamin B5. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 853,
    "discount_price": null,
    "stock": 69,
    "sku": "BEAU-THE-618",
    "featured": false,
    "rating": 4.6,
    "review_count": 185,
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "AHA 30% + BHA 2% Peeling Solution 30ml (Special Edition)",
    "slug": "the-ordinary-aha-30-bha-2-peeling-solution-30ml-special-edition",
    "description": "10-minute exfoliating facial peeling solution that refines pore texture and boosts radiance. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 1102,
    "discount_price": 970,
    "stock": 71,
    "sku": "BEAU-THE-619",
    "featured": false,
    "rating": 4.8,
    "review_count": 207,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "Retinol 0.5% in Squalane Anti-Aging Drops (Series II)",
    "slug": "the-ordinary-retinol-05-in-squalane-anti-aging-drops-series-ii",
    "description": "Stable water-free solution with 0.5% pure retinol for fine line and photo-damage reduction. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 1104,
    "discount_price": null,
    "stock": 73,
    "sku": "BEAU-THE-620",
    "featured": false,
    "rating": 4.3,
    "review_count": 229,
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Paula's Choice",
    "name": "Skin Perfecting 2% BHA Liquid Exfoliant (Carbon Black)",
    "slug": "paulas-choice-skin-perfecting-2-bha-liquid-exfoliant-carbon-black",
    "description": "Salicylic acid toner clearing enlarged pores, shedding dead skin cells, and smoothing wrinkles. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 3828,
    "discount_price": 3369,
    "stock": 75,
    "sku": "BEAU-PAU-621",
    "featured": false,
    "rating": 4.5,
    "review_count": 251,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Paula's Choice",
    "name": "C15 Super Booster 15% Vitamin C Treatment (Minimalist Edition)",
    "slug": "paulas-choice-c15-super-booster-15-vitamin-c-treatment-minimalist-edition",
    "description": "15% pure stabilized L-ascorbic acid blended with ferulic acid to brighten dull complexion. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 4400,
    "discount_price": null,
    "stock": 77,
    "sku": "BEAU-PAU-622",
    "featured": false,
    "rating": 4.7,
    "review_count": 273,
    "images": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "CeraVe",
    "name": "Resurfacing Retinol Serum with Ceramides (Midnight Blue)",
    "slug": "cerave-resurfacing-retinol-serum-with-ceramides-midnight-blue",
    "description": "Encapsulated retinol with licorice root extract smoothing acne marks and evening skin tone. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 2159,
    "discount_price": 1900,
    "stock": 79,
    "sku": "BEAU-CER-623",
    "featured": true,
    "rating": 4.2,
    "review_count": 295,
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "CeraVe",
    "name": "Hydrating Facial Cleanser for Normal to Dry Skin (Signature Series)",
    "slug": "cerave-hydrating-facial-cleanser-for-normal-to-dry-skin-signature-series",
    "description": "Non-foaming lotion with hyaluronic acid and 3 essential ceramides preserving moisture barrier. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 1450,
    "discount_price": null,
    "stock": 81,
    "sku": "BEAU-CER-624",
    "featured": false,
    "rating": 4.4,
    "review_count": 317,
    "images": [
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "CeraVe",
    "name": "Moisturizing Cream Body & Face 453g Tub (Classic Edition)",
    "slug": "cerave-moisturizing-cream-body-face-453g-tub-classic-edition",
    "description": "Rich patented MVE delivery technology releasing nourishing ceramides all day long. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 2046,
    "discount_price": 1800,
    "stock": 83,
    "sku": "BEAU-CER-625",
    "featured": false,
    "rating": 4.6,
    "review_count": 339,
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "La Roche-Posay",
    "name": "Anthelios UVmune 400 Invisible Fluid SPF 50+ (Studio Model)",
    "slug": "la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf-50-studio-model",
    "description": "Ultra-long UVA filter protection with non-greasy invisible finish resistant to sweat and sand. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 2838,
    "discount_price": null,
    "stock": 85,
    "sku": "BEAU-LA--626",
    "featured": false,
    "rating": 4.8,
    "review_count": 361,
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "La Roche-Posay",
    "name": "Hyalu B5 Pure Hyaluronic Acid Repair Serum (Pro Edition)",
    "slug": "la-roche-posay-hyalu-b5-pure-hyaluronic-acid-repair-serum-pro-edition",
    "description": "Two pure hyaluronic acids with vitamin B5 and madecassoside plumping aging skin. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 3450,
    "discount_price": 3036,
    "stock": 87,
    "sku": "BEAU-LA--627",
    "featured": false,
    "rating": 4.3,
    "review_count": 33,
    "images": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "La Roche-Posay",
    "name": "Effaclar Duo+ Anti-Blemish Treatment Cream (Plus)",
    "slug": "la-roche-posay-effaclar-duo-anti-blemish-treatment-cream-plus",
    "description": "Niacinamide, procerad, and LHA targeting severe blemishes and preventing red post-acne marks. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 1890,
    "discount_price": null,
    "stock": 89,
    "sku": "BEAU-LA--628",
    "featured": false,
    "rating": 4.5,
    "review_count": 55,
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Estee Lauder",
    "name": "Advanced Night Repair Synchronized Multi-Recovery (Special Edition)",
    "slug": "estee-lauder-advanced-night-repair-synchronized-multi-recovery-special-edition",
    "description": "Patented Chronolux Power Signal technology igniting natural night-time cellular repair. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 9512,
    "discount_price": 8371,
    "stock": 11,
    "sku": "BEAU-EST-629",
    "featured": false,
    "rating": 4.7,
    "review_count": 77,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "SkinCeuticals",
    "name": "C E Ferulic Antioxidant Serum 30ml (Series II)",
    "slug": "skinceuticals-c-e-ferulic-antioxidant-serum-30ml-series-ii",
    "description": "Gold standard vitamin C antioxidant serum clinically proven to reduce oxidative environmental damage. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 17980,
    "discount_price": null,
    "stock": 13,
    "sku": "BEAU-SKI-630",
    "featured": false,
    "rating": 4.2,
    "review_count": 99,
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Cetaphil",
    "name": "Gentle Skin Cleanser Soap-Free 500ml (Carbon Black)",
    "slug": "cetaphil-gentle-skin-cleanser-soap-free-500ml-carbon-black",
    "description": "Dermatologist backed creamy cleanser containing soothing niacinamide and panthenol. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 1451,
    "discount_price": 1277,
    "stock": 15,
    "sku": "BEAU-CET-631",
    "featured": false,
    "rating": 4.4,
    "review_count": 121,
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Bioderma",
    "name": "Sensibio H2O Micellar Water Cleanser 500ml (Minimalist Edition)",
    "slug": "bioderma-sensibio-h2o-micellar-water-cleanser-500ml-minimalist-edition",
    "description": "Physiological pH biomimetic micellar formula removing 99% of makeup without rinsing. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 1695,
    "discount_price": null,
    "stock": 17,
    "sku": "BEAU-BIO-632",
    "featured": false,
    "rating": 4.6,
    "review_count": 143,
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Laneige",
    "name": "Lip Sleeping Mask Berry Antioxidant 20g (Midnight Blue)",
    "slug": "laneige-lip-sleeping-mask-berry-antioxidant-20g-midnight-blue",
    "description": "Moisture Wrap technology with shea butter and berry fruit complex melting dead flakes. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 1566,
    "discount_price": 1378,
    "stock": 19,
    "sku": "BEAU-LAN-633",
    "featured": false,
    "rating": 4.8,
    "review_count": 165,
    "images": [
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Olaplex",
    "name": "No. 3 Hair Perfector At-Home Bond Builder (Signature Series)",
    "slug": "olaplex-no-3-hair-perfector-at-home-bond-builder-signature-series",
    "description": "Patented Bis-Aminopropyl Diglycol Dimaleate rebuilding broken disulfide bonds in dry hair. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 3422,
    "discount_price": null,
    "stock": 21,
    "sku": "BEAU-OLA-634",
    "featured": false,
    "rating": 4.3,
    "review_count": 187,
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Olaplex",
    "name": "No. 7 Bonding Oil Weightless Shine Styler (Classic Edition)",
    "slug": "olaplex-no-7-bonding-oil-weightless-shine-styler-classic-edition",
    "description": "Ultra-nourishing golden styling oil providing heat protection up to 450 degrees Fahrenheit. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 3658,
    "discount_price": 3219,
    "stock": 23,
    "sku": "BEAU-OLA-635",
    "featured": false,
    "rating": 4.5,
    "review_count": 209,
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Moroccanoil",
    "name": "Treatment Original Argan Oil 100ml (Studio Model)",
    "slug": "moroccanoil-treatment-original-argan-oil-100ml-studio-model",
    "description": "Argan oil infused with antioxidant-rich vitamins improving detangling, shine, and softness. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 5016,
    "discount_price": null,
    "stock": 25,
    "sku": "BEAU-MOR-636",
    "featured": false,
    "rating": 4.7,
    "review_count": 231,
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Dyson",
    "name": "Airwrap Multi-Styler Complete Long Nickel/Copper (Pro Edition)",
    "slug": "dyson-airwrap-multi-styler-complete-long-nickelcopper-pro-edition",
    "description": "Enhanced Coanda airflow styling hair with air instead of extreme heat, curling and drying. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 49900,
    "discount_price": 43912,
    "stock": 27,
    "sku": "BEAU-DYS-637",
    "featured": false,
    "rating": 4.2,
    "review_count": 253,
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Philips",
    "name": "OneBlade Pro Hybrid Electric Styler & Shaver (Plus)",
    "slug": "philips-oneblade-pro-hybrid-electric-styler-shaver-plus",
    "description": "Fast-moving cutter with dual protection system trimming, edging, and shaving any length hair. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 5399,
    "discount_price": null,
    "stock": 29,
    "sku": "BEAU-PHI-638",
    "featured": true,
    "rating": 4.4,
    "review_count": 275,
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Braun",
    "name": "Series 9 Pro Electric Shaver with SmartCare Center (Special Edition)",
    "slug": "braun-series-9-pro-electric-shaver-with-smartcare-center-special-edition",
    "description": "ProLift trimmer lifting tough flat hairs with sonic technology shaving in fewer strokes. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 38279,
    "discount_price": 33686,
    "stock": 31,
    "sku": "BEAU-BRA-639",
    "featured": false,
    "rating": 4.6,
    "review_count": 297,
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Dior",
    "name": "Sauvage Eau de Parfum Pour Homme 100ml (Series II)",
    "slug": "dior-sauvage-eau-de-parfum-pour-homme-100ml-series-ii",
    "description": "Calabrian bergamot infused with smoky Papua New Guinean vanilla absolute accents. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 14260,
    "discount_price": null,
    "stock": 33,
    "sku": "BEAU-DIO-640",
    "featured": false,
    "rating": 4.8,
    "review_count": 319,
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Chanel",
    "name": "Bleu de Chanel Eau de Parfum Spray 100ml (Carbon Black)",
    "slug": "chanel-bleu-de-chanel-eau-de-parfum-spray-100ml-carbon-black",
    "description": "Aromatic woody fragrance trailing cedar, New Caledonian sandalwood, and fresh citrus. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 17028,
    "discount_price": 14985,
    "stock": 35,
    "sku": "BEAU-CHA-641",
    "featured": false,
    "rating": 4.3,
    "review_count": 341,
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Tom Ford",
    "name": "Tobacco Vanille Eau de Parfum Luxury 50ml (Minimalist Edition)",
    "slug": "tom-ford-tobacco-vanille-eau-de-parfum-luxury-50ml-minimalist-edition",
    "description": "Opulent warm artisanal scent with rich tobacco leaf, aromatic spices, and tonka bean. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 22000,
    "discount_price": null,
    "stock": 37,
    "sku": "BEAU-TOM-642",
    "featured": false,
    "rating": 4.5,
    "review_count": 363,
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Giorgio Armani",
    "name": "Acqua Di Gio Profondo Eau de Parfum 75ml (Midnight Blue)",
    "slug": "giorgio-armani-acqua-di-gio-profondo-eau-de-parfum-75ml-midnight-blue",
    "description": "Marine notes blending green mandarin, rosemary, and woody patchouli minerals. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 9612,
    "discount_price": 8459,
    "stock": 39,
    "sku": "BEAU-GIO-643",
    "featured": false,
    "rating": 4.7,
    "review_count": 35,
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "Niacinamide 10% + Zinc 1% Blemish Serum (Signature Series)",
    "slug": "the-ordinary-niacinamide-10-zinc-1-blemish-serum-signature-series",
    "description": "High-strength vitamin and mineral blemish formula reducing skin congestion and sebum. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 754,
    "discount_price": null,
    "stock": 41,
    "sku": "BEAU-THE-644",
    "featured": false,
    "rating": 4.2,
    "review_count": 57,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "Hyaluronic Acid 2% + B5 Hydration Serum (Classic Edition)",
    "slug": "the-ordinary-hyaluronic-acid-2-b5-hydration-serum-classic-edition",
    "description": "Multi-depth hydration combining low, medium, and high molecular weight HA with provitamin B5. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 980,
    "discount_price": 862,
    "stock": 43,
    "sku": "BEAU-THE-645",
    "featured": false,
    "rating": 4.4,
    "review_count": 79,
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "AHA 30% + BHA 2% Peeling Solution 30ml (Studio Model)",
    "slug": "the-ordinary-aha-30-bha-2-peeling-solution-30ml-studio-model",
    "description": "10-minute exfoliating facial peeling solution that refines pore texture and boosts radiance. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 1254,
    "discount_price": null,
    "stock": 45,
    "sku": "BEAU-THE-646",
    "featured": false,
    "rating": 4.6,
    "review_count": 101,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "Retinol 0.5% in Squalane Anti-Aging Drops (Pro Edition)",
    "slug": "the-ordinary-retinol-05-in-squalane-anti-aging-drops-pro-edition",
    "description": "Stable water-free solution with 0.5% pure retinol for fine line and photo-damage reduction. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 890,
    "discount_price": 783,
    "stock": 47,
    "sku": "BEAU-THE-647",
    "featured": false,
    "rating": 4.8,
    "review_count": 123,
    "images": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Paula's Choice",
    "name": "Skin Perfecting 2% BHA Liquid Exfoliant (Plus)",
    "slug": "paulas-choice-skin-perfecting-2-bha-liquid-exfoliant-plus",
    "description": "Salicylic acid toner clearing enlarged pores, shedding dead skin cells, and smoothing wrinkles. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 3132,
    "discount_price": null,
    "stock": 49,
    "sku": "BEAU-PAU-648",
    "featured": false,
    "rating": 4.3,
    "review_count": 145,
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Paula's Choice",
    "name": "C15 Super Booster 15% Vitamin C Treatment (Special Edition)",
    "slug": "paulas-choice-c15-super-booster-15-vitamin-c-treatment-special-edition",
    "description": "15% pure stabilized L-ascorbic acid blended with ferulic acid to brighten dull complexion. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 5104,
    "discount_price": 4492,
    "stock": 51,
    "sku": "BEAU-PAU-649",
    "featured": false,
    "rating": 4.5,
    "review_count": 167,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "CeraVe",
    "name": "Resurfacing Retinol Serum with Ceramides (Series II)",
    "slug": "cerave-resurfacing-retinol-serum-with-ceramides-series-ii",
    "description": "Encapsulated retinol with licorice root extract smoothing acne marks and evening skin tone. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 2479,
    "discount_price": null,
    "stock": 53,
    "sku": "BEAU-CER-650",
    "featured": false,
    "rating": 4.7,
    "review_count": 189,
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "CeraVe",
    "name": "Hydrating Facial Cleanser for Normal to Dry Skin (Carbon Black)",
    "slug": "cerave-hydrating-facial-cleanser-for-normal-to-dry-skin-carbon-black",
    "description": "Non-foaming lotion with hyaluronic acid and 3 essential ceramides preserving moisture barrier. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 1650,
    "discount_price": 1452,
    "stock": 55,
    "sku": "BEAU-CER-651",
    "featured": false,
    "rating": 4.2,
    "review_count": 211,
    "images": [
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "CeraVe",
    "name": "Moisturizing Cream Body & Face 453g Tub (Minimalist Edition)",
    "slug": "cerave-moisturizing-cream-body-face-453g-tub-minimalist-edition",
    "description": "Rich patented MVE delivery technology releasing nourishing ceramides all day long. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 1650,
    "discount_price": null,
    "stock": 57,
    "sku": "BEAU-CER-652",
    "featured": false,
    "rating": 4.4,
    "review_count": 233,
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "La Roche-Posay",
    "name": "Anthelios UVmune 400 Invisible Fluid SPF 50+ (Midnight Blue)",
    "slug": "la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf-50-midnight-blue",
    "description": "Ultra-long UVA filter protection with non-greasy invisible finish resistant to sweat and sand. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 2322,
    "discount_price": 2043,
    "stock": 59,
    "sku": "BEAU-LA--653",
    "featured": true,
    "rating": 4.6,
    "review_count": 255,
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "La Roche-Posay",
    "name": "Hyalu B5 Pure Hyaluronic Acid Repair Serum (Signature Series)",
    "slug": "la-roche-posay-hyalu-b5-pure-hyaluronic-acid-repair-serum-signature-series",
    "description": "Two pure hyaluronic acids with vitamin B5 and madecassoside plumping aging skin. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 4002,
    "discount_price": null,
    "stock": 61,
    "sku": "BEAU-LA--654",
    "featured": false,
    "rating": 4.8,
    "review_count": 277,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "La Roche-Posay",
    "name": "Effaclar Duo+ Anti-Blemish Treatment Cream (Classic Edition)",
    "slug": "la-roche-posay-effaclar-duo-anti-blemish-treatment-cream-classic-edition",
    "description": "Niacinamide, procerad, and LHA targeting severe blemishes and preventing red post-acne marks. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 2170,
    "discount_price": 1910,
    "stock": 63,
    "sku": "BEAU-LA--655",
    "featured": false,
    "rating": 4.3,
    "review_count": 299,
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Estee Lauder",
    "name": "Advanced Night Repair Synchronized Multi-Recovery (Studio Model)",
    "slug": "estee-lauder-advanced-night-repair-synchronized-multi-recovery-studio-model",
    "description": "Patented Chronolux Power Signal technology igniting natural night-time cellular repair. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 10824,
    "discount_price": null,
    "stock": 65,
    "sku": "BEAU-EST-656",
    "featured": false,
    "rating": 4.5,
    "review_count": 321,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "SkinCeuticals",
    "name": "C E Ferulic Antioxidant Serum 30ml (Pro Edition)",
    "slug": "skinceuticals-c-e-ferulic-antioxidant-serum-30ml-pro-edition",
    "description": "Gold standard vitamin C antioxidant serum clinically proven to reduce oxidative environmental damage. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 14500,
    "discount_price": 12760,
    "stock": 67,
    "sku": "BEAU-SKI-657",
    "featured": false,
    "rating": 4.7,
    "review_count": 343,
    "images": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Cetaphil",
    "name": "Gentle Skin Cleanser Soap-Free 500ml (Plus)",
    "slug": "cetaphil-gentle-skin-cleanser-soap-free-500ml-plus",
    "description": "Dermatologist backed creamy cleanser containing soothing niacinamide and panthenol. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 1187,
    "discount_price": null,
    "stock": 69,
    "sku": "BEAU-CET-658",
    "featured": false,
    "rating": 4.2,
    "review_count": 15,
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Bioderma",
    "name": "Sensibio H2O Micellar Water Cleanser 500ml (Special Edition)",
    "slug": "bioderma-sensibio-h2o-micellar-water-cleanser-500ml-special-edition",
    "description": "Physiological pH biomimetic micellar formula removing 99% of makeup without rinsing. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 1966,
    "discount_price": 1730,
    "stock": 71,
    "sku": "BEAU-BIO-659",
    "featured": false,
    "rating": 4.4,
    "review_count": 37,
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Laneige",
    "name": "Lip Sleeping Mask Berry Antioxidant 20g (Series II)",
    "slug": "laneige-lip-sleeping-mask-berry-antioxidant-20g-series-ii",
    "description": "Moisture Wrap technology with shea butter and berry fruit complex melting dead flakes. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 1798,
    "discount_price": null,
    "stock": 73,
    "sku": "BEAU-LAN-660",
    "featured": false,
    "rating": 4.6,
    "review_count": 59,
    "images": [
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Olaplex",
    "name": "No. 3 Hair Perfector At-Home Bond Builder (Carbon Black)",
    "slug": "olaplex-no-3-hair-perfector-at-home-bond-builder-carbon-black",
    "description": "Patented Bis-Aminopropyl Diglycol Dimaleate rebuilding broken disulfide bonds in dry hair. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 3894,
    "discount_price": 3427,
    "stock": 75,
    "sku": "BEAU-OLA-661",
    "featured": false,
    "rating": 4.8,
    "review_count": 81,
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Olaplex",
    "name": "No. 7 Bonding Oil Weightless Shine Styler (Minimalist Edition)",
    "slug": "olaplex-no-7-bonding-oil-weightless-shine-styler-minimalist-edition",
    "description": "Ultra-nourishing golden styling oil providing heat protection up to 450 degrees Fahrenheit. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 2950,
    "discount_price": null,
    "stock": 77,
    "sku": "BEAU-OLA-662",
    "featured": false,
    "rating": 4.3,
    "review_count": 103,
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Moroccanoil",
    "name": "Treatment Original Argan Oil 100ml (Midnight Blue)",
    "slug": "moroccanoil-treatment-original-argan-oil-100ml-midnight-blue",
    "description": "Argan oil infused with antioxidant-rich vitamins improving detangling, shine, and softness. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 4104,
    "discount_price": 3612,
    "stock": 79,
    "sku": "BEAU-MOR-663",
    "featured": false,
    "rating": 4.5,
    "review_count": 125,
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Dyson",
    "name": "Airwrap Multi-Styler Complete Long Nickel/Copper (Signature Series)",
    "slug": "dyson-airwrap-multi-styler-complete-long-nickelcopper-signature-series",
    "description": "Enhanced Coanda airflow styling hair with air instead of extreme heat, curling and drying. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 57884,
    "discount_price": null,
    "stock": 81,
    "sku": "BEAU-DYS-664",
    "featured": false,
    "rating": 4.7,
    "review_count": 147,
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Philips",
    "name": "OneBlade Pro Hybrid Electric Styler & Shaver (Classic Edition)",
    "slug": "philips-oneblade-pro-hybrid-electric-styler-shaver-classic-edition",
    "description": "Fast-moving cutter with dual protection system trimming, edging, and shaving any length hair. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 6199,
    "discount_price": 5455,
    "stock": 83,
    "sku": "BEAU-PHI-665",
    "featured": false,
    "rating": 4.2,
    "review_count": 169,
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Braun",
    "name": "Series 9 Pro Electric Shaver with SmartCare Center (Studio Model)",
    "slug": "braun-series-9-pro-electric-shaver-with-smartcare-center-studio-model",
    "description": "ProLift trimmer lifting tough flat hairs with sonic technology shaving in fewer strokes. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 43559,
    "discount_price": null,
    "stock": 85,
    "sku": "BEAU-BRA-666",
    "featured": false,
    "rating": 4.4,
    "review_count": 191,
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Dior",
    "name": "Sauvage Eau de Parfum Pour Homme 100ml (Pro Edition)",
    "slug": "dior-sauvage-eau-de-parfum-pour-homme-100ml-pro-edition",
    "description": "Calabrian bergamot infused with smoky Papua New Guinean vanilla absolute accents. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 11500,
    "discount_price": 10120,
    "stock": 87,
    "sku": "BEAU-DIO-667",
    "featured": false,
    "rating": 4.6,
    "review_count": 213,
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Chanel",
    "name": "Bleu de Chanel Eau de Parfum Spray 100ml (Plus)",
    "slug": "chanel-bleu-de-chanel-eau-de-parfum-spray-100ml-plus",
    "description": "Aromatic woody fragrance trailing cedar, New Caledonian sandalwood, and fresh citrus. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 13932,
    "discount_price": null,
    "stock": 89,
    "sku": "BEAU-CHA-668",
    "featured": true,
    "rating": 4.8,
    "review_count": 235,
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Tom Ford",
    "name": "Tobacco Vanille Eau de Parfum Luxury 50ml (Special Edition)",
    "slug": "tom-ford-tobacco-vanille-eau-de-parfum-luxury-50ml-special-edition",
    "description": "Opulent warm artisanal scent with rich tobacco leaf, aromatic spices, and tonka bean. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 25520,
    "discount_price": 22458,
    "stock": 11,
    "sku": "BEAU-TOM-669",
    "featured": false,
    "rating": 4.3,
    "review_count": 257,
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "Giorgio Armani",
    "name": "Acqua Di Gio Profondo Eau de Parfum 75ml (Series II)",
    "slug": "giorgio-armani-acqua-di-gio-profondo-eau-de-parfum-75ml-series-ii",
    "description": "Marine notes blending green mandarin, rosemary, and woody patchouli minerals. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 11036,
    "discount_price": null,
    "stock": 13,
    "sku": "BEAU-GIO-670",
    "featured": false,
    "rating": 4.5,
    "review_count": 279,
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "Niacinamide 10% + Zinc 1% Blemish Serum (Carbon Black)",
    "slug": "the-ordinary-niacinamide-10-zinc-1-blemish-serum-carbon-black",
    "description": "High-strength vitamin and mineral blemish formula reducing skin congestion and sebum. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 858,
    "discount_price": 755,
    "stock": 15,
    "sku": "BEAU-THE-671",
    "featured": false,
    "rating": 4.7,
    "review_count": 301,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "Hyaluronic Acid 2% + B5 Hydration Serum (Minimalist Edition)",
    "slug": "the-ordinary-hyaluronic-acid-2-b5-hydration-serum-minimalist-edition",
    "description": "Multi-depth hydration combining low, medium, and high molecular weight HA with provitamin B5. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 790,
    "discount_price": null,
    "stock": 17,
    "sku": "BEAU-THE-672",
    "featured": false,
    "rating": 4.2,
    "review_count": 323,
    "images": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "AHA 30% + BHA 2% Peeling Solution 30ml (Midnight Blue)",
    "slug": "the-ordinary-aha-30-bha-2-peeling-solution-30ml-midnight-blue",
    "description": "10-minute exfoliating facial peeling solution that refines pore texture and boosts radiance. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 1026,
    "discount_price": 903,
    "stock": 19,
    "sku": "BEAU-THE-673",
    "featured": false,
    "rating": 4.4,
    "review_count": 345,
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "beauty-health",
    "brand": "The Ordinary",
    "name": "Retinol 0.5% in Squalane Anti-Aging Drops (Signature Series)",
    "slug": "the-ordinary-retinol-05-in-squalane-anti-aging-drops-signature-series",
    "description": "Stable water-free solution with 0.5% pure retinol for fine line and photo-damage reduction. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 1032,
    "discount_price": null,
    "stock": 21,
    "sku": "BEAU-THE-674",
    "featured": false,
    "rating": 4.6,
    "review_count": 17,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Bowflex",
    "name": "SelectTech 552 Adjustable Dumbbells Pair",
    "slug": "bowflex-selecttech-552-adjustable-dumbbells-pair",
    "description": "Replaces 15 sets of weights adjusting from 5 to 52.5 lbs with smooth dial selection.",
    "price": 34990,
    "discount_price": 29990,
    "stock": 12,
    "sku": "SPRT-BOW-675",
    "featured": false,
    "rating": 4.7,
    "review_count": 64,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Bowflex",
    "name": "SelectTech 840 Adjustable Kettlebell 8-40 lbs",
    "slug": "bowflex-selecttech-840-adjustable-kettlebell-8-40-lbs",
    "description": "6 weight settings in one space-efficient cast iron body for swings, presses, and snatches.",
    "price": 18990,
    "discount_price": 15990,
    "stock": 13,
    "sku": "SPRT-BOW-676",
    "featured": false,
    "rating": 4.8,
    "review_count": 83,
    "images": [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "PowerBlock",
    "name": "Elite EXP Adjustable Dumbbell Set 5-50 lbs",
    "slug": "powerblock-elite-exp-adjustable-dumbbell-set-5-50-lbs",
    "description": "Urethane-coated solid steel weight plates with auto-lock selector pin engineered for life.",
    "price": 39990,
    "discount_price": 34990,
    "stock": 14,
    "sku": "SPRT-POW-677",
    "featured": false,
    "rating": 4.3,
    "review_count": 102,
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Rogue Fitness",
    "name": "Echo Bumper Plates V2 20kg Pair",
    "slug": "rogue-fitness-echo-bumper-plates-v2-20kg-pair",
    "description": "Durable Olympic rubber bumper plates with stainless steel hub inserts and low bounce.",
    "price": 16500,
    "discount_price": 14500,
    "stock": 15,
    "sku": "SPRT-ROG-678",
    "featured": false,
    "rating": 4.4,
    "review_count": 121,
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Rogue Fitness",
    "name": "The Ohio Barbell 20kg Black Zinc Shaft",
    "slug": "rogue-fitness-the-ohio-barbell-20kg-black-zinc-shaft",
    "description": "Precision machined 190,000 PSI tensile strength steel with dual knurl marks and bronze bushings.",
    "price": 28500,
    "discount_price": 25500,
    "stock": 16,
    "sku": "SPRT-ROG-679",
    "featured": false,
    "rating": 4.5,
    "review_count": 140,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "TRX",
    "name": "All-in-One Suspension Trainer Bodyweight System",
    "slug": "trx-all-in-one-suspension-trainer-bodyweight-system",
    "description": "Full-body suspension straps anchored to doors or rafters using bodyweight for resistance.",
    "price": 14999,
    "discount_price": 12499,
    "stock": 17,
    "sku": "SPRT-TRX-680",
    "featured": false,
    "rating": 4.6,
    "review_count": 159,
    "images": [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Manduka",
    "name": "PRO Yoga Mat 6mm High-Density Cushioning",
    "slug": "manduka-pro-yoga-mat-6mm-high-density-cushioning",
    "description": "Lifetime guaranteed closed-cell natural rubber mat protecting joints with non-slip finish.",
    "price": 10900,
    "discount_price": 9400,
    "stock": 18,
    "sku": "SPRT-MAN-681",
    "featured": false,
    "rating": 4.7,
    "review_count": 178,
    "images": [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Lululemon",
    "name": "The Reversible Mat 5mm Grip Natural Rubber",
    "slug": "lululemon-the-reversible-mat-5mm-grip-natural-rubber",
    "description": "Polyurethane top layer absorbing sweat with antimicrobial additive preventing mold.",
    "price": 6800,
    "discount_price": 5900,
    "stock": 19,
    "sku": "SPRT-LUL-682",
    "featured": false,
    "rating": 4.8,
    "review_count": 197,
    "images": [
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Theragun",
    "name": "PRO 5th Gen Percussive Therapy Massage Device",
    "slug": "theragun-pro-5th-gen-percussive-therapy-massage-device",
    "description": "Patented triangle multi-grip handle with 16mm amplitude reaching 60% deeper into muscle.",
    "price": 49990,
    "discount_price": 44990,
    "stock": 20,
    "sku": "SPRT-THE-683",
    "featured": true,
    "rating": 4.3,
    "review_count": 216,
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Theragun",
    "name": "Mini 2.0 Portable Percussion Massager Black",
    "slug": "theragun-mini-20-portable-percussion-massager-black",
    "description": "Pocket-sized powerhouse with 3 speed settings delivering on-the-go localized muscle relief.",
    "price": 16990,
    "discount_price": 14490,
    "stock": 21,
    "sku": "SPRT-THE-684",
    "featured": false,
    "rating": 4.4,
    "review_count": 235,
    "images": [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Hyperice",
    "name": "Hypervolt 2 Pro Deep Tissue Muscle Gun",
    "slug": "hyperice-hypervolt-2-pro-deep-tissue-muscle-gun",
    "description": "QuietGlide technology with 5 speed dial and Bluetooth connection to the Hyperice app.",
    "price": 34990,
    "discount_price": 29990,
    "stock": 22,
    "sku": "SPRT-HYP-685",
    "featured": false,
    "rating": 4.5,
    "review_count": 254,
    "images": [
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "TriggerPoint",
    "name": "GRID Multi-Density Foam Roller 13 Inch",
    "slug": "triggerpoint-grid-multi-density-foam-roller-13-inch",
    "description": "Patented hollow-core design with multi-density foam mimicking a massage therapist hands.",
    "price": 3499,
    "discount_price": 2899,
    "stock": 23,
    "sku": "SPRT-TRI-686",
    "featured": false,
    "rating": 4.6,
    "review_count": 273,
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Nike",
    "name": "Vaporfly 3 Road Racing Shoes Electric Orange",
    "slug": "nike-vaporfly-3-road-racing-shoes-electric-orange",
    "description": "Full-length carbon fiber flyplate paired with Nike ZoomX foam for record-setting marathon speed.",
    "price": 20695,
    "discount_price": 18495,
    "stock": 24,
    "sku": "SPRT-NIK-687",
    "featured": false,
    "rating": 4.7,
    "review_count": 292,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Nike",
    "name": "Alphafly 3 Marathon Road Racing Shoes White",
    "slug": "nike-alphafly-3-marathon-road-racing-shoes-white",
    "description": "Dual forefoot Air Zoom units with continuous ZoomX foam and Atomknit 3.0 breathable upper.",
    "price": 23795,
    "discount_price": 21995,
    "stock": 25,
    "sku": "SPRT-NIK-688",
    "featured": false,
    "rating": 4.8,
    "review_count": 311,
    "images": [
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Garmin",
    "name": "HRM-Pro Plus Dual Transmission Heart Rate Strap",
    "slug": "garmin-hrm-pro-plus-dual-transmission-heart-rate-strap",
    "description": "Captures advanced running dynamics and transmits heart rate data via ANT+ and Bluetooth.",
    "price": 12990,
    "discount_price": 10990,
    "stock": 26,
    "sku": "SPRT-GAR-689",
    "featured": false,
    "rating": 4.3,
    "review_count": 330,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Concept2",
    "name": "RowErg Indoor Rowing Machine with PM5 Console",
    "slug": "concept2-rowerg-indoor-rowing-machine-with-pm5-console",
    "description": "Commercial gym standard flywheel damper providing smooth air-resistance full body exercise.",
    "price": 115000,
    "discount_price": 104900,
    "stock": 27,
    "sku": "SPRT-CON-690",
    "featured": false,
    "rating": 4.4,
    "review_count": 349,
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Hydro Flask",
    "name": "32 oz Wide Mouth with Flex Straw Cap Pacific",
    "slug": "hydro-flask-32-oz-wide-mouth-with-flex-straw-cap-pacific",
    "description": "TempShield double-wall vacuum insulation keeping drinks ice cold for 24 hours in pro-grade steel.",
    "price": 3999,
    "discount_price": 3299,
    "stock": 28,
    "sku": "SPRT-HYD-691",
    "featured": false,
    "rating": 4.5,
    "review_count": 368,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Stanley",
    "name": "The Quencher H2.0 FlowState Tumbler 40 oz Cream",
    "slug": "stanley-the-quencher-h20-flowstate-tumbler-40-oz-cream",
    "description": "Recycled stainless steel tumbler with 3-position rotating lid and ergonomic comfort-grip handle.",
    "price": 4499,
    "discount_price": 3799,
    "stock": 29,
    "sku": "SPRT-STA-692",
    "featured": false,
    "rating": 4.6,
    "review_count": 387,
    "images": [
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Yeti",
    "name": "Rambler 26 oz Water Bottle with Chug Cap Navy",
    "slug": "yeti-rambler-26-oz-water-bottle-with-chug-cap-navy",
    "description": "DuraCoat color that won't crack or peel with 100% leakproof Shatter-resistant Chug spout.",
    "price": 4299,
    "discount_price": 3699,
    "stock": 30,
    "sku": "SPRT-YET-693",
    "featured": false,
    "rating": 4.7,
    "review_count": 406,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "MSR",
    "name": "Hubba Hubba 2-Person Ultralight Backpacking Tent",
    "slug": "msr-hubba-hubba-2-person-ultralight-backpacking-tent",
    "description": "Easton Syclone poles with DuraShield waterproof coating weighing just 1.3kg packed.",
    "price": 42990,
    "discount_price": 38990,
    "stock": 31,
    "sku": "SPRT-MSR-694",
    "featured": false,
    "rating": 4.8,
    "review_count": 25,
    "images": [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Osprey",
    "name": "Talon 22 Day Hiking Backpack Stealth Black",
    "slug": "osprey-talon-22-day-hiking-backpack-stealth-black",
    "description": "AirScape breathable backpanel with continuous-wrap hipbelt for dynamic technical hikes.",
    "price": 13990,
    "discount_price": 11990,
    "stock": 32,
    "sku": "SPRT-OSP-695",
    "featured": true,
    "rating": 4.3,
    "review_count": 44,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Black Diamond",
    "name": "Storm 500-R Rechargeable Waterproof Headlamp",
    "slug": "black-diamond-storm-500-r-rechargeable-waterproof-headlamp",
    "description": "500 lumens of light with micro-optical faceted lens and IP67 submersible dust/waterproof housing.",
    "price": 5999,
    "discount_price": 4999,
    "stock": 33,
    "sku": "SPRT-BLA-696",
    "featured": false,
    "rating": 4.4,
    "review_count": 63,
    "images": [
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Bowflex",
    "name": "SelectTech 552 Adjustable Dumbbells Pair (Pro Edition)",
    "slug": "bowflex-selecttech-552-adjustable-dumbbells-pair-pro-edition",
    "description": "Replaces 15 sets of weights adjusting from 5 to 52.5 lbs with smooth dial selection. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 34990,
    "discount_price": 30791,
    "stock": 67,
    "sku": "SPRT-BOW-697",
    "featured": false,
    "rating": 4.7,
    "review_count": 343,
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Bowflex",
    "name": "SelectTech 840 Adjustable Kettlebell 8-40 lbs (Plus)",
    "slug": "bowflex-selecttech-840-adjustable-kettlebell-8-40-lbs-plus",
    "description": "6 weight settings in one space-efficient cast iron body for swings, presses, and snatches. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 20509,
    "discount_price": null,
    "stock": 69,
    "sku": "SPRT-BOW-698",
    "featured": false,
    "rating": 4.2,
    "review_count": 15,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "PowerBlock",
    "name": "Elite EXP Adjustable Dumbbell Set 5-50 lbs (Special Edition)",
    "slug": "powerblock-elite-exp-adjustable-dumbbell-set-5-50-lbs-special-edition",
    "description": "Urethane-coated solid steel weight plates with auto-lock selector pin engineered for life. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 46388,
    "discount_price": 40821,
    "stock": 71,
    "sku": "SPRT-POW-699",
    "featured": false,
    "rating": 4.4,
    "review_count": 37,
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Rogue Fitness",
    "name": "Echo Bumper Plates V2 20kg Pair (Series II)",
    "slug": "rogue-fitness-echo-bumper-plates-v2-20kg-pair-series-ii",
    "description": "Durable Olympic rubber bumper plates with stainless steel hub inserts and low bounce. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 20460,
    "discount_price": null,
    "stock": 73,
    "sku": "SPRT-ROG-700",
    "featured": false,
    "rating": 4.6,
    "review_count": 59,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Rogue Fitness",
    "name": "The Ohio Barbell 20kg Black Zinc Shaft (Carbon Black)",
    "slug": "rogue-fitness-the-ohio-barbell-20kg-black-zinc-shaft-carbon-black",
    "description": "Precision machined 190,000 PSI tensile strength steel with dual knurl marks and bronze bushings. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 37620,
    "discount_price": 33106,
    "stock": 75,
    "sku": "SPRT-ROG-701",
    "featured": false,
    "rating": 4.8,
    "review_count": 81,
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "TRX",
    "name": "All-in-One Suspension Trainer Bodyweight System (Minimalist Edition)",
    "slug": "trx-all-in-one-suspension-trainer-bodyweight-system-minimalist-edition",
    "description": "Full-body suspension straps anchored to doors or rafters using bodyweight for resistance. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 14999,
    "discount_price": null,
    "stock": 77,
    "sku": "SPRT-TRX-702",
    "featured": false,
    "rating": 4.3,
    "review_count": 103,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Manduka",
    "name": "PRO Yoga Mat 6mm High-Density Cushioning (Midnight Blue)",
    "slug": "manduka-pro-yoga-mat-6mm-high-density-cushioning-midnight-blue",
    "description": "Lifetime guaranteed closed-cell natural rubber mat protecting joints with non-slip finish. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 11772,
    "discount_price": 10359,
    "stock": 79,
    "sku": "SPRT-MAN-703",
    "featured": false,
    "rating": 4.5,
    "review_count": 125,
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Lululemon",
    "name": "The Reversible Mat 5mm Grip Natural Rubber (Signature Series)",
    "slug": "lululemon-the-reversible-mat-5mm-grip-natural-rubber-signature-series",
    "description": "Polyurethane top layer absorbing sweat with antimicrobial additive preventing mold. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 7888,
    "discount_price": null,
    "stock": 81,
    "sku": "SPRT-LUL-704",
    "featured": false,
    "rating": 4.7,
    "review_count": 147,
    "images": [
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Theragun",
    "name": "PRO 5th Gen Percussive Therapy Massage Device (Classic Edition)",
    "slug": "theragun-pro-5th-gen-percussive-therapy-massage-device-classic-edition",
    "description": "Patented triangle multi-grip handle with 16mm amplitude reaching 60% deeper into muscle. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 61988,
    "discount_price": 54549,
    "stock": 83,
    "sku": "SPRT-THE-705",
    "featured": false,
    "rating": 4.2,
    "review_count": 169,
    "images": [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Theragun",
    "name": "Mini 2.0 Portable Percussion Massager Black (Studio Model)",
    "slug": "theragun-mini-20-portable-percussion-massager-black-studio-model",
    "description": "Pocket-sized powerhouse with 3 speed settings delivering on-the-go localized muscle relief. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 22427,
    "discount_price": null,
    "stock": 85,
    "sku": "SPRT-THE-706",
    "featured": false,
    "rating": 4.4,
    "review_count": 191,
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Hyperice",
    "name": "Hypervolt 2 Pro Deep Tissue Muscle Gun (Pro Edition)",
    "slug": "hyperice-hypervolt-2-pro-deep-tissue-muscle-gun-pro-edition",
    "description": "QuietGlide technology with 5 speed dial and Bluetooth connection to the Hyperice app. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 34990,
    "discount_price": 30791,
    "stock": 87,
    "sku": "SPRT-HYP-707",
    "featured": false,
    "rating": 4.6,
    "review_count": 213,
    "images": [
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "TriggerPoint",
    "name": "GRID Multi-Density Foam Roller 13 Inch (Plus)",
    "slug": "triggerpoint-grid-multi-density-foam-roller-13-inch-plus",
    "description": "Patented hollow-core design with multi-density foam mimicking a massage therapist hands. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 3779,
    "discount_price": null,
    "stock": 89,
    "sku": "SPRT-TRI-708",
    "featured": true,
    "rating": 4.8,
    "review_count": 235,
    "images": [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Nike",
    "name": "Vaporfly 3 Road Racing Shoes Electric Orange (Special Edition)",
    "slug": "nike-vaporfly-3-road-racing-shoes-electric-orange-special-edition",
    "description": "Full-length carbon fiber flyplate paired with Nike ZoomX foam for record-setting marathon speed. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 24006,
    "discount_price": 21125,
    "stock": 11,
    "sku": "SPRT-NIK-709",
    "featured": false,
    "rating": 4.3,
    "review_count": 257,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Nike",
    "name": "Alphafly 3 Marathon Road Racing Shoes White (Series II)",
    "slug": "nike-alphafly-3-marathon-road-racing-shoes-white-series-ii",
    "description": "Dual forefoot Air Zoom units with continuous ZoomX foam and Atomknit 3.0 breathable upper. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 29506,
    "discount_price": null,
    "stock": 13,
    "sku": "SPRT-NIK-710",
    "featured": false,
    "rating": 4.5,
    "review_count": 279,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Garmin",
    "name": "HRM-Pro Plus Dual Transmission Heart Rate Strap (Carbon Black)",
    "slug": "garmin-hrm-pro-plus-dual-transmission-heart-rate-strap-carbon-black",
    "description": "Captures advanced running dynamics and transmits heart rate data via ANT+ and Bluetooth. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 17147,
    "discount_price": 15089,
    "stock": 15,
    "sku": "SPRT-GAR-711",
    "featured": false,
    "rating": 4.7,
    "review_count": 301,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Concept2",
    "name": "RowErg Indoor Rowing Machine with PM5 Console (Minimalist Edition)",
    "slug": "concept2-rowerg-indoor-rowing-machine-with-pm5-console-minimalist-edition",
    "description": "Commercial gym standard flywheel damper providing smooth air-resistance full body exercise. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 115000,
    "discount_price": null,
    "stock": 17,
    "sku": "SPRT-CON-712",
    "featured": false,
    "rating": 4.2,
    "review_count": 323,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Hydro Flask",
    "name": "32 oz Wide Mouth with Flex Straw Cap Pacific (Midnight Blue)",
    "slug": "hydro-flask-32-oz-wide-mouth-with-flex-straw-cap-pacific-midnight-blue",
    "description": "TempShield double-wall vacuum insulation keeping drinks ice cold for 24 hours in pro-grade steel. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 4319,
    "discount_price": 3801,
    "stock": 19,
    "sku": "SPRT-HYD-713",
    "featured": false,
    "rating": 4.4,
    "review_count": 345,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Stanley",
    "name": "The Quencher H2.0 FlowState Tumbler 40 oz Cream (Signature Series)",
    "slug": "stanley-the-quencher-h20-flowstate-tumbler-40-oz-cream-signature-series",
    "description": "Recycled stainless steel tumbler with 3-position rotating lid and ergonomic comfort-grip handle. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 5219,
    "discount_price": null,
    "stock": 21,
    "sku": "SPRT-STA-714",
    "featured": false,
    "rating": 4.6,
    "review_count": 17,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Yeti",
    "name": "Rambler 26 oz Water Bottle with Chug Cap Navy (Classic Edition)",
    "slug": "yeti-rambler-26-oz-water-bottle-with-chug-cap-navy-classic-edition",
    "description": "DuraCoat color that won't crack or peel with 100% leakproof Shatter-resistant Chug spout. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 5331,
    "discount_price": 4691,
    "stock": 23,
    "sku": "SPRT-YET-715",
    "featured": false,
    "rating": 4.8,
    "review_count": 39,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "MSR",
    "name": "Hubba Hubba 2-Person Ultralight Backpacking Tent (Studio Model)",
    "slug": "msr-hubba-hubba-2-person-ultralight-backpacking-tent-studio-model",
    "description": "Easton Syclone poles with DuraShield waterproof coating weighing just 1.3kg packed. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 56747,
    "discount_price": null,
    "stock": 25,
    "sku": "SPRT-MSR-716",
    "featured": false,
    "rating": 4.3,
    "review_count": 61,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Osprey",
    "name": "Talon 22 Day Hiking Backpack Stealth Black (Pro Edition)",
    "slug": "osprey-talon-22-day-hiking-backpack-stealth-black-pro-edition",
    "description": "AirScape breathable backpanel with continuous-wrap hipbelt for dynamic technical hikes. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 13990,
    "discount_price": 12311,
    "stock": 27,
    "sku": "SPRT-OSP-717",
    "featured": false,
    "rating": 4.5,
    "review_count": 83,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Black Diamond",
    "name": "Storm 500-R Rechargeable Waterproof Headlamp (Plus)",
    "slug": "black-diamond-storm-500-r-rechargeable-waterproof-headlamp-plus",
    "description": "500 lumens of light with micro-optical faceted lens and IP67 submersible dust/waterproof housing. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 6479,
    "discount_price": null,
    "stock": 29,
    "sku": "SPRT-BLA-718",
    "featured": false,
    "rating": 4.7,
    "review_count": 105,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Bowflex",
    "name": "SelectTech 552 Adjustable Dumbbells Pair (Special Edition)",
    "slug": "bowflex-selecttech-552-adjustable-dumbbells-pair-special-edition",
    "description": "Replaces 15 sets of weights adjusting from 5 to 52.5 lbs with smooth dial selection. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 40588,
    "discount_price": 35717,
    "stock": 31,
    "sku": "SPRT-BOW-719",
    "featured": false,
    "rating": 4.2,
    "review_count": 127,
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Bowflex",
    "name": "SelectTech 840 Adjustable Kettlebell 8-40 lbs (Series II)",
    "slug": "bowflex-selecttech-840-adjustable-kettlebell-8-40-lbs-series-ii",
    "description": "6 weight settings in one space-efficient cast iron body for swings, presses, and snatches. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 23548,
    "discount_price": null,
    "stock": 33,
    "sku": "SPRT-BOW-720",
    "featured": false,
    "rating": 4.4,
    "review_count": 149,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "PowerBlock",
    "name": "Elite EXP Adjustable Dumbbell Set 5-50 lbs (Carbon Black)",
    "slug": "powerblock-elite-exp-adjustable-dumbbell-set-5-50-lbs-carbon-black",
    "description": "Urethane-coated solid steel weight plates with auto-lock selector pin engineered for life. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 52787,
    "discount_price": 46453,
    "stock": 35,
    "sku": "SPRT-POW-721",
    "featured": false,
    "rating": 4.6,
    "review_count": 171,
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Rogue Fitness",
    "name": "Echo Bumper Plates V2 20kg Pair (Minimalist Edition)",
    "slug": "rogue-fitness-echo-bumper-plates-v2-20kg-pair-minimalist-edition",
    "description": "Durable Olympic rubber bumper plates with stainless steel hub inserts and low bounce. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 16500,
    "discount_price": null,
    "stock": 37,
    "sku": "SPRT-ROG-722",
    "featured": false,
    "rating": 4.8,
    "review_count": 193,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Rogue Fitness",
    "name": "The Ohio Barbell 20kg Black Zinc Shaft (Midnight Blue)",
    "slug": "rogue-fitness-the-ohio-barbell-20kg-black-zinc-shaft-midnight-blue",
    "description": "Precision machined 190,000 PSI tensile strength steel with dual knurl marks and bronze bushings. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 30780,
    "discount_price": 27086,
    "stock": 39,
    "sku": "SPRT-ROG-723",
    "featured": true,
    "rating": 4.3,
    "review_count": 215,
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "TRX",
    "name": "All-in-One Suspension Trainer Bodyweight System (Signature Series)",
    "slug": "trx-all-in-one-suspension-trainer-bodyweight-system-signature-series",
    "description": "Full-body suspension straps anchored to doors or rafters using bodyweight for resistance. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 17399,
    "discount_price": null,
    "stock": 41,
    "sku": "SPRT-TRX-724",
    "featured": false,
    "rating": 4.5,
    "review_count": 237,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Manduka",
    "name": "PRO Yoga Mat 6mm High-Density Cushioning (Classic Edition)",
    "slug": "manduka-pro-yoga-mat-6mm-high-density-cushioning-classic-edition",
    "description": "Lifetime guaranteed closed-cell natural rubber mat protecting joints with non-slip finish. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 13516,
    "discount_price": 11894,
    "stock": 43,
    "sku": "SPRT-MAN-725",
    "featured": false,
    "rating": 4.7,
    "review_count": 259,
    "images": [
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Lululemon",
    "name": "The Reversible Mat 5mm Grip Natural Rubber (Studio Model)",
    "slug": "lululemon-the-reversible-mat-5mm-grip-natural-rubber-studio-model",
    "description": "Polyurethane top layer absorbing sweat with antimicrobial additive preventing mold. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 8976,
    "discount_price": null,
    "stock": 45,
    "sku": "SPRT-LUL-726",
    "featured": false,
    "rating": 4.2,
    "review_count": 281,
    "images": [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Theragun",
    "name": "PRO 5th Gen Percussive Therapy Massage Device (Pro Edition)",
    "slug": "theragun-pro-5th-gen-percussive-therapy-massage-device-pro-edition",
    "description": "Patented triangle multi-grip handle with 16mm amplitude reaching 60% deeper into muscle. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 49990,
    "discount_price": 43991,
    "stock": 47,
    "sku": "SPRT-THE-727",
    "featured": false,
    "rating": 4.4,
    "review_count": 303,
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Theragun",
    "name": "Mini 2.0 Portable Percussion Massager Black (Plus)",
    "slug": "theragun-mini-20-portable-percussion-massager-black-plus",
    "description": "Pocket-sized powerhouse with 3 speed settings delivering on-the-go localized muscle relief. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 18349,
    "discount_price": null,
    "stock": 49,
    "sku": "SPRT-THE-728",
    "featured": false,
    "rating": 4.6,
    "review_count": 325,
    "images": [
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Hyperice",
    "name": "Hypervolt 2 Pro Deep Tissue Muscle Gun (Special Edition)",
    "slug": "hyperice-hypervolt-2-pro-deep-tissue-muscle-gun-special-edition",
    "description": "QuietGlide technology with 5 speed dial and Bluetooth connection to the Hyperice app. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 40588,
    "discount_price": 35717,
    "stock": 51,
    "sku": "SPRT-HYP-729",
    "featured": false,
    "rating": 4.8,
    "review_count": 347,
    "images": [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "TriggerPoint",
    "name": "GRID Multi-Density Foam Roller 13 Inch (Series II)",
    "slug": "triggerpoint-grid-multi-density-foam-roller-13-inch-series-ii",
    "description": "Patented hollow-core design with multi-density foam mimicking a massage therapist hands. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 4339,
    "discount_price": null,
    "stock": 53,
    "sku": "SPRT-TRI-730",
    "featured": false,
    "rating": 4.3,
    "review_count": 19,
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Nike",
    "name": "Vaporfly 3 Road Racing Shoes Electric Orange (Carbon Black)",
    "slug": "nike-vaporfly-3-road-racing-shoes-electric-orange-carbon-black",
    "description": "Full-length carbon fiber flyplate paired with Nike ZoomX foam for record-setting marathon speed. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 27317,
    "discount_price": 24039,
    "stock": 55,
    "sku": "SPRT-NIK-731",
    "featured": false,
    "rating": 4.5,
    "review_count": 41,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Nike",
    "name": "Alphafly 3 Marathon Road Racing Shoes White (Minimalist Edition)",
    "slug": "nike-alphafly-3-marathon-road-racing-shoes-white-minimalist-edition",
    "description": "Dual forefoot Air Zoom units with continuous ZoomX foam and Atomknit 3.0 breathable upper. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 23795,
    "discount_price": null,
    "stock": 57,
    "sku": "SPRT-NIK-732",
    "featured": false,
    "rating": 4.7,
    "review_count": 63,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Garmin",
    "name": "HRM-Pro Plus Dual Transmission Heart Rate Strap (Midnight Blue)",
    "slug": "garmin-hrm-pro-plus-dual-transmission-heart-rate-strap-midnight-blue",
    "description": "Captures advanced running dynamics and transmits heart rate data via ANT+ and Bluetooth. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 14029,
    "discount_price": 12346,
    "stock": 59,
    "sku": "SPRT-GAR-733",
    "featured": false,
    "rating": 4.2,
    "review_count": 85,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Concept2",
    "name": "RowErg Indoor Rowing Machine with PM5 Console (Signature Series)",
    "slug": "concept2-rowerg-indoor-rowing-machine-with-pm5-console-signature-series",
    "description": "Commercial gym standard flywheel damper providing smooth air-resistance full body exercise. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 133400,
    "discount_price": null,
    "stock": 61,
    "sku": "SPRT-CON-734",
    "featured": false,
    "rating": 4.4,
    "review_count": 107,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Hydro Flask",
    "name": "32 oz Wide Mouth with Flex Straw Cap Pacific (Classic Edition)",
    "slug": "hydro-flask-32-oz-wide-mouth-with-flex-straw-cap-pacific-classic-edition",
    "description": "TempShield double-wall vacuum insulation keeping drinks ice cold for 24 hours in pro-grade steel. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 4959,
    "discount_price": 4364,
    "stock": 63,
    "sku": "SPRT-HYD-735",
    "featured": false,
    "rating": 4.6,
    "review_count": 129,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Stanley",
    "name": "The Quencher H2.0 FlowState Tumbler 40 oz Cream (Studio Model)",
    "slug": "stanley-the-quencher-h20-flowstate-tumbler-40-oz-cream-studio-model",
    "description": "Recycled stainless steel tumbler with 3-position rotating lid and ergonomic comfort-grip handle. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 5939,
    "discount_price": null,
    "stock": 65,
    "sku": "SPRT-STA-736",
    "featured": false,
    "rating": 4.8,
    "review_count": 151,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Yeti",
    "name": "Rambler 26 oz Water Bottle with Chug Cap Navy (Pro Edition)",
    "slug": "yeti-rambler-26-oz-water-bottle-with-chug-cap-navy-pro-edition",
    "description": "DuraCoat color that won't crack or peel with 100% leakproof Shatter-resistant Chug spout. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 4299,
    "discount_price": 3783,
    "stock": 67,
    "sku": "SPRT-YET-737",
    "featured": false,
    "rating": 4.3,
    "review_count": 173,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "MSR",
    "name": "Hubba Hubba 2-Person Ultralight Backpacking Tent (Plus)",
    "slug": "msr-hubba-hubba-2-person-ultralight-backpacking-tent-plus",
    "description": "Easton Syclone poles with DuraShield waterproof coating weighing just 1.3kg packed. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 46429,
    "discount_price": null,
    "stock": 69,
    "sku": "SPRT-MSR-738",
    "featured": true,
    "rating": 4.5,
    "review_count": 195,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Osprey",
    "name": "Talon 22 Day Hiking Backpack Stealth Black (Special Edition)",
    "slug": "osprey-talon-22-day-hiking-backpack-stealth-black-special-edition",
    "description": "AirScape breathable backpanel with continuous-wrap hipbelt for dynamic technical hikes. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 16228,
    "discount_price": 14281,
    "stock": 71,
    "sku": "SPRT-OSP-739",
    "featured": false,
    "rating": 4.7,
    "review_count": 217,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Black Diamond",
    "name": "Storm 500-R Rechargeable Waterproof Headlamp (Series II)",
    "slug": "black-diamond-storm-500-r-rechargeable-waterproof-headlamp-series-ii",
    "description": "500 lumens of light with micro-optical faceted lens and IP67 submersible dust/waterproof housing. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 7439,
    "discount_price": null,
    "stock": 73,
    "sku": "SPRT-BLA-740",
    "featured": false,
    "rating": 4.2,
    "review_count": 239,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Bowflex",
    "name": "SelectTech 552 Adjustable Dumbbells Pair (Carbon Black)",
    "slug": "bowflex-selecttech-552-adjustable-dumbbells-pair-carbon-black",
    "description": "Replaces 15 sets of weights adjusting from 5 to 52.5 lbs with smooth dial selection. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 46187,
    "discount_price": 40645,
    "stock": 75,
    "sku": "SPRT-BOW-741",
    "featured": false,
    "rating": 4.4,
    "review_count": 261,
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Bowflex",
    "name": "SelectTech 840 Adjustable Kettlebell 8-40 lbs (Minimalist Edition)",
    "slug": "bowflex-selecttech-840-adjustable-kettlebell-8-40-lbs-minimalist-edition",
    "description": "6 weight settings in one space-efficient cast iron body for swings, presses, and snatches. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 18990,
    "discount_price": null,
    "stock": 77,
    "sku": "SPRT-BOW-742",
    "featured": false,
    "rating": 4.6,
    "review_count": 283,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "PowerBlock",
    "name": "Elite EXP Adjustable Dumbbell Set 5-50 lbs (Midnight Blue)",
    "slug": "powerblock-elite-exp-adjustable-dumbbell-set-5-50-lbs-midnight-blue",
    "description": "Urethane-coated solid steel weight plates with auto-lock selector pin engineered for life. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 43189,
    "discount_price": 38006,
    "stock": 79,
    "sku": "SPRT-POW-743",
    "featured": false,
    "rating": 4.8,
    "review_count": 305,
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Rogue Fitness",
    "name": "Echo Bumper Plates V2 20kg Pair (Signature Series)",
    "slug": "rogue-fitness-echo-bumper-plates-v2-20kg-pair-signature-series",
    "description": "Durable Olympic rubber bumper plates with stainless steel hub inserts and low bounce. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 19140,
    "discount_price": null,
    "stock": 81,
    "sku": "SPRT-ROG-744",
    "featured": false,
    "rating": 4.3,
    "review_count": 327,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Rogue Fitness",
    "name": "The Ohio Barbell 20kg Black Zinc Shaft (Classic Edition)",
    "slug": "rogue-fitness-the-ohio-barbell-20kg-black-zinc-shaft-classic-edition",
    "description": "Precision machined 190,000 PSI tensile strength steel with dual knurl marks and bronze bushings. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 35340,
    "discount_price": 31099,
    "stock": 83,
    "sku": "SPRT-ROG-745",
    "featured": false,
    "rating": 4.5,
    "review_count": 349,
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "TRX",
    "name": "All-in-One Suspension Trainer Bodyweight System (Studio Model)",
    "slug": "trx-all-in-one-suspension-trainer-bodyweight-system-studio-model",
    "description": "Full-body suspension straps anchored to doors or rafters using bodyweight for resistance. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 19799,
    "discount_price": null,
    "stock": 85,
    "sku": "SPRT-TRX-746",
    "featured": false,
    "rating": 4.7,
    "review_count": 21,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Manduka",
    "name": "PRO Yoga Mat 6mm High-Density Cushioning (Pro Edition)",
    "slug": "manduka-pro-yoga-mat-6mm-high-density-cushioning-pro-edition",
    "description": "Lifetime guaranteed closed-cell natural rubber mat protecting joints with non-slip finish. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 10900,
    "discount_price": 9592,
    "stock": 87,
    "sku": "SPRT-MAN-747",
    "featured": false,
    "rating": 4.2,
    "review_count": 43,
    "images": [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Lululemon",
    "name": "The Reversible Mat 5mm Grip Natural Rubber (Plus)",
    "slug": "lululemon-the-reversible-mat-5mm-grip-natural-rubber-plus",
    "description": "Polyurethane top layer absorbing sweat with antimicrobial additive preventing mold. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 7344,
    "discount_price": null,
    "stock": 89,
    "sku": "SPRT-LUL-748",
    "featured": false,
    "rating": 4.4,
    "review_count": 65,
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Theragun",
    "name": "PRO 5th Gen Percussive Therapy Massage Device (Special Edition)",
    "slug": "theragun-pro-5th-gen-percussive-therapy-massage-device-special-edition",
    "description": "Patented triangle multi-grip handle with 16mm amplitude reaching 60% deeper into muscle. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 57988,
    "discount_price": 51029,
    "stock": 11,
    "sku": "SPRT-THE-749",
    "featured": false,
    "rating": 4.6,
    "review_count": 87,
    "images": [
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Theragun",
    "name": "Mini 2.0 Portable Percussion Massager Black (Series II)",
    "slug": "theragun-mini-20-portable-percussion-massager-black-series-ii",
    "description": "Pocket-sized powerhouse with 3 speed settings delivering on-the-go localized muscle relief. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 21068,
    "discount_price": null,
    "stock": 13,
    "sku": "SPRT-THE-750",
    "featured": false,
    "rating": 4.8,
    "review_count": 109,
    "images": [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Hyperice",
    "name": "Hypervolt 2 Pro Deep Tissue Muscle Gun (Carbon Black)",
    "slug": "hyperice-hypervolt-2-pro-deep-tissue-muscle-gun-carbon-black",
    "description": "QuietGlide technology with 5 speed dial and Bluetooth connection to the Hyperice app. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 46187,
    "discount_price": 40645,
    "stock": 15,
    "sku": "SPRT-HYP-751",
    "featured": false,
    "rating": 4.3,
    "review_count": 131,
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "TriggerPoint",
    "name": "GRID Multi-Density Foam Roller 13 Inch (Minimalist Edition)",
    "slug": "triggerpoint-grid-multi-density-foam-roller-13-inch-minimalist-edition",
    "description": "Patented hollow-core design with multi-density foam mimicking a massage therapist hands. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 3499,
    "discount_price": null,
    "stock": 17,
    "sku": "SPRT-TRI-752",
    "featured": false,
    "rating": 4.5,
    "review_count": 153,
    "images": [
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Nike",
    "name": "Vaporfly 3 Road Racing Shoes Electric Orange (Midnight Blue)",
    "slug": "nike-vaporfly-3-road-racing-shoes-electric-orange-midnight-blue",
    "description": "Full-length carbon fiber flyplate paired with Nike ZoomX foam for record-setting marathon speed. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 22351,
    "discount_price": 19669,
    "stock": 19,
    "sku": "SPRT-NIK-753",
    "featured": true,
    "rating": 4.7,
    "review_count": 175,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Nike",
    "name": "Alphafly 3 Marathon Road Racing Shoes White (Signature Series)",
    "slug": "nike-alphafly-3-marathon-road-racing-shoes-white-signature-series",
    "description": "Dual forefoot Air Zoom units with continuous ZoomX foam and Atomknit 3.0 breathable upper. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 27602,
    "discount_price": null,
    "stock": 21,
    "sku": "SPRT-NIK-754",
    "featured": false,
    "rating": 4.2,
    "review_count": 197,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Garmin",
    "name": "HRM-Pro Plus Dual Transmission Heart Rate Strap (Classic Edition)",
    "slug": "garmin-hrm-pro-plus-dual-transmission-heart-rate-strap-classic-edition",
    "description": "Captures advanced running dynamics and transmits heart rate data via ANT+ and Bluetooth. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 16108,
    "discount_price": 14175,
    "stock": 23,
    "sku": "SPRT-GAR-755",
    "featured": false,
    "rating": 4.4,
    "review_count": 219,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Concept2",
    "name": "RowErg Indoor Rowing Machine with PM5 Console (Studio Model)",
    "slug": "concept2-rowerg-indoor-rowing-machine-with-pm5-console-studio-model",
    "description": "Commercial gym standard flywheel damper providing smooth air-resistance full body exercise. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 151800,
    "discount_price": null,
    "stock": 25,
    "sku": "SPRT-CON-756",
    "featured": false,
    "rating": 4.6,
    "review_count": 241,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Hydro Flask",
    "name": "32 oz Wide Mouth with Flex Straw Cap Pacific (Pro Edition)",
    "slug": "hydro-flask-32-oz-wide-mouth-with-flex-straw-cap-pacific-pro-edition",
    "description": "TempShield double-wall vacuum insulation keeping drinks ice cold for 24 hours in pro-grade steel. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 3999,
    "discount_price": 3519,
    "stock": 27,
    "sku": "SPRT-HYD-757",
    "featured": false,
    "rating": 4.8,
    "review_count": 263,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Stanley",
    "name": "The Quencher H2.0 FlowState Tumbler 40 oz Cream (Plus)",
    "slug": "stanley-the-quencher-h20-flowstate-tumbler-40-oz-cream-plus",
    "description": "Recycled stainless steel tumbler with 3-position rotating lid and ergonomic comfort-grip handle. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 4859,
    "discount_price": null,
    "stock": 29,
    "sku": "SPRT-STA-758",
    "featured": false,
    "rating": 4.3,
    "review_count": 285,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "sports-fitness",
    "brand": "Yeti",
    "name": "Rambler 26 oz Water Bottle with Chug Cap Navy (Special Edition)",
    "slug": "yeti-rambler-26-oz-water-bottle-with-chug-cap-navy-special-edition",
    "description": "DuraCoat color that won't crack or peel with 100% leakproof Shatter-resistant Chug spout. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 4987,
    "discount_price": 4389,
    "stock": 31,
    "sku": "SPRT-YET-759",
    "featured": false,
    "rating": 4.5,
    "review_count": 307,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "O'Reilly",
    "name": "Designing Data-Intensive Applications",
    "slug": "oreilly-designing-data-intensive-applications",
    "description": "Martin Kleppmann's definitive architectural guide to distributed data, storage, and consensus.",
    "price": 1899,
    "discount_price": 1499,
    "stock": 22,
    "sku": "BOOK-ORE-760",
    "featured": false,
    "rating": 4.8,
    "review_count": 79,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Pearson",
    "name": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "slug": "pearson-clean-code-a-handbook-of-agile-software-craftsmanship",
    "description": "Robert C. Martin's foundational manifesto on software principles, naming, and refactoring.",
    "price": 1299,
    "discount_price": 999,
    "stock": 23,
    "sku": "BOOK-PEA-761",
    "featured": false,
    "rating": 4.3,
    "review_count": 98,
    "images": [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Addison-Wesley",
    "name": "The Pragmatic Programmer 20th Anniversary Edition",
    "slug": "addison-wesley-the-pragmatic-programmer-20th-anniversary-edition",
    "description": "David Thomas and Andrew Hunt explore timeless insights on software craftsmanship and career growth.",
    "price": 1799,
    "discount_price": 1399,
    "stock": 24,
    "sku": "BOOK-ADD-762",
    "featured": false,
    "rating": 4.4,
    "review_count": 117,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Addison-Wesley",
    "name": "Domain-Driven Design: Tackling Software Complexity",
    "slug": "addison-wesley-domain-driven-design-tackling-software-complexity",
    "description": "Eric Evans presents the core domain modeling principles that drive modern microservice architecture.",
    "price": 2199,
    "discount_price": 1799,
    "stock": 25,
    "sku": "BOOK-ADD-763",
    "featured": false,
    "rating": 4.5,
    "review_count": 136,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "ByteByteGo",
    "name": "System Design Interview – An Insider's Guide Volume 1",
    "slug": "bytebytego-system-design-interview-an-insiders-guide-volume-1",
    "description": "Alex Xu provides step-by-step visual frameworks for scaling real-world distributed architectures.",
    "price": 2499,
    "discount_price": 1999,
    "stock": 26,
    "sku": "BOOK-BYT-764",
    "featured": false,
    "rating": 4.6,
    "review_count": 155,
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "ByteByteGo",
    "name": "System Design Interview – An Insider's Guide Volume 2",
    "slug": "bytebytego-system-design-interview-an-insiders-guide-volume-2",
    "description": "Deep dive into specialized distributed architectures: digital payments, stock exchanges, and gaming.",
    "price": 2699,
    "discount_price": 2199,
    "stock": 27,
    "sku": "BOOK-BYT-765",
    "featured": false,
    "rating": 4.7,
    "review_count": 174,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "CareerCup",
    "name": "Cracking the Coding Interview 189 Programming Questions",
    "slug": "careercup-cracking-the-coding-interview-189-programming-questions",
    "description": "Gayle Laakmann McDowell's industry standard handbook for technical software engineering algorithms.",
    "price": 1499,
    "discount_price": 1199,
    "stock": 28,
    "sku": "BOOK-CAR-766",
    "featured": false,
    "rating": 4.8,
    "review_count": 193,
    "images": [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "John Wiley & Sons",
    "name": "HTML and CSS: Design and Build Websites",
    "slug": "john-wiley-sons-html-and-css-design-and-build-websites",
    "description": "Jon Duckett's visually stunning full-color guide introducing core front-end web markup.",
    "price": 1899,
    "discount_price": 1499,
    "stock": 29,
    "sku": "BOOK-JOH-767",
    "featured": true,
    "rating": 4.3,
    "review_count": 212,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Crown Business",
    "name": "Zero to One: Notes on Startups and Future",
    "slug": "crown-business-zero-to-one-notes-on-startups-and-future",
    "description": "Peter Thiel's contrarian manifesto on vertical progress, monopoly innovation, and technology.",
    "price": 499,
    "discount_price": 399,
    "stock": 30,
    "sku": "BOOK-CRO-768",
    "featured": false,
    "rating": 4.4,
    "review_count": 231,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Crown Business",
    "name": "The Lean Startup: Continuous Innovation",
    "slug": "crown-business-the-lean-startup-continuous-innovation",
    "description": "Eric Ries introduces validated learning, build-measure-learn loops, and MVP strategy.",
    "price": 599,
    "discount_price": 449,
    "stock": 31,
    "sku": "BOOK-CRO-769",
    "featured": false,
    "rating": 4.5,
    "review_count": 250,
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Simon & Schuster",
    "name": "Principles: Life and Work by Ray Dalio",
    "slug": "simon-schuster-principles-life-and-work-by-ray-dalio",
    "description": "Billionaire investor Ray Dalio outlines radical truth, radical transparency, and algorithmic management.",
    "price": 999,
    "discount_price": 799,
    "stock": 32,
    "sku": "BOOK-SIM-770",
    "featured": false,
    "rating": 4.6,
    "review_count": 269,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Scribner",
    "name": "Shoe Dog: A Memoir by the Creator of Nike",
    "slug": "scribner-shoe-dog-a-memoir-by-the-creator-of-nike",
    "description": "Phil Knight's candid, gripping origin story of building Nike from importing Japanese sneakers.",
    "price": 599,
    "discount_price": 449,
    "stock": 33,
    "sku": "BOOK-SCR-771",
    "featured": false,
    "rating": 4.7,
    "review_count": 288,
    "images": [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Harper Business",
    "name": "Good to Great: Why Some Companies Leap",
    "slug": "harper-business-good-to-great-why-some-companies-leap",
    "description": "Jim Collins examines Level 5 leadership, the Hedgehog Concept, and the corporate Flywheel Effect.",
    "price": 699,
    "discount_price": 549,
    "stock": 34,
    "sku": "BOOK-HAR-772",
    "featured": false,
    "rating": 4.8,
    "review_count": 307,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Harriman House",
    "name": "The Psychology of Money: Timeless Lessons",
    "slug": "harriman-house-the-psychology-of-money-timeless-lessons",
    "description": "Morgan Housel explores behavioral finance, ego, patience, and the psychology behind wealth.",
    "price": 450,
    "discount_price": 350,
    "stock": 35,
    "sku": "BOOK-HAR-773",
    "featured": false,
    "rating": 4.3,
    "review_count": 326,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Simon & Schuster",
    "name": "Steve Jobs by Walter Isaacson",
    "slug": "simon-schuster-steve-jobs-by-walter-isaacson",
    "description": "The definitive bestselling biography based on forty interviews with the Apple co-founder.",
    "price": 799,
    "discount_price": 599,
    "stock": 36,
    "sku": "BOOK-SIM-774",
    "featured": false,
    "rating": 4.4,
    "review_count": 345,
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Currency",
    "name": "Rework: Change the Way You Work Forever",
    "slug": "currency-rework-change-the-way-you-work-forever",
    "description": "Jason Fried and DHH reject traditional corporate bureaucracy in favor of lean execution.",
    "price": 650,
    "discount_price": 499,
    "stock": 37,
    "sku": "BOOK-CUR-775",
    "featured": false,
    "rating": 4.5,
    "review_count": 364,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Avery",
    "name": "Atomic Habits: Proven Way to Build Good Habits",
    "slug": "avery-atomic-habits-proven-way-to-build-good-habits",
    "description": "James Clear reveals how tiny 1% daily optimizations compound into life-altering personal transformations.",
    "price": 599,
    "discount_price": 450,
    "stock": 38,
    "sku": "BOOK-AVE-776",
    "featured": false,
    "rating": 4.6,
    "review_count": 383,
    "images": [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Grand Central",
    "name": "Deep Work: Rules for Focused Success",
    "slug": "grand-central-deep-work-rules-for-focused-success",
    "description": "Cal Newport explains why distraction-free focus is a superpower in our hyper-connected knowledge economy.",
    "price": 499,
    "discount_price": 399,
    "stock": 39,
    "sku": "BOOK-GRA-777",
    "featured": false,
    "rating": 4.7,
    "review_count": 402,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Farrar Straus",
    "name": "Thinking, Fast and Slow by Daniel Kahneman",
    "slug": "farrar-straus-thinking-fast-and-slow-by-daniel-kahneman",
    "description": "Nobel laureate Daniel Kahneman explains the two cognitive systems governing human decision making.",
    "price": 699,
    "discount_price": 549,
    "stock": 40,
    "sku": "BOOK-FAR-778",
    "featured": false,
    "rating": 4.8,
    "review_count": 21,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Crown Business",
    "name": "Essentialism: The Disciplined Pursuit of Less",
    "slug": "crown-business-essentialism-the-disciplined-pursuit-of-less",
    "description": "Greg McKeown outlines how to discern what is truly essential to stop feeling stretched thin.",
    "price": 550,
    "discount_price": 420,
    "stock": 41,
    "sku": "BOOK-CRO-779",
    "featured": true,
    "rating": 4.3,
    "review_count": 40,
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Penguin Classics",
    "name": "Meditations by Marcus Aurelius (Hays Translation)",
    "slug": "penguin-classics-meditations-by-marcus-aurelius-hays-translation",
    "description": "The private stoic diary of the Roman Emperor offering daily guidance on resilience and duty.",
    "price": 399,
    "discount_price": 299,
    "stock": 42,
    "sku": "BOOK-PEN-780",
    "featured": false,
    "rating": 4.4,
    "review_count": 59,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Beacon Press",
    "name": "Man's Search for Meaning by Viktor E. Frankl",
    "slug": "beacon-press-mans-search-for-meaning-by-viktor-e-frankl",
    "description": "Psychiatrist Viktor Frankl describes his concentration camp survival and the will to meaning.",
    "price": 350,
    "discount_price": 260,
    "stock": 43,
    "sku": "BOOK-BEA-781",
    "featured": false,
    "rating": 4.5,
    "review_count": 78,
    "images": [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Leuchtturm1917",
    "name": "Medium A5 Dotted Hardcover Notebook Black",
    "slug": "leuchtturm1917-medium-a5-dotted-hardcover-notebook-black",
    "description": "80 gsm ink-proof paper with 251 numbered pages, table of contents, and expandable gusset pocket.",
    "price": 1950,
    "discount_price": 1650,
    "stock": 44,
    "sku": "BOOK-LEU-782",
    "featured": false,
    "rating": 4.6,
    "review_count": 97,
    "images": [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Moleskine",
    "name": "Classic Hard Cover Ruled Notebook Large Sapphire",
    "slug": "moleskine-classic-hard-cover-ruled-notebook-large-sapphire",
    "description": "Rounded corners with bookmark ribbon, elastic band closure, and ivory acid-free 70 gsm sheets.",
    "price": 1850,
    "discount_price": 1550,
    "stock": 45,
    "sku": "BOOK-MOL-783",
    "featured": false,
    "rating": 4.7,
    "review_count": 116,
    "images": [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Rhodia",
    "name": "Webnotebook A5 Dot Grid Leatherette Orange",
    "slug": "rhodia-webnotebook-a5-dot-grid-leatherette-orange",
    "description": "90 gsm Clairefontaine vellum paper designed specifically for wet fountain pen fountain nibs.",
    "price": 2100,
    "discount_price": 1750,
    "stock": 46,
    "sku": "BOOK-RHO-784",
    "featured": false,
    "rating": 4.8,
    "review_count": 135,
    "images": [
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Lamy",
    "name": "Safari Fountain Pen Charcoal Black Fine Nib",
    "slug": "lamy-safari-fountain-pen-charcoal-black-fine-nib",
    "description": "Timeless sturdy ABS plastic casing with ergonomic recessed grip and flexible brass wire clip.",
    "price": 2950,
    "discount_price": 2490,
    "stock": 47,
    "sku": "BOOK-LAM-785",
    "featured": false,
    "rating": 4.3,
    "review_count": 154,
    "images": [
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Lamy",
    "name": "2000 Fiberglass & Brushed Steel Fountain Pen",
    "slug": "lamy-2000-fiberglass-brushed-steel-fountain-pen",
    "description": "Bauhaus design masterpiece crafted from seamless black Makrolon with 14K gold platinum-coated nib.",
    "price": 19500,
    "discount_price": 17500,
    "stock": 48,
    "sku": "BOOK-LAM-786",
    "featured": false,
    "rating": 4.4,
    "review_count": 173,
    "images": [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Pilot",
    "name": "Custom 823 Amber Demonstrator Fountain Pen",
    "slug": "pilot-custom-823-amber-demonstrator-fountain-pen",
    "description": "Vacuum-filler with huge ink capacity and legendary 14K gold size 15 smooth writing nib.",
    "price": 27900,
    "discount_price": 24900,
    "stock": 49,
    "sku": "BOOK-PIL-787",
    "featured": false,
    "rating": 4.5,
    "review_count": 192,
    "images": [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Pilot",
    "name": "Metropolitan Collection Fountain Pen Matte Black",
    "slug": "pilot-metropolitan-collection-fountain-pen-matte-black",
    "description": "Durable brass barrel with stainless steel accents and smooth-flowing Japanese steel nib.",
    "price": 1950,
    "discount_price": 1650,
    "stock": 50,
    "sku": "BOOK-PIL-788",
    "featured": false,
    "rating": 4.6,
    "review_count": 211,
    "images": [
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Midori",
    "name": "MD Notebook Cotton A5 Blank Grid Journal",
    "slug": "midori-md-notebook-cotton-a5-blank-grid-journal",
    "description": "20% cotton pulp paper made in Japan with exposed cheesecloth spine that lays completely flat.",
    "price": 1450,
    "discount_price": 1190,
    "stock": 51,
    "sku": "BOOK-MID-789",
    "featured": false,
    "rating": 4.7,
    "review_count": 230,
    "images": [
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "O'Reilly",
    "name": "Designing Data-Intensive Applications (Pro Edition)",
    "slug": "oreilly-designing-data-intensive-applications-pro-edition",
    "description": "Martin Kleppmann's definitive architectural guide to distributed data, storage, and consensus. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 1899,
    "discount_price": 1671,
    "stock": 80,
    "sku": "BOOK-ORE-790",
    "featured": false,
    "rating": 4.2,
    "review_count": 316,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Pearson",
    "name": "Clean Code: A Handbook of Agile Software Craftsmanship (Plus)",
    "slug": "pearson-clean-code-a-handbook-of-agile-software-craftsmanship-plus",
    "description": "Robert C. Martin's foundational manifesto on software principles, naming, and refactoring. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 1403,
    "discount_price": null,
    "stock": 82,
    "sku": "BOOK-PEA-791",
    "featured": false,
    "rating": 4.4,
    "review_count": 338,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Addison-Wesley",
    "name": "The Pragmatic Programmer 20th Anniversary Edition (Special Edition)",
    "slug": "addison-wesley-the-pragmatic-programmer-20th-anniversary-edition-special-edition",
    "description": "David Thomas and Andrew Hunt explore timeless insights on software craftsmanship and career growth. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 2087,
    "discount_price": 1837,
    "stock": 84,
    "sku": "BOOK-ADD-792",
    "featured": true,
    "rating": 4.6,
    "review_count": 360,
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Addison-Wesley",
    "name": "Domain-Driven Design: Tackling Software Complexity (Series II)",
    "slug": "addison-wesley-domain-driven-design-tackling-software-complexity-series-ii",
    "description": "Eric Evans presents the core domain modeling principles that drive modern microservice architecture. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 2727,
    "discount_price": null,
    "stock": 86,
    "sku": "BOOK-ADD-793",
    "featured": false,
    "rating": 4.8,
    "review_count": 32,
    "images": [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "ByteByteGo",
    "name": "System Design Interview – An Insider's Guide Volume 1 (Carbon Black)",
    "slug": "bytebytego-system-design-interview-an-insiders-guide-volume-1-carbon-black",
    "description": "Alex Xu provides step-by-step visual frameworks for scaling real-world distributed architectures. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 3299,
    "discount_price": 2903,
    "stock": 88,
    "sku": "BOOK-BYT-794",
    "featured": false,
    "rating": 4.3,
    "review_count": 54,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "ByteByteGo",
    "name": "System Design Interview – An Insider's Guide Volume 2 (Minimalist Edition)",
    "slug": "bytebytego-system-design-interview-an-insiders-guide-volume-2-minimalist-edition",
    "description": "Deep dive into specialized distributed architectures: digital payments, stock exchanges, and gaming. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 2699,
    "discount_price": null,
    "stock": 10,
    "sku": "BOOK-BYT-795",
    "featured": false,
    "rating": 4.5,
    "review_count": 76,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "CareerCup",
    "name": "Cracking the Coding Interview 189 Programming Questions (Midnight Blue)",
    "slug": "careercup-cracking-the-coding-interview-189-programming-questions-midnight-blue",
    "description": "Gayle Laakmann McDowell's industry standard handbook for technical software engineering algorithms. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 1619,
    "discount_price": 1425,
    "stock": 12,
    "sku": "BOOK-CAR-796",
    "featured": false,
    "rating": 4.7,
    "review_count": 98,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "John Wiley & Sons",
    "name": "HTML and CSS: Design and Build Websites (Signature Series)",
    "slug": "john-wiley-sons-html-and-css-design-and-build-websites-signature-series",
    "description": "Jon Duckett's visually stunning full-color guide introducing core front-end web markup. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 2203,
    "discount_price": null,
    "stock": 14,
    "sku": "BOOK-JOH-797",
    "featured": false,
    "rating": 4.2,
    "review_count": 120,
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Crown Business",
    "name": "Zero to One: Notes on Startups and Future (Classic Edition)",
    "slug": "crown-business-zero-to-one-notes-on-startups-and-future-classic-edition",
    "description": "Peter Thiel's contrarian manifesto on vertical progress, monopoly innovation, and technology. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 619,
    "discount_price": 545,
    "stock": 16,
    "sku": "BOOK-CRO-798",
    "featured": false,
    "rating": 4.4,
    "review_count": 142,
    "images": [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Crown Business",
    "name": "The Lean Startup: Continuous Innovation (Studio Model)",
    "slug": "crown-business-the-lean-startup-continuous-innovation-studio-model",
    "description": "Eric Ries introduces validated learning, build-measure-learn loops, and MVP strategy. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 791,
    "discount_price": null,
    "stock": 18,
    "sku": "BOOK-CRO-799",
    "featured": false,
    "rating": 4.6,
    "review_count": 164,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Simon & Schuster",
    "name": "Principles: Life and Work by Ray Dalio (Pro Edition)",
    "slug": "simon-schuster-principles-life-and-work-by-ray-dalio-pro-edition",
    "description": "Billionaire investor Ray Dalio outlines radical truth, radical transparency, and algorithmic management. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 999,
    "discount_price": 879,
    "stock": 20,
    "sku": "BOOK-SIM-800",
    "featured": false,
    "rating": 4.8,
    "review_count": 186,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Scribner",
    "name": "Shoe Dog: A Memoir by the Creator of Nike (Plus)",
    "slug": "scribner-shoe-dog-a-memoir-by-the-creator-of-nike-plus",
    "description": "Phil Knight's candid, gripping origin story of building Nike from importing Japanese sneakers. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 647,
    "discount_price": null,
    "stock": 22,
    "sku": "BOOK-SCR-801",
    "featured": false,
    "rating": 4.3,
    "review_count": 208,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Harper Business",
    "name": "Good to Great: Why Some Companies Leap (Special Edition)",
    "slug": "harper-business-good-to-great-why-some-companies-leap-special-edition",
    "description": "Jim Collins examines Level 5 leadership, the Hedgehog Concept, and the corporate Flywheel Effect. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 811,
    "discount_price": 714,
    "stock": 24,
    "sku": "BOOK-HAR-802",
    "featured": false,
    "rating": 4.5,
    "review_count": 230,
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Harriman House",
    "name": "The Psychology of Money: Timeless Lessons (Series II)",
    "slug": "harriman-house-the-psychology-of-money-timeless-lessons-series-ii",
    "description": "Morgan Housel explores behavioral finance, ego, patience, and the psychology behind wealth. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 558,
    "discount_price": null,
    "stock": 26,
    "sku": "BOOK-HAR-803",
    "featured": false,
    "rating": 4.7,
    "review_count": 252,
    "images": [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Simon & Schuster",
    "name": "Steve Jobs by Walter Isaacson (Carbon Black)",
    "slug": "simon-schuster-steve-jobs-by-walter-isaacson-carbon-black",
    "description": "The definitive bestselling biography based on forty interviews with the Apple co-founder. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 1055,
    "discount_price": 928,
    "stock": 28,
    "sku": "BOOK-SIM-804",
    "featured": false,
    "rating": 4.2,
    "review_count": 274,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Currency",
    "name": "Rework: Change the Way You Work Forever (Minimalist Edition)",
    "slug": "currency-rework-change-the-way-you-work-forever-minimalist-edition",
    "description": "Jason Fried and DHH reject traditional corporate bureaucracy in favor of lean execution. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 650,
    "discount_price": null,
    "stock": 30,
    "sku": "BOOK-CUR-805",
    "featured": false,
    "rating": 4.4,
    "review_count": 296,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Avery",
    "name": "Atomic Habits: Proven Way to Build Good Habits (Midnight Blue)",
    "slug": "avery-atomic-habits-proven-way-to-build-good-habits-midnight-blue",
    "description": "James Clear reveals how tiny 1% daily optimizations compound into life-altering personal transformations. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 647,
    "discount_price": 569,
    "stock": 32,
    "sku": "BOOK-AVE-806",
    "featured": false,
    "rating": 4.6,
    "review_count": 318,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Grand Central",
    "name": "Deep Work: Rules for Focused Success (Signature Series)",
    "slug": "grand-central-deep-work-rules-for-focused-success-signature-series",
    "description": "Cal Newport explains why distraction-free focus is a superpower in our hyper-connected knowledge economy. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 579,
    "discount_price": null,
    "stock": 34,
    "sku": "BOOK-GRA-807",
    "featured": true,
    "rating": 4.8,
    "review_count": 340,
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Farrar Straus",
    "name": "Thinking, Fast and Slow by Daniel Kahneman (Classic Edition)",
    "slug": "farrar-straus-thinking-fast-and-slow-by-daniel-kahneman-classic-edition",
    "description": "Nobel laureate Daniel Kahneman explains the two cognitive systems governing human decision making. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 867,
    "discount_price": 763,
    "stock": 36,
    "sku": "BOOK-FAR-808",
    "featured": false,
    "rating": 4.3,
    "review_count": 362,
    "images": [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Crown Business",
    "name": "Essentialism: The Disciplined Pursuit of Less (Studio Model)",
    "slug": "crown-business-essentialism-the-disciplined-pursuit-of-less-studio-model",
    "description": "Greg McKeown outlines how to discern what is truly essential to stop feeling stretched thin. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 726,
    "discount_price": null,
    "stock": 38,
    "sku": "BOOK-CRO-809",
    "featured": false,
    "rating": 4.5,
    "review_count": 34,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Penguin Classics",
    "name": "Meditations by Marcus Aurelius (Hays Translation) (Pro Edition)",
    "slug": "penguin-classics-meditations-by-marcus-aurelius-hays-translation-pro-edition",
    "description": "The private stoic diary of the Roman Emperor offering daily guidance on resilience and duty. Featuring enhanced pro edition tuning, premium finishes, and guaranteed performance.",
    "price": 399,
    "discount_price": 351,
    "stock": 40,
    "sku": "BOOK-PEN-810",
    "featured": false,
    "rating": 4.7,
    "review_count": 56,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Beacon Press",
    "name": "Man's Search for Meaning by Viktor E. Frankl (Plus)",
    "slug": "beacon-press-mans-search-for-meaning-by-viktor-e-frankl-plus",
    "description": "Psychiatrist Viktor Frankl describes his concentration camp survival and the will to meaning. Featuring enhanced plus tuning, premium finishes, and guaranteed performance.",
    "price": 378,
    "discount_price": null,
    "stock": 42,
    "sku": "BOOK-BEA-811",
    "featured": false,
    "rating": 4.2,
    "review_count": 78,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Leuchtturm1917",
    "name": "Medium A5 Dotted Hardcover Notebook Black (Special Edition)",
    "slug": "leuchtturm1917-medium-a5-dotted-hardcover-notebook-black-special-edition",
    "description": "80 gsm ink-proof paper with 251 numbered pages, table of contents, and expandable gusset pocket. Featuring enhanced special edition tuning, premium finishes, and guaranteed performance.",
    "price": 2262,
    "discount_price": 1991,
    "stock": 44,
    "sku": "BOOK-LEU-812",
    "featured": false,
    "rating": 4.4,
    "review_count": 100,
    "images": [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Moleskine",
    "name": "Classic Hard Cover Ruled Notebook Large Sapphire (Series II)",
    "slug": "moleskine-classic-hard-cover-ruled-notebook-large-sapphire-series-ii",
    "description": "Rounded corners with bookmark ribbon, elastic band closure, and ivory acid-free 70 gsm sheets. Featuring enhanced series ii tuning, premium finishes, and guaranteed performance.",
    "price": 2294,
    "discount_price": null,
    "stock": 46,
    "sku": "BOOK-MOL-813",
    "featured": false,
    "rating": 4.6,
    "review_count": 122,
    "images": [
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Rhodia",
    "name": "Webnotebook A5 Dot Grid Leatherette Orange (Carbon Black)",
    "slug": "rhodia-webnotebook-a5-dot-grid-leatherette-orange-carbon-black",
    "description": "90 gsm Clairefontaine vellum paper designed specifically for wet fountain pen fountain nibs. Featuring enhanced carbon black tuning, premium finishes, and guaranteed performance.",
    "price": 2772,
    "discount_price": 2439,
    "stock": 48,
    "sku": "BOOK-RHO-814",
    "featured": false,
    "rating": 4.8,
    "review_count": 144,
    "images": [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Lamy",
    "name": "Safari Fountain Pen Charcoal Black Fine Nib (Minimalist Edition)",
    "slug": "lamy-safari-fountain-pen-charcoal-black-fine-nib-minimalist-edition",
    "description": "Timeless sturdy ABS plastic casing with ergonomic recessed grip and flexible brass wire clip. Featuring enhanced minimalist edition tuning, premium finishes, and guaranteed performance.",
    "price": 2950,
    "discount_price": null,
    "stock": 50,
    "sku": "BOOK-LAM-815",
    "featured": false,
    "rating": 4.3,
    "review_count": 166,
    "images": [
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Lamy",
    "name": "2000 Fiberglass & Brushed Steel Fountain Pen (Midnight Blue)",
    "slug": "lamy-2000-fiberglass-brushed-steel-fountain-pen-midnight-blue",
    "description": "Bauhaus design masterpiece crafted from seamless black Makrolon with 14K gold platinum-coated nib. Featuring enhanced midnight blue tuning, premium finishes, and guaranteed performance.",
    "price": 21060,
    "discount_price": 18533,
    "stock": 52,
    "sku": "BOOK-LAM-816",
    "featured": false,
    "rating": 4.5,
    "review_count": 188,
    "images": [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Pilot",
    "name": "Custom 823 Amber Demonstrator Fountain Pen (Signature Series)",
    "slug": "pilot-custom-823-amber-demonstrator-fountain-pen-signature-series",
    "description": "Vacuum-filler with huge ink capacity and legendary 14K gold size 15 smooth writing nib. Featuring enhanced signature series tuning, premium finishes, and guaranteed performance.",
    "price": 32364,
    "discount_price": null,
    "stock": 54,
    "sku": "BOOK-PIL-817",
    "featured": false,
    "rating": 4.7,
    "review_count": 210,
    "images": [
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Pilot",
    "name": "Metropolitan Collection Fountain Pen Matte Black (Classic Edition)",
    "slug": "pilot-metropolitan-collection-fountain-pen-matte-black-classic-edition",
    "description": "Durable brass barrel with stainless steel accents and smooth-flowing Japanese steel nib. Featuring enhanced classic edition tuning, premium finishes, and guaranteed performance.",
    "price": 2418,
    "discount_price": 2128,
    "stock": 56,
    "sku": "BOOK-PIL-818",
    "featured": false,
    "rating": 4.2,
    "review_count": 232,
    "images": [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Midori",
    "name": "MD Notebook Cotton A5 Blank Grid Journal (Studio Model)",
    "slug": "midori-md-notebook-cotton-a5-blank-grid-journal-studio-model",
    "description": "20% cotton pulp paper made in Japan with exposed cheesecloth spine that lays completely flat. Featuring enhanced studio model tuning, premium finishes, and guaranteed performance.",
    "price": 1914,
    "discount_price": null,
    "stock": 58,
    "sku": "BOOK-MID-819",
    "featured": false,
    "rating": 4.4,
    "review_count": 254,
    "images": [
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "O'Reilly",
    "name": "Designing Data-Intensive Applications (Deluxe Hardcover Edition)",
    "slug": "oreilly-designing-data-intensive-applications-deluxe-hardcover-edition",
    "description": "Martin Kleppmann's definitive architectural guide to distributed data, storage, and consensus. Special release printed in deluxe hardcover edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 1899,
    "discount_price": 1671,
    "stock": 60,
    "sku": "BOOK-ORE-820",
    "featured": false,
    "rating": 4.6,
    "review_count": 276,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Pearson",
    "name": "Clean Code: A Handbook of Agile Software Craftsmanship (Collector Leatherbound Edition)",
    "slug": "pearson-clean-code-a-handbook-of-agile-software-craftsmanship-collector-leatherbound-edition",
    "description": "Robert C. Martin's foundational manifesto on software principles, naming, and refactoring. Special release printed in collector leatherbound edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 1403,
    "discount_price": null,
    "stock": 62,
    "sku": "BOOK-PEA-821",
    "featured": false,
    "rating": 4.8,
    "review_count": 298,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Addison-Wesley",
    "name": "The Pragmatic Programmer 20th Anniversary Edition (Anniversary Boxed Set)",
    "slug": "addison-wesley-the-pragmatic-programmer-20th-anniversary-edition-anniversary-boxed-set",
    "description": "David Thomas and Andrew Hunt explore timeless insights on software craftsmanship and career growth. Special release printed in anniversary boxed set with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 2087,
    "discount_price": 1837,
    "stock": 64,
    "sku": "BOOK-ADD-822",
    "featured": true,
    "rating": 4.3,
    "review_count": 320,
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Addison-Wesley",
    "name": "Domain-Driven Design: Tackling Software Complexity (Annotated Student Edition)",
    "slug": "addison-wesley-domain-driven-design-tackling-software-complexity-annotated-student-edition",
    "description": "Eric Evans presents the core domain modeling principles that drive modern microservice architecture. Special release printed in annotated student edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 2727,
    "discount_price": null,
    "stock": 66,
    "sku": "BOOK-ADD-823",
    "featured": false,
    "rating": 4.5,
    "review_count": 342,
    "images": [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "ByteByteGo",
    "name": "System Design Interview – An Insider's Guide Volume 1 (Executive Desk Reference)",
    "slug": "bytebytego-system-design-interview-an-insiders-guide-volume-1-executive-desk-reference",
    "description": "Alex Xu provides step-by-step visual frameworks for scaling real-world distributed architectures. Special release printed in executive desk reference with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 3299,
    "discount_price": 2903,
    "stock": 68,
    "sku": "BOOK-BYT-824",
    "featured": false,
    "rating": 4.7,
    "review_count": 364,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "ByteByteGo",
    "name": "System Design Interview – An Insider's Guide Volume 2 (International Paperback Edition)",
    "slug": "bytebytego-system-design-interview-an-insiders-guide-volume-2-international-paperback-edition",
    "description": "Deep dive into specialized distributed architectures: digital payments, stock exchanges, and gaming. Special release printed in international paperback edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 2699,
    "discount_price": null,
    "stock": 70,
    "sku": "BOOK-BYT-825",
    "featured": false,
    "rating": 4.2,
    "review_count": 36,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "CareerCup",
    "name": "Cracking the Coding Interview 189 Programming Questions (Companion Workbook Edition)",
    "slug": "careercup-cracking-the-coding-interview-189-programming-questions-companion-workbook-edition",
    "description": "Gayle Laakmann McDowell's industry standard handbook for technical software engineering algorithms. Special release printed in companion workbook edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 1619,
    "discount_price": 1425,
    "stock": 72,
    "sku": "BOOK-CAR-826",
    "featured": false,
    "rating": 4.4,
    "review_count": 58,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "John Wiley & Sons",
    "name": "HTML and CSS: Design and Build Websites (Gift Edition in Slipcase)",
    "slug": "john-wiley-sons-html-and-css-design-and-build-websites-gift-edition-in-slipcase",
    "description": "Jon Duckett's visually stunning full-color guide introducing core front-end web markup. Special release printed in gift edition in slipcase with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 2203,
    "discount_price": null,
    "stock": 74,
    "sku": "BOOK-JOH-827",
    "featured": false,
    "rating": 4.6,
    "review_count": 80,
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Crown Business",
    "name": "Zero to One: Notes on Startups and Future (Archival Quality Print)",
    "slug": "crown-business-zero-to-one-notes-on-startups-and-future-archival-quality-print",
    "description": "Peter Thiel's contrarian manifesto on vertical progress, monopoly innovation, and technology. Special release printed in archival quality print with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 619,
    "discount_price": 545,
    "stock": 76,
    "sku": "BOOK-CRO-828",
    "featured": false,
    "rating": 4.8,
    "review_count": 102,
    "images": [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Crown Business",
    "name": "The Lean Startup: Continuous Innovation (Special Author Signed Edition)",
    "slug": "crown-business-the-lean-startup-continuous-innovation-special-author-signed-edition",
    "description": "Eric Ries introduces validated learning, build-measure-learn loops, and MVP strategy. Special release printed in special author signed edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 791,
    "discount_price": null,
    "stock": 78,
    "sku": "BOOK-CRO-829",
    "featured": false,
    "rating": 4.3,
    "review_count": 124,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Simon & Schuster",
    "name": "Principles: Life and Work by Ray Dalio (Expanded 2nd Edition)",
    "slug": "simon-schuster-principles-life-and-work-by-ray-dalio-expanded-2nd-edition",
    "description": "Billionaire investor Ray Dalio outlines radical truth, radical transparency, and algorithmic management. Special release printed in expanded 2nd edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 999,
    "discount_price": 879,
    "stock": 80,
    "sku": "BOOK-SIM-830",
    "featured": false,
    "rating": 4.5,
    "review_count": 146,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Scribner",
    "name": "Shoe Dog: A Memoir by the Creator of Nike (Fine Paper Edition)",
    "slug": "scribner-shoe-dog-a-memoir-by-the-creator-of-nike-fine-paper-edition",
    "description": "Phil Knight's candid, gripping origin story of building Nike from importing Japanese sneakers. Special release printed in fine paper edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 647,
    "discount_price": null,
    "stock": 82,
    "sku": "BOOK-SCR-831",
    "featured": false,
    "rating": 4.7,
    "review_count": 168,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Harper Business",
    "name": "Good to Great: Why Some Companies Leap (Academic Reference Edition)",
    "slug": "harper-business-good-to-great-why-some-companies-leap-academic-reference-edition",
    "description": "Jim Collins examines Level 5 leadership, the Hedgehog Concept, and the corporate Flywheel Effect. Special release printed in academic reference edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 811,
    "discount_price": 714,
    "stock": 84,
    "sku": "BOOK-HAR-832",
    "featured": false,
    "rating": 4.2,
    "review_count": 190,
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Harriman House",
    "name": "The Psychology of Money: Timeless Lessons (Centennial Illustrated Edition)",
    "slug": "harriman-house-the-psychology-of-money-timeless-lessons-centennial-illustrated-edition",
    "description": "Morgan Housel explores behavioral finance, ego, patience, and the psychology behind wealth. Special release printed in centennial illustrated edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 558,
    "discount_price": null,
    "stock": 86,
    "sku": "BOOK-HAR-833",
    "featured": false,
    "rating": 4.4,
    "review_count": 212,
    "images": [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Simon & Schuster",
    "name": "Steve Jobs by Walter Isaacson (Library Binding Edition)",
    "slug": "simon-schuster-steve-jobs-by-walter-isaacson-library-binding-edition",
    "description": "The definitive bestselling biography based on forty interviews with the Apple co-founder. Special release printed in library binding edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 1055,
    "discount_price": 928,
    "stock": 88,
    "sku": "BOOK-SIM-834",
    "featured": false,
    "rating": 4.6,
    "review_count": 234,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Currency",
    "name": "Rework: Change the Way You Work Forever (Commemorative Edition)",
    "slug": "currency-rework-change-the-way-you-work-forever-commemorative-edition",
    "description": "Jason Fried and DHH reject traditional corporate bureaucracy in favor of lean execution. Special release printed in commemorative edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 650,
    "discount_price": null,
    "stock": 10,
    "sku": "BOOK-CUR-835",
    "featured": false,
    "rating": 4.8,
    "review_count": 256,
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Avery",
    "name": "Atomic Habits: Proven Way to Build Good Habits (Compact Travel Edition)",
    "slug": "avery-atomic-habits-proven-way-to-build-good-habits-compact-travel-edition",
    "description": "James Clear reveals how tiny 1% daily optimizations compound into life-altering personal transformations. Special release printed in compact travel edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 647,
    "discount_price": 569,
    "stock": 12,
    "sku": "BOOK-AVE-836",
    "featured": false,
    "rating": 4.3,
    "review_count": 278,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Grand Central",
    "name": "Deep Work: Rules for Focused Success (Unabridged Audio Companion Edition)",
    "slug": "grand-central-deep-work-rules-for-focused-success-unabridged-audio-companion-edition",
    "description": "Cal Newport explains why distraction-free focus is a superpower in our hyper-connected knowledge economy. Special release printed in unabridged audio companion edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 579,
    "discount_price": null,
    "stock": 14,
    "sku": "BOOK-GRA-837",
    "featured": true,
    "rating": 4.5,
    "review_count": 300,
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Farrar Straus",
    "name": "Thinking, Fast and Slow by Daniel Kahneman (Limited Numbered Edition)",
    "slug": "farrar-straus-thinking-fast-and-slow-by-daniel-kahneman-limited-numbered-edition",
    "description": "Nobel laureate Daniel Kahneman explains the two cognitive systems governing human decision making. Special release printed in limited numbered edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 867,
    "discount_price": 763,
    "stock": 16,
    "sku": "BOOK-FAR-838",
    "featured": false,
    "rating": 4.7,
    "review_count": 322,
    "images": [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "category": "books",
    "brand": "Crown Business",
    "name": "Essentialism: The Disciplined Pursuit of Less (Definitive Master Edition)",
    "slug": "crown-business-essentialism-the-disciplined-pursuit-of-less-definitive-master-edition",
    "description": "Greg McKeown outlines how to discern what is truly essential to stop feeling stretched thin. Special release printed in definitive master edition with archival quality paper, ribbon marker, and comprehensive supplementary index.",
    "price": 726,
    "discount_price": null,
    "stock": 18,
    "sku": "BOOK-CRO-839",
    "featured": false,
    "rating": 4.2,
    "review_count": 344,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ]
  }
];

const DEMO_COUPONS = [
  {
    "code": "WELCOME10",
    "discount_type": "percentage",
    "discount_value": 10,
    "min_order_amount": 1500,
    "max_discount": 500,
    "usage_limit": 100,
    "is_active": true
  },
  {
    "code": "SAVE200",
    "discount_type": "fixed",
    "discount_value": 200,
    "min_order_amount": 2500,
    "usage_limit": 50,
    "is_active": true
  },
  {
    "code": "SAVE20",
    "discount_type": "fixed",
    "discount_value": 200,
    "min_order_amount": 2500,
    "usage_limit": 50,
    "is_active": true
  },
  {
    "code": "VIP50",
    "discount_type": "percentage",
    "discount_value": 50,
    "min_order_amount": 5000,
    "max_discount": 2000,
    "usage_limit": 10,
    "is_active": true
  }
];

module.exports = { CATEGORIES, PRODUCTS_DATA, DEMO_COUPONS };
