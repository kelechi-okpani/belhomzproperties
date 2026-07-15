"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Ruler, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  size: number;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  images: { url: string }[];
}

const STATUS_TONE = {
  AVAILABLE: "default",
  RESERVED: "secondary",
  SOLD: "destructive",
} as const;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

interface PropertyCardProps {
  property: Property;
  isAdmin?: boolean;
}

export function PropertyCard({ property, isAdmin = false }: PropertyCardProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const images = property.images || [];
  const hasMultipleImages = images.length > 1;

  const detailHref = isAdmin
      ? `/account/property/${property.id}`
      : `/properties/${property.id}`;

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  return (
      <Link href={detailHref} className="block group">
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-card border-border rounded-2xl flex flex-col h-full p-0">

          {/* Image Container */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted shrink-0">
            {images.length > 0 ? (
                <img
                    src={images[currentImgIndex].url}
                    alt={`${property.title} - View ${currentImgIndex + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-xs font-medium">
                  No image available
                </div>
            )}

            {/* Segmented Image Progress Indicator */}
            {hasMultipleImages && (
                <div className="absolute top-2 left-3 right-3 z-20 flex gap-1">
                  {images.map((_, idx) => (
                      <div
                          key={idx}
                          className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                              idx === currentImgIndex ? "bg-white" : "bg-white/40"
                          }`}
                      />
                  ))}
                </div>
            )}

            {/* Status Badge & Counters Overlay */}
            <div className="absolute top-4 left-3 right-3 z-10 flex justify-between items-center pointer-events-none">
              <Badge variant={STATUS_TONE[property.status]} className="shadow-sm backdrop-blur-md text-[10px] uppercase font-bold py-0.5 px-2">
                {property.status}
              </Badge>
              {hasMultipleImages && (
                  <span className="text-[10px] bg-black/60 text-white font-semibold px-2 py-0.5 rounded-full backdrop-blur-md">
                {currentImgIndex + 1}/{images.length}
              </span>
              )}
            </div>

            {/* Carousel Next/Prev Controls */}
            {hasMultipleImages && (
                <div className="absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                      type="button"
                      onClick={handlePrevImage}
                      className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm transition pointer-events-auto"
                      aria-label="Previous image"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                      type="button"
                      onClick={handleNextImage}
                      className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm transition pointer-events-auto"
                      aria-label="Next image"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
            )}
          </div>

          {/* Card Content Block */}
          <div className="p-4 flex flex-col justify-between flex-grow">
            <div className="space-y-1.5">
              <p className="font-display text-lg font-bold tracking-tight text-foreground">
                {formatCurrency(property.price)}
              </p>

              <h3 className="text-sm font-medium text-foreground/90 line-clamp-2 leading-snug">
                {property.title}
              </h3>

              <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground gap-2">
              <span className="flex items-center gap-1 min-w-0">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{property.location}</span>
              </span>
                <span className="flex items-center gap-1 shrink-0 font-medium text-foreground/80">
                <Ruler className="h-3.5 w-3.5 text-primary shrink-0" />
                  {property.size}m²
              </span>
              </div>
            </div>

            {/* Action Link Row */}
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-primary/80 transition-colors">
              <span>{isAdmin ? "Manage Property" : "View Details"}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

        </Card>
      </Link>
  );
}