'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Globe, Users, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import VisionSection from '@/components/about/VisionSection';

const stats = [
  { label: 'Properties Managed', value: '250+', icon: Trophy },
  { label: 'Expert Consultants', value: '15+', icon: Users },
  { label: 'Global Reach', value: '4 Countries', icon: Globe },
  { label: 'Verified Titles', value: '100%', icon: BadgeCheck },
];

export default function AboutSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-background">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/20 -skew-x-12 translate-x-20 z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: The Visual Stack (Multi-Image Composition) */}
          <div className="relative h-[600px] w-full">
            {/* Main Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 left-0 w-4/5 h-[80%] rounded-[2rem] overflow-hidden border border-border shadow-2xl"
            >
              <img 
                src="/slide/14.jpg" 
                alt="Luxury Exterior" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Overlapping Secondary Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute bottom-0 right-0 w-3/5 h-[50%] rounded-[2rem] overflow-hidden border-8 border-background shadow-2xl"
            >
              <img 
                src="/slide/15.jpg" 
                alt="Modern Interior" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Glassmorphic Experience Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-1/2 -left-8 backdrop-blur-xl bg-primary/10 border border-white/20 p-6 rounded-2xl shadow-xl hidden md:block"
            >
              <p className="text-4xl font-bold text-primary">05+</p>
              <p className="text-xs uppercase tracking-widest font-semibold">Years of Mastery</p>
            </motion.div>
          </div>

          {/* RIGHT: Content & Philosophy */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-sm uppercase tracking-[0.4em] text-primary/60 font-bold">The Belhomz Legacy</span>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
                Architecting <br /> 
                <span className="text-muted-foreground font-light italic">Generational Wealth.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Based in Abuja, Belhomz is more than a real estate firm; we are curators of luxury lifestyles. 
                We bridge the gap between structural excellence and your vision of home, focusing on high-availability 
                infrastructure and performance-first investment architecture.
              </p>
            </div>

            {/* Icon Stats Grid */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-start space-x-4 group">
                  <div className="p-3 rounded-xl bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">{stat.value}</h4>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Button size="lg" className="rounded-full px-10 h-16 text-lg font-bold group">
                Discover Our Story 
                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Carousel Teaser */}
      <div className="mt-24 border-y border-border py-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
           <h3 className="text-center text-xs uppercase tracking-[0.5em] mb-12 opacity-50 font-bold">Global Presence</h3>
           {/* Reusing your ContinuousCarousel component here */}
           <div className="opacity-80 grayscale hover:grayscale-0 transition-all duration-700">
             {/* <ContinuousCarousel /> */}
             <div className="flex justify-between items-center gap-8 flex-wrap opacity-40 grayscale">
                <span className="text-2xl font-bold">ABUJA</span>
                <span className="text-2xl font-bold">LAGOS</span>
                <span className="text-2xl font-bold">DUBAI</span>
                <span className="text-2xl font-bold">LONDON</span>
                <span className="text-2xl font-bold">ACCRA</span>
             </div>
           </div>
        </div>
      </div>


      <VisionSection/>

      {/* Founder's Message */}
    </section>
  );
}