module.exports = function (eleventyConfig) {
  // Copy the admin folder (for Netlify CMS)
  eleventyConfig.addPassthroughCopy("admin");

  // ✅ Copy style.css (and any images)
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/images");

  return {
    dir: { input: "src", output: "dist" },
    dataTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md"],
    // Add default data
    data: {
      layout: "layout.njk",
      tags: ["books"],
    },
  };
};
