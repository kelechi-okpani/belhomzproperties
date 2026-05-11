'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Maximize2, 
  BedDouble, 
  Bath, 
  Square, 
  MapPin, 
  SlidersHorizontal,
  Search,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Type-safe property definition
// Expanded Type-safe property definition
interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds?: number; // Optional for land/commercial
  baths?: number;
  sqft: string;
  image: string;
  tag: 'Sale' | 'Rent' | 'Sold' | 'Lease';
  category: 'Residential' | 'Commercial' | 'Penthouse' | 'Land';
}

const properties: Property[] = [
  {
    id: '1',
    title: "The Platinum Monolith",
    location: "Maitama, Abuja",
    price: "₦850,000,000",
    beds: 6,
    baths: 7,
    sqft: "1,200m²",
    image: "/slide/14.jpg",
    tag: 'Sale',
    category: 'Residential'
  },
  {
    id: '2',
    title: "Horizon Glass Villa",
    location: "Asokoro, Abuja",
    price: "₦1,200,000,000",
    beds: 5,
    baths: 6,
    sqft: "950m²",
    image: "/slide/15.jpg",
    tag: 'Sale',
    category: 'Residential'
  },
  {
    id: '3',
    title: "The Diplomatic Vault",
    location: "Wuse II, Abuja",
    price: "₦450,000,000",
    beds: 4,
    baths: 4,
    sqft: "650m²",
    image: "/slide/12.jpg",
    tag: 'Sold',
    category: 'Penthouse'
  },
  {
    id: '4',
    title: "Skyline Executive Suite",
    location: "Central Business District, Abuja",
    price: "₦15,000,000 /yr",
    beds: 3,
    baths: 3,
    sqft: "320m²",
    image: "/slide/10.jpg",
    tag: 'Rent',
    category: 'Penthouse'
  },
  {
    id: '5',
    title: "Summit Corporate Plaza",
    location: "Garki, Abuja",
    price: "₦25,000,000 /yr",
    sqft: "1,500m²",
    image: "/slide/11.jpg",
    tag: 'Lease',
    category: 'Commercial'
  },
  {
    id: '6',
    title: "Azure Waterfront Estate",
    location: "Jabi, Abuja",
    price: "₦7,500,000 /yr",
    beds: 2,
    baths: 2,
    sqft: "180m²",
    image: "/slide/13.jpg",
    tag: 'Rent',
    category: 'Residential'
  },
  {
    id: '7',
    title: "Heritage Acres",
    location: "Guzape, Abuja",
    price: "₦320,000,000",
    sqft: "2,000m²",
    image: "/slide/9.jpg",
    tag: 'Sale',
    category: 'Land'
  }
];

export default function PropertyListingPage() {
  const [filter, setFilter] = useState('');

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* 1. ARCHITECTURAL HEADER */}
        <header className="mb-12">
          {/* ... Header Content ... */}
        </header>

        {/* 2. SEARCH INFRASTRUCTURE */}
        <div className="relative mb-16">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search size={20} />
          </div>
          <Input 
            placeholder="Search by District, Property Name, or Asset ID..." 
            className="h-20 pl-16 pr-8 bg-secondary/10 border-border rounded-[2rem] text-lg focus:ring-1 focus:ring-primary transition-all"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {/* 3. PROPERTY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              {/* WRAP CARD IN LINK */}
              <Link href={`/properties/${property.id}`} className="block cursor-pointer">
                
                {/* Image Composition */}
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 border border-border shadow-sm">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-6 left-6">
                    <Badge className={`px-4 py-2 rounded-full font-bold uppercase tracking-widest text-[10px] ${
                      property.tag === 'Sold' ? 'bg-destructive text-white' : 'bg-primary text-primary-foreground'
                    }`}>
                      {property.tag}
                    </Badge>
                  </div>

                  {/* Glass Interaction Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform">
                      <Maximize2 size={24} />
                    </div>
                  </div>
                </div>

                {/* Data Display */}
                <div className="px-2 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1 flex items-center gap-2">
                        <MapPin size={10} /> {property.location}
                      </p>
                      <h3 className="text-2xl font-bold tracking-tight">{property.title}</h3>
                    </div>
                    <p className="text-xl font-bold tracking-tighter">{property.price}</p>
                  </div>

                  {/* Technical Specs */}
                  <div className="flex items-center gap-6 py-4 border-y border-border/50 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BedDouble size={16} className="text-primary" />
                      <span className="text-sm font-medium">{property.beds}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath size={16} className="text-primary" />
                      <span className="text-sm font-medium">{property.baths}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square size={16} className="text-primary" />
                      <span className="text-sm font-medium">{property.sqft}</span>
                    </div>
                  </div>

                  <div className="w-full h-14 rounded-xl border border-transparent flex items-center justify-between px-6 font-bold text-sm bg-secondary/50 group-hover:bg-primary group-hover:text-white transition-all">
                    VIEW FULL ARCHITECTURE
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 4. LOAD PERFORMANCE INDICATOR */}
        <footer className="mt-20 py-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold">ABV / INVENTORY / 2026</p>
          {/* ... Footer Content ... */}
        </footer>
      </div>
    </div>
  );
}