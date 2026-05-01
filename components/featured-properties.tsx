import Link from 'next/link';
import Image from 'next/image';
import { mockProperties } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export default function FeaturedProperties() {
  const featured = mockProperties.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Featured Properties</h2>
          <p className="text-lg text-muted-foreground">Handpicked luxury homes waiting for their next owner</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((property) => (
            <Link key={property.id} href={`/properties/${property.id}`}>
              <div className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary shadow-sm hover:shadow-md transition cursor-pointer">
                {/* Image */}
                <div className="relative h-72 overflow-hidden bg-muted">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition">
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
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{property.bedrooms}</span>
                      <span className="text-muted-foreground">beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{property.bathrooms}</span>
                      <span className="text-muted-foreground">baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{(property.sqft / 1000).toFixed(1)}k</span>
                      <span className="text-muted-foreground">sqft</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {property.description}
                  </p>

                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group-hover:translate-y-0 translate-y-1 opacity-0 group-hover:opacity-100 transition">
                    View Details
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/properties">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
