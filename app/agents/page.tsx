import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import { mockAgents, mockProperties } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Our Agents</h1>
          <p className="text-muted-foreground">Meet the experts behind our successful listings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockAgents.map((agent) => {
            const agentListings = mockProperties.filter((p) => p.agentId === agent.id);

            return (
              <div key={agent.id} className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary shadow-sm hover:shadow-md transition">
                <div className="grid grid-cols-1 sm:grid-cols-3">
                  {/* Image */}
                  <div className="sm:col-span-1 relative h-64 sm:h-auto bg-muted">
                    <Image
                      src={agent.image}
                      alt={agent.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="sm:col-span-2 p-6 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-1">{agent.name}</h2>
                      <p className="text-accent font-semibold mb-4">{agent.listings} Active Listings</p>

                      <p className="text-muted-foreground text-sm mb-4">{agent.bio}</p>

                      <div className="mb-4">
                        <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Specialties</p>
                        <div className="flex flex-wrap gap-2">
                          {agent.specialties.map((spec) => (
                            <span
                              key={spec}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="block font-semibold text-foreground">{agent.email}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">{agent.phone}</p>

                      <div className="flex gap-2">
                        <Link href={`/agents/${agent.id}`} className="flex-1">
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            View Profile
                          </Button>
                        </Link>
                        <a href={`mailto:${agent.email}`} className="flex-1">
                          <Button variant="outline" className="w-full border-primary text-primary">
                            Contact
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listings Preview */}
                {agentListings.length > 0 && (
                  <div className="border-t border-border p-6 bg-muted/50">
                    <p className="text-sm font-semibold text-foreground mb-3">Recent Listings</p>
                    <div className="grid grid-cols-3 gap-2">
                      {agentListings.slice(0, 3).map((property) => (
                        <Link key={property.id} href={`/properties/${property.id}`}>
                          <div className="relative h-20 rounded overflow-hidden border border-border hover:border-primary cursor-pointer group">
                            <Image
                              src={property.images[0]}
                              alt={property.title}
                              fill
                              className="object-cover group-hover:scale-105 transition"
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
