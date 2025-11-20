"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

const LazyComponent: React.FC<LazyComponentProps> = ({ 
  children, 
  fallback = (
    <div className="w-full h-32 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  ),
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold,
        rootMargin 
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={containerRef}>
      {isInView ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

export default LazyComponent;
