import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from '../lib/db';

const __dirname = dirname(fileURLToPath(import.meta.url));

type SeedCity = { id: string; name: string; country: string };

type SeedStay = {
  id: string;
  cityId: string;
  name: string;
  address: string;
  historicNote: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  rating: number;
  amenities: string[];
  images: string[];
  blockedDates: string[];
};

type SeedReview = {
  id: string;
  stayId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type SeedData = { cities: SeedCity[]; stays: SeedStay[]; reviews: SeedReview[] };

async function run() {
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  await db.executeMultiple(schema);

  const seed: SeedData = JSON.parse(
    readFileSync(join(__dirname, '..', 'historicstays-seed.json'), 'utf-8')
  );

  await db.execute('DELETE FROM favorites');
  await db.execute('DELETE FROM bookings');
  await db.execute('DELETE FROM reviews');
  await db.execute('DELETE FROM stays');
  await db.execute('DELETE FROM cities');

  for (const city of seed.cities) {
    await db.execute({
      sql: 'INSERT INTO cities (id, name, country) VALUES (?, ?, ?)',
      args: [city.id, city.name, city.country],
    });
  }

  for (const stay of seed.stays) {
    await db.execute({
      sql: `INSERT INTO stays
        (id, city_id, name, address, historic_note, description, price_per_night, max_guests, rating, amenities, images, blocked_dates)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        stay.id,
        stay.cityId,
        stay.name,
        stay.address,
        stay.historicNote,
        stay.description,
        stay.pricePerNight,
        stay.maxGuests,
        stay.rating,
        JSON.stringify(stay.amenities),
        JSON.stringify(stay.images),
        JSON.stringify(stay.blockedDates),
      ],
    });
  }

  for (const review of seed.reviews) {
    await db.execute({
      sql: `INSERT INTO reviews (id, stay_id, author_name, rating, comment, created_at, status)
            VALUES (?, ?, ?, ?, ?, ?, 'approved')`,
      args: [
        review.id,
        review.stayId,
        review.authorName,
        review.rating,
        review.comment,
        review.createdAt,
      ],
    });
  }

  console.log(
    `[seed] inserted ${seed.cities.length} cities, ${seed.stays.length} stays, ${seed.reviews.length} reviews`
  );
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] failed:', err);
    process.exit(1);
  });
