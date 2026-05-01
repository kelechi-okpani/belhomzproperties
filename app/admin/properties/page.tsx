'use client';

import { useState } from 'react';
import Image from 'next/image';
import { mockProperties, mockAgents } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import PropertyForm from '@/components/property-form';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState(mockProperties);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter((p) => p.id !== id));
    }
  };

  const handleToggleFeatured = (id: string) => {
    setProperties(
      properties.map((p) =>
        p.id === id ? { ...p, featured: !p.featured } : p
      )
    );
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground mt-2">Manage all property listings</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : '+ Add Property'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8">
          <PropertyForm
            onSave={(property) => {
              if (editingId) {
                setProperties(
                  properties.map((p) => (p.id === editingId ? property : p))
                );
              } else {
                setProperties([...properties, { ...property, id: Date.now().toString() }]);
              }
              setShowForm(false);
            }}
            initialData={editingId ? properties.find((p) => p.id === editingId) : undefined}
          />
        </div>
      )}

      {/* Properties Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Property</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Agent</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {properties.map((property) => {
                const agent = mockAgents.find((a) => a.id === property.agentId);
                return (
                  <tr key={property.id} className="hover:bg-muted transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                          <Image
                            src={property.images[0]}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{property.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{property.location}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">
                        ${(property.price / 1000000).toFixed(1)}M
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {property.bedrooms}B • {property.bathrooms}B • {(property.sqft / 1000).toFixed(1)}k sqft
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{agent?.name}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleFeatured(property.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                          property.featured
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {property.featured ? '⭐ Featured' : 'Regular'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(property.id);
                            setShowForm(true);
                          }}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="text-red-600 hover:underline text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No properties yet</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create First Property
          </Button>
        </div>
      )}
    </div>
  );
}
