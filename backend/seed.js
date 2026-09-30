import { supabase } from './supabase.js';

const jewelleryItems = [
  {
    title: 'Aura Solitaire Diamond Ring',
    description: 'A timeless 1.5-carat round brilliant-cut solitaire diamond set on an elegant 18K yellow gold band.',
    price: 1850,
    category: 'Rings',
    metal: '18K Yellow Gold',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    stock: 8
  },
  {
    title: 'Celeste Diamond Pavé Band',
    description: 'Intricately handcrafted eternity band studded with micro-pavé conflict-free lab diamonds.',
    price: 920,
    category: 'Rings',
    metal: 'Platinum',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
    stock: 12
  },
  {
    title: 'Lumina Emerald Drop Pendant',
    description: 'A striking pear-cut Colombian emerald accented with a halo of white diamonds on a delicate chain.',
    price: 2400,
    category: 'Necklaces',
    metal: '18K Rose Gold',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    stock: 5
  },
  {
    title: 'Elysian Freshwater Pearl Choker',
    description: 'Lustrous hand-selected Akoya pearls finished with a minimalist 14K gold magnetic clasp.',
    price: 750,
    category: 'Necklaces',
    metal: '14K Yellow Gold',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    stock: 10
  },
  {
    title: 'Seraphina Diamond Stud Earrings',
    description: 'Classic four-prong basket setting holding two matched brilliant diamonds totaling 1.0 carat.',
    price: 1350,
    category: 'Earrings',
    metal: 'Platinum',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
    stock: 14
  },
  {
    title: 'Royal Sapphire Huggie Hoops',
    description: 'Deep royal blue sapphires alternating with shimmering white diamonds in a hinged hoop design.',
    price: 1100,
    category: 'Earrings',
    metal: '18K White Gold',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80',
    stock: 9
  },
  {
    title: 'Verona Diamond Tennis Bracelet',
    description: 'Continuous strand of fifty round brilliant diamonds bezel-set in hand-polished 18K white gold.',
    price: 3200,
    category: 'Bracelets',
    metal: '18K White Gold',
    image: 'https://images.unsplash.com/photo-1611591475155-426473824761?auto=format&fit=crop&w=800&q=80',
    stock: 4
  }
];

async function seed() {
  console.log('Seeding products...');
  // Clear existing items
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const { data, error } = await supabase.from('products').insert(jewelleryItems).select();
  if (error) {
    console.error('Seed error:', error);
  } else {
    console.log(`Successfully seeded ${data.length} products!`);
  }
  process.exit();
}

seed();