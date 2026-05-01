'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import { mockProperties, mockAgents } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = mockProperties.find((p) => p.id === params.id);
  const agent = mockAgents.find((a) => a.id === property?.agentId);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">Property not found</h1>
          <Link href="/properties">
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/properties" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Properties
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">{property.title}</h1>
          <p className="text-lg text-muted-foreground">{property.location}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-4 bg-muted">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              {property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {property.images.map((img, idx) => (
                    <div key={idx} className="relative h-24 rounded-lg overflow-hidden bg-muted border border-border hover:border-primary cursor-pointer">
                      <Image
                        src={img}
                        alt={`Gallery ${idx}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-card border border-border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Property Details</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Bedrooms</p>
                  <p className="text-2xl font-bold text-foreground">{property.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Bathrooms</p>
                  <p className="text-2xl font-bold text-foreground">{property.bathrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Square Feet</p>
                  <p className="text-2xl font-bold text-foreground">{property.sqft.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Price per Sqft</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${(property.price / property.sqft).toFixed(0)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Description</h3>
                <p className="text-foreground leading-relaxed">{property.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Price Card */}
            <div className="bg-card border border-border rounded-lg p-8 mb-8 sticky top-24">
              <p className="text-sm text-muted-foreground mb-2">List Price</p>
              <p className="text-4xl font-bold text-primary mb-6">
                ${(property.price / 1000000).toFixed(1)}M
              </p>

              {/* Agent Card */}
              {agent && (
                <div className="mb-6 pb-6 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground mb-4">Listing Agent</h3>
                  <div className="flex gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={agent.image}
                        alt={agent.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">{agent.listings} Listings</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{agent.email}</p>
                  <p className="text-sm text-muted-foreground">{agent.phone}</p>
                </div>
              )}

              {/* Inquiry Form */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-4">Interested?</h3>
                {submitted ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    Thank you! We&apos;ll be in touch soon.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="text-sm"
                    />
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="text-sm"
                    />
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="text-sm"
                    />
                    <textarea
                      name="message"
                      placeholder="Message (optional)"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                    />
                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Send Inquiry
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-3xl font-bold text-foreground mb-8">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockProperties
              .filter((p) => p.id !== property.id)
              .slice(0, 3)
              .map((sim) => (
                <Link key={sim.id} href={`/properties/${sim.id}`}>
                  <div className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary shadow-sm hover:shadow-md transition cursor-pointer">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <Image
                        src={sim.images[0]}
                        alt={sim.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition">
                        {sim.title}
                      </h3>
                      <p className="text-sm text-primary font-bold mb-2">
                        ${(sim.price / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-muted-foreground">{sim.location}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
