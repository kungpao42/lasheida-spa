# @ID location pages ("stacks")

Reverse-engineered from the Priority 1 Plumbing ID page
(https://slstacks.s3.amazonaws.com/priority1plumbing/id.html). Not part of the Astro site build.

`node stacks/build.mjs stacks/config/lasheidaspa.json` writes `stacks/dist/<slug>/`:
`id.html`, `sitemap.html`, `privacy-policy.html`, `img/` (logo + hero). Upload that folder to
`s3://slstacks/<slug>/` (public-read).

## Anatomy of the reference page

**Head**
- `<title>`, `meta title`, `DC.title` = "Business - Category City, State"
- `description`, `keywords` = the 7-keyword list; robots/googlebot/bingbot with `max-image-preview:large`
- canonical = the ID page itself; favicon = local logo
- JSON-LD #1 `LocalBusiness`: name, sameAs (socials), logo/image (local), url (ID page), description,
  telephone, address, `hasMap` (GBP CID link)
- JSON-LD #2 `WebPage`: significantLink/relatedLink/mainEntityOfPage = money site;
  `mainContentOfPage.about` (identifier/additionalType = money site, disambiguatingDescription = keywords);
  keywords/teaches/educationalUse/text = keyword list; citation sameAs socials;
  `hasPart` VideoObject (YouTube, locationCreated hasMap, publisher)
- JSON-LD #3 standalone `VideoObject` with `@id` = money-site#VideoObject

**Body: one keyword per heading, H1 down to H6**

| # | Heading | Keyword slot | Media |
|---|---|---|---|
| 1 | H1 | Business - Category City, State | — |
| 2 | H2 | kw1 (primary) + paragraph and brand-anchor link to money site, inside H3 | YouTube iframe (title = kw1) + **local** hero image (alt = kw1, title = H1 + name) |
| 3 | H2 | kw2 | text only |
| 4 | H4 ×2 | category entity + city entity | Wikipedia iframes |
| 5 | H3 | kw3 | iframe of money-site home |
| 6 | H3 | kw4 | **GBP photo** hotlinked `lh5.googleusercontent.com/p/<mediaId>` (alt = kw4), image left |
| 7 | H4 | kw5 | iframe of a second stack page (Google Cloud Storage) |
| 8 | H5 | kw6 | **GBP photo** (alt = kw6), image left |
| 9 | H6 | kw7 | **GBP photo** (alt = kw7), image right |
| 10 | — | — | Google Maps embed of the business |
| 11 | footer | NAP, City/State/Zip lines, GBP CID link, website (nofollow), money-site service links (nofollow), county map embed, sitemap + privacy links, socials | — |

Images: the logo and hero are hosted with the page; every other photo is the business's own Google Business
Profile photo, hotlinked by media ID, so the page carries the GBP entity's images. Alt text = the
section keyword.

## Deliberate differences from the reference
- No `award` property: the reference lists "Best <keyword>" awards the business never won. That's a false
  claim in structured data, so it's left out.
- Video blocks and VideoObject schema render only when `youtubeId` is set.
- The second-stack iframe (row 7) renders only when `secondStackUrl` is set.
- Copy is written per business from real facts (no "24/7", no invented claims).
- Kept from the reference on purpose: the intro and kw2 paragraphs sit inside `<h3>` (not valid HTML, but
  part of the template's heading weighting), styled back to body size.

## Deploying to S3
`.github/workflows/deploy-id-page.yml` syncs `stacks/dist/lasheidaspa/` to `s3://slstacks/lasheidaspa/`
on every push that changes it (or run it from the Actions tab). It needs two repo secrets,
`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` (optional repo variable `AWS_REGION`), from an IAM user
limited to this bucket prefix:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": ["s3:PutObject", "s3:DeleteObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::slstacks/lasheidaspa/*" },
    { "Effect": "Allow", "Action": "s3:ListBucket", "Resource": "arn:aws:s3:::slstacks",
      "Condition": { "StringLike": { "s3:prefix": ["lasheidaspa/*"] } } }
  ]
}
```
Public read comes from the bucket's existing policy (the same way the priority1plumbing/ pages are public).
