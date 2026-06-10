# ANTIGRAVITY SKILLS — SOP FILES FOR ADVANCED WEBSITES

These are **SOP (Standard Operating Procedure) files** sourced from the
[Antigravity Awesome Skills](https://github.com/sickn33/antigravity-awesome-skills)
GitHub repository (37k+ stars). Each file tells Claude exactly how to build
a specific type of advanced background, animation, or UI.

**How to use:** When building a website, reference the relevant skill file
in your prompt like this:

> "Use the `high-end-visual-design` SOP rules to build this site."
> "Apply `threejs-postprocessing` bloom to the particle background."
> "Follow `industrial-brutalist-ui` style for this agency site."

---

## 3D-Backgrounds/ — Three.js & WebGL SOPs

| File | What it does |
|---|---|
| `3d-web-experience.md` | Full 3D web stack guide — Three.js vs R3F vs Spline selection, scene setup, model integration |
| `threejs-fundamentals.md` | Core Three.js setup: scene, camera, renderer, resize, animation loop |
| `threejs-geometry.md` | Geometry creation, BufferGeometry, custom shapes, instancing |
| `threejs-lighting.md` | All light types, shadows, environment maps, HDRI |
| `threejs-materials.md` | PBR materials, MeshStandardMaterial, custom maps, transparency |
| `threejs-textures.md` | Texture loading, atlases, UV mapping, video textures |
| `threejs-animation.md` | Keyframe animation, GLTF animation mixer, procedural motion |
| `threejs-interaction.md` | Raycasting, click/hover on 3D objects, orbit controls, drag |
| `threejs-shaders.md` | ShaderMaterial, uniforms, custom GLSL vertex + fragment shaders |
| `threejs-postprocessing.md` | EffectComposer, Bloom (UnrealBloomPass), DOF, color grading |
| `shader-programming-glsl.md` | Raw GLSL — vertex/fragment pipeline, uniforms, noise, UV effects |
| `spline-3d-integration.md` | Embedding Spline 3D scenes in websites, interactive 3D without code |

### Quick Pick by Background Type

| Background you want | Use these SOPs |
|---|---|
| Energy helix / flowing particles | `threejs-fundamentals` + `threejs-shaders` |
| Particle storm / explosion sphere | `threejs-fundamentals` + `threejs-geometry` + `threejs-animation` |
| Bloom / glow effects | `threejs-postprocessing` |
| Custom shader background | `shader-programming-glsl` + `threejs-shaders` |
| Spline 3D embedded object | `spline-3d-integration` |
| Interactive click/hover 3D | `threejs-interaction` |

---

## Advanced-UI/ — High-End Interface SOPs

| File | What it does |
|---|---|
| `high-end-visual-design.md` | **Awwwards-tier UI rules** — anti-generic fonts, double-bezel cards, fluid nav, spring physics, layout archetypes. The #1 UI SOP. |
| `industrial-brutalist-ui.md` | Swiss-print / CRT terminal UI — heavy typography, stark grids, tactical telemetry style, no gradients |
| `antigravity-design-expert.md` | Floating/glassmorphism spatial UI — GSAP ScrollTrigger, isometric card grids, weightless layered depth |
| `design-spells.md` | Micro-interactions library — magnetic buttons, physics hover, scroll surprises, Easter eggs, "wow" moments |
| `animejs-animation.md` | Anime.js timelines, stagger reveals, SVG path morphing, spring easing choreography |
| `magic-animator.md` | AI-powered motion for logos/icons/UI — Lottie export, premium animation presets |
| `magic-ui-generator.md` | Premium component variations using 21st.dev Magic — always generates multiple design options |
| `visual-emotion-engineer.md` | Color/type/spacing mapped to emotional response — use to set the psychological tone of a site |
| `stitch-design-taste.md` | Google Stitch DESIGN.md system — encodes premium taste rules that prevent generic AI layouts |
| `canvas-design.md` | 2D Canvas design philosophies — visual art direction frameworks |
| `fixing-motion-performance.md` | GPU-accelerated animation, will-change, 60fps rules, jank elimination |
| `frontend-ui-dark-ts.md` | Dark mode TypeScript UI patterns — dark color systems, contrast ratios, semantic tokens |

### Quick Pick by Site Style

| Style you want | Use these SOPs |
|---|---|
| Pioneer Seeds / immersive scroll | `high-end-visual-design` + `threejs-postprocessing` + `design-spells` |
| Active Theory / cyberpunk agency | `industrial-brutalist-ui` + `threejs-shaders` + `animejs-animation` |
| Luxury minimal (Apple/Linear) | `high-end-visual-design` + `stitch-design-taste` + `magic-ui-generator` |
| Fitness / aggressive dark | `industrial-brutalist-ui` + `antigravity-design-expert` + `animejs-animation` |
| SaaS / tech startup | `antigravity-design-expert` + `magic-ui-generator` + `fixing-motion-performance` |
| Restaurant / organic warmth | `visual-emotion-engineer` + `canvas-design` + `design-spells` |
| Music / DJ / artist | `industrial-brutalist-ui` + `threejs-shaders` + `animejs-animation` |

---

## HOW TO INCLUDE A SKILL IN YOUR PROMPT

Add one line to any website prompt to activate a skill's rules:

```
Follow the rules in the high-end-visual-design SOP — avoid all banned fonts,
use the double-bezel card architecture, and apply spring-physics transitions.
```

Or reference multiple:

```
Background: Use the threejs-postprocessing SOP for real UnrealBloomPass glow.
UI: Follow high-end-visual-design rules — no Inter, no generic shadows, spring easing.
Motion: Apply the design-spells SOP for micro-interactions on hover and scroll.
```

---

## SOURCE

All SOPs sourced from:
**[github.com/sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills)**
License: MIT · 37k+ GitHub stars · 1,453+ skills total

Only the most relevant skills for building immersive advanced websites
have been included here.
