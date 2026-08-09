# FIND - Find Everything On a Click

## Overview

FIND is a comprehensive digital platform designed specifically for Malawian students to simplify their daily challenges. The platform serves as an all-in-one solution connecting students with transportation, career opportunities, and compatible roommates. This prototype demonstrates the core functionalities of taxi booking, job searching, roommate matching, and user management.

## 🎯 Mission & Vision

**Mission**: To empower Malawian students by providing a comprehensive platform that simplifies their daily challenges and connects them with opportunities for growth and success.

**Vision**: To be the leading digital platform that transforms student life in Malawi, making education and career development accessible to all.

## 🚀 Features

### Core Services

#### 1. **Taxi Booking System**
- **Interactive Map Integration**: Google Maps-powered location selection
- **Real-time Pricing**: Dynamic fare calculation based on distance
- **Multiple Payment Options**: Support for mobile money and card payments
- **Booking Management**: Track booking status and history
- **Location Data**: Pre-populated with Malawi-specific locations

#### 2. **Job Search Platform**
- **Job Listings**: Browse available positions with detailed requirements
- **Advanced Filtering**: Search by location, qualification, and job type
- **Company Profiles**: Information about hiring organizations
- **Application Tracking**: Quick apply functionality with resume upload

#### 3. **Roommate Matching**
- **Smart Matching Algorithm**: Based on university, program, and preferences
- **Profile Compatibility**: Match students with similar academic interests
- **University Database**: Comprehensive list of Malawian universities
- **Contact Integration**: Direct messaging with potential roommates

#### 4. **User Management**
- **Authentication System**: Secure login/registration with Supabase
- **Profile Management**: Comprehensive user profiles with university details
- **Data Persistence**: Local storage and cloud synchronization
- **Password Security**: Built-in password validation

#### 5. **AI Assistant**
- **Intelligent Chatbot**: Powered by Victor Balawe (team member)
- **Contextual Help**: Assistance with navigation, booking, and general queries
- **24/7 Availability**: Always-on support for user queries
- **Multi-purpose Support**: Handles taxi, jobs, roommates, and app navigation

### Additional Features

#### 6. **Live Statistics Dashboard**
- **Real-time Metrics**: Display platform usage statistics
- **User Engagement**: Track active users and service utilization
- **Performance Monitoring**: System health and response times

#### 7. **Information Pages**
- **About Us**: Platform mission, vision, and team information
- **Meet the Team**: Developer and contributor profiles
- **FAQ**: Common user questions and answers
- **Feedback System**: User feedback collection and management

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality UI component library
- **React Router**: Client-side routing
- **React Hook Form**: Form management with validation
- **Zod**: Schema validation

### Backend & Database
- **Supabase**: Backend-as-a-Service platform
- **PostgreSQL**: Primary database
- **Supabase Auth**: User authentication and authorization
- **Row Level Security (RLS)**: Database-level access control

### Integrations
- **Google Maps API**: Location services and mapping
- **Supabase Edge Functions**: Serverless functions for complex operations
- **React Query**: Data fetching and caching

### Development Tools
- **ESLint**: Code linting and formatting
- **TypeScript Compiler**: Type checking
- **Vite Dev Server**: Hot module replacement
- **Bun**: Fast JavaScript runtime (alternative to npm)

## 📁 Project Structure

```
FINDProject/
├── public/                    # Static assets
│   ├── images/               # Image files
│   └── robots.txt            # SEO configuration
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Shadcn/ui components
│   │   ├── AIAssistant.tsx   # AI chatbot component
│   │   ├── AuthGuard.tsx     # Route protection
│   │   ├── GoogleMap.tsx     # Map integration
│   │   ├── JobCard.tsx       # Job listing component
│   │   ├── LiveStats.tsx     # Statistics dashboard
│   │   ├── Navbar.tsx        # Navigation bar
│   │   ├── OurServices.tsx   # Services overview
│   │   ├── PasswordValidator.tsx
│   │   ├── ProfileEditor.tsx
│   │   ├── QuickApplyCard.tsx
│   │   ├── ResumeUploader.tsx
│   │   ├── ServiceCard.tsx
│   │   └── TaxiBookingCard.tsx
│   ├── data/                 # Static data files
│   │   ├── malawi-locations.ts
│   │   ├── roommateData.ts
│   │   └── universities.ts
│   ├── hooks/                # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── integrations/         # External service integrations
│   │   └── supabase/
│   ├── lib/                  # Utility libraries
│   │   └── utils.ts
│   ├── pages/                # Page components
│   │   ├── AboutUs.tsx
│   │   ├── Auth.tsx
│   │   ├── FAQ.tsx
│   │   ├── Feedback.tsx
│   │   ├── Index.tsx         # Landing page
│   │   ├── Jobs.tsx
│   │   ├── MeetOurTeam.tsx
│   │   ├── NotFound.tsx
│   │   ├── Profile.tsx
│   │   ├── Register.tsx
│   │   ├── Roommates.tsx
│   │   ├── SignIn.tsx
│   │   ├── TaxiBooking.tsx
│   │   └── Welcome.tsx
│   ├── App.css              # Global styles
│   ├── App.tsx              # Main app component
│   ├── index.css            # Base styles
│   └── main.tsx             # App entry point
├── supabase/                # Backend configuration
│   ├── config.toml         # Supabase configuration
│   ├── functions/          # Edge functions
│   │   ├── ai-assistant/
│   │   └── calculate-distance/
│   └── migrations/         # Database migrations
├── bun.lockb               # Bun lockfile
├── components.json         # Shadcn/ui configuration
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig*.json          # TypeScript configurations
└── vite.config.ts          # Vite configuration
```

