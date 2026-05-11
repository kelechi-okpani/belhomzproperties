"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowUpRight, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const reels = [
  { id: 1, embedId: "DXr4qPVAsr9", title: "Maitama Heights", category: "Luxury Residential" },
  { id: 2, embedId: "DW65kbSgq-2", title: "The Penthouse", category: "Interior Design" },
  { id: 3, embedId: "DXHP5bQgjZP", title: "Guzape Villas", category: "Development" },
  { id: 4, embedId: "DWqOLB-gtfU", title: "Premium Suites", category: "Commercial" },
  { id: 5, embedId: "DWRpcV6gp58", title: "Project Skyline", category: "Construction" },
  { id: 6, embedId: "DWODjAmAkRl", title: "Asokoro Grande", category: "Exclusive" },
  { id: 7, embedId: "DWEWlzWAhy5", title: "The Atrium", category: "Architecture" },
  { id: 8, embedId: "DVxjs9Ggskd", title: "Modern Terrace", category: "Residential" },
  { id: 9, embedId: "DVvwHeLAkZl", title: "The Courtyard", category: "Architecture" },
  { id: 10, embedId: "DVqsaYdAsmJ", title: "Urban Oasis", category: "Development" },
  { id: 11, embedId: "DVfn3qDAgnU", title: "Sky Garden", category: "Exterior" },
];

// ProfessionalReels

export default function ProfessionalReels() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <Badge variant="outline" className="border-primary text-primary font-bold uppercase tracking-widest px-4 py-1">
              Live Showcase
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tighter">
              Architecture in <span className="italic font-light text-primary">Motion.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-lg">
            Direct glimpses into Nigeria's most prestigious developments, updated in real-time.
          </p>
        </div>

        {/* Carousel Container */}
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4">
            {reels.map((reel) => (
              <CarouselItem key={reel.id} className="pl-4 basis-full sm:basis-1/1 lg:basis-1/2 xl:basis-1/3">
                <Card className="border-none bg-transparent w-full h-full">
                  <CardContent className="p-0 w-full relative aspect-[6/8]  overflow-hidden shadow-2xl  ring-1 ring-border/50 bg-secondary/10">
                    
                    {/* Native Instagram Embed */}
                    <iframe
                    
                      src={`https://www.instagram.com/belhomzproperties/reel/${reel.embedId}/embed/captioned`}
                      // src={`https://www.instagram.com/belhomzproperties/reel/${reel.embedId}/embed/captioned/`}
                      className="absolute inset-0 w-full h-full object-cover "
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency={true}
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    ></iframe>

                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Luxury Controls */}
          <div className="flex justify-center md:justify-end gap-4 mt-12">
            <CarouselPrevious className="static translate-y-0 h-14 w-14 border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-lg" />
            <CarouselNext className="static translate-y-0 h-14 w-14 border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-lg" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}