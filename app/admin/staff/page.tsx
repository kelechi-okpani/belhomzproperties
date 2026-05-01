'use client';

import { useState } from 'react';
import Image from 'next/image';
import { mockAgents, mockProperties } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  bio: string;
  specialties: string[];
  listings: number;
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Agent[]>(mockAgents);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Agent>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'specialties' ? value.split(',').map((s) => s.trim()) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setStaff(
        staff.map((s) =>
          s.id === editingId ? { ...s, ...formData } as Agent : s
        )
      );
    } else {
      setStaff([
        ...staff,
        {
          id: Date.now().toString(),
          name: formData.name || '',
          email: formData.email || '',
          phone: formData.phone || '',
          image: formData.image || 'https://via.placeholder.com/400',
          bio: formData.bio || '',
          specialties: formData.specialties || [],
          listings: 0,
        },
      ]);
    }
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  };

  const handleEdit = (agent: Agent) => {
    setFormData(agent);
    setEditingId(agent.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      setStaff(staff.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground mt-2">Manage agents and team members</p>
        </div>
        <Button
          onClick={() => {
            setFormData({});
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : '+ Add Staff Member'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">
            {editingId ? 'Edit Staff Member' : 'New Staff Member'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleFormChange}
                  placeholder="Full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleFormChange}
                  placeholder="Email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleFormChange}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                <Input
                  type="url"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleFormChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleFormChange}
                placeholder="Professional bio"
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Specialties (comma-separated)
              </label>
              <Input
                type="text"
                name="specialties"
                value={Array.isArray(formData.specialties) ? formData.specialties.join(', ') : ''}
                onChange={handleFormChange}
                placeholder="Luxury Homes, Waterfront Properties"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {editingId ? 'Update Staff Member' : 'Add Staff Member'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staff.map((agent) => {
          const agentListings = mockProperties.filter((p) => p.agentId === agent.id).length;
          return (
            <div key={agent.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition">
              <div className="flex">
                <div className="relative w-24 h-24 bg-muted flex-shrink-0 overflow-hidden">
                  <Image
                    src={agent.image}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground">{agent.email}</p>
                    <p className="text-xs text-accent font-semibold mt-1">{agentListings} Active Listings</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(agent)}
                      className="text-primary hover:underline text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="text-red-600 hover:underline text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {agent.specialties.length > 0 && (
                <div className="px-4 py-3 border-t border-border bg-muted/50">
                  <p className="text-xs font-semibold text-foreground mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {staff.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No staff members yet</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Add First Staff Member
          </Button>
        </div>
      )}
    </div>
  );
}
