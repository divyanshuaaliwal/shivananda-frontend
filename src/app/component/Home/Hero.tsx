"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import LazyComponent from "../LazyComponent";

const Hero = () => {
  const [heroContent, setHeroContent] = useState({
    title: "",
    subtitle: "",
    description: "",
    videoUrl: "" // Start with empty videoUrl to properly reflect database content
  });
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fetch dynamic content from API
    const fetchHeroContent = async () => {
      try {
        // console.log('Fetching hero content...');
        const response = await axios.get('/api/content/hero/home', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        // console.log('Hero content response:', response.data);

        if (response.data && response.data.content) {
          // console.log('Setting hero content:', response.data.content);
          setHeroContent(prevContent => ({
            ...prevContent,
            ...response.data.content
          }));
        } else {
          // console.log('No content found in database, using defaults');
        }
      } catch (error) {
        // console.log("Failed to fetch hero content, using defaults", error);
        // Keep the default content if API fails completely
      }
    };

    fetchHeroContent();
  }, []);

  useEffect(() => {
    // Lazy load video when component mounts
    const video = videoRef.current;
    if (video) {
      // Start loading the video
      video.load();
    }
  }, [heroContent.videoUrl]);
  return (
    <div>
      <section className="relative w-full h-[600px]">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Show poster image while video is loading */}
          {!isVideoLoaded && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url("/images/bg_poster.png")' }}
            />
          )}
          
          {heroContent.videoUrl ? (
            <video
              ref={videoRef}
              className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
              autoPlay
              loop
              preload="metadata"
              poster="/images/bg_poster.png"
              muted
              playsInline
              src={heroContent.videoUrl}
              onError={(e) => {
                console.error('Video failed to load:', heroContent.videoUrl, e);
                // Hide the video element and show a fallback background
                const target = e.target as HTMLVideoElement;
                target.style.display = 'none';
                setIsVideoLoaded(true); // Show poster as fallback
              }}
              onLoadStart={() => {
                setIsVideoLoaded(false);
              }}
              onCanPlay={() => {
                setIsVideoLoaded(true);
              }}
              onLoadedData={() => {
                setIsVideoLoaded(true);
              }}
            />
          ) : (
            // Use default video when no custom video is uploaded
            <video
              ref={videoRef}
              className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
              autoPlay
              loop
              preload="metadata"
              poster="/images/bg_poster.png"
              muted
              playsInline
              src="/images/hero_bg.mp4"
              onError={(e) => {
                console.error('Default video failed to load:', e);
                // Hide the video element and show a fallback background
                const target = e.target as HTMLVideoElement;
                target.style.display = 'none';
                setIsVideoLoaded(true); // Show poster as fallback
              }}
              onLoadStart={() => {
                setIsVideoLoaded(false);
              }}
              onCanPlay={() => {
                setIsVideoLoaded(true);
              }}
              onLoadedData={() => {
                setIsVideoLoaded(true);
              }}
            />
          )}
        </div>

        <div className="container h-full mx-auto relative z-10 text-white">
          <LazyComponent fallback={
            <div className="w-full md:w-8/12 lg:w-6/12 mx-auto text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-16 bg-gray-300 animate-pulse rounded mb-4 w-full"></div>
              <div className="h-12 bg-gray-300 animate-pulse rounded mb-4 w-4/5 mx-auto"></div>
              <div className="h-8 bg-gray-300 animate-pulse rounded mb-4 w-3/4 mx-auto"></div>
              <div className="h-6 bg-gray-300 animate-pulse rounded w-2/3 mx-auto"></div>
            </div>
          }>
            <div className="w-full md:w-8/12 lg:w-6/12 mx-auto text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <h1 className="text-4xl xl:text-[56px] xl:leading-[60px] pb-8">
                {heroContent.title}
                <span className="font-semibold block">{heroContent.subtitle}</span>
              </h1>
              <div className="text-lg">
                <p>{heroContent.description}</p>
              </div>
            </div>
          </LazyComponent>
        </div>
      </section>
    </div>
  );
};

export default Hero;