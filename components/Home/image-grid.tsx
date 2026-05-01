"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Bed, Bath, Move } from "lucide-react";

const properties = [
    
  {
    id: 1,
    name: "Eko Atlantic Villa",
    location: "Victoria Island, Lagos",
    price: "₦450,000,000",
    beds: 5,
    baths: 6,
    sqft: "1,200",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "The Gables Penthouse",
    location: "Guzape, Abuja",
    price: "₦280,000,000",
    beds: 4,
    baths: 4,
    sqft: "850",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Sunset Ridge Estate",
    location: "Lekki Phase 1, Lagos",
    price: "₦150,000,000",
    beds: 3,
    baths: 3,
    sqft: "600",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function ImageGrid() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property, idx) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
              <Image
                src={property.image}
                alt={property.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-black">
                  New Listing
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-bold">{property.name}</h4>
                <p className="font-semibold text-primary">{property.price}</p>
              </div>
              
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin size={14} className="mr-1" />
                {property.location}
              </div>

              <div className="flex gap-4 pt-2 border-t text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Bed size={16} /> {property.beds}</span>
                <span className="flex items-center gap-1"><Bath size={16} /> {property.baths}</span>
                <span className="flex items-center gap-1"><Move size={16} /> {property.sqft} m²</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}