
import HeroSlider from '@/components/Home/hero-slider';
import HeroVideoSection from '@/components/Home/HeroVideoSection';
import HowWeWork from '@/components/Home/HowWeWork';
import ImageGrid from '@/components/Home/image-grid';
import ContinuousCarousel from '@/components/Home/ImageGrid';
import ListingCard from '@/components/Home/ListingCard';
import LuxuryVideoGallery from '@/components/Home/ReelsCarousel';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, MapPin, BadgeCheck, Phone } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">


      {/* 1. HERO SECTION (Visual Dominance) */}
      <HeroSlider />

      <ContinuousCarousel />

      <HeroVideoSection />
      
      <LuxuryVideoGallery/>

  

    

      {/* 3. FEATURED PROPERTIES (Social Proof & Urgency) */}
    <ListingCard/>

      {/* 4. KEY NEIGHBORHOODS (Visual Categories) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold mb-12 text-center">Exclusive Neighborhoods</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Maitama, Abuja', img: 'https://images.unsplash.com/photo-1590644365607-1c5a519a7a37', count: '42 Properties' },
            { name: 'Ikoyi, Lagos', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be', count: '28 Properties' },
            { name: 'Guzape, Abuja', img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf', count: '15 Properties' },
          ].map((loc) => (
            <div key={loc.name} className="relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url(${loc.img})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm opacity-80">{loc.count}</p>
                <h4 className="text-xl font-bold">{loc.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. THE PROCESS (Building Trust) */}
        <HowWeWork />

      {/* 6. STATISTICS (Proof of Scale) */}
      <section className="py-20 border-b">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><h5 className="text-4xl font-bold">₦15B+</h5><p className="text-muted-foreground">Portfolio Value</p></div>
          <div><h5 className="text-4xl font-bold">500+</h5><p className="text-muted-foreground">Happy Clients</p></div>
          <div><h5 className="text-4xl font-bold">12+</h5><p className="text-muted-foreground">Prime Locations</p></div>
          <div><h5 className="text-4xl font-bold">100%</h5><p className="text-muted-foreground">Title Verification</p></div>
        </div>
      </section>

      {/* 7. AGENT/MAESTRO SECTION (Personalization) */}
      <section className="py-24 px-6 max-w-7xl mx-auto bg-primary/5 rounded-[3rem] my-12">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a" className="rounded-2xl w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all" alt="Agent" />
          </div>
          <div className="flex-1 space-y-6">
            <h3 className="text-4xl font-bold">Speak with a Consultant</h3>
            <p className="text-lg text-muted-foreground italic">"Our mission is to bridge the gap between architectural vision and your reality. We don't just sell property; we curate futures."</p>
            <div className="flex gap-4">
              <Button size="lg" className="rounded-full bg-primary"><Phone className="mr-2" /> Call Now</Button>
              <Button size="lg" variant="outline" className="rounded-full">WhatsApp</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS (Social Proof) */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-12 uppercase tracking-widest text-primary">Testimonials</h3>
          <p className="text-2xl font-medium leading-relaxed">
            "Belhomz made finding our home in Guzape an effortless journey. Their attention to detail and transparency is unmatched in Nigeria's real estate market."
          </p>
          <div className="mt-8">
            <p className="font-bold">Engr. Olumide A.</p>
            <p className="text-sm text-muted-foreground">Real Estate Investor</p>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA SECTION */}
      <section className="bg-primary text-primary-foreground py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">Invest in Your <br /> Future Today.</h2>
          <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full h-16 px-12 text-xl font-bold">
            Get Started
          </Button>
        </div>
      </section>

  
    </div>
  );
}