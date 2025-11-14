# Image Optimization Guide

## Current Implementation
- ✅ Added `loading="lazy"` attribute to all postcard images
- ✅ Added `decoding="async"` for non-blocking image decoding
- ✅ CSS hints for image rendering optimization

## Further Optimization Options

### Option 1: Compress Existing Images (Recommended)
Use tools like:
- **TinyPNG** (https://tinypng.com/) - Online tool, free
- **Squoosh** (https://squoosh.app/) - Google's tool, free
- **ImageOptim** (Mac) or **FileOptimizer** (Windows) - Desktop tools

**Target**: Reduce file size by 60-80% while maintaining visual quality

### Option 2: Convert to WebP Format
WebP images are typically 25-35% smaller than PNG/JPG:
- Use Squoosh.app to convert
- Update HTML to use `<picture>` element with fallbacks

### Option 3: Responsive Images with srcset
For different screen sizes, use:
```html
<img src="image.jpg" 
     srcset="image-small.jpg 400w, image-medium.jpg 800w, image-large.jpg 1200w"
     sizes="(max-width: 768px) 100vw, 33vw"
     loading="lazy">
```

### Option 4: Use a CDN with Image Optimization
Services like Cloudinary or Imgix can automatically optimize images on-the-fly.

## Quick Win
Run all images through TinyPNG or Squoosh - this alone can reduce total page weight by 50-70%!

