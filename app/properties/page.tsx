'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import { mockProperties } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [bedroomFilter, setBedroomFilter] = useState(0);

  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
      const matchesBedrooms = bedroomFilter === 0 || property.bedrooms >= bedroomFilter;

      return matchesSearch && matchesPrice && matchesBedrooms;
    });
  }, [searchTerm, minPrice, maxPrice, bedroomFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Properties</h1>
          <p className="text-muted-foreground">Browse our exclusive collection of luxury properties</p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="font-bold text-foreground mb-4">Search & Filter</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Search</label>
              <Input
                type="text"
                placeholder="Property or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Min Price</label>
              <Input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Max Price</label>
              <Input
                type="number"
                placeholder="5000000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Min Bedrooms</label>
              <select
                value={bedroomFilter}
                onChange={(e) => setBedroomFilter(Number(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value={0}>Any</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">{filteredProperties.length} properties found</p>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <div className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary shadow-sm hover:shadow-md transition cursor-pointer h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-72 overflow-hidden bg-muted">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition">
                      {property.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4">{property.location}</p>

                    {/* Price */}
                    <div className="mb-4 pb-4 border-b border-border">
                      <p className="text-2xl font-bold text-primary">
                        ${(property.price / 1000000).toFixed(1)}M
                      </p>
                    </div>

                    {/* Details */}
                    <div className="flex gap-4 mb-4 text-sm text-foreground">
                      <div>
                        <span className="font-semibold">{property.bedrooms}</span>
                        <span className="text-muted-foreground"> beds</span>
                      </div>
                      <div>
                        <span className="font-semibold">{property.bathrooms}</span>
                        <span className="text-muted-foreground"> baths</span>
                      </div>
                      <div>
                        <span className="font-semibold">{(property.sqft / 1000).toFixed(1)}k</span>
                        <span className="text-muted-foreground"> sqft</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {property.description}
                    </p>

                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-auto">
                      View Details
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No properties found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setMinPrice(0);
                setMaxPrice(5000000);
                setBedroomFilter(0);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
