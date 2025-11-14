# Eleventy Setup Guide

## ✅ What's Been Set Up

1. **Eleventy Configuration** (`.eleventy.js`)
   - Collections for works and blogs
   - Automatic previous/next navigation
   - Static asset copying
   - Date parsing for YY/MM/DD format

2. **Templates** (`_includes/`)
   - `base.njk` - Base template with navigation and marquee
   - `work-page.njk` - Template for artwork pages
   - `blog-page.njk` - Template for blog post pages

3. **Content Examples** (`content/`)
   - `works/underwater.md` - Example artwork
   - `works/nicholascopolla.md` - Example artwork
   - `blogs/reading.md` - Example blog post

4. **Listing Pages**
   - `index.html.njk` - Home page (auto-generates from collections)
   - `works.html.njk` - Works listing page
   - `blogs.html.njk` - Blogs listing page

## 🚀 Getting Started

### Step 1: Install Node.js
If you don't have Node.js installed:
1. Download from https://nodejs.org/ (LTS version recommended)
2. Install it
3. Restart your terminal

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Build Your Site
```bash
npm run build
```
This creates a `_site` folder with your generated HTML files.

### Step 4: Preview Locally
```bash
npm run serve
```
Visit http://localhost:8080 to see your site!

## 📝 Adding New Content

### Adding a New Artwork

1. Create a file: `content/works/my-artwork.md`
2. Add this frontmatter:
```markdown
---
layout: work-page.njk
title: My Artwork Title
date: 2024-12-15
dateDisplay: 24/12/15
image: /works/ArtworkImages/myimage.png
permalink: /works/my-artwork.html
activePage: work
---

Your description here...
```

**Note:** Use ISO date format (`YYYY-MM-DD`) for the `date` field (for sorting), and `dateDisplay` for your custom format (`YY/MM/DD`) that appears on the site.

3. Add your image to `works/ArtworkImages/myimage.png`
4. Run `npm run build` or `npm run serve`

### Adding a New Blog Post

1. Create a file: `content/blogs/my-post.md`
2. Add this frontmatter:
```markdown
---
layout: blog-page.njk
title: My Blog Post Title
date: 2024-12-15
dateDisplay: 24/12/15
image: /blogs/blogimages/myimage.jpg
permalink: /blogs/my-post.html
activePage: blog
---

Your blog content here...
```

**Note:** Use ISO date format (`YYYY-MM-DD`) for the `date` field (for sorting), and `dateDisplay` for your custom format (`YY/MM/DD`) that appears on the site.

3. Add your image to `blogs/blogimages/myimage.jpg`
4. Run `npm run build` or `npm run serve`

## 🎯 Key Features

- **Automatic Navigation**: Previous/next links are generated automatically based on date
- **Auto-sorted**: Works and blogs are sorted by date (newest first)
- **Home Page**: Automatically shows latest 9 items (works + blogs combined)
- **No Manual HTML**: Just write Markdown, Eleventy generates the HTML

## 📁 File Structure

```
.
├── _includes/          # Templates
│   ├── base.njk
│   ├── work-page.njk
│   └── blog-page.njk
├── content/           # Your content (Markdown files)
│   ├── works/
│   └── blogs/
├── .eleventy.js       # Eleventy configuration
├── package.json       # Dependencies
└── _site/            # Generated site (created after build)
```

## 🔄 Workflow

1. Create/edit Markdown files in `content/`
2. Run `npm run serve` to preview
3. When ready, run `npm run build`
4. Deploy the `_site` folder to your hosting

## 💡 Tips

- **Date format**: 
  - `date`: Use ISO format `YYYY-MM-DD` (e.g., `2024-12-15`) - this is for sorting
  - `dateDisplay`: Use your custom format `YY/MM/DD` (e.g., `24/12/15`) - this is what shows on the site
- Images: Keep them in `works/ArtworkImages/` or `blogs/blogimages/`
- Permalink: Use the same format as your existing HTML files for consistency
- Navigation: Previous/next is automatic - no need to set it manually!
- Build output: Generated files go in the `_site` folder

