const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const fs = require('fs');
const path = require('path');

const optimizeImages = async () => {
  try {
    console.log('🖼️  Optimizing images...');
    
    const files = await imagemin(['src/Assets/Images/*.{jpg,jpeg,png}'], {
      destination: 'src/Assets/Images/optimized',
      plugins: [
        imageminWebp({
          quality: 80,
          method: 6
        })
      ]
    });
    
    console.log('✅ Images optimized successfully!');
    console.log(`📊 Optimized ${files.length} images`);
    
    // Create WebP versions
    const webpFiles = await imagemin(['src/Assets/Images/*.{jpg,jpeg,png}'], {
      destination: 'src/Assets/Images/webp',
      plugins: [
        imageminWebp({
          quality: 85,
          method: 6
        })
      ]
    });
    
    console.log(`🖼️  Created ${webpFiles.length} WebP versions`);
    
  } catch (error) {
    console.error('❌ Image optimization failed:', error);
  }
};

// Run optimization
optimizeImages(); 