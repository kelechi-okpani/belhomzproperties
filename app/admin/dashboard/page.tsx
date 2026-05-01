'use client';

import { mockProperties, mockAgents, mockInquiries } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Properties',
      value: mockProperties.length,
      icon: '🏠',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Active Agents',
      value: mockAgents.length,
      icon: '👥',
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'New Inquiries',
      value: mockInquiries.filter((i) => i.status === 'new').length,
      icon: '💬',
      color: 'bg-orange-50 text-orange-700',
    },
    {
      label: 'Featured Listings',
      value: mockProperties.filter((p) => p.featured).length,
      icon: '⭐',
      color: 'bg-yellow-50 text-yellow-700',
    },
  ];

  const recentInquiries = mockInquiries.slice(-5).reverse();
  const topAgents = mockAgents
    .map((agent) => ({
      ...agent,
      listingCount: mockProperties.filter((p) => p.agentId === agent.id).length,
    }))
    .sort((a, b) => b.listingCount - a.listingCount);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here&apos;s an overview of your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${stat.color}`}>
                Active
              </span>
            </div>
            <h3 className="text-muted-foreground text-sm mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Recent Inquiries</h2>
            {recentInquiries.length > 0 ? (
              <div className="space-y-4">
                {recentInquiries.map((inquiry) => {
                  const property = mockProperties.find((p) => p.id === inquiry.propertyId);
                  return (
                    <div key={inquiry.id} className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted transition">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{inquiry.name}</p>
                        <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Interested in: <span className="font-medium text-foreground">{property?.title}</span>
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
                        inquiry.status === 'new'
                          ? 'bg-green-50 text-green-700'
                          : inquiry.status === 'contacted'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-50 text-gray-700'
                      }`}>
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No inquiries yet</p>
            )}
          </div>
        </div>

        {/* Top Agents */}
        <div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Top Agents</h2>
            <div className="space-y-4">
              {topAgents.map((agent, idx) => (
                <div key={agent.id} className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.listingCount} listings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
