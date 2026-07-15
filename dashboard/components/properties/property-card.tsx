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
    if (currentImgIndex < images.length - 1) {
      setCurrentImgIndex((prev) => prev + 1);
    } else {
      setCurrentImgIndex(0);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImgIndex > 0) {
      setCurrentImgIndex((prev) => prev - 1);
    } else {
      setCurrentImgIndex(images.length - 1);
    }
  };

  return (
      <Link href={detailHref}>
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer bg-[#0D0F12] border border-zinc-800 rounded-2xl flex flex-col p-0">

          {/* Top Image Section (Reduced height to aspect-[4/3] to fit portrait mobile captures perfectly) */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950 shrink-0">
            {images.length > 0 ? (
                <img
                    src={images[currentImgIndex].url}
                    alt={`${property.title} - View ${currentImgIndex + 1}`}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.02]"
                />
            ) : (
                <div className="flex h-full items-center justify-center text-zinc-500">
                  No image
                </div>
            )}

            {/* Reels-style Segmented Progress Bar (Tightly pinned to top boundary) */}
            {hasMultipleImages && (
                <div className="absolute top-1.5 left-3 right-3 z-20 flex gap-1">
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

            {/* Badge Overlays (Sits snuggly directly below the progress bar line) */}
            <div className="absolute top-4 left-3 right-3 z-10 flex justify-between items-center pointer-events-none">
              <Badge variant={STATUS_TONE[property.status]} className="shadow-md backdrop-blur-sm pointer-events-auto text-[10px] py-0 px-2 h-5">
                {property.status}
              </Badge>
              {hasMultipleImages && (
                  <span className="text-[9px] bg-black/60 text-white font-semibold px-1.5 py-0.5 rounded-full backdrop-blur-sm">
            {currentImgIndex + 1}/{images.length}
          </span>
              )}
            </div>

            {/* Image Navigation Stepper Controls */}
            {hasMultipleImages && (
                <div className="absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                      type="button"
                      onClick={handlePrevImage}
                      className="p-1 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm transition pointer-events-auto"
                      aria-label="Previous image"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                      type="button"
                      onClick={handleNextImage}
                      className="p-1 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm transition pointer-events-auto"
                      aria-label="Next image"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
            )}
          </div>

          {/* Text Area Below Image (Dark, cleanly structured content) */}
          <div className="p-4 flex flex-col justify-between flex-grow">
            <div>
              <p className="font-display text-lg font-bold tracking-tight text-zinc-600">
                {formatCurrency(property.price)}
              </p>

              {/* Title / Description */}
              <h3 className="mt-1 text-sm font-medium text-zinc-600 line-clamp-2 leading-relaxed">
                {property.title}
              </h3>

              {/* Attributes */}
              <div className="mt-3.5 flex items-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1 truncate max-w-[70%]">
            <MapPin className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span className="truncate">{property.location}</span>
          </span>
                <span className="flex items-center gap-1 shrink-0 ml-auto">
            <Ruler className="h-3.5 w-3.5 text-zinc-500" />
                  {property.size}m²
          </span>
              </div>
            </div>

            {/* Bottom Link Action (Matches the "View on IG" visual accent) */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-[var(--color-brass,theme(colors.amber.500))] group-hover:text-[var(--color-brass-hover,theme(colors.amber.400))] transition-colors duration-200">
              <span>{isAdmin ? "Manage Property" : "View Details"}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </Card>
      </Link>
  );
}