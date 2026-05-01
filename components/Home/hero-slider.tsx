"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "The Maitama Collection",
    subtitle: "Architectural Excellence",
    description: "Experience the pinnacle of luxury living in Abuja's most prestigious district.",
    image: "/home/slide1.webp",
    location: "Maitama, Abuja",
  },
  {
    id: 2,
    title: "Guzape Hilltop Manors",
    subtitle: "Panoramic Serenity",
    description: "Breathtaking views meets modern minimalist design in the heart of the capital.",
    image: "/home/slide2.jpg",
    location: "Guzape, Abuja",
  },
  {
    id: 3,
    title: "Asokoro Diplomatic Suites",
    subtitle: "Unrivaled Security",
    description: "Sophisticated residences designed to meet the highest world-class standards.",
    image: "/home/slide3.png",
    location: "Asokoro, Abuja",
  },
  {
    id: 4,
    title: "Eko Atlantic Options",
    subtitle: "Investment Diversification",
    description: "Direct access to premium coastal investments for the discerning Abuja investor.",
    image: "/home/slide4.jpg",
    location: "Victoria Island, Lagos",
  }
];

export default function LuxuryHero() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  // Handle Slide Timing and Progress Bar
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, 8000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 80);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, [current]);

  // Calculate previous slide for the "Stability Layer" background
  const prevIndex = (current - 1 + slides.length) % slides.length;

  return (
    <section className="relative h-[95vh] w-full overflow-hidden bg-zinc-950">
      {/* 1. STABILITY LAYER: Prevents the "black flash" by showing the old image underneath */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
        style={{ backgroundImage: `url(${slides[prevIndex].image})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 2. ANIMATED LAYER: Fades the new image in on top of the stability layer */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-10"
        >
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "linear" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          {/* Integrated Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* 3. CONTENT LAYER */}
      <div className="container relative z-20 flex h-full items-center px-6 md:px-12">
        <div className="max-w-4xl">
          <motion.div
            key={`content-${current}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="h-[1px] w-12 bg-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-primary">
                {slides[current].subtitle}
              </span>
            </div>

            <h1 className="mb-6 text-6xl font-light leading-[1.1] tracking-tighter text-white md:text-8xl">
              {slides[current].title.split(' ').slice(0, -1).join(' ')} <br />
              <span className="font-serif italic text-primary">
                {slides[current].title.split(' ').pop()}
              </span>
            </h1>

            <p className="mb-10 max-w-xl text-lg leading-relaxed text-gray-300 md:text-xl">
              {slides[current].description}
            </p>

            <div className="flex flex-wrap gap-5">
              <Button size="lg" className="h-16 rounded-none bg-primary px-10 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all">
                Explore Estates
              </Button>
              <Button size="lg" variant="outline" className="h-16 rounded-none border-white/20 bg-white/5 px-10 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-xl hover:bg-white hover:text-black transition-all">
                Contact Agent
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. NAVIGATION INDICATORS */}
      <div className="absolute bottom-12 left-12 z-30 hidden items-center gap-8 md:flex">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrent(index); setProgress(0); }}
            className="group relative flex items-center gap-4 py-4"
          >
            <span className={`text-xs font-bold tracking-widest transition-colors ${current === index ? "text-white" : "text-white/40 hover:text-white/70"}`}>
              0{index + 1}
            </span>
            <div className="h-[2px] w-16 bg-white/10">
              {current === index && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-primary"
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* 5. LOCATION BADGE */}
      <div className="absolute bottom-12 right-12 z-30 hidden md:block">
        <motion.div 
          key={`location-${current}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6 bg-zinc-900/40 p-6 backdrop-blur-2xl border border-white/10"
        >
           <div className="text-right">
             <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Location</p>
             <p className="text-sm font-medium text-white">{slides[current].location}</p>
           </div>
           <div className="h-10 w-[1px] bg-white/20" />
           <div className="flex h-12 w-12 items-center justify-center bg-primary text-white">
              <ArrowRight className="w-5 h-5" />
           </div>
        </motion.div>
      </div>
    </section>
  );
}