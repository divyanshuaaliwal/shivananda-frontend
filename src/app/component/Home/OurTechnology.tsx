"use client";
import React, { useEffect, useState } from "react";
import blog1 from "../../../../public/images/SMA-mix.jpg";
// import blog2 from "../../../../public/images/SMA-mix.jpg";
import blog3 from "../../../../public/images/self-concrete-bgImage.jpg";
import blog4 from "../../../../public/images/steel-bgImage.png";
// import blog5 from "../../../../public/images/fibre-reinforce.jpg";
// import blog6 from "../../../../public/images/Self-compacting-Concrete-SCC.jpg";
import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from 'next/image';

const defaultBlogsData = [
  {
    BlogLink: "/Blog/stone-matrix-asphalt",
    BlogImg: blog1,
    BlogTitle: "Stone Matrix Asphalt (SMA)",
    BlogDate: "March 1, 2023",
    BlogDesc:
      "Stone Matrix Asphalt (SMA) is a gap-graded mix that provides enhanced durability and rut resistance for high-traffic roads. Its stone-on-stone contact structure, held together by a rich mastic of bitumen and filler, offers superior performance against deformation, cracking, and weathering.",
    BlogBtn: "Read More",
  },
  // {
  //   BlogLink: "/Blog/sma-asphalt-mix-design",
  //   BlogImg: blog2,
  //   BlogTitle: "SMA Mix Design",
  //   BlogDate: "July 19, 2023",
  //   BlogDesc:
  //     "Proper SMA mix design requires careful selection of aggregates, binders, and stabilizing additives. The optimized design balances stone skeleton for strength, mastic for durability, and voids for proper drainage. Our advanced mix designs exceed industry standards for performance and longevity.",
  //   BlogBtn: "Read More",
  // },
  {
    BlogLink: "/Blog/silica-fume-concrete",
    BlogImg: blog3,
    BlogTitle: "Silica Fume Concrete (SFC)",
    BlogDate: "April 1, 2023",
    BlogDesc:
      "Silica fume dramatically improves concrete's compressive strength and durability. As an ultrafine pozzolanic material, it fills microscopic voids and enhances the cement paste-aggregate bond. The result is significantly reduced permeability and superior resistance to chemical attack from chlorides and sulfates.",
    BlogBtn: "Read More",
  },
  {
    BlogLink: "/Blog/steel-fibre-reinforced-concrete",
    BlogImg: blog4,
    BlogTitle: "Steel Fibre Reinforced Concrete (SFRC)",
    BlogDate: "May 1, 2023",
    BlogDesc:
      "Steel Fibre Reinforced Concrete (SFRC) incorporates high-tensile steel fibres to enhance flexural strength and crack resistance. These fibres distribute stresses uniformly throughout the concrete matrix, dramatically improving toughness, impact resistance, and fatigue performance in demanding infrastructure applications.",
    BlogBtn: "Read More",
  }
];

type TechItem = {
  BlogLink: string;
  BlogImg: string | StaticImageData;
  BlogTitle: string;
  BlogDate: string;
  BlogDesc: string;
  BlogBtn: string;
};

function Carousel({ items }: { items: TechItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1);
      } else if (width < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, items.length - itemsPerView);
  useEffect(() => {
    // Clamp index when itemsPerView or items change
    setCurrentIndex((i) => Math.min(i, Math.max(0, items.length - itemsPerView)));
  }, [items.length, itemsPerView]);

  useEffect(() => {
    if (items.length <= itemsPerView) return; // nothing to slide
    const id = setInterval(() => {
      setCurrentIndex((p) => (p >= maxIndex ? 0 : p + 1));
    }, 3500);
    return () => clearInterval(id);
  }, [items.length, itemsPerView, maxIndex]);

  const itemWidthPercent = 100 / (itemsPerView || 1);

  return (
    <div className="relative">
      <div className="overflow-x-hidden px-2 md:px-4">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * itemWidthPercent}%)` }}
        >
          {items.map((BlogItems, index) => (
            <div
              key={index}
              className="shrink-0"
              style={{ width: `${itemWidthPercent}%` }}
            >
              <div className="h-full px-2 md:px-3">
                <div className="rounded-[20px] p-5 pb-9 bg-[#EFEFEF] flex flex-col h-full">
                <div className="w-full h-[200px] overflow-hidden rounded-[20px]">
                  <Link href={BlogItems.BlogLink}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={typeof BlogItems.BlogImg === 'string' ? BlogItems.BlogImg : (BlogItems.BlogImg as any).src}
                      alt={BlogItems.BlogTitle}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>

                <div className="text-Dark flex flex-col flex-grow">
                  <div className="text-lg font-normal my-3 ">
                    {BlogItems.BlogDate}
                  </div>
                  <Link href={BlogItems.BlogLink}>
                    <h2 className="text-2xl md:text-xl line-clamp-2 text-ellipsis font-semibold mb-3">
                      {BlogItems.BlogTitle}
                    </h2>
                  </Link>
                  <p className="text-base line-clamp-3 text-ellipsis flex-grow">
                    {BlogItems.BlogDesc}
                  </p>

                  <Link
                    href={BlogItems.BlogLink}
                    className="py-2 block mt-3 w-fit px-6 bg-transparent hover:bg-Light border-2 hover:border-Light border-primaryColor font-semibold text-primaryColor duration-300 rounded-full"
                  >
                    {BlogItems.BlogBtn}
                  </Link>
                </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > itemsPerView && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setCurrentIndex((p) => (p <= 0 ? maxIndex : p - 1))}
            className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/80 hover:bg-white shadow ring-1 ring-black/5 flex items-center justify-center"
          >
            <span className="sr-only">Previous</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setCurrentIndex((p) => (p >= maxIndex ? 0 : p + 1))}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/80 hover:bg-white shadow ring-1 ring-black/5 flex items-center justify-center"
          >
            <span className="sr-only">Next</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: Math.max(1, items.length - itemsPerView + 1) }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to position ${i + 1}`}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${i === currentIndex ? 'bg-primaryColor' : 'bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const OurTechnology = () => {
  const [items, setItems] = useState<TechItem[]>(defaultBlogsData as any);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/Blog', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const fetched = (json?.content?.items || []) as TechItem[];
          if (Array.isArray(fetched) && fetched.length) setItems(fetched);
        }
      } catch (_) {}
    }
    load();
  }, []);

  return (
    <section className="py-12 sm:py-14 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-8 ">
        <div className="mb-12 text-center">
          <h3 className="text-primaryColor text-lg leading-6 mb-3 font-semibold">
            Technologies
          </h3>
          <h1 className="mb-5 text-Dark text-2xl sm:text-3xl leading-8 sm:leading-10 font-medium">
            Technologies
          </h1>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative">
          {/* Mask to prevent overflow */}
          <div className="overflow-hidden">
            <Carousel items={items} />
          </div>

          {/* Optional navigation (kept minimal to avoid functional changes) */}
        </div>
      </div>
    </section>
  );
};

export default OurTechnology;