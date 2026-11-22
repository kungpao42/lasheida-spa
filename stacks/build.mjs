// @ID location page generator. Usage: node stacks/build.mjs stacks/config/<slug>.json
// Mirrors the structure of the Priority 1 Plumbing ID page (see stacks/README.md).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const c = JSON.parse(await readFile(process.argv[2] ?? 'stacks/config/lasheidaspa.json'));
const out = `stacks/dist/${c.slug}`;
await mkdir(`${out}/img`, { recursive: true });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const [k1, k2, k3, k4, k5, k6, k7] = c.keywords;
const kwList = c.keywords.join(',');
const H1 = `${c.name} - ${c.category} ${c.city}, ${c.state}`;
const cidUrl = `https://maps.google.com/?cid=${c.gbpCid}`;
const gbp = (id) => `https://lh5.googleusercontent.com/p/${id}`;
const paras = (arr) => arr.map((p) => `<p>${esc(p)}</p>`).join('\n');
const yt = c.youtubeId;
const today = new Date().toISOString().slice(0, 10);

// local assets: logo + hero (like the reference's img/ folder)
await sharp(c.logo).resize({ height: 150, withoutEnlargement: true }).png({ compressionLevel: 9, palette: true }).toFile(`${out}/img/logo.png`);
await sharp(c.hero).resize({ width: 384, height: 512, fit: 'cover' }).jpeg({ quality: 80, mozjpeg: true }).toFile(`${out}/img/${c.slug}-${today}.jpg`);
const heroFile = `img/${c.slug}-${today}.jpg`;

const localBusiness = {
  '@context': 'http://www.schema.org', '@type': 'LocalBusiness', name: c.name,
  sameAs: c.sameAs, logo: 'img/logo.png', image: heroFile, url: c.pageUrl,
  description: c.shortDescription, telephone: c.phone, ...(c.email ? { email: c.email } : {}),
  address: { '@type': 'PostalAddress', streetAddress: c.street, addressLocality: c.city, addressRegion: c.stateAbbr, postalCode: c.zip },
  hasMap: cidUrl,
};
const videoPart = yt ? [{
  '@context': 'https://schema.org', '@type': 'VideoObject', additionalType: 'https://en.wikipedia.org/wiki/Video',
  name: `This video is about ${H1}`, alternatename: `This video also describes ${k1}`,
  description: `The description of the content of this video is ${k1} and ${k2}`,
  disambiguatingdescription: `Besides what is already mentioned, the video also contains knowledge of ,${c.keywords.slice(1).join(',')}`,
  about: `The video is mainly about ${k1} and ${H1}`, keywords: [kwList], mainEntityOfPage: c.website,
  thumbnailUrl: `https://i.ytimg.com/vi/${yt}/maxresdefault.jpg`, contentUrl: `https://www.youtube.com/watch?v=${yt}`,
  embedUrl: `https://youtube.googleapis.com/embed/${yt}`, uploadDate: c.youtubeUploadDate, duration: c.youtubeDuration,
  accessmode: ['auditory, textual, visual, textOnVisual'], accessibilityFeature: ['audioDescription, captions'],
  locationCreated: { '@type': 'Place', address: c.street, hasMap: [cidUrl] },
  publisher: { '@type': 'Organization', name: c.name, logo: { '@type': 'ImageObject', name: H1, url: `https://i.ytimg.com/vi/${yt}/maxresdefault.jpg`, width: '1280', height: '720' } },
}] : [];
const webPage = {
  '@type': 'WebPage', '@context': 'http://www.schema.org', significantLink: c.website, relatedLink: c.website, lastReviewed: today,
  mainContentOfPage: {
    about: { sameAs: [c.website], url: c.pageUrl, additionalType: c.website, name: k1, identifier: c.website, description: `${k1},${k2}`, disambiguatingDescription: kwList, alternateName: k2 },
    accessibilitySummary: k1,
    ...(yt ? { associatedMedia: { embedUrl: `https://www.youtube.com/watch?v=${yt}`, contentUrl: `https://www.youtube.com/watch?v=${yt}`, about: { sameAs: [c.website], url: c.pageUrl } } } : {}),
  },
  mainEntityOfPage: c.website, keywords: [kwList], teaches: [kwList], educationalUse: [kwList], text: [kwList],
  workExample: { about: { sameAs: [c.website], url: c.pageUrl } },
  citation: { '@type': 'CreativeWork', about: { url: c.pageUrl, sameAs: c.sameAs } },
  ...(videoPart.length ? { hasPart: videoPart } : {}),
};
const videoObject = yt ? {
  '@context': 'http://schema.org', '@type': 'VideoObject', thumbnailUrl: `https://i.ytimg.com/vi/${yt}/maxresdefault.jpg`,
  description: c.metaDescription, contentUrl: `https://www.youtube.com/watch?v=${yt}`, name: `${c.name} - ${c.category} in ${c.city}, ${c.state} Video`,
  embedUrl: `https://www.youtube.com/embed/${yt}`, uploadDate: c.youtubeUploadDate, duration: c.youtubeDuration, '@id': `${c.website}#VideoObject`,
} : null;
const ld = (o) => `<script type="application/ld+json">\n${JSON.stringify(o, null, 1)}\n</script>`;

