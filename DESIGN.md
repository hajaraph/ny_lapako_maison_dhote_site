---
name: Maison d'Hôte Moderne
colors:
  surface: '#f8faf8'
  surface-dim: '#d8dad9'
  surface-bright: '#f8faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f2'
  surface-container: '#eceeec'
  surface-container-high: '#e6e9e7'
  surface-container-highest: '#e1e3e1'
  on-surface: '#191c1b'
  on-surface-variant: '#3e4a3f'
  inverse-surface: '#2e3130'
  inverse-on-surface: '#eff1ef'
  outline: '#6e7a6e'
  outline-variant: '#bdcabc'
  surface-tint: '#006d36'
  primary: '#006d36'
  on-primary: '#ffffff'
  primary-container: '#50c878'
  on-primary-container: '#005025'
  inverse-primary: '#66dd8b'
  secondary: '#00658e'
  on-secondary: '#ffffff'
  secondary-container: '#85cfff'
  on-secondary-container: '#00587d'
  tertiary: '#715c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#d0af2f'
  on-tertiary-container: '#524300'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#83fba5'
  primary-fixed-dim: '#66dd8b'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005227'
  secondary-fixed: '#c7e7ff'
  secondary-fixed-dim: '#85cfff'
  on-secondary-fixed: '#001e2e'
  on-secondary-fixed-variant: '#004c6c'
  tertiary-fixed: '#ffe179'
  tertiary-fixed-dim: '#e6c443'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#554500'
  background: '#f8faf8'
  on-background: '#191c1b'
  surface-variant: '#e1e3e1'
typography:
  display-xl:
    fontFamily: Noto Serif
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.5'
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

This design system centers on the concept of "Quiet Luxury"—a philosophy that prioritizes substance, serenity, and a deep connection to the natural world. The brand personality is poised, welcoming, and sophisticated, targeting high-discerning travelers who seek refuge from the digital noise in favor of organic, tactile experiences.

The visual style combines **Minimalism** with **Glassmorphism**. By using heavy whitespace and a refined color palette, the UI feels airy and unburdened. Glassmorphism is utilized not for futuristic flash, but to mimic the transparency of water and the layering of forest canopies, creating a sense of physical depth and openness. The emotional response should be an immediate lowering of the heart rate, evoking the feeling of stepping into a sun-drenched atrium.

## Colors

The color palette is a curated reflection of a high-end coastal estate. **Emerald Green** serves as the primary brand anchor, representing lush vegetation and vitality. **Deep Sea Blue** provides structural depth and establishes trust, used primarily for secondary elements, footers, and meaningful iconography. 

**Mustard Yellow** is reserved exclusively for warm calls-to-action and delicate accents, mimicking the golden hour light. The neutral foundation is a "Soft Linen" off-white rather than a clinical pure white, ensuring the interface feels warm and residential. Use the secondary blue for text in high-contrast scenarios to maintain a softer, more luxurious feel than pure black.

## Typography

Typography in this design system balances traditional elegance with contemporary clarity. **Noto Serif** is the voice of the house—authoritative yet graceful, used for all major headings and editorial moments. It should be typeset with generous leading to allow the letterforms to breathe.

**Plus Jakarta Sans** handles the functional aspects of the interface. Its soft, slightly rounded terminals complement the organic shapes of the UI while ensuring maximum readability for booking flows and amenity descriptions. For navigational elements and small labels, use increased letter spacing and uppercase styling to maintain a premium, "gallery" aesthetic.

## Layout & Spacing

The layout philosophy follows a **fixed grid** model on desktop to create a centered, focused experience that feels intentional and curated. A 12-column grid is used with significant outer margins (64px+) to prevent content from feeling crowded.

Spacing is generous. This design system avoids "information density" in favor of "visual pause." Sections should be separated by large vertical gaps (80px+) to signify a transition in the guest’s journey. Elements are grouped using a consistent 8px rhythmic scale, but the primary driver of layout is the use of whitespace as a luxury commodity.

## Elevation & Depth

Depth is achieved through layering rather than traditional heavy shadowing. This design system utilizes a **Glassmorphism** approach for floating elements like navigation bars and booking cards. 

Surfaces should use a backdrop-filter (blur: 16px to 24px) combined with a semi-transparent white fill (70-80% opacity). To define edges, use a very thin, low-contrast 1px border in a slightly lighter tint of the background or a pure white with 20% opacity. Shadows must be "Ambient"—extra-diffused, with a large blur radius (30px+) and very low opacity (5-10%), tinted slightly with the Deep Sea Blue to keep the shadows feeling natural and "cool" rather than gray and "muddy."

## Shapes

The shape language is inspired by nature—specifically smoothed river stones and soft architectural arches. While the core system uses a **Rounded (Level 2)** setting for standard UI components (0.5rem to 1.5rem), this design system encourages the use of **Organic Shapes** for decorative containers and image masks. 

Avoid harsh 90-degree angles. Use asymmetrical border-radii for featured imagery to create a "pebble" effect. Buttons should be pill-shaped or heavily rounded to feel soft to the touch. This fluidity in shape reinforces the "serene and connected to nature" vibe.

## Components

### Buttons
Primary CTAs use the **Mustard Yellow** with Deep Sea Blue text for maximum warmth and visibility. Secondary buttons should use an outlined Emerald Green style. All buttons feature a 500ms transition on hover, subtly increasing the ambient shadow to simulate a "lift."

### Glass Cards
The signature component of this design system. Cards feature a 20px blur and a subtle 1px white inner-stroke. Content inside cards should have ample padding (32px+) to maintain the minimalist aesthetic.

### Inputs & Fields
Input fields are minimalist, utilizing a soft background tint of the neutral color and a bottom-border that transforms into Emerald Green on focus. Error states should be handled with a muted terracotta, avoiding aggressive reds to maintain serenity.

### Navigation
The navigation bar is a floating glass element that stays pinned to the top of the viewport. It uses high-transparency to allow the natural imagery of the site to bleed through, maintaining the "connected to nature" theme.

### Ambient Content
Include "Nature Chips"—small, rounded labels used for tags (e.g., "Sea View", "Organic Breakfast") using low-saturation Emerald Green backgrounds with dark green text.