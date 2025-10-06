# 🚀 ChakruloApp - Space Biology Knowledge Engine Frontend

A modern Next.js web application built for the **NASA Space Apps Challenge 2025** - "Build a Space Biology Knowledge Engine". This frontend application provides an intuitive interface for space biology education, AI-powered health assessment, and community collaboration.

## 🌟 Challenge Context

### NASA Space Apps Challenge 2025: Space Biology Knowledge Engine

The challenge focuses on creating accessible tools for understanding how space affects human biology. ChakruloApp addresses this by providing:

- **Evidence-Based Health Assessment**: Comprehensive questionnaires based on NASA astronaut health studies
- **Space Biology Education**: Interactive learning modules covering Moon, Mars, microgravity, and space radiation effects
- **AI-Powered Insights**: Integration with Google Gemini for personalized health recommendations
- **Community Platform**: Connect researchers, students, and space enthusiasts

### Mission Statement

To democratize access to space biology knowledge and provide evidence-based health assessment tools that bridge the gap between space research and terrestrial health applications.

## 📖 About ChakruloApp

ChakruloApp is the frontend component of the Chakrulo ecosystem, designed to make space biology knowledge accessible through:

- **🤖 AI-Powered Health Assessment**: Comprehensive physical and mental health evaluation based on NASA research
- **🌌 Interactive Learning**: Space biology education modules with evidence-based content
- **📊 Readiness Scoring**: AI-calculated space readiness scores with detailed breakdowns
- **👥 Community Features**: Connect with researchers, students, and space enthusiasts
- **📚 Publication Access**: Curated collection of space biology research papers

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control
- **Environment Variables** (see Configuration section)

### Installation

```bash
# Clone the repository
git clone https://github.com/GeorgeShani/Chakrulo.git
cd Chakrulo/ChakruloApp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (see Configuration section)

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### First Time Setup

1. **Configure Environment Variables**: Set up your API keys for Clerk, Supabase, and Google Gemini
2. **Database Setup**: Initialize your Supabase database with the provided schema
3. **Authentication**: Configure Clerk authentication providers
4. **AI Integration**: Set up Google Gemini API access for health assessments

### Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run test suite
npm run test:watch       # Run tests in watch mode
```

## ✨ Frontend Features

### 🤖 **AI-Powered Health Assessment**

- **Comprehensive Questionnaire System**: Multi-step health assessment based on NASA astronaut health studies
- **Real-time AI Analysis**: Google Gemini integration for instant health insights and recommendations
- **Readiness Scoring**: AI-calculated space readiness scores with detailed breakdowns
- **File Upload Support**: Medical document upload and AI-powered analysis
- **Personalized Recommendations**: Custom health advice based on space biology research

### 🔐 **Authentication & User Management**

- **Clerk Integration**: Enterprise-grade authentication with OAuth providers (Google, Apple, Discord)
- **Secure User Profiles**: Comprehensive user profiles with health history and preferences
- **Session Management**: JWT-based secure session handling
- **Password Recovery**: Secure password reset functionality
- **Multi-factor Authentication**: Enhanced security options

### 📊 **Interactive Dashboard**

- **Personalized Dashboard**: Customizable dashboard with user-specific health metrics
- **Real-time Health Monitoring**: Live updates of health assessment results
- **Progress Tracking**: Visual progress indicators for health goals
- **AI Insights Display**: Interactive visualization of AI-generated health insights
- **Quick Actions**: Fast access to key features and assessments

### 🌌 **Space Biology Education**

- **Interactive Learning Modules**:
  - **Moon Missions**: Reduced gravity effects, bone density loss, vestibular changes
  - **Mars Missions**: Partial gravity adaptation, cardiovascular deconditioning
  - **Microgravity**: Spatial disorientation, muscle atrophy, fluid shifts
  - **Space Radiation**: Cancer risk, cognitive effects, tissue damage
- **Evidence-Based Content**: All content grounded in NASA research and peer-reviewed studies
- **Progressive Learning**: Structured learning paths for different user levels
- **Interactive Quizzes**: Knowledge assessment and reinforcement

### 👥 **Community Features**

- **User Forums**: Space biology discussion boards and Q&A sections
- **Research Collaboration**: Connect with researchers and students
- **Knowledge Sharing**: Share insights and research findings
- **Mentorship Programs**: Connect experienced researchers with newcomers
- **Event Calendar**: Space biology conferences and educational events

### 📚 **Publication Access**

- **Research Paper Library**: Curated collection of space biology research papers
- **Advanced Search**: AI-powered search through research documents
- **Citation Management**: Save and organize research references
- **Reading Lists**: Create and share custom reading lists
- **PDF Viewer**: In-app document viewing with annotation support

### 🛠️ **Technical Features**

- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Updates**: Live data synchronization with Supabase
- **File Management**: Secure file upload and storage with Supabase Storage
- **API Integration**: RESTful API endpoints for all backend operations
- **Performance Optimization**: Next.js optimization with code splitting and lazy loading
- **Accessibility**: WCAG 2.1 compliant design with screen reader support

