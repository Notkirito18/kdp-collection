// pagination.js
// Client-side pagination + live search for Eleventy-rendered items.
// Shows 6 items per page, supports #page-N hash, and live-search with debounce.

document.addEventListener("DOMContentLoaded", function () {
  const itemsPerPage = 3;
  const container = document.getElementById("books-grid");
  if (!container) return;

  const paginationEl = document.getElementById("pagination");
  paginationEl.classList.add("custom-pink-pagination");

  const noResultsEl = document.getElementById("no-results");
  const searchInput = document.getElementById("book-search");

  // Gather all articles and extract searchable text
  const articleNodes = Array.from(container.querySelectorAll("article"));
  const itemsData = articleNodes.map((el) => {
    const title = (el.querySelector(".card-title")?.textContent || "").trim();
    const subtitle = (
      el.querySelector(".card-subtitle")?.textContent || ""
    ).trim();
    const desc = (el.querySelector(".card-text")?.textContent || "").trim();
    const text = (title + " " + subtitle + " " + desc).toLowerCase();
    return { el, text };
  });

  let filtered = itemsData.slice();

  // Utility: read page from hash like #page-2 (default 1)
  function getPageFromHash() {
    const m = location.hash.match(/page-(\d+)/);
    let p = m ? parseInt(m[1], 10) : 1;
    if (isNaN(p) || p < 1) p = 1;
    const maxP = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    if (p > maxP) p = maxP;
    return p;
  }

  // Show a specific page (of the currently filtered set)
  function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    // Hide all first
    itemsData.forEach((it) => {
      it.el.style.display = "none";
    });

    // Show visible slice
    filtered.forEach((it, idx) => {
      const visible = idx >= start && idx < end;
      it.el.style.display = visible ? "" : "none";
    });

    // Show/hide "no results"
    if (filtered.length === 0) {
      noResultsEl.style.display = "";
      paginationEl.innerHTML = "";
    } else {
      noResultsEl.style.display = "none";
      renderPagination(page);
    }

    // Update hash (replaceState to avoid polluting history while typing)
    const desiredHash = "#page-" + page;
    if (location.hash !== desiredHash) {
      history.replaceState(null, "", desiredHash);
    }

    // Smoothly scroll to top of grid on page change (optional nice UX)
    // Only run if user is not at top already
    try {
      const rect = container.getBoundingClientRect();
      if (Math.abs(rect.top) > 10) {
        window.scrollTo({
          top: window.scrollY + rect.top - 20,
          behavior: "smooth",
        });
      }
    } catch (e) {
      /* ignore */
    }
  }

  // Render pagination HTML based on filtered.length
  function renderPagination(current) {
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // If single page, clear pagination
    if (totalPages <= 1) {
      paginationEl.innerHTML = "";
      return;
    }

    let html = '<ul class="pagination justify-content-center mb-0">';

    // Prev
    html += '<li class="page-item ' + (current === 1 ? "disabled" : "") + '">';
    html +=
      '<a class="page-link" href="#page-' +
      Math.max(1, current - 1) +
      '" aria-label="Previous">';
    html += '<span aria-hidden="true">&laquo;</span>';
    html += "</a></li>";

    // Simple page numbers; for many pages you can replace with ellipses logic
    for (let i = 1; i <= totalPages; i++) {
      html += '<li class="page-item ' + (i === current ? "active" : "") + '">';
      html +=
        '<a class="page-link" href="#page-' +
        i +
        '"' +
        (i === current ? ' aria-current="page"' : "") +
        ">" +
        i +
        "</a>";
      html += "</li>";
    }

    // Next
    html +=
      '<li class="page-item ' +
      (current === totalPages ? "disabled" : "") +
      '">';
    html +=
      '<a class="page-link" href="#page-' +
      Math.min(totalPages, current + 1) +
      '" aria-label="Next">';
    html += '<span aria-hidden="true">&raquo;</span>';
    html += "</a></li>";

    html += "</ul>";
    paginationEl.innerHTML = html;
  }

  // Hash changes (back/forward) -> show requested page
  window.addEventListener("hashchange", function () {
    const page = getPageFromHash();
    showPage(page);
  });

  // Live search (debounced)
  let debounceTimer = null;
  function handleSearchInputImmediate(raw) {
    const q = (raw || "").trim().toLowerCase();
    if (!q) {
      filtered = itemsData.slice();
    } else {
      filtered = itemsData.filter((it) => it.text.indexOf(q) !== -1);
    }

    // After filtering, go to page 1 (or to a page from hash if that makes sense)
    const pageFromHash = getPageFromHash();
    const startPage = 1; // keep it simple and show first page of results
    showPage(startPage);
  }

  function handleSearchInputDebounced(raw) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => handleSearchInputImmediate(raw), 150);
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      handleSearchInputDebounced(e.target.value);
    });

    // Pressing ESC clears search
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchInput.value = "";
        handleSearchInputImmediate("");
      }
    });
  }

  // Init: compute filtered and show initial page from hash
  filtered = itemsData.slice();
  const initPage = getPageFromHash();
  showPage(initPage);
});
