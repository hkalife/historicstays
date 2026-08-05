CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS stays (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  historic_note TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_night REAL NOT NULL,
  max_guests INTEGER NOT NULL,
  rating REAL NOT NULL,
  amenities TEXT NOT NULL,
  images TEXT NOT NULL,
  blocked_dates TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stays_city_id ON stays(city_id);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  stay_id TEXT NOT NULL REFERENCES stays(id),
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved'
);

CREATE INDEX IF NOT EXISTS idx_reviews_stay_id ON reviews(stay_id);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  stay_id TEXT NOT NULL REFERENCES stays(id),
  user_id TEXT REFERENCES users(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  guests_count INTEGER NOT NULL,
  total_price REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_stay_id ON bookings(stay_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);

CREATE TABLE IF NOT EXISTS favorites (
  user_id TEXT NOT NULL REFERENCES users(id),
  stay_id TEXT NOT NULL REFERENCES stays(id),
  PRIMARY KEY (user_id, stay_id)
);
