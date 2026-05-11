'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroVideo = () => {
    
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* 1. THE VIDEO LAYER */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105" // Slight scale to avoid edge gaps
        >
          {/* Replace with your actual luxury property video path */}
          <source src="/abuja/city1.mp4" type="video/mp4" />
        </video>
        {/* Dynamic Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background z-10" />
      </div>

      {/* 2. THE CONTENT LAYER */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center lg:text-left w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now Premiering: Abuja City
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9]"
          >
            Experience <br /> 
            <span className="text-white/60 font-light italic">Living Art.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed font-light"
          >
            Belhomz bridges architectural vision with premium residential reality, delivering high-performance luxury across Abuja's skyline.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
          >
          <Link href="/about" className="w-max cursor-pointer ">
              <Button size="lg" className=" cursor-pointer rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform h-12 px-8 text-lg font-bold">
              About Belhomz  <ArrowRight className="ml-2" />
            </Button>
          </Link>
        
          
          </motion.div>
        </div>

        {/* 3. INTERACTIVE MINI-CARD (Floating) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="hidden lg:flex justify-end"
        >
          <div className="p-8 rounded-[2.5rem] backdrop-blur-2xl bg-white/5 border border-white/10 text-white w-80 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest opacity-50 font-bold">Market Update</p>
                <h4 className="text-2xl font-bold tracking-tight">Abuja 2026</h4>
              </div>
              <TrendingUp className="text-primary" />
            </div>
            <p className="text-sm font-light leading-relaxed opacity-80">
              Equity in Guzape has grown by 14% this quarter. Secure your position in the capital's fastest-developing district.
            </p>
            <div className="pt-2">
              <div className="flex -space-x-3">
                {[1,2,3,4,5,6].map(i => (
                  <img key={i} src={`/slide/${i}.jpg`} className="h-10 w-10 rounded-full border-2 border-background object-cover" alt="Investor" />
                ))}
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-xs font-bold border-2 border-background">
                  +12
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-tighter opacity-50 mt-3 font-bold">Active Investors this week</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white font-bold">Discover</p>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="h-10 w-[1px] bg-white"
        />
      </div>
    </section>
  );
};

// Internal component for the Trending Icon
const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default HeroVideo;