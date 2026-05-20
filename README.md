# 3D Wallpaper Discovery Platform

A premium, highly interactive 3D Wallpaper Discovery and Download platform built with Next.js (App Router), Three.js (via React Three Fiber), Framer Motion, and Tailwind CSS.

## Features

- **Immersive 3D Gallery**: A global `<Canvas>` element manages 3D textures that warp and shift subtly using custom GLSL shaders.
- **Smooth Sequential Scroll**: Leverages `Lenis` for smooth kinetic scrolling, seamlessly synchronized with the React Three Fiber camera position.
- **Dynamic Framer Motion UI**: UI elements dynamically animate into view based on scroll position using `useInView`.
- **Blob-based Downloading**: Downloads are handled directly via client-side object URLs to prevent unnecessary server load and correctly apply file names.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Engine**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations**: `framer-motion`
- **Smooth Scroll**: `lenis`
- **Icons**: `lucide-react`

## Project Structure

\`\`\`
src/
├── app/
│   ├── layout.tsx         # Global layout & Lenis Provider Wrapper
│   └── page.tsx           # Main page (UI overlays, Sections, Download logic)
├── components/
│   ├── 3d/
│   │   ├── Scene.tsx      # R3F Canvas and global lighting setup
│   │   └── Gallery.tsx    # Manager for custom shader meshes & scroll sync
│   └── ui/
│       └── SmoothScrollProvider.tsx # Lenis wrapper component
├── lib/
│   └── data.ts            # Mock wallpaper asset registry
\`\`\`

## Getting Started

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

3. **Production Build**
   \`\`\`bash
   npm run build
   npm run start
   \`\`\`

## Deployment

This platform is ready to be deployed to Vercel (or any other standard Next.js hosting provider). Ensure that you optimize and compress the `public/wallpapers` directory images before a real production deployment, or use a CDN to serve the ultra-high-res 4K images.