const socialIcon = (u) => /facebook/.test(u) ? 'fa-facebook' : /instagram/.test(u) ? 'fa-instagram' : /tiktok/.test(u) ? 'fa-music' : 'fa-link';

const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
<title>${esc(H1)}</title>
<meta name="title" content="${esc(H1)}">
<meta name="DC.title" lang="en" content="${esc(H1)}">
<meta name="description" content="${esc(c.metaDescription)}">
<meta name="keywords" content="${esc(H1)},${esc(kwList)}">
<meta name="robots" content="index, follow">
<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<link rel="canonical" href="${c.pageUrl}">
<link rel="shortcut icon" href="img/logo.png">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,500;1,400&family=Hanken+Grotesk:wght@400;600&display=swap">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
${ld(localBusiness)}
${ld(webPage)}
${videoObject ? ld(videoObject) : ''}
<style>
:root{--plum:#3a1e32;--purple:#7c397b;--gold:#bcaa4e;--blush:#ecd0cc;--mist:#ebe4ee;--porcelain:#f5f2f6}
*{font-family:'Hanken Grotesk',sans-serif}
body{background:var(--porcelain);color:var(--plum)}
h1,h2,h4,h5,h6,.h3t{font-family:'Bodoni Moda',serif;font-weight:500;color:var(--plum)}
h3.prose{font-family:'Hanken Grotesk',sans-serif;font-size:1.15rem;font-weight:400;line-height:1.68}
h3.prose p{font-size:1.15rem;line-height:1.68}
p{font-size:1.1rem;line-height:1.68}
a{color:var(--purple);text-decoration:underline}
a:hover{color:var(--plum)}
.navbar{background:#fff;box-shadow:0 0 14px 0 rgb(0 0 0 / 8%)}
.nav-link{color:var(--plum)!important}
section{position:relative}
.hero{padding:3rem 0 4rem;background:#fff}
.hero h1{font-size:clamp(1.8rem,1.2rem+2vw,2.6rem)}
.hero h2{font-size:1.5rem;font-style:italic;font-weight:400;color:var(--purple)}
.hero-img img{width:100%;height:100%;object-fit:cover;border-radius:999px 999px 6px 6px}
.band{padding:4rem 0}
.band--blush{background:var(--blush)}
.band--mist{background:var(--mist)}
.card-wiki{background:#fff;padding:2rem;height:100%}
.card-wiki h4{font-size:1.8rem;margin-bottom:1rem}
.side-img img{width:100%;border-radius:6px}
.map iframe{display:block;border:0}
footer{background:var(--plum);color:var(--blush);padding:4rem 0 2rem}
footer *{color:var(--blush)}
footer h5{color:#fff;font-size:1.4rem}
footer ul{padding-left:0;list-style:none}
footer li{margin-top:.6rem}
footer a{color:#fff}
.legal{display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--gold);margin-top:3rem;padding-top:1.5rem}
.legal i{font-size:1.2rem;padding:.5rem}
@media (max-width:991px){.hero-img{margin-top:2rem}.side-img{margin-bottom:2rem}}
</style>
</head>
<body>
<nav class="navbar navbar-expand-lg">
<div class="container">
<a class="navbar-brand" href="${c.pageUrl}"><img alt="${esc(c.name)}" src="img/logo.png" width="100"></a>
<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation"><i class="fa fa-bars"></i></button>
<div class="collapse navbar-collapse" id="nav">
<ul class="navbar-nav ml-auto">
<li class="nav-item dropdown">
<a class="nav-link dropdown-toggle" href="#" id="svc" role="button" data-toggle="dropdown" aria-expanded="false"><b>Services</b></a>
<div class="dropdown-menu" aria-labelledby="svc"><a class="dropdown-item" href="${c.pageUrl}">${esc(H1)}</a></div>
</li>
<li class="nav-item"><a class="nav-link" href="${c.contactUrl}" rel="nofollow">Contact Us</a></li>
</ul>
</div>
</div>
</nav>

<section class="hero">
<div class="container"><div class="row align-items-center">
<div class="col-lg-7">
<h1>${esc(H1)}</h1>
<h2><b>${esc(k1)}</b></h2>
<h3 class="prose">${paras(c.copy.kw1)}<a href="${c.website}">${esc(H1)}</a></h3>
${yt ? `<div class="mt-4"><iframe width="100%" height="315" src="https://youtube.com/embed/${yt}" title="${esc(k1)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>${esc(k1)}</iframe></div>` : ''}
</div>
<div class="col-lg-5 hero-img">
<img src="${heroFile}" alt="${esc(k1)}" title="${esc(H1)} ${esc(c.name)}">
</div>
</div></div>
</section>

<div class="band band--blush"><div class="container">
<h2 id="${esc(k2)}"><b>${esc(k2)}</b></h2>
<h3 class="prose">${paras(c.copy.kw2)}</h3>
</div></div>

<section class="band"><div class="container"><div class="row">
<div class="col-md-6 mb-4"><div class="card-wiki">
<h4>${esc(c.categoryWikiTitle)}</h4>
<p><iframe allowfullscreen frameborder="1" height="400px" name="${esc(c.categoryWikiTitle)}" scrolling="yes" src="${c.categoryWiki}" width="100%"></iframe></p>
</div></div>
<div class="col-md-6 mb-4"><div class="card-wiki">
<h4>${esc(c.city)}, ${esc(c.state)}</h4>
<p><iframe allowfullscreen frameborder="1" height="400px" name="${esc(c.city)}, ${esc(c.state)}" scrolling="yes" src="${c.cityWiki}" width="100%"></iframe></p>
</div></div>
</div></div></section>

<section class="band band--mist"><div class="container"><div class="row">
<div class="col-lg-6">
<h3 class="h3t" id="${esc(k3)}">${esc(k3)}</h3>
<div>${paras(c.copy.kw3)}</div>
</div>
<div class="col-lg-6"><iframe width="100%" height="600" src="${c.website}" title="${esc(k1)}" frameborder="0">${esc(k3)}</iframe></div>
</div></div></section>

<section class="band"><div class="container"><div class="row align-items-center">
<div class="col-lg-5 side-img"><img src="${gbp(c.gbpPhotos.kw4)}" alt="${esc(k4)}"></div>
<div class="col-lg-7">
<h3 class="h3t" id="${esc(k4)}">${esc(k4)}</h3>
<div>${paras(c.copy.kw4)}</div>
</div>
</div></div></section>

<section class="band band--blush"><div class="container"><div class="row">
<div class="${c.secondStackUrl ? 'col-lg-6' : 'col-lg-9'}" id="${esc(k5)}">
<h4 id="${esc(k5)}">${esc(k5)}</h4>
<div>${paras(c.copy.kw5)}</div>
</div>
${c.secondStackUrl ? `<div class="col-lg-6"><iframe width="100%" height="600" src="${c.secondStackUrl}" title="${esc(k5)}" frameborder="0">${esc(k5)}</iframe></div>` : ''}
</div></div></section>

<section class="band"><div class="container"><div class="row align-items-center" id="${esc(k6)}">
<div class="col-lg-5 side-img"><img src="${gbp(c.gbpPhotos.kw6)}" alt="${esc(k6)}"></div>
<div class="col-lg-7">
<h5 id="${esc(k6)}">${esc(k6)}</h5>
<div>${paras(c.copy.kw6)}</div>
</div>
</div></div></section>

<section class="band band--mist"><div class="container"><div class="row align-items-center" id="${esc(k7)}">
<div class="col-lg-7">
<h6>${esc(k7)}</h6>
<div>${paras(c.copy.kw7)}</div>
</div>
<div class="col-lg-5 side-img"><img src="${gbp(c.gbpPhotos.kw7)}" alt="${esc(k7)}"></div>
</div></div></section>

<section class="map">
<iframe src="https://maps.google.com/maps?q=${encodeURIComponent(c.mapsQuery)}&output=embed" width="100%" height="480" loading="lazy">${esc(H1)}</iframe>
</section>

<footer><div class="container">
<div class="row">
<div class="col-lg-4">
<h5>${esc(c.name)}</h5>
<ul>
<li>${esc(c.street)}</li>
${c.email ? `<li>${esc(c.email)}</li>` : ''}
<li>${esc(c.phone)}</li>
<li>City : ${esc(c.city)}</li>
<li>State : ${esc(c.stateAbbr)}</li>
<li>Zip : ${esc(c.zip)}</li>
<li><a href="${cidUrl}" rel="nofollow">Google Business Profile</a></li>
<li>Company Website : <a href="${c.website}" rel="nofollow">${c.website}</a></li>
</ul>
</div>
<div class="col-lg-4">
<h5><b>Useful Links</b></h5>
<ul>${c.usefulLinks.map(([t, u]) => `<li><a href="${u}" rel="nofollow" target="_blank">${esc(t)}</a></li>`).join('')}</ul>
</div>
<div class="col-lg-4">
<ul><li><iframe allowfullscreen height="200" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${c.countyMapEmbed}" width="100%" style="border:0"></iframe></li></ul>
</div>
</div>
<div class="legal">
<div><a href="${c.pageUrl.replace('id.html', 'sitemap.html')}" rel="nofollow">Sitemap</a> | <a href="${c.pageUrl.replace('id.html', 'privacy-policy.html')}" rel="nofollow">Privacy Policy</a></div>
<div>Follow us ${c.sameAs.map((u) => `<a href="${u}" rel="nofollow" aria-label="${esc(c.name)} on ${new URL(u).hostname.replace('www.', '')}"><i class="fa ${socialIcon(u)}"></i></a>`).join('')}</div>
</div>
</div></footer>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js"></script>
</body></html>
`;
await writeFile(`${out}/id.html`, html);

const shell = (title, body) => `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><meta name="robots" content="noindex, follow"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css"></head><body class="container py-5">${body}<p class="mt-5"><a href="${c.pageUrl}">Back to ${esc(c.name)}</a></p></body></html>`;
await writeFile(`${out}/sitemap.html`, shell(`Sitemap | ${c.name}`, `<h1>Sitemap</h1><ul><li><a href="${c.pageUrl}">${esc(H1)}</a></li>${c.keywords.map((k) => `<li><a href="${c.pageUrl}#${encodeURIComponent(k)}">${esc(k)}</a></li>`).join('')}<li><a href="${c.website}">${esc(c.name)} website</a></li></ul>`));
await writeFile(`${out}/privacy-policy.html`, shell(`Privacy Policy | ${c.name}`, `<h1>Privacy Policy</h1><p>This page is an informational listing for ${esc(c.name)}, ${esc(c.street)}, ${esc(c.city)}, ${esc(c.stateAbbr)} ${esc(c.zip)}. It does not collect personal information, use forms, or set cookies of its own. Embedded content from Google Maps, Wikipedia${yt ? ', YouTube' : ''} and the business website may set cookies under those providers' policies.</p><p>Questions: call ${esc(c.phone)} or visit <a href="${c.website}">${c.website}</a>.</p>`));
console.log('built', out);
