'use client';

import { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from '@/lib/i18n/use-translations';

export function Gallery({ images, stayName }: { images: string[]; stayName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  function scrollToIndex(index: number) {
    const clamped = Math.max(0, Math.min(images.length - 1, index));
    scrollRef.current?.scrollTo({ left: clamped * scrollRef.current.clientWidth, behavior: 'smooth' });
    setActiveIndex(clamped);
  }

  function handleScroll() {
    const container = scrollRef.current;
    if (!container) return;
    setActiveIndex(Math.round(container.scrollLeft / container.clientWidth));
  }

  return (
    <Dialog.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
      <div className="relative" role="region" aria-roledescription="carousel" aria-label={stayName}>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-72 snap-x snap-mandatory overflow-x-auto rounded-xl scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] sm:h-96 [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <Dialog.Trigger key={src} asChild>
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={t.stayDetail.gallery.openPhoto}
                className="relative h-full w-full shrink-0 cursor-zoom-in snap-center"
              >
                <Image
                  src={src}
                  alt={`${stayName} — ${i + 1}`}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="(min-width: 640px) 1152px, 100vw"
                />
              </button>
            </Dialog.Trigger>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label={t.stayDetail.gallery.previous}
              className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === images.length - 1}
              aria-label={t.stayDetail.gallery.next}
              className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  aria-label={t.stayDetail.gallery.goToPhoto(i + 1)}
                  aria-current={i === activeIndex}
                  className={`h-1.5 cursor-pointer rounded-full transition-all ${
                    i === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90" />
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 outline-none">
          <Dialog.Title className="sr-only">{stayName}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {t.stayDetail.gallery.goToPhoto(activeIndex + 1)}
          </Dialog.Description>

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label={t.stayDetail.gallery.close}
              className="absolute top-4 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </Dialog.Close>

          <div className="relative h-[70vh] w-full max-w-5xl">
            <Image
              src={images[activeIndex]}
              alt={`${stayName} — ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <p className="mt-3 text-sm text-white/70">
            {activeIndex + 1} / {images.length}
          </p>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label={t.stayDetail.gallery.previous}
                className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex + 1)}
                disabled={activeIndex === images.length - 1}
                aria-label={t.stayDetail.gallery.next}
                className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
