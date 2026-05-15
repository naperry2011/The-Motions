# Asset Map — `The Motions Graphics (1)` ↔ canon

The `Graphics (1)` folder contains 50 numbered PNGs that are not labeled in
the filename. This is the audited mapping:

| # | Role | Character | Notes |
|---|---|---|---|
| 1 | Welcome banner | — | "Welcome to Mo Town — Where inner work has a zip code" |
| 2 | Scene | Quake | Street with EKG-line cracks |
| 3 | Scene | Harbor | Canal walkway, turbaned figure |
| 4 | Scene | Static | Times-Square-chaos, awestruck figure |
| 5 | Scene | North | Rooftop with compass |
| 6 | Scene | Polish | Refined lobby, woman in long skirt + pencil |
| 7 | Scene | Pilot | Hilltop "MO TOWN" overlook, paper plane |
| 8 | Scene | Plenty | Industrial alley w/ overalls + gold bars |
| 9 | Scene | Pinch | Federal Money Bank vault |
| 10 | Scene | Shade | Graffiti corner, orange hood |
| 11 | Scene | Signal | "MO NEWS" district |
| 12 | Scene | Ledger | Trading floor w/ stats |
| 13 | Scene | Sputter | Industrial transformer machine |
| 14 | Scene | Drift | Subway station, long-haired character |
| 15 | Scene | Guess | Market w/ question marks |
| 16 | Scene | Flow | Rooftop sound-bar dance |
| 17 | Scene | Frame | Round office with neat desks |
| 18 | Scene | Echo | MO U music room, face bubbles |
| 19 | Scene | Resonate | Mo Sound Radio station |
| 20 | Scene | Glitch | Jackpot machines, split-self character |
| 21 | Scene | Honeytrap | VIP lounge, two glamorous women |
| 22 | Scene | Mirrorball | "Showtime" theater stage |
| 23 | Scene | Bossy Boots | Surveillance control room |
| 24 | Scene | Capital | Casino office w/ slot machines + cane |
| 25 | Hero card | Quake | Portrait + name plate |
| 26 | Hero card | Harbor |  |
| 27 | Hero card | Static |  |
| 28 | Hero card | North |  |
| 29 | Hero card | Polish |  |
| 30 | Hero card | Pilot |  |
| 31 | Hero card | Pinch |  |
| 32 | Hero card | Plenty |  |
| 33 | Hero card | Shade |  |
| 34 | Hero card | Signal |  |
| 35 | Hero card | Guess |  |
| 36 | Hero card | Ledger |  |
| 37 | Hero card | Sputter |  |
| 38 | Hero card | Flow |  |
| 39 | Hero card | Drift |  |
| 40 | Hero card | Frame |  |
| 41 | Hero card | Echo |  |
| 42 | Hero card | Resonate |  |
| 43 | Hero card | Capital |  |
| 44 | Hero card | Bossy Boots |  |
| 45 | Hero card | Honeytrap |  |
| 46 | Hero card | Velour |  |
| 47 | Hero card | Amp |  |
| 48 | Hero card | Glitch |  |
| 49 | Hero card | Mirrorball |  |
| 50 | Cast group | — | Full 25-character group shot |

## Characters without a Graphics(1) scene
Amp, Velour — they have hero cards (47, 46) but no scene panel.

## File destinations after `npm run assets:remap`
- `1.webp` → `public/assets/illustrations/welcome.webp`
- `50.webp` → `public/assets/illustrations/cast.webp`
- `2..24.webp` → `public/assets/scenes/{slug}.webp` (replaces simpler Graphics (4) versions)
- `25..49.webp` → `public/assets/hero-cards/{slug}.webp`

## Per-character art availability matrix
After the remap, every canonical character has at least a **hero card**.
| Character | portrait | hero-card | scene | title |
|---|---|---|---|---|
| Amp | — | ✓ | — | — |
| Bossy Boots | — | ✓ | ✓ | — |
| Capital | — | ✓ | ✓ | — |
| Drift | ✓ | ✓ | ✓ | ✓ |
| Echo | — | ✓ | ✓ | ✓ |
| Flow | ✓ | ✓ | ✓ | ✓ |
| Frame | ✓ | ✓ | ✓ | ✓ |
| Glitch | — | ✓ | ✓ | — |
| Guess | ✓ | ✓ | ✓ | ✓ |
| Harbor | ✓ | ✓ | ✓ | ✓ |
| Honeytrap | — | ✓ | ✓ | — |
| Ledger | ✓ | ✓ | ✓ | ✓ |
| Mirrorball | — | ✓ | ✓ | — |
| North | ✓ | ✓ | ✓ | ✓ |
| Pilot | ✓ | ✓ | ✓ | ✓ |
| Pinch | ✓ | ✓ | ✓ | ✓ |
| Plenty | ✓ | ✓ | ✓ | ✓ |
| Polish | ✓ | ✓ | ✓ | ✓ |
| Quake | ✓ | ✓ | ✓ | ✓ |
| Resonate | — | ✓ | ✓ | ✓ |
| Shade | ✓ | ✓ | ✓ | ✓ |
| Signal | ✓ | ✓ | ✓ | ✓ |
| Sputter | ✓ | ✓ | ✓ | ✓ |
| Static | ✓ | ✓ | ✓ | ✓ |
| Velour | — | ✓ | — | — |
