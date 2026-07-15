'use client';
import HeroSlider from '@/components/Home/hero-slider';
import HeroVideo from '@/components/Home/HeroVideo';
import HeroVideoSection from '@/components/Home/HeroVideoSection';
import HowWeWork from '@/components/Home/HowWeWork';
import ContinuousCarousel from '@/components/Home/ImageGrid';
import ListingCard from '@/components/Home/ListingCard';
import NeighborhoodBento from '@/components/Home/Neighborhood';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, MapPin, ArrowUpRight } from 'lucide-react';


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      
      {/* 1. HERO SECTION */}
      <section className="relative">
        <HeroVideo />
        {/* <HeroSlider /> */}
   
      </section>


     {/* Subtle Brand Bar */}
      
      {/* 2. ARCHITECTURAL VIDEO SECTION */}
      <section className="py-22 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
            <div className="lg:col-span-7">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
                Redefining the <br /> <span className="text-muted-foreground font-light italic">Abuja Skyline.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-lg text-muted-foreground max-w-md">
                Belhomz bridges the gap between ambitious architectural vision and premium residential reality.
              </p>
            </div>
          </div>
          <div className="rounded-[2rem] overflow-hidden border border-border shadow-2xl">
            <HeroVideoSection />
          </div>
        </div>
      </section>


  <div className=" bottom-0 w-full bg-background/80 backdrop-blur-md border-t border-border py-4 overflow-hidden">
          <ContinuousCarousel />
        </div>

      {/* 4. EXCLUSIVE NEIGHBORHOODS - Bento Grid Style */}
        <NeighborhoodBento/>

      {/* 5. STATISTICS - Minimalist High Contrast */}
      <section className="py-24 border-y border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { val: '₦15B+', label: 'Portfolio Value' },
            { val: '500+', label: 'Happy Clients' },
            { val: '12+', label: 'Prime Locations' },
            { val: '100%', label: 'Title Verified' },
          ].map((stat, i) => (
            <div key={i} className="space-y-2 border-l border-primary/10 pl-6">
              <h5 className="text-5xl font-bold tracking-tighter">{stat.val}</h5>
              <p className="text-muted-foreground uppercase text-xs tracking-widest font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. THE PROCESS */}
      <HowWeWork />

      {/* 7. CONSULTANT SECTION - Glassmorphism & Contrast */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-primary text-primary-foreground rounded-[3rem] overflow-hidden flex flex-col md:flex-row items-stretch">
          <div className="flex-1 min-h-[400px]">
            <img 
               src="home/boss1.png" 
               className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" 
               alt="Consultant" 
            />
          </div>
          <div className="flex-1 p-12 md:p-20 flex flex-col justify-center space-y-8">
            <h3 className="text-4xl md:text-5xl font-bold leading-tight">Personalized <br /> Property Mastery.</h3>
            <p className="text-xl text-primary-foreground/80 font-light italic leading-relaxed">
              "We don't just sell property; we curate futures by bridging the gap between architectural vision and your reality."
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 px-8">
                <Phone className="mr-2 h-5 w-5" /> Call Expert
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-primary-foreground/20 hover:bg-primary-foreground/10 px-8">
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA - The Big Bold Statement */}
      <section className="py-32 px-6 bg-background relative overflow-hidden">
        {/* Background Decorative Text */}
        <div className="absolute -bottom-10 -left-10 text-[20vw] font-bold text-muted/20 select-none pointer-events-none tracking-tighter">
          BELHOMZ
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-12">
            Invest in <br /> <span className="text-muted-foreground font-light">Your Future.</span>
          </h2>
          <Button size="lg" className="bg-primary text-primary-foreground rounded-full h-20 px-16 text-2xl font-bold hover:scale-105 transition-transform">
            Get Started <ArrowRight className="ml-3 h-8 w-8" />
          </Button>
        </div>
      </section>

    </div>
  );
}