## 🗄️ Database Schema

### Tables

#### `profiles`
- User profile information including university, program, gender
- Linked to Supabase auth users
- Row Level Security enabled

#### `taxi_bookings`
- Taxi booking records with location coordinates
- Payment and contact information
- Booking status tracking
- User-specific access control

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ or Bun
- Supabase account and project
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FINDProject
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using bun (recommended)
   bun install
   ```

3. **Environment Configuration**
   - Set up Supabase project
   - Configure Google Maps API key
   - Update environment variables in Supabase dashboard

4. **Database Setup**
   ```bash
   # Run migrations
   supabase db push
   ```

5. **Start Development Server**
   ```bash
   # Using npm
   npm run dev

   # Using bun
   bun run dev
   ```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Vercel**: Recommended for React apps
- **Netlify**: Alternative hosting platform
- **Supabase**: For full-stack deployment

## 👥 Team

### Development Team
- **Travor Bobby** - Marketing Director
- **Emmanuel Mhango** - CTO, Graphic Designer
- **Victor Balawe** - Lead Backend Developer, AI Assistant
- **Jabulan Cyber** - Software Engineer

## 📊 Current Status

### Implemented Features ✅
- User authentication and profiles
- Taxi booking with Google Maps
- Job search interface
- Roommate matching system
- AI assistant chatbot
- Responsive design
- Database integration

### In Development 🚧
- Job application system
- Advanced roommate matching algorithm
- Payment gateway integration
- Mobile app development

### Planned Features 📋
- Real-time notifications
- Advanced analytics dashboard
- Multi-language support
- Offline functionality

## 🔒 Security Features

- **Supabase RLS**: Database-level access control
- **Secure Authentication**: JWT-based auth system
- **Input Validation**: Zod schema validation
- **Password Security**: Strong password requirements
- **Data Encryption**: Secure data transmission

## 🎨 Design System

### Color Palette
- **Primary Red**: `#DC2626` (find-red)
- **Primary Dark**: Custom dark theme
- **Accent Colors**: Tailwind default colors

### Typography
- **Font Family**: Inter
- **Hierarchy**: Consistent heading scales
- **Readability**: Optimized for mobile and desktop

### Components
- **UI Library**: Shadcn/ui components
- **Consistency**: Unified design language
- **Accessibility**: WCAG compliant components

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Adaptive layouts
- **Desktop Enhancement**: Full feature utilization
- **Touch-Friendly**: Mobile-optimized interactions

## 🔍 API Integrations

### Google Maps API
- Location autocomplete
- Distance calculation
- Map visualization
- Geocoding services

### Supabase APIs
- Authentication
- Database operations
- File storage
- Real-time subscriptions

## 🧪 Testing

### Current Testing Status
- Manual testing implemented
- Component-level testing planned
- Integration testing in development

### Testing Tools
- React Testing Library (planned)
- Jest (planned)
- Cypress for E2E testing (planned)

## 📈 Performance

### Optimization Features
- **Code Splitting**: Route-based splitting
- **Lazy Loading**: Component lazy loading
- **Image Optimization**: Next-gen formats
- **Caching**: React Query caching
- **Bundle Analysis**: Vite build analysis

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Use ESLint configuration
3. Maintain component documentation
4. Test changes thoroughly
5. Follow Git commit conventions

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Import Order**: Organized imports

## 📄 License

This project is proprietary software developed for educational purposes.

## 📞 Support

For support and questions:
- **Email**: support@find.mw
- **AI Assistant**: Available within the app
- **Documentation**: This README and inline code comments

## 🔄 Future Roadmap

### Phase 1 (Current): MVP
- Core functionality implementation
- User testing and feedback
- Performance optimization

### Phase 2: Enhancement
- Advanced features implementation
- Mobile app development
- Payment system integration

### Phase 3: Scale
- Multi-region expansion
- Advanced analytics
- Enterprise features

---

**FIND** - Connecting Malawiian with opportunities, one click at a time.
