# BREAK UP CONTENT MANAGER

I want every page to fetch only the data needed

- cv page gets collection "content", filtered by key
- image (art) pages gets coll "image", fileted by page
- footer always fetches email and phone
- kontakt page fetches email and phone as well, so maybe this can be solved together
- api should be the same
- each page should include an astro script tag which does this fetching + invoking the replace
  - figure out a clean way to fo it