### 📱 **Mobile Experience**

- **Progressive Web App**: Installable web app with offline capabilities
- **Touch-Optimized**: Gesture-based navigation and interactions
- **Offline Support**: Core features available without internet connection
- **Push Notifications**: Health reminders and community updates
- **Camera Integration**: Document scanning and health metric capture

## 🛠️ Technology Stack

### 🎨 **Frontend Framework**

- **Next.js 15** with **TypeScript** – Modern React framework with App Router
- **Tailwind CSS 4.0** – Utility-first CSS framework with custom design system
- **React 19** – Latest React features with concurrent rendering

### 🔐 **Authentication & User Management**

- **Clerk** – Enterprise-grade authentication with OAuth providers
- **Supabase** – Backend-as-a-Service for user data and real-time features
- **JWT Tokens** – Secure session management

### 🤖 **AI Integration**

- **Google Gemini 2.0 Flash** – Advanced AI for health assessment and insights
- **Custom AI Prompts** – Curated prompts for space biology evaluation
- **AI Service Layer** – Modular AI integration architecture

### 🗄️ **Database & Storage**

- **Supabase PostgreSQL** – Relational database for user data and assessments
- **Supabase Storage** – File storage for medical documents and user uploads
- **Real-time Subscriptions** – Live data synchronization

### 🎯 **State Management**

- **Redux Toolkit** – Predictable state management for complex UI state
- **React Query (TanStack Query)** – Server state management and caching
- **Zustand** – Lightweight state management for simple state

### 📝 **Form Handling & Validation**

- **React Hook Form** – Performant form handling with minimal re-renders
- **Zod** – TypeScript-first schema validation
- **Custom Validation** – Space biology-specific validation rules

### 🎨 **UI/UX Components**

- **Lucide React** – Beautiful, customizable icons
- **Custom Design System** – Space-themed UI components
- **Responsive Design** – Mobile-first approach with Tailwind CSS

### 🔧 **Development Tools**

- **TypeScript** – Type-safe development with strict configuration
- **ESLint** – Code linting and quality assurance
- **Prettier** – Code formatting and consistency
- **Husky** – Git hooks for code quality

### 📦 **Key Dependencies**

```json
{
  "next": "^15.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^4.0.0",
  "@clerk/nextjs": "^5.0.0",
  "@supabase/supabase-js": "^2.0.0",
  "@google/generative-ai": "^0.2.0",
  "@reduxjs/toolkit": "^2.0.0",
  "@tanstack/react-query": "^5.0.0",
  "react-hook-form": "^7.0.0",
  "zod": "^3.0.0",
  "lucide-react": "^0.400.0"
}
```

## 🏗️ Project Structure

```
ChakruloApp/
├── public/                     # Static assets and media files
│   ├── images/                 # Application images and illustrations
│   │   ├── icons/              # UI icons and symbols
│   │   ├── illustrations/      # Space-themed illustrations
│   │   └── logos/              # Brand logos and partner logos
│   ├── fonts/                  # Custom font files
│   └── favicon.ico             # Application favicon
├── src/
│   ├── ai/                     # AI integration layer
│   │   ├── config/             # AI configuration (Gemini API settings)
│   │   ├── models/             # AI model interfaces and types
│   │   ├── services/           # AI service implementations
│   │   └── prompts/            # AI prompt templates for health assessment
│   ├── app/                    # Next.js App Router structure
│   │   ├── (auth)/             # Authentication pages (sign-in, sign-up)
│   │   │   ├── sign-in/        # User login page
│   │   │   ├── sign-up/        # User registration page
│   │   │   └── sso-callback/   # OAuth callback handling
│   │   ├── (dashboard)/        # Main application pages
│   │   │   ├── dashboard/      # User dashboard and navigation
│   │   │   │   ├── community/  # Community features and forums
│   │   │   │   ├── profile/    # User profile management
│   │   │   │   ├── publications/ # Research paper access
│   │   │   │   ├── questionnaire/ # Health assessment forms
│   │   │   │   └── readiness-score/ # AI-calculated readiness scores
│   │   │   └── layout.tsx      # Dashboard layout wrapper
│   │   └── api/                # API routes and endpoints
│   │       ├── conversations/  # Chat and conversation management
│   │       ├── gemini/         # Google Gemini AI integration
│   │       ├── messages/       # Message handling and storage
│   │       ├── questions/      # Health questionnaire data
│   │       └── users/          # User management and profiles
│   ├── components/             # Reusable UI components
│   │   ├── common/             # Shared components (buttons, inputs)
│   │   ├── features/           # Feature-specific components
│   │   │   ├── auth/           # Authentication components
│   │   │   └── dashboard/      # Dashboard-specific components
│   │   ├── forms/              # Form components and validation
│   │   ├── layout/             # Layout components (headers, footers)
│   │   └── ui/                 # Base UI components
│   ├── constants/              # Application constants and configurations
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Core utilities and configurations
│   │   ├── database/           # Database connection and setup
│   │   ├── email/              # Email service integration
│   │   ├── upload/             # File upload utilities
│   │   └── validations/        # Form validation schemas
│   ├── services/               # Business logic and external integrations
│   │   ├── api/                # API client configurations
│   │   ├── external/           # Third-party service integrations
│   │   └── internal/           # Internal service implementations
│   │       └── supabase/       # Supabase-specific services
│   ├── store/                  # State management
│   │   ├── providers/          # Redux providers and context
│   │   └── slices/             # Redux slices for different features
│   ├── styles/                 # CSS and styling files
│   │   ├── components.css      # Component-specific styles
│   │   ├── globals.css         # Global styles and CSS variables
│   │   └── utilities.css       # Utility classes and helpers
│   ├── types/                  # TypeScript type definitions
│   │   └── supabase/           # Supabase-generated types
│   └── utils/                  # Utility functions and helpers
├── .env.example                # Environment variables template
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── README.md                   # This documentation file
```

