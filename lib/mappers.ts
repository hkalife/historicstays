export type StayRow = {
  id: string;
  city_id: string;
  name: string;
  address: string;
  historic_note: string;
  description: string;
  price_per_night: number;
  max_guests: number;
  rating: number;
  amenities: string;
  images: string;
  blocked_dates: string;
};

export type Stay = {
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

export function mapStayRow(row: StayRow): Stay {
  return {
    id: row.id,
    cityId: row.city_id,
    name: row.name,
    address: row.address,
    historicNote: row.historic_note,
    description: row.description,
    pricePerNight: row.price_per_night,
    maxGuests: row.max_guests,
    rating: row.rating,
    amenities: JSON.parse(row.amenities),
    images: JSON.parse(row.images),
    blockedDates: JSON.parse(row.blocked_dates),
  };
}

export type StayWithCity = Stay & { cityName: string; country: string };

export function mapStayWithCity(row: StayRow & { city_name: string; country: string }): StayWithCity {
  return {
    ...mapStayRow(row),
    cityName: row.city_name,
    country: row.country,
  };
}

export type ReviewRow = {
  id: string;
  stay_id: string;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
  status: string;
};

export type Review = {
  id: string;
  stayId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: string;
};

export function mapReviewRow(row: ReviewRow): Review {
  return {
    id: row.id,
    stayId: row.stay_id,
    authorName: row.author_name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    status: row.status,
  };
}

export type BookingRow = {
  id: string;
  stay_id: string;
  user_id: string | null;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
  status: string;
  created_at: string;
};

export type Booking = {
  id: string;
  stayId: string;
  userId: string | null;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
};

export function mapBookingRow(row: BookingRow): Booking {
  return {
    id: row.id,
    stayId: row.stay_id,
    userId: row.user_id,
    guestName: row.guest_name,
    guestEmail: row.guest_email,
    checkIn: row.check_in,
    checkOut: row.check_out,
    guestsCount: row.guests_count,
    totalPrice: row.total_price,
    status: row.status,
    createdAt: row.created_at,
  };
}

export type UserRow = { id: string; name: string; email: string; password: string };
export type User = { id: string; name: string; email: string };

export function mapUserRow(row: UserRow): User {
  return { id: row.id, name: row.name, email: row.email };
}
