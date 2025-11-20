"use client";

import { useState, useEffect } from 'react';

interface UseInitialLoaderReturn {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useInitialLoader = (minLoadTime: number = 2000): UseInitialLoaderReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const checkLoadingComplete = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      if (remainingTime > 0) {
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      } else {
        setIsLoading(false);
      }
    };

    // Check if all critical resources are loaded
    const checkResourcesLoaded = () => {
      if (document.readyState === 'complete') {
        checkLoadingComplete();
      } else {
        window.addEventListener('load', checkLoadingComplete);
      }
    };

    checkResourcesLoaded();

    return () => {
      window.removeEventListener('load', checkLoadingComplete);
    };
  }, [startTime, minLoadTime]);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return { isLoading, setLoading };
};
