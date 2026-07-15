'use client';

import { motion } from 'framer-motion';
import { 
  Home, 
  Key, 
  TrendingUp, 
  HardHat, 
  ArrowRight, 
  CheckCircle2,
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    title: "Luxury Residential Sales",
    description: "Access to Abuja's most exclusive off-market listings in Maitama, Asokoro, and Guzape.",
    icon: Home,
    image: "slide/10.jpg",
    features: ["Title Verification", "Private Viewings", "Bespoke Financing"]
  },
  {
    title: "Investment Portfolio Management",
    description: "High-yield real estate diversification for the discerning investor looking for long-term equity growth.",
    icon: TrendingUp,
    image: "slide/11.jpg",  
    features: ["ROI Projection", "Asset Diversification", "Market Analysis"]
  },
  {
    title: "Property Development & Tech",
    description: "Specializing in high-performance architecture with redundant power and fiber-ready infrastructure.",
    icon: HardHat,
    image: "slide/12.jpg",
    features: ["Modern Luxury Design", "Fiber Internet Ready", "Power Redundancy"]
  },
  {
    title: "Concierge Management",
    description: "Complete hands-off management for landlords, ensuring maximum occupancy and structural maintenance.",
    icon: Key,
    image: "slide/13.jpg",
    features: ["Tenant Vetting", "24/7 Maintenance", "Legal Support"]
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 1. MINIMALIST HEADER */}
      <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <span className="text-xs uppercase tracking-[0.5em] text-primary/60 font-bold">Solutions for Excellence</span>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mt-4 mb-8">
            Our <br /> <span className="text-muted-foreground font-light italic">Core Services.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            From verified title acquisitions to architectural project management, Belhomz provides a 360° ecosystem for luxury real estate.
          </p>
        </motion.div>
      </section>

      {/* 2. ALTERNATING FEATURE SECTIONS (Visual Dominance) */}
      <section className="space-y-32 py-24">
        {services.map((service, index) => (
          <div key={index} className="max-w-7xl mx-auto px-6">
            <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
              
              {/* Image Side with Floating Elements */}
              <div className="flex-1 relative w-full group">
                <motion.div 
                  whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 2.5rem)' }}
                  initial={{ clipPath: 'inset(10% 10% 10% 10% round 2.5rem)' }}
                  transition={{ duration: 1 }}
                  className="aspect-[4/5] overflow-hidden border border-border"
                >
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                </motion.div>
                
                {/* Floating Icon Badge */}
                <div className={`absolute top-10 ${index % 2 === 0 ? '-left-8' : '-right-8'} bg-primary text-primary-foreground p-6 rounded-2xl shadow-2xl hidden md:block`}>
                  <service.icon size={32} strokeWidth={1.5} />
                </div>
              </div>

              {/* Text Side */}
              <div className="flex-1 space-y-8">
                <h2 className="text-4xl font-bold tracking-tight">{service.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-4">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-md font-medium">
                      <CheckCircle2 className="mr-3 text-primary h-5 w-5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <Button variant="outline" className="rounded-full px-8 h-12 group hover:bg-primary hover:text-primary-foreground">
                    Learn More <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </section>

      {/* 3. CTA: THE INVESTMENT DESK */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-secondary/30 rounded-[3rem] border border-border p-12 md:p-24 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
            Tailored Solutions <br /> for <span className="font-light italic">Global Investors.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg">
            Whether you are in Abuja or the Diaspora, our digital-first infrastructure allows you to manage your Nigerian portfolio with total transparency.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full bg-primary h-16 px-10 text-lg">
              Consult the Desk
            </Button>
            <Button size="lg" variant="ghost" className="rounded-full h-16 px-10 text-lg">
              View Case Studies <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}