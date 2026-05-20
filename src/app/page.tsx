'use client';

import { Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Scene from '@/components/3d/Scene';
import { wallpapers } from '@/lib/data';
import { Download, Loader2 } from 'lucide-react';

function Loader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
    </div>
  );
}

function Section({ wallpaper, index }: { wallpaper: any; index: number }) {
  const handleDownload = async () => {
    try {
      const response = await fetch(wallpaper.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallpaper-${wallpaper.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <section className="relative h-[150vh] w-full pointer-events-none flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: index === 0 ? "100px" : "-20%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="pointer-events-auto absolute bottom-24 flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-slate-950/40 backdrop-blur-md border border-slate-800/50 shadow-2xl"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">
          {wallpaper.title}
        </h2>
        <p className="text-lg md:text-xl text-slate-300 font-light mb-1">
          by {wallpaper.author}
        </p>
        <div className="inline-block px-3 py-1 mb-8 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm tracking-widest uppercase">
          {wallpaper.category}
        </div>
        
        <button
          onClick={handleDownload}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 font-semibold text-slate-900 transition-transform active:scale-95 hover:scale-105 shadow-xl hover:shadow-white/20"
        >
          <span className="relative z-10 flex items-center gap-2">
            Download 4K
            <Download className="h-5 w-5 transition-transform group-hover:translate-y-1" />
          </span>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Suspense fallback={<Loader />}>
        <Scene />
      </Suspense>
      
      <div className="relative z-10">
        <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference text-white">
          <h1 className="text-2xl font-bold tracking-tighter">GALLERY<span className="font-light">3D</span></h1>
          <nav className="hidden md:flex gap-6 text-sm font-medium tracking-wide">
            <a href="#" className="hover:text-indigo-400 transition-colors">Discover</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Collections</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Creators</a>
          </nav>
        </header>

        {wallpapers.map((wallpaper, i) => (
          <Section key={wallpaper.id} wallpaper={wallpaper} index={i} />
        ))}
      </div>
    </main>
  );
}
