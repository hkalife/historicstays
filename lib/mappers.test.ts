import { describe, expect, it } from 'vitest';
import {
  mapBookingRow,
  mapReviewRow,
  mapStayRow,
  mapStayWithCity,
  mapUserRow,
  type BookingRow,
  type ReviewRow,
  type StayRow,
  type UserRow,
} from './mappers';

const stayRow: StayRow = {
  id: 'stay-1',
  city_id: 'city-1',
  name: 'Malá Strana townhouse',
  address: 'Malá Strana, Prague 1',
  historic_note: '17th-century burgher house below Prague Castle',
  description: 'A restored townhouse.',
  price_per_night: 142,
  max_guests: 4,
  rating: 4.8,
  amenities: '["wifi","kitchen"]',
  images: '["/a.png","/b.png"]',
  blocked_dates: '["2026-08-10","2026-08-11"]',
};

describe('mapStayRow', () => {
  it('converts snake_case columns to camelCase fields', () => {
    const stay = mapStayRow(stayRow);
    expect(stay.cityId).toBe('city-1');
    expect(stay.historicNote).toBe('17th-century burgher house below Prague Castle');
    expect(stay.pricePerNight).toBe(142);
    expect(stay.maxGuests).toBe(4);
  });

  it('parses the JSON-encoded array columns', () => {
    const stay = mapStayRow(stayRow);
    expect(stay.amenities).toEqual(['wifi', 'kitchen']);
    expect(stay.images).toEqual(['/a.png', '/b.png']);
    expect(stay.blockedDates).toEqual(['2026-08-10', '2026-08-11']);
  });
});

describe('mapStayWithCity', () => {
  it('adds the joined city fields on top of the stay fields', () => {
    const stay = mapStayWithCity({ ...stayRow, city_name: 'Prague', country: 'Czech Republic' });
    expect(stay.cityName).toBe('Prague');
    expect(stay.country).toBe('Czech Republic');
    expect(stay.name).toBe('Malá Strana townhouse');
  });
});

describe('mapReviewRow', () => {
  const reviewRow: ReviewRow = {
    id: 'rev-1',
    stay_id: 'stay-1',
    author_name: 'Marta K.',
    rating: 5,
    comment: 'Lovely stay.',
    created_at: '2026-05-12',
    status: 'approved',
  };

  it('converts snake_case columns to camelCase fields', () => {
    const review = mapReviewRow(reviewRow);
    expect(review.stayId).toBe('stay-1');
    expect(review.authorName).toBe('Marta K.');
    expect(review.createdAt).toBe('2026-05-12');
  });
});

describe('mapBookingRow', () => {
  const bookingRow: BookingRow = {
    id: 'booking-1',
    stay_id: 'stay-1',
    user_id: 'user-1',
    guest_name: 'Ana Silva',
    guest_email: 'ana@example.com',
    check_in: '2026-08-01',
    check_out: '2026-08-04',
    guests_count: 2,
    total_price: 426,
    status: 'confirmed',
    created_at: '2026-08-04T19:09:44.696Z',
  };

  it('converts snake_case columns to camelCase fields', () => {
    const booking = mapBookingRow(bookingRow);
    expect(booking.stayId).toBe('stay-1');
    expect(booking.userId).toBe('user-1');
    expect(booking.guestName).toBe('Ana Silva');
    expect(booking.guestsCount).toBe(2);
    expect(booking.totalPrice).toBe(426);
  });

  it('keeps a null userId for guest checkout', () => {
    const booking = mapBookingRow({ ...bookingRow, user_id: null });
    expect(booking.userId).toBeNull();
  });
});

describe('mapUserRow', () => {
  const userRow: UserRow = {
    id: 'user-1',
    name: 'Henrique Kalife',
    email: 'henrique@example.com',
    password: 'super-secret',
  };

  it('never includes the password in the mapped user', () => {
    const user = mapUserRow(userRow);
    expect(user).toEqual({ id: 'user-1', name: 'Henrique Kalife', email: 'henrique@example.com' });
    expect(user).not.toHaveProperty('password');
  });
});
