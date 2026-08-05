import { CheckoutView } from '@/components/checkout/checkout-view';

export default async function CheckoutPage({ params, searchParams }: PageProps<'/checkout/[id]'>) {
  const { id } = await params;
  const sp = await searchParams;

  const checkIn = typeof sp.checkIn === 'string' ? sp.checkIn : undefined;
  const checkOut = typeof sp.checkOut === 'string' ? sp.checkOut : undefined;
  const guestsParam = typeof sp.guests === 'string' ? Number(sp.guests) : undefined;
  const guests = guestsParam !== undefined && Number.isFinite(guestsParam) ? guestsParam : undefined;

  return <CheckoutView stayId={id} checkIn={checkIn} checkOut={checkOut} guests={guests} />;
}
