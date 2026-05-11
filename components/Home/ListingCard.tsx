"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, MapPin, Eye } from "lucide-react";

const listings = [
  {
    id: 1,
    title: "Ultra-Modern 5 Bed Villa",
    price: "₦750,000,000",
    location: "Maitama, Abuja",
    videoUrl: "/video/hero.mp4", 
    thumbnail: "/home/slide1.webp",
  },
  {
    id: 2,
    title: "Luxury Hilltop Mansion",
    price: "₦900,000,000",
    location: "Guzape, Abuja",
    videoUrl: "/video/guzape-tour.mp4",
    thumbnail: "/home/slide2.jpg",
  },
  // Add more listings...
];

function ListingCard({ listing }: { listing: typeof listings[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative aspect-[9/16] w-full overflow-hidden bg-zinc-900 group cursor-pointer"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={listing.videoUrl}
        poster={listing.thumbnail}
        muted
        loop
        playsInline
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-60"
        }`}
      />

      {/* Static Info Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent">
        <div className="mb-2 flex items-center gap-2 text-primary font-bold">
           <MapPin size={14} />
           <span className="text-xs uppercase tracking-widest">{listing.location}</span>
        </div>
        <h4 className="text-xl font-bold text-white mb-1">{listing.title}</h4>
        <p className="text-white/80 font-medium mb-4">{listing.price}</p>
        
        {/* Animated Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="flex gap-2"
        >
          <Button size="sm" className="w-full bg-white text-black hover:bg-primary hover:text-white transition-colors">
            View Details
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 bg-white/10 backdrop-blur-md text-white">
            <Eye size={16} />
          </Button>
        </motion.div>
      </div>

      {/* Play Icon Placeholder (When not hovered) */}
      {!isHovered && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="h-12 w-12 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
            <Play className="text-white fill-white ml-1" size={20} />
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function FeaturedVideos() {
  return (
    <section className=" py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs">Featured Tours</span>
            <h3 className="text-3xl md:text-4xl font-light text-white mt-2 leading-tight">
              Exclusive <span className="font-serif">Video Walkthroughs</span>
            </h3>
          </div>
       
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      </div>
    </section>
  );
}