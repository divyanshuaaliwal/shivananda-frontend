"use client";

import React from "react";

const BlogSkeleton: React.FC = () => {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero Section Skeleton */}
      <div className="relative w-full h-96 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back button skeleton */}
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
              <div className="w-24 h-4 bg-gray-300 rounded"></div>
            </div>
            
            {/* Title skeleton */}
            <div className="space-y-3 max-w-3xl">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            </div>
            
            {/* Meta info skeleton */}
            <div className="flex items-center mt-6 space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                <div className="w-16 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs Skeleton */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:flex lg:gap-12">
          {/* Article Content Skeleton */}
          <div className="lg:w-2/3">
            {/* Description skeleton */}
            <div className="mb-8 space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-4/5"></div>
            </div>

            {/* Main image skeleton */}
            <div className="relative w-full h-96 md:h-[500px] mb-8 rounded-xl bg-gray-200 animate-pulse"></div>

            {/* Content sections skeleton */}
            <div className="space-y-8">
              {/* Overview section */}
              <div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-32 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                </div>
              </div>

              {/* Topic image skeleton */}
              <div className="my-10">
                <div className="relative w-full h-[300px] md:h-[400px] rounded-lg bg-gray-200 animate-pulse"></div>
                <div className="mt-3 h-4 bg-gray-200 rounded animate-pulse w-2/3 mx-auto"></div>
              </div>

              {/* Additional content sections */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-40"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                </div>
                
                {/* Grid skeleton for advantages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="border-b border-gray-200 pb-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:w-1/3 lg:pl-8 mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-8">
              {/* Navigation skeleton */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-18"></div>
                </div>
              </div>

              {/* Related posts skeleton */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-36 mb-4"></div>
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section Skeleton */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-8 bg-gray-700 rounded animate-pulse w-80 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded animate-pulse w-96 mx-auto mb-8"></div>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-grow h-12 bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="w-24 h-12 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-32 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mx-auto mb-6"></div>
          <div className="flex justify-center space-x-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto"></div>
        </div>
      </footer>
    </main>
  );
};

export default BlogSkeleton;
