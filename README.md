# 🚀 Chakrulo: Space Biology Knowledge Engine

> **NASA Space Apps Challenge 2025** - Build a Space Biology Knowledge Engine

Chakrulo is a comprehensive space biology knowledge platform that combines AI-powered research assistance with interactive health assessment tools. Built for the [NASA Space Apps Challenge 2025](https://www.spaceappschallenge.org/2025/challenges/build-a-space-biology-knowledge-engine/), this project addresses the critical need for accessible space biology knowledge and astronaut health assessment tools.

## 🌟 Project Overview

Chakrulo consists of two main components:

1. **ChakruloApp** - A modern Next.js web application with AI-powered health assessment and space biology education
2. **ChakruloAI** - A fully offline RAG-powered research assistant with 33+ space medicine research papers

### 🎯 Mission Statement

To democratize access to space biology knowledge and provide evidence-based health assessment tools that bridge the gap between space research and terrestrial health applications.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Chakrulo Ecosystem                       │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)           │  AI Backend (Python)        │
│  ├── User Authentication      │  ├── RAG Pipeline           │
│  ├── Health Questionnaire     │  ├── Vector Database        │
│  ├── AI-Powered Dashboard     │  ├── Local LLM (Ollama)     │
│  ├── Readiness Scoring        │  └── Document Processing    │
│  └── Community Features       │                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Key Features

### Frontend Application (ChakruloFrontend)

#### 🤖 AI-Powered Health Assessment

- **Comprehensive Questionnaire**: Physical and mental health assessment based on NASA astronaut health studies
- **Readiness Scoring**: AI-calculated space readiness scores with detailed breakdowns
- **Interactive Dashboard**: Real-time visualization of health metrics and space biology insights
- **File Upload Support**: Users can upload medical documents for enhanced assessment

#### 🌌 Space Biology Education

- **Interactive Learning Modules**: Moon, Mars, Microgravity, and Space Radiation effects
- **Evidence-Based Content**: All content grounded in NASA research and peer-reviewed studies
- **Community Features**: Connect with other space enthusiasts and researchers
- **Publication Access**: Curated collection of space biology research papers

#### 🔐 User Management

- **Secure Authentication**: Powered by Clerk for enterprise-grade security
- **Profile Management**: Comprehensive user profiles with health history
- **Data Privacy**: All user data stored securely with full GDPR compliance

### AI Research Assistant (ChakruloAI)

#### 🧠 Advanced RAG System

- **100% Offline Operation**: No API keys, no cloud dependencies, complete data privacy
- **33+ Research Papers**: Curated collection from NCBI/PMC on space medicine
- **Three AI Modes**:
  - **Scientific Understanding**: Q&A with evidence-based answers
  - **Scientific Summary**: Comprehensive summaries using Map-Reduce
  - **Scientific Recommendation**: Actionable recommendations for research and missions

#### 🔬 Research Capabilities

- **Persistent Vector Database**: One-time document processing, instant retrieval
- **Source Attribution**: All answers grounded in actual document content
- **Chat History**: Conversation memory within sessions
- **Multi-Document Analysis**: Cross-reference information from multiple papers

## 🛠️ Technology Stack

### Frontend Technologies

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS 4.0
- **Authentication**: Clerk
- **AI Integration**: Google Gemini 2.0 Flash
- **Database**: Supabase
- **State Management**: React Query + Redux Toolkit
- **UI Components**: Custom components with Lucide React icons
- **Form Handling**: React Hook Form with Zod validation
- **File Upload**: Supabase Storage
- **Email Service**: Resend

## 📁 Project Structure

```
Chakrulo/
├── ChakruloApp/           # Next.js Web Application
│   ├── src/
│   │   ├── ai/                 # AI integration layer
│   │   ├── app/                # Next.js app router
│   │   │   ├── (auth)/         # Authentication pages
│   │   │   ├── (dashboard)/    # Main application pages
│   │   │   └── api/            # API endpoints
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # Business logic
│   │   ├── types/              # TypeScript definitions
│   │   └── utils/              # Utility functions
│   └── public/                 # Static assets
└── ChakruloAI/                 # Python AI Backend
    ├── app.py                  # Main Streamlit application
    ├── requirements.txt         # Python dependencies
    └── chakrulo_ai_chroma_db_local/  # Vector database (auto-generated)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **Ollama** installed locally
- **Git** for version control

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/GeorgeShani/Chakrulo.git
cd Chakrulo/ChakruloApp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

### AI Backend Setup

```bash
# Install Ollama
# Visit https://ollama.ai and install for your platform

