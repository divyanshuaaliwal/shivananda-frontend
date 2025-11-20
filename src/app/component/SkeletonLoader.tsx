"use client";

import React from 'react';

// Skeleton base component
const SkeletonBase: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => (
  <div className={`skeleton-shimmer rounded ${className}`}>
    {children}
  </div>
);

// Header skeleton
export const HeaderSkeleton: React.FC = () => (
  <header className="bg-white shadow-sm">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Logo skeleton */}
        <SkeletonBase className="w-32 h-8" />
        
        {/* Navigation skeleton */}
        <nav className="hidden md:flex space-x-8">
          {[...Array(5)].map((_, i) => (
            <SkeletonBase key={i} className="w-16 h-4" />
          ))}
        </nav>
        
        {/* Mobile menu button skeleton */}
        <SkeletonBase className="md:hidden w-8 h-8" />
      </div>
    </div>
  </header>
);

// Hero section skeleton
export const HeroSkeleton: React.FC = () => (
  <section className="relative w-full h-[600px] bg-gray-100">
    {/* Video/Image skeleton */}
    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
    
    {/* Content skeleton */}
    <div className="container h-full mx-auto relative z-10 flex items-center justify-center">
      {/* <div className="w-full md:w-8/12 lg:w-6/12 text-center space-y-4"> */}
        {/* Title skeleton */}
        {/* <SkeletonBase className="w-full h-16 mx-auto" /> */}
        {/* <SkeletonBase className="w-3/4 h-12 mx-auto" /> */}
        
        {/* Description skeleton */}
        {/* <SkeletonBase className="w-full h-6 mx-auto" /> */}
        {/* <SkeletonBase className="w-2/3 h-6 mx-auto" /> */}
      {/* </div> */}
    </div> 
  </section>
);

// About section skeleton
export const AboutSkeleton: React.FC = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Content skeleton */}
        <div className="space-y-4">
          <SkeletonBase className="w-32 h-8" />
          <SkeletonBase className="w-full h-6" />
          <SkeletonBase className="w-full h-6" />
          <SkeletonBase className="w-3/4 h-6" />
          <SkeletonBase className="w-24 h-10" />
        </div>
        
        {/* Image skeleton */}
        <div className="space-y-4">
          <SkeletonBase className="w-full h-64" />
        </div>
      </div>
    </div>
  </section>
);

// Industries section skeleton
export const IndustriesSkeleton: React.FC = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      {/* Section title */}
      <div className="text-center mb-12">
        <SkeletonBase className="w-48 h-8 mx-auto mb-4" />
        <SkeletonBase className="w-96 h-6 mx-auto" />
      </div>
      
      {/* Industry cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
            <SkeletonBase className="w-full h-32 mb-4" />
            <SkeletonBase className="w-3/4 h-6 mb-2" />
            <SkeletonBase className="w-full h-4 mb-2" />
            <SkeletonBase className="w-2/3 h-4" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Projects section skeleton
export const ProjectsSkeleton: React.FC = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      {/* Section title */}
      <div className="text-center mb-12">
        <SkeletonBase className="w-48 h-8 mx-auto mb-4" />
        <SkeletonBase className="w-96 h-6 mx-auto" />
      </div>
      
      {/* Project cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <SkeletonBase className="w-full h-48" />
            <SkeletonBase className="w-3/4 h-6" />
            <SkeletonBase className="w-full h-4" />
            <SkeletonBase className="w-2/3 h-4" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Technology section skeleton
export const TechnologySkeleton: React.FC = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      {/* Section title */}
      <div className="text-center mb-12">
        <SkeletonBase className="w-48 h-8 mx-auto mb-4" />
        <SkeletonBase className="w-96 h-6 mx-auto" />
      </div>
      
      {/* Technology items */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="text-center space-y-3">
            <SkeletonBase className="w-16 h-16 mx-auto rounded-full" />
            <SkeletonBase className="w-24 h-6 mx-auto" />
            <SkeletonBase className="w-full h-4" />
            <SkeletonBase className="w-3/4 h-4 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Contact section skeleton
export const ContactSkeleton: React.FC = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact info skeleton */}
        <div className="space-y-6">
          <SkeletonBase className="w-48 h-8" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <SkeletonBase className="w-6 h-6" />
                <SkeletonBase className="w-48 h-4" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact form skeleton */}
        <div className="space-y-4">
          <SkeletonBase className="w-full h-12" />
          <SkeletonBase className="w-full h-12" />
          <SkeletonBase className="w-full h-32" />
          <SkeletonBase className="w-32 h-10" />
        </div>
      </div>
    </div>
  </section>
);

// Footer skeleton
export const FooterSkeleton: React.FC = () => (
  <footer className="bg-gray-800 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <SkeletonBase className="w-32 h-6" />
            <div className="space-y-2">
              {[...Array(4)].map((_, j) => (
                <SkeletonBase key={j} className="w-24 h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Copyright skeleton */}
      <div className="border-t border-gray-700 mt-8 pt-8 text-center">
        <SkeletonBase className="w-48 h-4 mx-auto" />
      </div>
    </div>
  </footer>
);

// Main skeleton loader component
export const SkeletonLoader: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="min-h-screen bg-white">
      <HeaderSkeleton />
      <HeroSkeleton />
      <AboutSkeleton />
      <IndustriesSkeleton />
      <ProjectsSkeleton />
      <TechnologySkeleton />
      <ContactSkeleton />
      <FooterSkeleton />
    </div>
  );
};

export default SkeletonLoader;
