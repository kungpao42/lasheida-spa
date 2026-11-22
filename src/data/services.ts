// Single source of truth for the La Sheida Spa menu (from the Oct 2026 studio menu image).
// Every service page, the /services/ menu, and the homepage read from here.

export type Item = { name: string; price: string; note?: string };

export const business = {
  name: 'La Sheida Spa',
  phone: '571-218-0986',
  phoneHref: 'tel:+15712180986',
  text: '571-601-0009',
  textHref: 'sms:+15716010009',
  street: '1601 Village Market Blvd SE, Suite 100',
  city: 'Leesburg',
  region: 'VA',
  zip: '20175',
  building: 'Inside Salon Lofts at the Village at Leesburg',
  bookUrl: '/appointments/',
  reviewsUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJUWgy0mwXtokRW0KKf_kCctY',
  rating: '5.0',
  reviewCount: '160+',
  hours: [
    { day: 'Monday', open: '10:00 am – 5:30 pm' },
    { day: 'Tuesday', open: 'Closed' },
    { day: 'Wednesday', open: '10:00 am – 5:30 pm' },
    { day: 'Thursday', open: '10:00 am – 5:30 pm' },
    { day: 'Friday', open: '10:00 am – 5:30 pm' },
    { day: 'Saturday', open: '10:00 am – 5:30 pm' },
    { day: 'Sunday', open: 'Closed' },
  ],
};

export const threading: Item[] = [
  { name: 'Eyebrow threading, first visit', price: '$23' },
  { name: 'Eyebrow threading, returning clients', price: '$20' },
  { name: 'Upper lip & eyebrows', price: '$33' },
  { name: 'Upper lip & chin', price: '$22' },
  { name: 'Sideburns', price: '$15' },
  { name: 'Full face, including eyebrows', price: '$60' },
];

export type Facial = Item & { slug: string; blurb: string; minutes: number };

export const facials: Facial[] = [
  { slug: 'signature-facial', name: "Sheida's signature custom facial", price: '$160', minutes: 60,
    blurb: 'Built on the day around what your skin needs. Tell Sheida what’s going on and she designs the treatment.' },
  { slug: 'hydrodermabrasion', name: 'Hydrodermabrasion facial', price: '$180', minutes: 60,
    blurb: 'Gentle exfoliation, cleansing and hydration in one pass for brighter, smoother skin.' },
  { slug: 'microdermabrasion', name: 'Microdermabrasion facial', price: '$155', minutes: 60,
    blurb: 'Clears away dull surface skin to even out texture, tone and brightness.' },
  { slug: 'rf-skin-tightening', name: 'RF skin tightening facial', price: '$165', minutes: 60,
    blurb: 'Radiofrequency energy that encourages firmer, smoother, younger-looking skin.' },
  { slug: 'needle-free-mesotherapy', name: 'Needle-free mesotherapy facial', price: '$200', minutes: 60,
    blurb: 'Micro-needling results without needles: a rejuvenation treatment for hydration and texture.' },
  { slug: 'teen-acne-facial', name: 'Teen acne facial (ages 12+)', price: '$140', minutes: 60,
    blurb: 'Gentle, age-appropriate care for skin that’s prone to breakouts.' },
  { slug: 'relaxation-facial', name: 'Relaxation facial, no extractions', price: '$150', minutes: 60,
    blurb: 'Soothing, nourishing and quiet. An hour that’s just about feeling good.' },
  { slug: 'mens-facial', name: "Men's facial", price: 'from $140', minutes: 60,
    blurb: 'Cleansing, hydration and care tuned to men’s skin and shaving.' },
];

export const waxing: { group: string; items: Item[] }[] = [
  { group: 'Face', items: [
    { name: 'Eyebrows', price: '$20' },
    { name: 'Full face, with eyebrows', price: '$60' },
    { name: 'Full face, without eyebrows', price: '$45' },
    { name: 'Chin only', price: '$10' },
    { name: 'Sideburns', price: '$15' },
    { name: 'Ears', price: '$10' },
  ]},
  { group: 'Bikini', items: [
    { name: 'Brazilian', price: 'from $60' },
    { name: 'French bikini', price: '$50' },
    { name: 'Bikini line', price: '$40' },
  ]},
  { group: 'Body', items: [
    { name: 'Full legs, with bikini line', price: '$80' },
    { name: 'Full arms', price: '$55' },
    { name: 'Underarms', price: '$40' },
    { name: 'Back', price: '$70' },
    { name: 'Back & shoulders', price: '$90' },
  ]},
];
