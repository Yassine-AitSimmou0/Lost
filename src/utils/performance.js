// Advanced Performance Optimizations
export const optimizeImages = () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Add lazy loading
    if (!img.loading) {
      img.loading = 'lazy';
    }
    
    // Add decoding optimization
    if (!img.decoding) {
      img.decoding = 'async';
    }
    
    // Add fetch priority for above-the-fold images
    if (img.dataset.priority === 'high') {
      img.fetchPriority = 'high';
    }
  });
};

// Resource optimization
export const optimizeResources = () => {
  // Preload critical resources
  const criticalResources = [
    '/static/css/main.chunk.css',
    '/static/js/main.chunk.js'
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.css') ? 'style' : 'script';
    document.head.appendChild(link);
  });
};

// Advanced Core Web Vitals monitoring
export const monitorCoreWebVitals = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Monitor LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime, 'ms');
      
      // Send to analytics if needed
      if (window.gtag) {
        window.gtag('event', 'LCP', {
          value: Math.round(lastEntry.startTime),
          event_category: 'Web Vitals'
        });
      }
    });
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.log('LCP monitoring not supported');
    }
    
    // Monitor FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        const fid = entry.processingStart - entry.startTime;
        console.log('FID:', fid, 'ms');
        
        if (window.gtag) {
          window.gtag('event', 'FID', {
            value: Math.round(fid),
            event_category: 'Web Vitals'
          });
        }
      });
    });
    
    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.log('FID monitoring not supported');
    }
    
    // Monitor CLS
    let cls = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      }
      console.log('CLS:', cls);
      
      if (window.gtag) {
        window.gtag('event', 'CLS', {
          value: Math.round(cls * 1000) / 1000,
          event_category: 'Web Vitals'
        });
      }
    });
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.log('CLS monitoring not supported');
    }
  }
};

// Cache management
export const cacheManager = {
  cache: new Map(),
  
  set: (key, value, ttl = 300000) => {
    cacheManager.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  },
  
  get: (key) => {
    const item = cacheManager.cache.get(key);
    if (item && Date.now() < item.expiry) {
      return item.value;
    }
    cacheManager.cache.delete(key);
    return null;
  },
  
  clear: () => {
    cacheManager.cache.clear();
  }
};

// Debounce utility for performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for performance
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Image optimization
export const lazyLoadImage = (img) => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    imageObserver.observe(img);
  } else {
    // Fallback for older browsers
    img.src = img.dataset.src;
  }
};

// Preload critical resources
export const preloadResource = (href, as = 'fetch') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Performance measurement
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start}ms`);
  return result;
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  }
};

// Enhanced performance monitoring
export const monitorPerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Monitor Core Web Vitals
    monitorCoreWebVitals();
    
    // Monitor page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log('Page load time:', loadTime.toFixed(2), 'ms');
      
      // Monitor navigation timing
      if ('navigation' in performance) {
        const nav = performance.getEntriesByType('navigation')[0];
        if (nav) {
          console.log('Time to First Byte:', nav.responseStart - nav.requestStart, 'ms');
          console.log('DOM Content Loaded:', nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart, 'ms');
        }
      }
    });
    
    // Optimize images
    optimizeImages();
    
    // Optimize resources
    optimizeResources();
  }
}; 