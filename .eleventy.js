module.exports = function(eleventyConfig) {
  // Ignore old HTML files that are being replaced by .njk templates or markdown
  eleventyConfig.ignores.add("index.html");
  eleventyConfig.ignores.add("works.html");
  eleventyConfig.ignores.add("blogs.html");
  // Ignore old HTML files in works/ and blogs/ directories (now converted to markdown)
  eleventyConfig.ignores.add("works/*.html");
  eleventyConfig.ignores.add("blogs/*.html");
  // Ignore fake blog post with incorrect date
  eleventyConfig.ignores.add("content/blogs/fakeblogpost.md");
  
  // Copy static assets
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("styles");
  eleventyConfig.addPassthroughCopy("menu.js");
  eleventyConfig.addPassthroughCopy("tape-persist.js");
  eleventyConfig.addPassthroughCopy("keyboard-nav.js");
  eleventyConfig.addPassthroughCopy("grid-overlay.js");
  eleventyConfig.addPassthroughCopy("image-modal.js");
  // Interactive features
  eleventyConfig.addPassthroughCopy("custom-cursor.js");
  eleventyConfig.addPassthroughCopy("gradient-background.js");
  eleventyConfig.addPassthroughCopy("particle-background.js");
  eleventyConfig.addPassthroughCopy("three-card-tilt.js");
  eleventyConfig.addPassthroughCopy("three-logo-animation.js");
  eleventyConfig.addPassthroughCopy("cursor.cur");
  eleventyConfig.addPassthroughCopy("erino.svg");
  eleventyConfig.addPassthroughCopy("erinoisidorionlineicon.gif");
  eleventyConfig.addPassthroughCopy("works/ArtworkImages");
  eleventyConfig.addPassthroughCopy("blogs/blogimages");
  eleventyConfig.addPassthroughCopy("pageassets");
  
  // Process static HTML files as templates so they can use directory-based URLs
  // They will be processed as .njk templates
  
  // Copy 404.html (will be processed as template)
  // eleventyConfig.addPassthroughCopy("404.html"); // Don't copy, let it be processed

  // Helper function to parse date format (handles both ISO and YY/MM/DD)
  function parseDate(dateInput) {
    if (!dateInput) return new Date(0);
    // If it's already a Date object, return it
    if (dateInput instanceof Date) return dateInput;
    // Convert to string
    const dateStr = String(dateInput);
    // Check if it's YY/MM/DD format
    if (dateStr.includes('/') && dateStr.length <= 8) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        // Format: YY/MM/DD -> convert to 20YY-MM-DD
        const year = 2000 + parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
    return new Date(dateStr);
  }

  // Collections
  eleventyConfig.addCollection("works", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/works/*.md").sort((a, b) => {
      return parseDate(b.data.date) - parseDate(a.data.date);
    });
  });

  eleventyConfig.addCollection("blogs", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/blogs/*.md")
      .filter(item => item.data.title !== "Fake Blogpost") // Exclude fake blog post
      .sort((a, b) => {
        return parseDate(b.data.date) - parseDate(a.data.date);
      });
  });

  // Filter to get previous item in a sorted collection
  eleventyConfig.addFilter("getPreviousInCollection", function(collection, currentUrl) {
    const sorted = [...collection].sort((a, b) => {
      return parseDate(b.data.date) - parseDate(a.data.date);
    });
    const currentIndex = sorted.findIndex(item => item.url === currentUrl);
    return currentIndex > 0 ? sorted[currentIndex - 1] : null;
  });

  // Filter to get next item in a sorted collection
  eleventyConfig.addFilter("getNextInCollection", function(collection, currentUrl) {
    const sorted = [...collection].sort((a, b) => {
      return parseDate(b.data.date) - parseDate(a.data.date);
    });
    const currentIndex = sorted.findIndex(item => item.url === currentUrl);
    return currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;
  });

  // Filter to concatenate arrays
  eleventyConfig.addFilter("concat", function(arr1, arr2) {
    return [...arr1, ...arr2];
  });

  // Filter to limit array length
  eleventyConfig.addFilter("limit", function(arr, limit) {
    return arr.slice(0, limit);
  });

  // Filter to sort posts by date (newest first)
  eleventyConfig.addFilter("sortByDate", function(arr) {
    return [...arr].sort((a, b) => {
      return parseDate(b.data.date) - parseDate(a.data.date);
    });
  });

  // Filter to get random item from collection
  eleventyConfig.addFilter("random", function(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  });

  // Filter to get all posts (works + blogs combined)
  eleventyConfig.addFilter("getAllPosts", function(works, blogs) {
    return [...works, ...blogs];
  });

  // Filter to convert array to JSON string
  eleventyConfig.addFilter("tojson", function(value) {
    return JSON.stringify(value);
  });

  // Filter to map over array and extract attribute
  eleventyConfig.addFilter("map", function(arr, attribute) {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.map(item => {
      // For Eleventy collection items, url is a direct property
      if (attribute === 'url' && item.url) {
        return item.url;
      }
      // Try data attribute first, then direct property
      if (item.data && item.data[attribute] !== undefined) {
        return item.data[attribute];
      }
      return item[attribute] !== undefined ? item[attribute] : item;
    });
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["html", "md", "njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};

