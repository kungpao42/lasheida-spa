# La Sheida Spa: proposed services pages

Replaces today's /services/ page (one menu image, ~141 words) with three service hubs,
child pages for each facial, and a text price list. All prices live in `src/data/services.ts`.

| URL | Page | Target query | Content |
|---|---|---|---|
| `/eyebrow-threading/` | Eyebrow threading (build first) | eyebrow threading leesburg va / near me | First-visit vs returning price, tinting & shaping, face threading (lip, chin, sideburns, full face), Sheida's 35+ yrs, threading vs waxing, FAQs, book |
| `/facials/` | Facials hub | facials leesburg va / facial spa near me | Compare all 8 facials, how to choose, relaxation facial lives here |
| `/facials/signature-facial/` | Sheida's signature custom facial | custom facial leesburg | $160, 60 min |
| `/facials/hydrodermabrasion/` | Hydrodermabrasion facial | hydrafacial leesburg / hydrodermabrasion | $180 |
| `/facials/microdermabrasion/` | Microdermabrasion facial | microdermabrasion leesburg | $155 |
| `/facials/rf-skin-tightening/` | RF skin tightening facial | rf skin tightening leesburg | $165 |
| `/facials/needle-free-mesotherapy/` | Needle-free mesotherapy | needle-free microneedling | $200 |
| `/facials/teen-acne-facial/` | Teen acne facial (12+) | teen facial / acne facial leesburg | $140 |
| `/facials/mens-facial/` | Men's facial | mens facial leesburg | from $140 |
| `/waxing/` | Waxing hub | waxing leesburg va | Face, bikini, body tables; aftercare; FAQs |
| `/waxing/brazilian-wax/` | Brazilian & bikini waxing | brazilian wax leesburg | from $60, French bikini $50, bikini line $40 |
| `/services/` | Full price list (keeps existing URL) | la sheida spa prices | Text menu replacing the image; links to every page above |

Keep existing URLs: `/appointments/`, `/get-in-touch/`, `/parking/`, `/blog/`.
Redirects at launch (Cloudflare `_redirects`): `/massage/` and `/massages-and-stress/` → `/facials/`,
`/waxing-vs-threading/` → `/eyebrow-threading/`, `/book-now/` → `/appointments/`, 2019 price PDF → `/services/`.

Open decisions: drop the "Price TBD" add-ons (gua sha, jelly mask, scalp massage, leg & back massage)
or price them; eyebrow tint price; "Studio" vs "Spa" naming (menu image says La Sheida Studio).
