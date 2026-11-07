# Nearstep — public site

Support, privacy and terms pages for the Nearstep app, served by GitHub Pages.
The official address is https://ternmade.com/nearstep/; the same files remain
available at https://ternmade.github.io/nearstep/.

The product presentation reflects Nearstep 2.2 and is available in English,
Portuguese, Spanish, French, German and Italian. Updated 6 November 2026.
Support, privacy and terms are available in English and Portuguese. Shared
skies have neutral previews and a language selector; they contain no user data.

The pages are generated from the product repository (`mobile/lib/app/policies.dart`
and `mobile/tool/site_copy.dart`, rendered from `mobile/` with
`dart run tool/render_site.dart --search-package <external-output-directory>`).
Use the complete search package, including its sitemap and six preview images;
the base package alone would omit the published search pages from the sitemap.
Do not edit HTML here by hand;
regenerate and push. Commits to this repository use the studio identity
(`Ternmade <ternmade@outlook.com>`).

`sitemap.xml` lists the canonical ternmade.com URLs of the published pages and
is generated with them. Search crawlers use the host-level robots file
at `https://ternmade.github.io/robots.txt`. Availability for crawling does not
confirm indexing or recommendations.
