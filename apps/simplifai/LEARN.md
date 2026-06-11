# 📚 LEARN.md - SimplifAI

Welcome to the **SimplifAI** learning guide! This document will help you understand the project structure, technologies used, and how to contribute effectively.

---

## 🎯 Project Overview

**Simplifai** is an AI-powered learning platform that transforms documents into interactive flashcards, concise summaries, and quizzes. It utilizes advanced AI models to provide intelligent content extraction and learning tools for students and professionals.

### Key Features
- ✅ **Smart Flashcards** — Instantly generate flashcards from uploaded content  
- 📌 **Concise Summaries** — Understand the key points at a glance  
- 🧪 **Interactive Quizzes** — Reinforce your knowledge with AI-generated questions  
- 📁 **Multi-format Support** — Supports PDF and TXT files (more coming soon!)  
- 🔐 **Secure & Private** — Your documents are processed safely and never stored permanently

---
## 🧱 Tech Stack

### 🔹 Frontend
- **Framework**: [Next.js 14](https://nextjs.org/)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)

### 🔹 Backend / API
- **AI Integration**: [DeepSeek](https://deepseek.com/) / [OpenRouter](https://openrouter.ai/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Google OAuth + Credentials)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)

### 🔹 DevOps & Hosting
- **Deployment**: [Vercel](https://vercel.com/)
- **Version Control**: [GitHub](https://github.com/)
- **Environment Management**: `.env` files with secrets

### 🛡️ Security & Privacy
- No persistent file storage  
- API keys & credentials are managed through environment variables

---

## 📁 Project Structure

### Root Level Files

- **`app/`** - Next.js application source
- **`components/`** - Reusable React UI components
- **`lib/`** - Utility functions and Redux store
- **`prisma/`** - Prisma schema and migrations
- **`public/`** - Static assets
- **`package.json`** - Project dependencies
- **`README.md`** - Main project documentation
- **`LEARN.md`** - This learning guide
- **`LICENSE`** - Project license information

### Core Directories

#### 🖥️ `/app` Directory
The main Next.js application module containing all pages and API routes.

- **`page.tsx`** - Home page
- **`about/page.tsx`** - About page
- **`pricing/page.tsx`** - Pricing information
- **`results/[fileId]/page.tsx`** - Results view for processed documents
- **`signin/page.tsx`** - Sign in UI
- **`signup/page.tsx`** - Registration UI
- **`api/`** - Next.js API endpoints
  - `auth/[...nextauth]/route.ts` - Authentication routes
  - `auth/signup/route.ts` - Registration API
  - `parse-pdf/route.ts` - PDF/TXT parsing and AI processing
  - `chat-pdf/route.ts` - Chat with document endpoint

#### 🧩 `/components` Directory
Reusable React components for UI features.

- **UI Components**: `button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `progress.tsx`, `tabs.tsx`, etc.
- **Feature Components**: `file-uploader.tsx`, `flashcard-view.tsx`, `quiz-view.tsx`, `results-header.tsx`, `summary-view.tsx`, `hero-section.tsx`, `features.tsx`, etc.
- **Providers**: `SessionProviderC.tsx`, `theme-provider.tsx`, `loading-provider.tsx`
- **Utilities**: `toasts.tsx`, `user-label.tsx`, `MobileMenu.tsx`

#### 📊 `/lib` Directory
Utilities and Redux store configuration.

- **`store/`** - Redux slices (`parseSlice.ts`, `chatSlice.ts`, `index.ts`)
- **`prisma.ts`** - Prisma client setup
- **`utils.ts`** - Utility functions

#### 🔄 `/prisma` Directory
Database schema and ORM setup.

- **`schema.prisma`** - Prisma database schema

---

## 🏗️ Detailed Source Code Architecture

### Main Application Structure

- **State Management**: Redux Toolkit slices for parsing results and chat state
- **Authentication**: NextAuth integration for Google and email/password
- **AI Integration**: API endpoints leverage external AI models for parsing and chat

#### 💬 UI Layer
- **File Upload**: `file-uploader.tsx` manages drag-and-drop and file processing
- **Flashcards**: `flashcard-view.tsx` displays interactive flashcards
- **Quiz**: `quiz-view.tsx` provides generated quizzes with scoring
- **Summary**: `summary-view.tsx` shows main points, insights, and recommendations

#### 📊 Data Layer
- **Redux Store**: Handles parsed document data for flashcards, summary, and quiz

#### 🤖 AI Components
- **API Integration**: Calls OpenRouter and DeepSeek models via serverless functions
- **RAG and memory**: (Planned) Support for document retrieval and memory context

---
## ⚙️ Technical Setup

### 📦 Prerequisites
- **Node.js**: v18 or higher
- **Yarn** or **npm**
- **PostgreSQL**: Required for local development
- **Prisma CLI**: For managing database migrations

---

### 🧩 Key Dependencies
- **React** & **Next.js** — Frontend framework
- **Tailwind CSS** — Utility-first CSS framework
- **Redux Toolkit** — State management
- **NextAuth.js** — Authentication (Google & Credentials)
- **Prisma** — ORM for PostgreSQL
- **Axios** — For making API requests

---

### 🛠️ Configuration Files

#### `.env.local` — Environment Variables
Used to store sensitive config values:
- `DATABASE_URL`: PostgreSQL connection string
- `AI_API_KEY`: API key for OpenRouter/DeepSeek
- `NEXT_PUBLIC_AI_URL`: AI API endpoint

#### `prisma/schema.prisma` — Prisma Schema
Defines the database models and structure used in the project.

---

## 🚀 Getting Started for Contributors

### 1. Environment Setup
```bash
# Clone the repository
git clone https://github.com/Er-luffy-D/SimplifAI.git
cd SimplifAI

# Install dependencies
yarn install
# or
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 2. Project Structure Understanding
- Start with `app/page.tsx` for the main application flow
- Explore `file-uploader.tsx` and `results/[fileId]/page.tsx` for core features
- Check Redux slices in `lib/store/` for state management
- Review API endpoints in `app/api/` for backend logic

### 3. Development Workflow
1. **Pick an issue** from the issue tracker
2. **Create a feature branch**: `git checkout -b user-name/your-feature`
3. **Make changes** following established patterns
4. **Test your changes** using unit and integration tests
5. **Submit a PR** with clear description and testing evidence

### 4. Code Style Guidelines
- Follow **TypeScript and React best practices**
- Use **Redux Toolkit** for state management
- Add **unit tests** for business logic
- Use **meaningful variable and function names**
- Follow **accessible and responsive design**

---

## 🎯 Areas for Contribution

### 🟢 Beginner-Friendly
- UI improvements and bug fixes
- Documentation updates
- Test case additions
- Resource optimizations

### 🟡 Intermediate
- New features for flashcards and quizzes
- Voice processing enhancements (planned)
- Database schema improvements
- Performance optimizations

### 🔴 Advanced
- AI model integration improvements
- Memory system enhancements
- RAG implementation features
- Architecture component additions

---

## 📋 App Configuration & Permissions

### Required Environment Variables
- **DATABASE_URL**: PostgreSQL connection string
- **AI_API_KEY**: API key for OpenRouter/DeepSeek
- **NEXT_PUBLIC_AI_URL**: AI API endpoint

### Application Configuration
- **Default Port**: 3000
- **Main Entry**: `app/page.tsx`

---

## 🔧 Building & Running

### Development Build

```bash
# Start development server
yarn dev
# or
npm run dev

# Run tests
yarn test
# or
npm test
```

### Prisma & Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

---

## 📚 Learning Resources

### Web Development
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

### State Management
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Prisma ORM](https://www.prisma.io/docs/)

### AI Integration
- [OpenRouter Documentation](https://openrouter.ai/)
- [DeepSeek Model Information](https://deepseek.com/)

---

## 🔧 Troubleshooting

### Common Issues

**Build Issues:**
- Ensure Node.js v18+ is installed
- Check PostgreSQL installation and connection
- Verify `.env.local` has valid configuration

**Runtime Issues:**
- Check AI API key validity
- Verify network permissions for AI endpoints
- Ensure database migrations are applied

**Development Environment:**
- Use VSCode or preferred IDE
- Enable TypeScript and ESLint plugins

### Getting Help
1. Check existing GitHub issues first
2. Search the project documentation
3. Ask in Discord/community forums
4. Create a detailed issue with logs and steps to reproduce

---

## 🧪 Testing Guidelines

### Unit Tests
- Located in `lib/` or `components/`
- Run with `yarn test` or `npm test`
- Cover business logic and UI components
- Mock external dependencies

### Integration Tests
- Test complete user flows
- Verify AI integration works correctly
- Validate database operations

### Testing Best Practices
- Write tests before implementing features (TDD)
- Use descriptive test names
- Test both success and failure scenarios
- Mock network calls and external services

---

## 📊 Project Status & Roadmap

### Current Version: 1.0
- ✅ Core document parsing and AI extraction
- ✅ Flashcard and quiz generation
- ✅ Summary extraction
- ✅ Basic authentication system
- ✅ Room database integration (planned)

### Upcoming Features
- 🔄 Enhanced RAG capabilities
- 🔄 Improved memory visualization
- 🔄 Advanced voice commands
- 🔄 Customizable AI personalities
- 🔄 Offline mode capabilities

---

## 🤝 Contributing

### Code of Conduct
Before contributing, please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone.

### Issue Labels
- `good first issue`: Perfect for newcomers
- `enhancement`: New features and improvements
- `bug`: Bug fixes needed
- `documentation`: Documentation improvements

### Pull Request Guidelines
1. **Fork** the repository
2. **Create** a descriptive branch name
3. **Follow** the code style guidelines
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Reference issues** in your PR description
7. **Ensure compliance** with the Code of Conduct

### Code Review Process
- All PRs require at least one review
- Ensure CI checks pass
- Address reviewer feedback promptly
- Maintain backwards compatibility

---

## 📞 Support & Communication

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and community support
- **Discord/Community**: For real-time communication

---

## 🏆 Recognition

This project is part of **GirlScript Summer of Code (GSSoC)** - an initiative to encourage open source contributions and provide learning opportunities for students and developers.

**Happy Coding! 🚀**

---
*Last updated: July 2025*
