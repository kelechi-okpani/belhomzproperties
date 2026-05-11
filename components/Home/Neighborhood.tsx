'use client';

import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const locations = [
  { 
    name: 'Maitama', 
    city: 'Abuja',
    img: '/slide/10.jpg', 
    count: '42',
    description: 'The epicenter of diplomatic residence and structural legacy.',
    size: 'large' 
  },
  { 
    name: 'karasana', 
    city: 'Abuja',
    img: '/slide/9.jpg', 
    count: '28',
    description: 'Island luxury defined by high-yield waterfront assets.',
    size: 'small'
  },
  { 
    name: 'Guzape', 
    city: 'Abuja',
    img: '/slide/7.jpg', 
    count: '15',
    description: 'Elevated topography featuring brutalist hillside mansions.',
    size: 'small'
  }
];

export default function NeighborhoodBento() {
  return (
    <section className="py-32 px-6 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-4 block">
            Strategic Geographies
          </span>
          <h3 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
            Exclusive <span className="text-muted-foreground/40 italic font-light">Neighborhoods.</span>
          </h3>
        </div>
        <p className="text-muted-foreground max-w-xs text-sm font-medium leading-relaxed">
          Curated access to high-growth districts across Nigeria’s primary economic hubs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-3 gap-6 h-auto md:h-[700px]">
        {/* Maitama - Large Feature */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-6 lg:col-span-2 relative rounded-[2.5rem] overflow-hidden group border border-border"
        >
          <div className="absolute inset-0 bg-[url('/slide/20.jpg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
          
          <div className="absolute top-8 right-8">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
              <ArrowUpRight size={20} />
            </div>
          </div>

          <div className="absolute bottom-10 left-10 right-10 text-white">
            <Badge className="mb-4 bg-primary text-white border-none px-4 py-1 rounded-full text-[10px] uppercase tracking-widest">
              Flagship District
            </Badge>
            <h4 className="text-4xl md:text-5xl font-bold tracking-tighter">{locations[0].name}, {locations[0].city}</h4>
            <div className="flex items-center justify-between mt-4">
              <p className="text-white/60 text-sm max-w-sm font-medium">{locations[0].description}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold py-2 px-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                {locations[0].count} Assets
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Vertical Stack */}
        <div className="md:col-span-6 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {locations.slice(1).map((loc) => (
            <motion.div 
              key={loc.name}
              whileHover={{ y: -5 }}
              className="relative rounded-[2rem] overflow-hidden group border border-border"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                style={{ backgroundImage: `url(${loc.img})` }} 
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-2xl font-bold tracking-tight">{loc.name}</h4>
                    <p className="text-xs text-white/50 uppercase tracking-widest mt-1">{loc.city}</p>
                  </div>
                  <p className="text-[10px] font-bold opacity-60">{loc.count} Properties</p>
                </div>
                <p className="text-sm text-white/70 mt-4 line-clamp-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {loc.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}