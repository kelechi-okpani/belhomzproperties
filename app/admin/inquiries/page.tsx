'use client';

import { useState } from 'react';
import { mockInquiries, mockProperties } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState(mockInquiries);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');

  const handleStatusChange = (id: string, status: 'new' | 'contacted' | 'closed') => {
    setInquiries(
      inquiries.map((inq) =>
        inq.id === id ? { ...inq, status } : inq
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      setInquiries(inquiries.filter((inq) => inq.id !== id));
    }
  };

  const filteredInquiries = selectedStatus === 'all' 
    ? inquiries 
    : inquiries.filter((inq) => inq.status === selectedStatus);

  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === 'new').length,
    contacted: inquiries.filter((i) => i.status === 'contacted').length,
    closed: inquiries.filter((i) => i.status === 'closed').length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Inquiries</h1>
        <p className="text-muted-foreground mt-2">Manage property inquiries and leads</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'New', value: stats.new, color: 'bg-green-50 text-green-700' },
          { label: 'Contacted', value: stats.contacted, color: 'bg-orange-50 text-orange-700' },
          { label: 'Closed', value: stats.closed, color: 'bg-gray-50 text-gray-700' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-lg p-4`}>
            <p className="text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'new', 'contacted', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedStatus === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.length > 0 ? (
          filteredInquiries.map((inquiry) => {
            const property = mockProperties.find((p) => p.id === inquiry.propertyId);
            return (
              <div key={inquiry.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{inquiry.name}</h3>
                    <p className="text-sm text-muted-foreground">{inquiry.email} • {inquiry.phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    inquiry.status === 'new'
                      ? 'bg-green-50 text-green-700'
                      : inquiry.status === 'contacted'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-gray-50 text-gray-700'
                  }`}>
                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                  </span>
                </div>

                <div className="mb-4 pb-4 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-1">Interested Property:</p>
                  <p className="font-semibold text-foreground">{property?.title}</p>
                </div>

                {inquiry.message && (
                  <div className="mb-4 pb-4 border-b border-border">
                    <p className="text-sm text-muted-foreground mb-1">Message:</p>
                    <p className="text-foreground">{inquiry.message}</p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mb-4">
                  Received: {new Date(inquiry.createdAt).toLocaleDateString()} at {new Date(inquiry.createdAt).toLocaleTimeString()}
                </p>

                <div className="flex gap-2">
                  <select
                    value={inquiry.status}
                    onChange={(e) => handleStatusChange(inquiry.id, e.target.value as any)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                  <a href={`mailto:${inquiry.email}`}>
                    <Button variant="outline" size="sm" className="border-primary text-primary">
                      Send Email
                    </Button>
                  </a>
                  <button
                    onClick={() => handleDelete(inquiry.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">No inquiries in this status</p>
          </div>
        )}
      </div>
    </div>
  );
}
