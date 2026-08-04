import Image from 'next/image';

export function Gallery({ images, stayName }: { images: string[]; stayName: string }) {
  const [hero, ...rest] = images;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl sm:col-span-3">
        <Image
          src={hero}
          alt={stayName}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 640px) 1152px, 100vw"
        />
      </div>
      {rest.map((src, i) => (
        <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={src}
            alt={`${stayName} — ${i + 2}`}
            fill
            className="object-cover"
            sizes="(min-width: 640px) 33vw, 100vw"
          />
        </div>
      ))}
    </div>
  );
}
