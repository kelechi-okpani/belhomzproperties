'use client';

import { useState } from 'react';
import { Property, mockAgents } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PropertyFormProps {
  onSave: (property: Property) => void;
  initialData?: Property;
}

export default function PropertyForm({ onSave, initialData }: PropertyFormProps) {
  const [formData, setFormData] = useState<Partial<Property>>(
    initialData || {
      title: '',
      description: '',
      price: 0,
      location: '',
      bedrooms: 0,
      bathrooms: 0,
      sqft: 0,
      images: ['https://images.unsplash.com/photo-1512917774080-9a485dc25a8f?w=800&q=80'],
      featured: false,
      agentId: '2',
      type: 'sale',
    }
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'sqft'
        ? Number(value)
        : finalValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      onSave({
        id: initialData?.id || Date.now().toString(),
        title: formData.title || '',
        description: formData.description || '',
        price: formData.price || 0,
        location: formData.location || '',
        bedrooms: formData.bedrooms || 0,
        bathrooms: formData.bathrooms || 0,
        sqft: formData.sqft || 0,
        images: formData.images || [],
        featured: formData.featured || false,
        agentId: formData.agentId || '2',
        type: (formData.type || 'sale') as 'sale' | 'rent',
        createdAt: initialData?.createdAt || new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h2 className="text-lg font-bold text-foreground">
        {initialData ? 'Edit Property' : 'New Property'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Title</label>
          <Input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            placeholder="Property title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Location</label>
          <Input
            type="text"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            placeholder="Location"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Price</label>
          <Input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleChange}
            placeholder="Price"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Type</label>
          <select
            name="type"
            value={formData.type || 'sale'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Bedrooms</label>
          <Input
            type="number"
            name="bedrooms"
            value={formData.bedrooms || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Bathrooms</label>
          <Input
            type="number"
            name="bathrooms"
            value={formData.bathrooms || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Square Feet</label>
          <Input
            type="number"
            name="sqft"
            value={formData.sqft || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Agent</label>
          <select
            name="agentId"
            value={formData.agentId || '2'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            {mockAgents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Property description"
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          required
        />
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured || false}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-foreground">Featured Property</span>
        </label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {isLoading ? 'Saving...' : 'Save Property'}
        </Button>
      </div>
    </form>
  );
}
