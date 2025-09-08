# ManuaLink

## 🔗 Connecting Manual Workers with Opportunities Across Kenya

**ManuaLink** is a modern Next.js web application that bridges the gap between skilled manual workers and employers across Kenya. Built with cutting-edge technology to provide a seamless experience for finding reliable workers or discovering manual work opportunities in Nairobi, Mombasa, Kisumu, and beyond.

## 🚀 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) with App Router
- **Backend**: Next.js API Routes + Server Actions
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage (for images/documents)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Language**: JavaScript (ES6+)

## 🌍 Coverage Areas

- **Nairobi** - Kenya's capital and largest city
- **Mombasa** - Coastal hub and major port city
- **Kisumu** - Western Kenya's economic center
- **Expanding nationwide** - Growing coverage across all Kenyan counties

## ✨ Key Features

### 🔍 For Job Seekers
- **Dynamic Profile Creation**: Showcase skills, portfolio, and experience
- **Smart Job Matching**: AI-powered recommendation system
- **Real-time Notifications**: Instant alerts for new opportunities
- **Location-based Search**: Find jobs within your preferred radius
- **Skill Verification System**: Build credibility with verified badges

### 🏢 For Employers
- **Project Management Dashboard**: Track multiple hiring projects
- **Advanced Worker Discovery**: Filter by skills, location, and ratings
- **Secure Communication**: Built-in messaging system
- **Review & Rating System**: Community-driven quality assurance
- **Analytics Dashboard**: Track hiring success metrics with Firestore aggregation queries

### 🛠️ Platform Features
- **Progressive Web App (PWA)**: Install on mobile devices
- **Offline Functionality**: Cache critical data for offline access
- **Multi-language Support**: English and Swahili interfaces
- **Responsive Design**: Optimized for all screen sizes
- **SEO Optimized**: Server-side rendering with Next.js

## 🛠️ Supported Work Categories

```
Construction & Building    │ Electrical & Electronics
Plumbing & Water Systems  │ Carpentry & Furniture
Painting & Decoration     │ Landscaping & Gardening
Mechanical & Auto Repair  │ Cleaning & Maintenance
Security Services         │ Food Service & Catering
Transportation & Delivery │ General Labor
```

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+ 
npm or yarn
PostgreSQL (or preferred database)
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/manualink.git
cd manualink
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

4. **Configure environment variables**
```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

5. **Run database migrations**
```bash
npm run db:migrate
```

6. **Start development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
manualink/
├── app/                    # Next.js 13+ App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # User dashboards
│   ├── jobs/              # Job listings & details
│   └── workers/           # Worker profiles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── forms/            # Form components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication config
│   ├── db.ts             # Database connection
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run test suite
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
```

## 🌟 Core Features Implementation

### Authentication System
- **NextAuth.js** integration with multiple providers
- **Role-based access control** (Worker/Employer/Admin)
- **JWT tokens** for secure session management
- **Email verification** and password reset functionality

### Job Matching Algorithm
- **Skill-based matching** using weighted scoring
- **Location proximity** calculations
- **Availability matching** based on schedules
- **Historical success rate** consideration

### Real-time Features
- **WebSocket integration** for live notifications
- **Real-time messaging** between users
- **Live job status updates**
- **Push notifications** support

## 🎨 UI/UX Features

- **Dark/Light mode** toggle
- **Accessibility compliance** (WCAG 2.1)
- **Mobile-first design** approach
- **Smooth animations** with Framer Motion
- **Loading states** and skeleton screens
- **Error boundaries** for graceful error handling

## 📊 Analytics & Monitoring

- **Google Analytics** integration
- **Performance monitoring** with Vercel Analytics
- **Error tracking** with Sentry
- **User behavior insights**
- **Conversion funnel analysis**

## 🔒 Security Features

### Firestore Security Rules
```javascript
// Example security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Jobs are readable by authenticated users
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.employerId || 
         hasRole('admin'));
    }
  }
}
```

### Additional Security
- **Input sanitization** and validation with custom utilities
- **Rate limiting** on API endpoints
- **CORS configuration** for API routes
- **Environment variable protection**
- **Firebase App Check** for client verification
- **Audit logging** for sensitive operations

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t manualink .
docker run -p 3000:3000 manualink
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🌍 Community Impact

ManuaLink contributes to Kenya's digital transformation by:

- **Digitalizing Traditional Work**: Bringing manual labor into the digital economy
- **Economic Empowerment**: Creating sustainable income opportunities
- **Skill Development**: Encouraging professional growth and certification
- **Geographic Inclusion**: Connecting remote areas with urban opportunities
- **Gender Equality**: Promoting equal access to work opportunities

## 📞 Support & Contact

- **Documentation**: [docs.manualink.co.ke](https://docs.manualink.co.ke)
- **Issues**: [GitHub Issues](https://github.com/your-username/manualink/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/manualink/discussions)
- **Email**: support@manualink.co.ke

## 🗺️ Roadmap

- [ ] **Q3 2025**: Mobile app development (React Native)
- [ ] **Q4 2025**: Payment integration (M-Pesa, Bank transfers)
- [ ] **Q1 2026**: Skills training platform integration
- [ ] **Q2 2026**: AI-powered job recommendations
- [ ] **2026**: Expansion to neighboring East African countries

---

**ManuaLink** - *Linking Skills with Opportunities* 🇰🇪

Built with ❤️ using Next.js