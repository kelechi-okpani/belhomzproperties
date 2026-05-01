import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import { mockAgents, mockProperties } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const agent = mockAgents.find((a) => a.id === params.id);
  const agentProperties = mockProperties.filter((p) => p.agentId === params.id);

  if (!agent) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">Agent not found</h1>
          <Link href="/agents">
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Back to Agents
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <Link href="/agents" className="text-primary hover:underline mb-4 inline-block">
          ← Back to Agents
        </Link>

        {/* Agent Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Image & Contact */}
          <div className="md:col-span-1">
            <div className="bg-card border border-border rounded-lg overflow-hidden sticky top-24">
              <div className="relative h-80 bg-muted">
                <Image
                  src={agent.image}
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">{agent.name}</h1>
                <p className="text-accent font-semibold mb-4">{agentProperties.length} Active Listings</p>

                <div className="space-y-4 pb-4 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <a href={`mailto:${agent.email}`} className="text-primary hover:underline font-medium">
                      {agent.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <a href={`tel:${agent.phone}`} className="text-primary hover:underline font-medium">
                      {agent.phone}
                    </a>
                  </div>
                </div>

                <div className="pt-4">
                  <a href={`mailto:${agent.email}`}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-2">
                      Send Email
                    </Button>
                  </a>
                  <a href={`tel:${agent.phone}`}>
                    <Button variant="outline" className="w-full border-primary text-primary">
                      Call Now
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Specialties */}
          <div className="md:col-span-2">
            <div className="bg-card border border-border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
              <p className="text-foreground leading-relaxed mb-6">{agent.bio}</p>

              <h3 className="text-lg font-bold text-foreground mb-4">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {agent.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-primary mb-2">{agentProperties.length}</p>
                <p className="text-sm text-muted-foreground">Active Listings</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-accent mb-2">
                  ${(agentProperties.reduce((sum, p) => sum + p.price, 0) / 1000000).toFixed(0)}M
                </p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-secondary mb-2">
                  ${(agentProperties.reduce((sum, p) => sum + p.price, 0) / agentProperties.length / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-muted-foreground">Avg. Price</p>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        {agentProperties.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">Active Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agentProperties.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}>
                  <div className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary shadow-sm hover:shadow-md transition cursor-pointer h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition line-clamp-2">
                        {property.title}
                      </h3>
                      <p className="text-sm text-primary font-bold mb-2">
                        ${(property.price / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">{property.location}</p>
                      <div className="flex gap-4 text-xs text-foreground mt-auto">
                        <span>{property.bedrooms} beds</span>
                        <span>{property.bathrooms} baths</span>
                        <span>{(property.sqft / 1000).toFixed(1)}k sqft</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {agentProperties.length === 0 && (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No active listings at this time</p>
            <Link href="/properties">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                View All Properties
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
