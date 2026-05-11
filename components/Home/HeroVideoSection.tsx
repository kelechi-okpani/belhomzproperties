"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroVideoSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Content - Text & CTA */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 md:order-1"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now Premiering: The 2026 Collection
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold leading-[1.05] mb-8 tracking-tighter">
            Architectural <br /> 
            <span className="text-muted-foreground font-light italic">Masterpieces.</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
            From the serene heights of Asokoro to the exclusive waterfronts of Jabi, we curate Nigeria's most prestigious addresses.
          </p>
          
          <div className="flex flex-wrap gap-6 items-center">
            <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
              View Catalog <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <button className="flex items-center gap-3 group text-sm font-bold uppercase tracking-wider">
              <PlayCircle className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
              <span>Watch Lifestyle Film</span>
            </button>
          </div>
        </motion.div>

        {/* Right Content - Auto-playing Video Block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.75 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="order-1 md:order-2 relative aspect-[4/5] md:aspect-square lg:aspect-[4/5]"
        >
          {/* Decorative Background Elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

          {/* Main Video Container */}
          <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white/10">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full object-cover  scale-105 hover:scale-100 transition-transform duration-[3000ms] ease-out"
            >
              <source 
                src="/home/hero.mp4" 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>

            {/* Glassmorphism Overlay Label */}
            <div className="absolute bottom-8 left-8 right-8 p-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl">
              <div className="flex justify-between items-center text-white">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-70 mb-1">Featured Location</p>
                  <p className="text-lg font-bold">3 Bedroom BQ, Kado</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-70 mb-1">Status</p>
                  <p className="text-lg font-bold text-primary">Available</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}