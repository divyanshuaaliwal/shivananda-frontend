"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useRouter } from "next/navigation";

// Transparent 1x1 pixel fallback to avoid empty src errors
const FALLBACK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

// Updated data with placeholder images related to each industry
// const defaultIndustries = [
//     {
//         image: "https://images.unsplash.com/photo-1690631058550-2524e7905d29?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnVpbGRpbmd8ZW58MHx8MHx8fDA%3D",
//         title: "Building",
//         href:"/infrastructure",
//     },
//     {
//         image: "https://images.unsplash.com/photo-1708358131308-c2dad0046a73?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fEluZnJhc3RydWN0dXJlfGVufDB8fDB8fHww",
//         title: "Infrastructure",
//         href:"/infrastructure",
//     },
//     {
//         image: "https://images.unsplash.com/photo-1638461800418-a54f284d72cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fENvYXRpbmclMjBhbmQlMjBNYXN0ZXJiYXRjaCUyMFNvbHV0aW9uc3xlbnwwfHwwfHx8MA%3D%3D",
//         title: "Coating and Masterbatch Solutions",
//         href:"/Coating",
//     },
//     {
//         image: "https://images.unsplash.com/photo-1713433977943-882fae1862a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTc5fHxQYXBlciUyMCUyNiUyMFBhY2thZ2luZ3xlbnwwfHwwfHx8MA%3D%3D",
//         title: "Paper & Packaging",
//         href:"https://indiapaper.com/",
//     }
// ];

type IndustryItem = { image: string; title: string; href: string };

function Carousel({ items }: { items: IndustryItem[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            if (width < 640) {
                setItemsPerView(1);
            } else if (width < 1024) {
                setItemsPerView(2);
            } else if (width < 1280) {
                setItemsPerView(3);
            } else {
                setItemsPerView(4);
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, items.length - itemsPerView);
    useEffect(() => {
        setCurrentIndex((i) => Math.min(i, Math.max(0, items.length - itemsPerView)));
    }, [items.length, itemsPerView]);

    useEffect(() => {
        if (items.length <= itemsPerView) return;
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
                    {items.map((industry, index) => (
                    <div
                    key={index}
                    className="shrink-0"
                    style={{ width: `${itemWidthPercent}%` }}
                  >
                    <div className="h-full px-2 md:px-3">
                      <div
                        className="w-full cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-96" // <-- fixed height
                        onClick={() => {
                          if (industry.href) window.location.href = industry.href;
                        }}
                      >
                        <div className="w-full h-48 relative"> {/* <-- fixed image height */}
                          <img
                            src={industry.image && industry.image.trim() ? industry.image : FALLBACK_IMG}
                            alt={`${industry.title} image`}
                            className="w-full h-full object-cover absolute inset-0"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <h2 className="text-xl md:text-2xl font-semibold mb-2">{industry.title}</h2>
                          <div className="flex-grow"></div>
                          <div className="mt-4 text-primaryColor font-medium text-lg hover:underline">
                            Find more &gt;
                          </div>
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
                        className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/80 hover:bg-white shadow ring-1 ring-black/5 flex items-center justify-center"
                    >
                        <span className="sr-only">Previous</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button
                        type="button"
                        aria-label="Next slide"
                        onClick={() => setCurrentIndex((p) => (p >= maxIndex ? 0 : p + 1))}
                        className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/80 hover:bg-white shadow ring-1 ring-black/5 flex items-center justify-center"
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

const Industrie = () => {
    const router = useRouter();
    const [items, setItems] = useState<IndustryItem[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/content/industries/home', { cache: 'no-store' });
                if (res.ok) {
                    const json = await res.json();
                    const fetched = (json?.content?.items || []) as IndustryItem[];
                    if (Array.isArray(fetched) && fetched.length) setItems(fetched);
                }
            } catch (_) {}
        }
        load();
    }, []);

    return (
        <section className='py-12 sm:py-14 md:py-16 lg:py-20'>
            <div className="container mx-auto px-4 md:px-8">
                {/* Section Heading */}
                <div className='mb-11 md:mb-12 text-center'>
                    <h3 className='text-primaryColor text-lg leading-6 mb-2 font-medium'>Our Industries</h3>
                    <h1 className="mb-5 text-Dark text-2xl sm:text-3xl leading-8 sm:leading-10 font-medium">
                        <span className="font-bold text-primaryColor uppercase">Industries</span> We Serve
                    </h1>
                </div>

                {/* Carousel Layout */}
                <Carousel items={items} />
            </div>
        </section>
    )
}

export default Industrie
