# Hero Image Assets

Place the following images in this directory before running the hero:

| File | Scene | Description |
|------|-------|-------------|
| `corridor.png` | Scene 1 | Corridor interior with framed developers and buildings |
| `burj-mid.png` | Scene 2 | Burj Khalifa visible through glass wall from distance |
| `burj-close.png` | Scene 3 | Close-up front view of Burj Khalifa |

## Recommended specs

- **Format:** PNG or WebP
- **Resolution:** 2560×1440 minimum (16:9 aspect)
- **Color space:** sRGB
- **File size:** Under 1.5 MB each (compress with TinyPNG or Squoosh)

The hero uses Three.js `TextureLoader` with lazy loading — corridor loads first, skyline images load during the loading screen.
