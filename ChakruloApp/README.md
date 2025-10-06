# 🚀 NASA Space Apps Challenge App

A modern web application built with Next.js, TypeScript, and Tailwind CSS for the NASA Space Apps Challenge. This app provides a robust platform for space-related collaboration, user management, and interactive dashboards powered by AI.

## 📖 About

The NASA Space Apps Challenge App is designed to enhance space exploration and collaboration through:

- **AI-Powered Analysis**: Intelligent processing of space-related data
- **Interactive Dashboards**: Real-time visualization of space metrics
- **Collaborative Features**: Team workspaces and shared resources
- **Space Data Integration**: Connection with NASA APIs and databases

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/GeorgeShani/nasa-app.git
cd nasa-app

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## ✨ Features

- 🤖 **AI Integration** – Smart analysis and recommendations for space data
- 🔐 **User Authentication** – Secure login, registration, and password recovery
- 📊 **Dashboard** – Personalized dashboard with AI-powered insights
- 🌌 **Space Data** – Integration with NASA APIs and databases
- 📝 **Blog** – Space-related articles, categories, and posts
- 🛠️ **API Endpoints** – RESTful routes for users, health checks, and authentication
- 📁 **File Uploads** – Upload and manage space-related files securely
- 📧 **Email Integration** – Email notifications and password resets
- 📱 **Responsive Design** – Mobile-first, adaptive layouts
- ⚡ **Fast Performance** – Optimized with Next.js and SWC

### Detailed Feature Breakdown

#### AI Capabilities

- Real-time analysis of space data
- Natural language processing for space queries
- Predictive analytics for space events
- Automated report generation

#### Space Data Integration

- NASA API connectivity
- Space weather monitoring
- Satellite tracking
- Astronomical event calendars

#### Collaboration Tools

- Team workspaces
- Project management features
- Real-time communication
- Data sharing capabilities

## 🛠️ Tech Stack

- **Next.js 15** + **TypeScript** – Modern React framework
- **Tailwind CSS** – Utility-first styling
- **Redux Toolkit** – State management
- **React Query** – Server state management
- **Zod** – Validation schemas
- **PostgreSQL** (optional) – Database integration

## 🏗️ Project Structure

```
nasa-app/
├── public/                 # Static assets
├── src/
│   ├── ai/                 # AI implementation
│   │   ├── config/         # AI configuration and settings
│   │   ├── models/         # AI models and interfaces
│   │   ├── services/       # AI services and utilities
│   │   └── prompts/        # AI prompt templates and constants
│   ├── app/                # Routing, pages, layouts, API endpoints
│   ├── components/         # Reusable UI, forms, layout, features
│   ├── lib/                # Utilities, auth, database, email, upload
│   ├── services/           # API, external, internal logic
│   ├── store/              # State management
│   ├── styles/             # CSS files and themes
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── .env.example            # Environment template
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

### AI Architecture

The `src/ai/` directory contains all the necessary components for our AI implementation:

- **config/**: Configuration files for AI models, API keys, and settings
- **models/**: AI model interfaces, types, and implementations
- **services/**: Core AI services, utilities, and helper functions
- **prompts/**: Template management for AI interactions and responses

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

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_EMAIL_API_KEY=your-email-key
```

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
