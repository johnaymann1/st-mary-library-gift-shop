import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample data
const categories = [
  {
    name_en: 'Birthday Gifts',
    name_ar: 'هدايا أعياد الميلاد',
    image_url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800',
    is_active: true
  },
  {
    name_en: 'Anniversary Gifts',
    name_ar: 'هدايا الذكرى السنوية',
    image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800',
    is_active: true
  },
  {
    name_en: 'Flowers & Bouquets',
    name_ar: 'الزهور والباقات',
    image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
    is_active: true
  },
  {
    name_en: 'Chocolates & Sweets',
    name_ar: 'الشوكولاتة والحلويات',
    image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800',
    is_active: true
  },
  {
    name_en: 'Luxury Items',
    name_ar: 'المنتجات الفاخرة',
    image_url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800',
    is_active: true
  },
  {
    name_en: 'Books & Stationery',
    name_ar: 'الكتب والقرطاسية',
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    is_active: true
  },
  {
    name_en: 'Toys & Games',
    name_ar: 'الألعاب والمسليات',
    image_url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800',
    is_active: true
  },
  {
    name_en: 'Home Decor',
    name_ar: 'ديكور المنزل',
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
    is_active: true
  }
]

const products = [
  // Birthday Gifts
  { name_en: 'Happy Birthday Balloon Bundle', name_ar: 'حزمة بالونات عيد ميلاد سعيد', desc_en: 'Colorful balloon arrangement with happy birthday message', desc_ar: 'ترتيب بالونات ملون مع رسالة عيد ميلاد سعيد', price: 150.00, in_stock: true, category_index: 0 },
  { name_en: 'Birthday Cake with Candles', name_ar: 'كعكة عيد ميلاد مع شموع', desc_en: 'Delicious chocolate cake perfect for celebrations', desc_ar: 'كعكة شوكولاتة لذيذة مثالية للاحتفالات', price: 350.00, in_stock: true, category_index: 0 },
  { name_en: 'Premium Gift Box Set', name_ar: 'طقم صندوق هدايا فاخر', desc_en: 'Luxury gift box with assorted treats and surprises', desc_ar: 'صندوق هدايا فاخر مع مجموعة متنوعة من المفاجآت', price: 500.00, in_stock: true, category_index: 0 },
  { name_en: 'Personalized Photo Album', name_ar: 'ألبوم صور مخصص', desc_en: 'Beautiful photo album with custom name engraving', desc_ar: 'ألبوم صور جميل مع نقش اسم مخصص', price: 250.00, in_stock: true, category_index: 0 },

  // Anniversary Gifts
  { name_en: 'Rose Gold Watch Set', name_ar: 'طقم ساعات ذهبية وردية', desc_en: 'Elegant matching watches for couples', desc_ar: 'ساعات أنيقة متطابقة للأزواج', price: 1200.00, in_stock: true, category_index: 1 },
  { name_en: 'Anniversary Memory Box', name_ar: 'صندوق ذكريات الذكرى السنوية', desc_en: 'Handcrafted wooden box for keeping precious memories', desc_ar: 'صندوق خشبي مصنوع يدويًا للاحتفاظ بالذكريات الثمينة', price: 300.00, in_stock: true, category_index: 1 },
  { name_en: 'Luxury Perfume Duo', name_ar: 'ثنائي العطور الفاخرة', desc_en: 'Premium his and hers fragrance set', desc_ar: 'طقم عطور فاخر للرجال والنساء', price: 850.00, in_stock: true, category_index: 1 },
  { name_en: 'Crystal Heart Decoration', name_ar: 'زينة قلب كريستال', desc_en: 'Beautiful crystal heart ornament', desc_ar: 'زينة قلب كريستالية جميلة', price: 400.00, in_stock: true, category_index: 1 },

  // Flowers & Bouquets
  { name_en: 'Red Roses Bouquet', name_ar: 'باقة ورود حمراء', desc_en: '12 fresh red roses with elegant wrapping', desc_ar: '12 وردة حمراء طازجة مع تغليف أنيق', price: 200.00, in_stock: true, category_index: 2 },
  { name_en: 'Mixed Flower Arrangement', name_ar: 'ترتيب زهور مختلطة', desc_en: 'Beautiful arrangement of seasonal flowers', desc_ar: 'ترتيب جميل من الزهور الموسمية', price: 280.00, in_stock: true, category_index: 2 },
  { name_en: 'Sunflower Delight', name_ar: 'باقة عباد الشمس البهجة', desc_en: 'Bright sunflowers to bring joy', desc_ar: 'عباد شمس مشرق لجلب السعادة', price: 180.00, in_stock: true, category_index: 2 },
  { name_en: 'Orchid Plant', name_ar: 'نبات الأوركيد', desc_en: 'Elegant potted orchid that lasts', desc_ar: 'نبات أوركيد أنيق في أصيص يدوم طويلاً', price: 320.00, in_stock: true, category_index: 2 },
  { name_en: 'Luxury Rose Box', name_ar: 'صندوق ورد فاخر', desc_en: '24 premium roses in elegant box', desc_ar: '24 وردة فاخرة في صندوق أنيق', price: 450.00, in_stock: true, category_index: 2 },

  // Chocolates & Sweets
  { name_en: 'Belgian Chocolate Box', name_ar: 'صندوق شوكولاتة بلجيكية', desc_en: 'Assorted premium Belgian chocolates', desc_ar: 'شوكولاتة بلجيكية فاخرة متنوعة', price: 300.00, in_stock: true, category_index: 3 },
  { name_en: 'Ferrero Rocher Tower', name_ar: 'برج فيريرو روشيه', desc_en: 'Impressive tower of Ferrero Rocher chocolates', desc_ar: 'برج مذهل من شوكولاتة فيريرو روشيه', price: 250.00, in_stock: true, category_index: 3 },
  { name_en: 'Arabic Sweets Platter', name_ar: 'طبق حلويات عربية', desc_en: 'Traditional Middle Eastern sweets selection', desc_ar: 'مجموعة مختارة من الحلويات الشرقية التقليدية', price: 200.00, in_stock: true, category_index: 3 },
  { name_en: 'Godiva Chocolate Collection', name_ar: 'مجموعة شوكولاتة جوديفا', desc_en: 'Luxury Godiva chocolate assortment', desc_ar: 'تشكيلة شوكولاتة جوديفا الفاخرة', price: 400.00, in_stock: true, category_index: 3 },
  { name_en: 'Macarons Gift Box', name_ar: 'صندوق ماكارون هدية', desc_en: 'French macarons in assorted flavors', desc_ar: 'ماكارون فرنسي بنكهات متنوعة', price: 180.00, in_stock: true, category_index: 3 },

  // Luxury Items
  { name_en: 'Designer Leather Handbag', name_ar: 'حقيبة يد جلدية من مصمم', desc_en: 'Premium leather handbag', desc_ar: 'حقيبة يد جلدية فاخرة', price: 2500.00, in_stock: true, category_index: 4 },
  { name_en: 'Gold Plated Jewelry Set', name_ar: 'طقم مجوهرات مطلي بالذهب', desc_en: 'Elegant necklace and earrings set', desc_ar: 'طقم قلادة وأقراط أنيق', price: 1800.00, in_stock: true, category_index: 4 },
  { name_en: 'Crystal Vase', name_ar: 'مزهرية كريستال', desc_en: 'Hand-cut crystal decorative vase', desc_ar: 'مزهرية كريستال زخرفية مقطوعة يدويًا', price: 900.00, in_stock: false, category_index: 4 },
  { name_en: 'Silk Scarf Collection', name_ar: 'مجموعة أوشحة حريرية', desc_en: 'Luxury silk scarves in beautiful patterns', desc_ar: 'أوشحة حريرية فاخرة بأنماط جميلة', price: 650.00, in_stock: true, category_index: 4 },

  // Books & Stationery
  { name_en: 'Leather Journal Set', name_ar: 'طقم دفتر يوميات جلدي', desc_en: 'Premium leather journal with pen', desc_ar: 'دفتر يوميات جلدي فاخر مع قلم', price: 280.00, in_stock: true, category_index: 5 },
  { name_en: 'Fountain Pen Gift Set', name_ar: 'طقم هدية قلم حبر', desc_en: 'Elegant fountain pen in presentation box', desc_ar: 'قلم حبر أنيق في صندوق عرض', price: 450.00, in_stock: true, category_index: 5 },
  { name_en: 'Bestseller Book Bundle', name_ar: 'حزمة كتب الأكثر مبيعًا', desc_en: 'Curated collection of popular books', desc_ar: 'مجموعة منتقاة من الكتب الشهيرة', price: 350.00, in_stock: true, category_index: 5 },
  { name_en: 'Calligraphy Set', name_ar: 'طقم خط عربي', desc_en: 'Complete Arabic calligraphy starter kit', desc_ar: 'طقم بداية كامل للخط العربي', price: 220.00, in_stock: true, category_index: 5 },

  // Toys & Games
  { name_en: 'LEGO Architecture Set', name_ar: 'طقم ليغو معماري', desc_en: 'Build famous landmarks with LEGO', desc_ar: 'ابنِ معالم شهيرة بمكعبات ليغو', price: 400.00, in_stock: true, category_index: 6 },
  { name_en: 'Board Game Collection', name_ar: 'مجموعة ألعاب الطاولة', desc_en: 'Family-friendly board games set', desc_ar: 'مجموعة ألعاب طاولة مناسبة للعائلة', price: 320.00, in_stock: true, category_index: 6 },
  { name_en: 'Stuffed Animal Giant Bear', name_ar: 'دب محشو عملاق', desc_en: 'Large cuddly teddy bear', desc_ar: 'دب دمية كبير محبوب', price: 280.00, in_stock: true, category_index: 6 },
  { name_en: 'Educational Science Kit', name_ar: 'طقم علوم تعليمي', desc_en: 'Fun science experiments for kids', desc_ar: 'تجارب علمية ممتعة للأطفال', price: 250.00, in_stock: false, category_index: 6 },

  // Home Decor
  { name_en: 'Scented Candle Set', name_ar: 'طقم شموع معطرة', desc_en: 'Luxury scented candles in elegant jars', desc_ar: 'شموع معطرة فاخرة في جرار أنيقة', price: 200.00, in_stock: true, category_index: 7 },
  { name_en: 'Wall Art Canvas', name_ar: 'لوحة فنية جدارية', desc_en: 'Modern abstract canvas print', desc_ar: 'طباعة قماشية تجريدية حديثة', price: 350.00, in_stock: true, category_index: 7 },
  { name_en: 'Decorative Cushion Set', name_ar: 'طقم وسائد زخرفية', desc_en: 'Elegant throw pillows for home', desc_ar: 'وسائد زخرفية أنيقة للمنزل', price: 180.00, in_stock: true, category_index: 7 },
  { name_en: 'Table Lamp Modern', name_ar: 'مصباح طاولة حديث', desc_en: 'Contemporary design table lamp', desc_ar: 'مصباح طاولة بتصميم عصري', price: 420.00, in_stock: true, category_index: 7 },
  { name_en: 'Ceramic Vase Set', name_ar: 'طقم مزهريات سيراميك', desc_en: 'Handcrafted ceramic vases in various sizes', desc_ar: 'مزهريات خزفية مصنوعة يدويًا بأحجام مختلفة', price: 280.00, in_stock: true, category_index: 7 }
]

