# Luxury Real Estate Platform - Deployment Guide

## Overview

This is a modern luxury real estate platform built with Next.js 16, featuring a public-facing website for browsing properties and an admin dashboard for managing listings, inquiries, and staff.

## Features

### Public Site
- Landing page with featured properties
- Property search and filtering
- Detailed property pages with image galleries
- Agent directory and profiles
- Contact forms and inquiry management

### Admin Dashboard
- Property management (CRUD operations)
- Inquiry tracking with status updates
- Staff/agent management
- Dashboard analytics
- Role-based access control

### Authentication
- Next-Auth v5 for secure authentication
- Admin and agent roles
- Protected routes and middleware

## Demo Credentials

- **Admin**: admin@realestate.com / admin123
- **Agent**: agent@realestate.com / admin123

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
app/
├── page.tsx                 # Homepage
├── properties/              # Public properties listing
├── agents/                  # Public agents directory
├── contact/                 # Contact page
├── login/                   # Authentication
└── admin/                   # Admin dashboard
    ├── dashboard/           # Overview and analytics
    ├── properties/          # Property management
    ├── inquiries/           # Inquiry tracking
    └── staff/               # Staff management

components/
├── navigation.tsx           # Main navigation
├── featured-properties.tsx  # Property showcase
├── agent-showcase.tsx       # Agent cards
├── admin-sidebar.tsx        # Admin navigation
└── property-form.tsx        # Property management form

lib/
└── mock-data.ts            # Sample data (replaceable with database)

auth.ts                      # Next-Auth configuration
```

## Environment Variables

Currently, the application uses mock data. To add real integrations:

### Cloudinary (Optional - for image uploads)
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Database Integration (Future)
When ready to replace mock data with a real database, update `lib/mock-data.ts` to connect to:
- Supabase
- Neon
- AWS Aurora
- Or any other database

## Key Modifications for Production

### 1. Replace Mock Data
Update `lib/mock-data.ts` to fetch from your database instead of returning hardcoded arrays.

### 2. Add Database Integration
```typescript
// Example: Replace mockProperties with database query
const properties = await db.properties.findAll();
```

### 3. Implement Image Upload
- Connect Cloudinary or Vercel Blob for property images
- Update property form to handle uploads
- Replace hardcoded image URLs with dynamic paths

### 4. Add Email Notifications
- Send emails when new inquiries arrive
- Confirmation emails for property submissions
- Agent notifications

### 5. Configure Authentication
- Update mock users in `auth.config.ts` with real user database
- Implement proper password hashing with bcrypt
- Add optional OAuth providers (Google, GitHub, etc.)

### 6. Security Hardening
- Add rate limiting to forms
- Implement CSRF protection
- Validate all inputs server-side
- Add request logging and monitoring

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial luxury real estate platform"
git push origin main
```

### 2. Deploy to Vercel
```bash
# Using Vercel CLI
vercel

# Or via Vercel Dashboard:
# 1. Go to https://vercel.com/dashboard
# 2. Click "Add New..." > "Project"
# 3. Select your GitHub repository
# 4. Click "Deploy"
```

### 3. Set Environment Variables
In Vercel Dashboard:
1. Go to Settings > Environment Variables
2. Add any required variables (Cloudinary keys, database URLs, etc.)
3. Redeploy

## Testing

### Admin Dashboard
1. Visit [http://localhost:3000/login](http://localhost:3000/login)
2. Use demo credentials to sign in
3. Explore dashboard features

### Public Site
1. Browse properties and agents
2. Submit inquiry forms
3. Test search and filtering

## Performance Optimizations

- Images are optimized with Next.js Image component
- Responsive design works on all devices
- CSS is optimized with Tailwind
- Client-side session management with next-auth

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Support & Maintenance

### Common Issues

**Properties not showing?**
- Check `lib/mock-data.ts` for sample data
- Ensure database connection if using real data

**Admin dashboard not accessible?**
- Clear browser cache and cookies
- Re-login with correct credentials
- Check middleware configuration in `middleware.ts`

**Images not loading?**
- Verify image URLs are valid
- Check Cloudinary configuration (if using)
- Use placeholder images during development

## Future Enhancements

- [ ] Real database integration
- [ ] Cloudinary image uploads
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Virtual tours
- [ ] Mortgage calculator
- [ ] Favorite properties list
- [ ] Saved searches

## License

This project is provided as-is for use and modification.
