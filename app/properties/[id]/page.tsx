'use client';

import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Share2, 
  Heart, 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  CheckCircle2, 
  ShieldCheck,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function PropertyDetailsPage() {
  // In a real app, you'd fetch this via params using your Sanity CMS logic
  const property = {
    title: "The Platinum Monolith",
    location: "Maitama District, Abuja",
    price: "₦850,000,000",
    description: "An architectural masterpiece defined by its brutalist concrete exterior and seamless glass-to-wall ratios. Designed for high-performance living, this estate features redundant power systems and high-speed fiber infrastructure as standard.",
    specs: { beds: 6, baths: 7, sqft: "1,200m²", lot: "2,500m²" },
    amenities: ["Private Cinema", "Smart Home OS", "Infinity Pool", "Redundant Power", "Fiber Internet", "24/7 Security"],
    images: ["/slide/14.jpg", "/slide/15.jpg", "/slide/12.jpg"]
  };

  return (
    <div className="min-h-screen bg-background pb-20 mt-20">
      {/* 1. NAVIGATION & ACTIONS */}
      

  


      {/* 2. HERO VISUAL GALLERY */}
      <section className="pt-20 px-6 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 relative rounded-[2.5rem] overflow-hidden border border-border"
        >
          <img src={property.images[0]} className="w-full h-full object-cover" alt="Main View" />
        </motion.div>
        <div className="hidden md:grid grid-rows-2 gap-4 md:col-span-1">
          <div className="relative rounded-[2rem] overflow-hidden border border-border">
            <img src={property.images[1]} className="w-full h-full object-cover" alt="Interior" />
          </div>
          <div className="relative rounded-[2rem] overflow-hidden border border-border">
            <img src={property.images[2]} className="w-full h-full object-cover" alt="Detail" />
          </div>
        </div>
        <div className="hidden md:block relative rounded-[2.5rem] overflow-hidden border border-border bg-secondary/30 flex items-center justify-center">
           <Button variant="link" className="font-bold uppercase tracking-[0.3em] text-[10px]">View All 24 Frames</Button>
        </div>
      </section>

      {/* 3. CONTENT ARCHITECTURE */}
      <main className="max-w-[1440px] mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Left: Details */}
        <div className="lg:col-span-8 space-y-12">
          <header>
            <div className="flex items-center gap-3 mb-6">
               <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[10px] px-4 py-1">Verified Asset</Badge>
               <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Ref: BLH-2026-001</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">{property.title}</h1>
            <p className="text-xl text-muted-foreground flex items-center gap-2 font-medium">
              <MapPin size={20} className="text-primary" /> {property.location}
            </p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-border/50">
            {[
              { label: "Sleeping", value: property.specs.beds, icon: BedDouble },
              { label: "Baths", value: property.specs.baths, icon: Bath },
              { label: "Interior", value: property.specs.sqft, icon: Square },
              { label: "Lot Size", value: property.specs.lot, icon: Square },
            ].map((spec) => (
              <div key={spec.label}>
                <spec.icon className="text-primary mb-3" size={24} />
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-1">{spec.label}</p>
                <p className="text-xl font-bold">{spec.value}</p>
              </div>
            ))}
          </div>

          <article className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-bold tracking-tight mb-4 uppercase text-xs tracking-[0.3em]">Architectural Narrative</h3>
            <p className="text-lg text-muted-foreground leading-relaxed italic border-l-2 border-primary/30 pl-8">
              {property.description}
            </p>
          </article>

          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-8">Integrated Infrastructure</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {property.amenities.map((item) => (
                <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/20 border border-border">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span className="text-sm font-bold tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Procurement Desk */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-secondary/30 border border-border shadow-xl">
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Acquisition Value</p>
              <h2 className="text-4xl font-bold tracking-tighter mb-8">{property.price}</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border">
                   <ShieldCheck className="text-primary" size={20} />
                   <div>
                     <p className="text-[10px] uppercase font-bold tracking-widest">Ownership</p>
                     <p className="text-xs font-medium">C of O Verified / Legal Clean</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border">
                   <Calendar className="text-primary" size={20} />
                   <div>
                     <p className="text-[10px] uppercase font-bold tracking-widest">Inspection</p>
                     <p className="text-xs font-medium">Available for Private View</p>
                   </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-bold text-sm tracking-widest group">
                  INITIATE HANDSHAKE <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="w-full h-16 rounded-2xl border-border font-bold text-xs tracking-widest">
                  DOWNLOAD BROCHURE (PDF)
                </Button>
              </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/20 flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <ShieldCheck className="text-primary" />
               </div>
               <p className="text-xs font-medium text-muted-foreground leading-snug">
                 This asset is managed by the <strong>Abuja Desk</strong> with 100% availability guaranteed.
               </p>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}