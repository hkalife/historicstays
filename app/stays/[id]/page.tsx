import { StayDetailView } from '@/components/stay/stay-detail-view';

export default async function StayDetailPage({ params }: PageProps<'/stays/[id]'>) {
  const { id } = await params;
  return <StayDetailView stayId={id} />;
}
