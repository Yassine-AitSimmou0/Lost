import React, { useState, useEffect, useRef } from 'react';
import { lazyLoadImage } from '../utils/performance';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  sizes = '100vw',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && !priority) {
      lazyLoadImage(imgRef.current);
    }
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Generate WebP src if available
  const getWebPSrc = (originalSrc) => {
    if (!originalSrc) return originalSrc;
    const extension = originalSrc.split('.').pop();
    if (['jpg', 'jpeg', 'png'].includes(extension.toLowerCase())) {
      return originalSrc.replace(new RegExp(`\\.${extension}$`, 'i'), '.webp');
    }
    return originalSrc;
  };

  const webpSrc = getWebPSrc(src);

  return (
    <div className={`image-container ${className}`}>
      {/* WebP version with fallback */}
      <picture>
        {webpSrc !== src && (
          <source
            srcSet={webpSrc}
            type="image/webp"
            sizes={sizes}
          />
        )}
        <img
          ref={imgRef}
          src={priority ? src : placeholder}
          data-src={priority ? undefined : src}
          alt={alt}
          className={`optimized-image ${isLoaded ? 'loaded' : ''} ${hasError ? 'error' : ''}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          sizes={sizes}
        />
      </picture>
      
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="image-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {/* Error fallback */}
      {hasError && (
        <div className="image-error">
          <span>Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 