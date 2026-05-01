export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  featured: boolean;
  agentId: string;
  createdAt: string;
  type: 'sale' | 'rent';
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  bio: string;
  specialties: string[];
  listings: number;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}

// Mock properties data
export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxurious Penthouse in Downtown',
    description: 'Modern penthouse with panoramic city views, private elevator, and state-of-the-art amenities.',
    price: 2500000,
    location: 'Downtown, New York',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 3500,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9a485dc25a8f?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ],
    featured: true,
    agentId: '2',
    createdAt: new Date().toISOString(),
    type: 'sale',
  },
  {
    id: '2',
    title: 'Contemporary Waterfront Villa',
    description: 'Stunning waterfront property with private beach access, infinity pool, and modern architecture.',
    price: 4200000,
    location: 'Malibu, California',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 5200,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1560070132-3ca02290e94c?w=800&q=80',
    ],
    featured: true,
    agentId: '2',
    createdAt: new Date().toISOString(),
    type: 'sale',
  },
  {
    id: '3',
    title: 'Historic Townhouse with Garden',
    description: 'Elegant brownstone in prestigious neighborhood with private garden and high ceilings.',
    price: 1800000,
    location: 'Brooklyn Heights, New York',
    bedrooms: 4,
    bathrooms: 2,
    sqft: 3200,
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0db6e1e?w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    ],
    featured: false,
    agentId: '2',
    createdAt: new Date().toISOString(),
    type: 'sale',
  },
  {
    id: '4',
    title: 'Modern Apartment with City View',
    description: 'Sleek apartment in vibrant neighborhood, hardwood floors, floor-to-ceiling windows.',
    price: 1200000,
    location: 'Upper East Side, New York',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1800,
    images: [
      'https://images.unsplash.com/photo-1545457945-7d5f5a74f1a1?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    ],
    featured: true,
    agentId: '2',
    createdAt: new Date().toISOString(),
    type: 'sale',
  },
];

// Mock agents data
export const mockAgents: Agent[] = [
  {
    id: '2',
    name: 'John Smith',
    email: 'john@realestate.com',
    phone: '+1 (555) 123-4567',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'Luxury real estate specialist with over 15 years of experience in high-end properties.',
    specialties: ['Luxury Homes', 'Waterfront Properties', 'Investment Properties'],
    listings: 24,
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah@realestate.com',
    phone: '+1 (555) 234-5678',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    bio: 'Expert in residential properties with a focus on first-time homebuyers.',
    specialties: ['Residential', 'New Developments', 'First-Time Buyers'],
    listings: 18,
  },
];

// Mock inquiries data
export const mockInquiries: Inquiry[] = [];