# Download the required model
ollama pull llama3.2

# Navigate to AI backend
cd ../ChakruloAI

# Install Python dependencies
pip install -r requirements.txt

# Start Ollama server (Terminal 1)
ollama serve

# Start Streamlit app (Terminal 2)
streamlit run app.py
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GOOGLE_GEMINI_API_KEY=your_gemini_key
```

#### AI Backend

No environment variables required - fully offline operation.

## 📊 Key Features Deep Dive

### Health Assessment System

The questionnaire system is based on NASA's Human Research Program (HRP) and includes:

- **Physical Health Assessment**: Cardiovascular, musculoskeletal, and physiological readiness
- **Mental Health Assessment**: Cognitive function, psychological resilience, and stress management
- **File Upload Support**: Medical documents, test results, and health records
- **AI-Powered Analysis**: Gemini AI integration for personalized insights

### Space Biology Education

Interactive modules covering:

- **Moon Missions**: Reduced gravity effects, bone density loss, vestibular changes
- **Mars Missions**: Partial gravity adaptation, cardiovascular deconditioning
- **Microgravity**: Spatial disorientation, muscle atrophy, fluid shifts
- **Space Radiation**: Cancer risk, cognitive effects, tissue damage

### AI Research Assistant

The RAG system processes 33+ research papers covering:

- Cardiovascular effects of spaceflight
- Musculoskeletal adaptations
- Radiation exposure and countermeasures
- Psychological challenges
- Nutrition and metabolism
- Sleep and circadian rhythms
- Vestibular and sensorimotor changes
- Immune system function

## 🔬 Research Foundation

Chakrulo is built on extensive research from:

- **NASA Human Research Program (HRP)**
- **NASA GeneLab**: Space Omics Data
- **NASA Twins Study**
- **608+ Open-Access Space Biology Publications**
- **NASA Open Science Data Repository**
- **NASA Space Life Sciences Library**

## 🎯 Target Users

- **Space Researchers**: Access to comprehensive space biology knowledge base
- **Astronaut Candidates**: Health assessment and readiness evaluation
- **Medical Professionals**: Space medicine education and research tools
- **Students**: Interactive learning about space biology
- **General Public**: Understanding space's impact on human health

## 🌟 Innovation Highlights

### 1. **Hybrid AI Architecture**

- Cloud-based frontend with local AI processing
- Best of both worlds: accessibility and privacy

### 2. **Evidence-Based Assessment**

- All health questions grounded in NASA research
- Continuous updates with latest space medicine findings

### 3. **Offline AI Capabilities**

- Complete data privacy with local processing
- No internet required for core AI functionality

### 4. **Comprehensive Knowledge Base**

- 33+ research papers in vector database
- Cross-referenced information retrieval
- Source attribution for all answers

## 🚀 Future Roadmap

### Phase 1 (Current)

- ✅ Core health assessment system
- ✅ AI research assistant
- ✅ Basic dashboard functionality

### Phase 2 (Planned)

- 🔄 Advanced analytics and reporting
- 🔄 Integration with wearable devices
- 🔄 Real-time health monitoring

### Phase 3 (Future)

- 🔄 Machine learning model training
- 🔄 Predictive health analytics
- 🔄 Multi-language support

## 🤝 Contributing

We welcome contributions from the space biology and health technology communities!

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Areas for Contribution

- Additional research paper integration
- UI/UX improvements
- Performance optimizations
- Documentation enhancements
- Multi-language support

## 🙏 Acknowledgments

- **NASA Space Apps Challenge** for the inspiration and platform
- **NASA Human Research Program** for the scientific foundation
- **Open Source Community** for the amazing tools and libraries
- **Research Contributors** who made their work openly available

## 📞 Support

- **GitHub Issues**: [Create an issue](https://github.com/GeorgeShani/Chakrulo/issues)
- **Documentation**: See individual component READMEs
- **Community**: Join our Discord server

## 🌐 Links

- **NASA Space Apps Challenge**: [2025 Challenge](https://www.spaceappschallenge.org/2025/challenges/build-a-space-biology-knowledge-engine/)
- **Live Demo**: [Coming Soon]

---

**Built with ❤️ for the future of space exploration and human health**

_Chakrulo Team - Making space biology accessible to everyone_