async function seedDatabase() {
  console.log('🗑️  Clearing existing data...')
  
  // Delete products first (due to foreign key constraint)
  const { error: deleteProductsError } = await supabase
    .from('products')
    .delete()
    .neq('id', 0) // Delete all
  
  if (deleteProductsError) {
    console.error('Error deleting products:', deleteProductsError)
    process.exit(1)
  }
  console.log('✅ Products cleared')

  // Delete categories
  const { error: deleteCategoriesError } = await supabase
    .from('categories')
    .delete()
    .neq('id', 0) // Delete all
  
  if (deleteCategoriesError) {
    console.error('Error deleting categories:', deleteCategoriesError)
    process.exit(1)
  }
  console.log('✅ Categories cleared')

  console.log('\n📦 Inserting categories...')
  
  // Insert categories and get their IDs
  const { data: insertedCategories, error: categoriesError } = await supabase
    .from('categories')
    .insert(categories)
    .select()
  
  if (categoriesError || !insertedCategories) {
    console.error('Error inserting categories:', categoriesError)
    process.exit(1)
  }
  console.log(`✅ Inserted ${insertedCategories.length} categories`)

  console.log('\n📦 Inserting products...')
  
  // Map products to actual category IDs
  const productsWithCategoryIds = products.map(product => {
    const { category_index, ...productData } = product
    return {
      ...productData,
      category_id: insertedCategories[category_index].id,
      image_url: `https://images.unsplash.com/photo-${Math.random().toString(36).substring(7)}?w=800`,
      is_active: true
    }
  })

  // Insert products in batches to avoid timeout
  const batchSize = 10
  let totalInserted = 0
  
  for (let i = 0; i < productsWithCategoryIds.length; i += batchSize) {
    const batch = productsWithCategoryIds.slice(i, i + batchSize)
    const { error: productsError } = await supabase
      .from('products')
      .insert(batch)
    
    if (productsError) {
      console.error('Error inserting products batch:', productsError)
      process.exit(1)
    }
    
    totalInserted += batch.length
    console.log(`  Inserted ${totalInserted}/${productsWithCategoryIds.length} products`)
  }

  console.log(`\n✨ Database seeded successfully!`)
  console.log(`📊 Summary:`)
  console.log(`   - ${insertedCategories.length} categories`)
  console.log(`   - ${totalInserted} products`)
  console.log(`\n🎉 Done! Your database is ready.`)
}

// Run the seed function
seedDatabase().catch(console.error)
