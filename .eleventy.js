module.exports = function (eleventyConfig) {
  // Copy the admin folder (for Netlify CMS)
  eleventyConfig.addPassthroughCopy("admin");

  // ✅ Copy style.css (and any images)
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/scripts");

  // -- Truncate filter (maxChars, default 180) --
  eleventyConfig.addFilter("truncate", function (value, maxChars = 180) {
    if (!value && value !== 0) return "";
    const s = String(value);
    if (s.length <= maxChars) return s;
    // cut to maxChars, trim trailing whitespace, append ellipsis
    return s.slice(0, maxChars).replace(/\s+\S*$/, "") + "…";
  });

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
