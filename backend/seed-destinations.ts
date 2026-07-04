import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const destinations = [
  {
    slug: 'kyoto-japan',
    name: 'Kyoto',
    description: 'The ancient capital of Japan, famous for its classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.',
    region: 'Asia',
    country: 'Japan',
    category: 'Cultural',
    latitude: 35.0116,
    longitude: 135.7681,
    image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop',
    alt_text: 'Yasaka Pagoda in Kyoto',
    highlights: ['Arashiyama Bamboo Grove', 'Fushimi Inari Taisha', 'Kinkaku-ji (Golden Pavilion)', 'Gion District'],
    ai_story: 'Kyoto whispers tales of ancient eras through its rustling bamboo groves and vermilion torii gates. Here, the modern world gently bows to traditions preserved for over a millennium. Tea ceremonies invite moments of profound stillness, while the geiko of Gion keep classical arts alive beneath the soft glow of paper lanterns.'
  },
  {
    slug: 'santorini-greece',
    name: 'Santorini',
    description: 'A beautiful island in the Aegean Sea, devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape and villages clinging to cliffs.',
    region: 'Europe',
    country: 'Greece',
    category: 'Coastal',
    latitude: 36.3932,
    longitude: 25.4615,
    image_url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2000&auto=format&fit=crop',
    alt_text: 'White buildings and blue domes in Santorini',
    highlights: ['Oia Sunsets', 'Black Sand Beaches', 'Akrotiri Ruins', 'Caldera Boat Tours'],
    ai_story: 'Born from fire and embraced by the sapphire Aegean, Santorini is a paradox of dramatic cliffs and serene white-washed architecture. Its blue domes mirror the cloudless skies, while the volcanic soil nurtures ancient vineyards that have quenched the thirst of travelers for centuries.'
  },
  {
    slug: 'machu-picchu-peru',
    name: 'Machu Picchu',
    description: 'An Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley. Built in the 15th century and later abandoned.',
    region: 'South America',
    country: 'Peru',
    category: 'Historical',
    latitude: -13.1631,
    longitude: -72.5450,
    image_url: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2000&auto=format&fit=crop',
    alt_text: 'Incan ruins of Machu Picchu',
    highlights: ['Inca Trail', 'Sun Gate', 'Temple of the Sun', 'Huayna Picchu'],
    ai_story: 'Shrouded in Andean mist, Machu Picchu stands as a silent testament to Incan ingenuity. These perfectly cut stones, mortarless yet unyielding, seem to grow organically from the jagged peaks. It is a place where earth meets sky, and history lingers in the thin mountain air.'
  }
];

async function seedDestinations() {
  console.log("Seeding destinations...");

  for (const dest of destinations) {
    const { data, error } = await supabase
      .from('destinations')
      .upsert(dest, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.error(`Failed to insert ${dest.name}:`, error.message);
    } else {
      console.log(`Successfully seeded: ${dest.name}`);
    }
  }

  console.log("Done seeding destinations!");
}

seedDestinations();