### Directory Explanations

#### 🎨 **Frontend Architecture**

- **`src/app/`**: Next.js 15 App Router structure with route-based organization
  - **`(auth)/`**: Authentication flow pages with Clerk integration
  - **`(dashboard)/`**: Main application pages with protected routes
  - **`api/`**: Server-side API endpoints for data handling

#### 🤖 **AI Integration Layer**

- **`src/ai/`**: Complete AI integration architecture
  - **`config/`**: Google Gemini API configuration and settings
  - **`models/`**: TypeScript interfaces for AI responses and data structures
  - **`services/`**: AI service implementations for health assessment
  - **`prompts/`**: Curated prompts for space biology and health evaluation

#### 🧩 **Component Organization**

- **`components/`**: Modular component architecture
  - **`common/`**: Shared UI components used across the application
  - **`features/`**: Feature-specific components (auth, dashboard)
  - **`forms/`**: Form components with validation integration
  - **`ui/`**: Base UI components and design system

#### 🔧 **Services & Utilities**

- **`services/`**: Business logic separation
  - **`api/`**: API client configurations and request handling
  - **`external/`**: Third-party service integrations (Clerk, Supabase)
  - **`internal/`**: Internal business logic and data processing

#### 🎯 **State Management**

- **`store/`**: Redux Toolkit implementation
  - **`providers/`**: React context providers and Redux store setup
  - **`slices/`**: Feature-based Redux slices for state management

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # TypeScript check
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Required API Keys

1. **Clerk**: Sign up at [clerk.com](https://clerk.com) for authentication
2. **Supabase**: Create a project at [supabase.com](https://supabase.com) for database
3. **Google Gemini**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 📁 Feature Module Structure

Each feature follows this pattern:

```
src/features/[feature]/
├── components/         # Feature components
├── hooks/              # Custom hooks
├── services/           # API calls
├── store/              # Feature state
├── types/              # TypeScript types
└── index.ts            # Barrel exports
```

## 🎨 Styling Guidelines

- Use semantic color tokens and Tailwind custom properties
- Leverage CSS custom properties for theming
- Use container queries for responsive components
- Create component-scoped styles with `@layer components`

## 🔌 API Integration

API clients are set up in `src/services/api/` using fetch or Axios. Auth tokens are managed via localStorage and sent with requests.

## 🔧 Configuration

Path aliases are set in `tsconfig.json` for clean imports:

```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/features/*": ["./src/features/*"],
    "@/utils/*": ["./src/utils/*"]
  }
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🛡️ Security

- JWT token management
- Input validation with Zod
- Protected routes for authenticated users
- HTTPS enforcement in production
- Environment variable security

## 🎯 Performance

- **Code Splitting** – Lazy load pages and components
- **Bundle Analysis** – Monitor and optimize bundle size
- **React Query** – Efficient data caching
- **Image Optimization** – Next.js image component and lazy loading
- **Tree Shaking** – Remove unused code automatically

## 🔄 State Management

- **Redux Toolkit** for global state
- **React Query** for server state

## 🤝 Contributing

1. Create feature branch from `main`
2. Follow coding standards and conventions
3. Ensure TypeScript compilation passes
4. Update documentation if needed
5. Create pull request to `main` branch

### Commit Convention

```bash
feat: add new dashboard widget
fix: resolve login bug
docs: update README
style: format code
refactor: reorganize auth logic
```

## 🐛 Troubleshooting

**Port Already in Use**

```bash
# Use different port
npm run dev -- --port 3001
```

**Build Errors**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors**

```bash
# Run type check
npm run type-check
```

## 📞 Support

- GitHub Issues: Create issue in the repository
- Team Slack/Discord: #nasa-app

---

**NASA Space Apps Team** – Innovating for space exploration and collaboration
