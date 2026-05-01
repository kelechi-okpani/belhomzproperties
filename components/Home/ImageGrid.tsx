"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Bed, Bath, Move } from "lucide-react";

const properties = [
  { id: 1, name: "Maitama Manor", location: "Maitama, Abuja", price: "₦450M", beds: 5, baths: 6, sqft: "1,200", image: "/slide/1.jpg" },
  { id: 2, name: "Guzape Heights", location: "Guzape, Abuja", price: "₦280M", beds: 4, baths: 4, sqft: "850", image: "/slide/2.jpg" },
  { id: 3, name: "Asokoro Diplomatic", location: "Asokoro, Abuja", price: "₦550M", beds: 6, baths: 7, sqft: "1,500", image: "/slide/3.jpg" },
  { id: 4, name: "Jabi Lake View", location: "Jabi, Abuja", price: "₦190M", beds: 3, baths: 3, sqft: "450", image: "/slide/4.jpg" },
  { id: 5, name: "Wuse Premium", location: "Wuse II, Abuja", price: "₦320M", beds: 4, baths: 5, sqft: "900", image: "/slide/5.jpg" },
  { id: 6, name: "Garki Modern", location: "Garki, Abuja", price: "₦150M", beds: 3, baths: 3, sqft: "400", image: "/slide/6.jpg" },
  { id: 7, name: "Katampe Hillside", location: "Katampe, Abuja", price: "₦410M", beds: 5, baths: 5, sqft: "1,100", image: "/slide/7.jpg" },
  { id: 8, name: "Lifecamp Villa", location: "Lifecamp, Abuja", price: "₦210M", beds: 4, baths: 4, sqft: "700", image: "/slide/8.jpg" },
  { id: 9, name: "Central Penthouses", location: "CBD, Abuja", price: "₦600M", beds: 4, baths: 6, sqft: "1,300", image: "/slide/9.jpg" },
  { id: 10, name: "Luxury Estate", location: "Lugbe, Abuja", price: "₦85M", beds: 3, baths: 3, sqft: "350", image: "/slide/10.jpg" },
];

// Double the array for seamless looping
const infiniteProperties = [...properties, ...properties];

export default function ContinuousCarousel() {
  return (
    <div className="relative w-full overflow-hidden py-12 bg-background">
      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <h2 className="text-4xl font-light tracking-tight">
          Featured <span className="font-serif italic text-primary">Properties</span>
        </h2>
      </div>

      <motion.div
        className="flex gap-8"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 40, // Increased duration for a smoother drift
          ease: "linear",
          repeat: Infinity,
        }}
        // Pauses the animation when the user is looking at a specific card
        whileHover={{ animationPlayState: "paused" }}
        style={{ width: "fit-content" }}
      >
        {infiniteProperties.map((property, idx) => (
          <div
            key={`${property.id}-${idx}`}
            className="w-[380px] flex-shrink-0 group cursor-pointer"
          >
            {/* Image Card */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted shadow-xl">
              <Image
                src={property.image}
                alt={property.name}
                fill
                sizes="380px"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              {/* Overlay Label */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-black/20 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  {property.location.split(",")[0]}
                </span>
              </div>

              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
              
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-xs font-medium text-primary mb-2 uppercase tracking-widest">
                  {property.location}
                </p>
                <h4 className="text-2xl font-semibold tracking-tight mb-4">{property.name}</h4>
                
                {/* Embedded Stats for a cleaner look */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  {/* <span className="text-xl font-bold">{property.price}</span> */}
                  {/* <div className="flex gap-3 opacity-80 text-[10px]"> */}
                     {/* <span className="flex items-center gap-1"><Bed size={12}/> {property.beds}</span> */}
                     {/* <span className="flex items-center gap-1"><Bath size={12}/> {property.baths}</span> */}
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Edge Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background via-background/50 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background via-background/50 to-transparent z-20" />
    </div>
  );
}