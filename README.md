# erinoisidori.online-redux

**a better more stylized website for me. I've dedicated time into making it more:** 
1. Austere. 
2. Mature. 
3. Uniform. 
4. Smarter.
5. Seamless
6. Responsive
7. Revitalized 
8. Modernized.
9. Cloud Architecture.
10. AI Enabled.
11. IoT Native.
12. IoT Infrastructure Based.
13. Active Directory.
14. Working 2019 (Not Patched).
15. Portfolio.
16. Brutalist.
17. Angry.
18. Politcal.
19. And Most of All Smart.

## Development & Testing

### Prerequisites
- Node.js (v14 or higher)
- npm

### Install Dependencies
```bash
npm install
```

### Build the Site
```bash
npm run build
```
This generates the static site in the `_site` directory.

### Serve Locally with Auto-reload
```bash
npm run serve
```
This starts a local development server with auto-reload on file changes.

### Development Mode
```bash
npm run dev
```
Same as `serve` but with watch mode enabled.

## Adding New Content

### Adding a New Artwork
1. Create a new Markdown file in `content/works/` (e.g., `my-new-artwork.md`)
2. Add frontmatter:
   ```markdown
   ---
   layout: work-page.njk
   title: My New Artwork
   date: 24/12/15
   image: /works/ArtworkImages/myartwork.png
   permalink: /works/my-new-artwork.html
   activePage: work
   ---
   
   Description of your artwork here...
   ```
3. Add your image to `works/ArtworkImages/`
4. Run `npm run build` or `npm run serve`

### Adding a New Blog Post
1. Create a new Markdown file in `content/blogs/` (e.g., `my-new-post.md`)
2. Add frontmatter:
   ```markdown
   ---
   layout: blog-page.njk
   title: My New Blog Post
   date: 24/12/15
   image: /blogs/blogimages/myimage.jpg
   permalink: /blogs/my-new-post.html
   activePage: blog
   ---
   
   Your blog post content here...
   ```
3. Add your image to `blogs/blogimages/`
4. Run `npm run build` or `npm run serve`

The previous/next navigation is automatically generated based on the date field!
