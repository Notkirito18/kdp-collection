module.exports = function (eleventyConfig) {
  // Copy the admin folder (for Netlify CMS)
  eleventyConfig.addPassthroughCopy("admin");

  // ✅ Copy style.css, images, scripts (and any other static files)
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/scripts");
  // optional: copy single-file scripts if you put them in src root
  eleventyConfig.addPassthroughCopy("src/pagination.js");

  // -- Truncate filter (maxChars, default 180) --
  eleventyConfig.addFilter("truncate", function (value, maxChars = 180) {
    if (!value && value !== 0) return "";
    const s = String(value);
    if (s.length <= maxChars) return s;
    // cut to maxChars, trim trailing whitespace, append ellipsis
    return s.slice(0, maxChars).replace(/\s+\S*$/, "") + "…";
  });

  // Collection: include every markdown file in src/books/
  // This ensures CMS-created files in src/books/ appear in collections.books
  eleventyConfig.addCollection("books", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/books/*.md").sort((a, b) => {
      const A = (a.data.title || "").toString().toLowerCase();
      const B = (b.data.title || "").toString().toLowerCase();
      return A.localeCompare(B);
    });
  });

  return {
    dir: { input: "src", output: "dist" },
    dataTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md"],
    // Add default data (keeps your default layout and tags if you want them)
    data: {
      layout: "layout.njk",
      tags: ["books"],
    },
  };
};
