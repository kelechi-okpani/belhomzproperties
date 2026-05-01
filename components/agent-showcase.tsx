import Link from 'next/link';
import Image from 'next/image';
import { mockAgents } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export default function AgentShowcase() {
  return (
    <section className="py-16 md:py-24 bg-muted border-y border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Agents</h2>
          <p className="text-lg text-muted-foreground">Experienced professionals dedicated to your success</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockAgents.map((agent) => (
            <Link key={agent.id} href={`/agents/${agent.id}`}>
              <div className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary shadow-sm hover:shadow-md transition cursor-pointer">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-48 h-64 sm:h-auto relative overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={agent.image}
                      alt={agent.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-accent font-semibold mb-3">{agent.listings} Active Listings</p>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{agent.bio}</p>

                      <div className="mb-4">
                        <p className="text-xs font-semibold text-foreground mb-2">Specialties</p>
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
                      <p className="text-sm text-muted-foreground mb-3">
                        <span className="block font-semibold text-foreground">{agent.email}</span>
                        <span className="block">{agent.phone}</span>
                      </p>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Contact Agent
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/agents">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              View All Agents
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
