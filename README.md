# 🗑️ BinSnap - Smart Waste Management System

## 🌟 Overview

**BinSnap** is a smart waste management application built with React and Node.js, featuring blockchain integration for data integrity.

---

##  Resources

### Core Technologies
- [Hedera Consensus Service (HCS) docs](https://docs.hedera.com/guides/hedera-services/consensus)  
- [Hedera Token Service (HTS) docs](https://docs.hedera.com/guides/hedera-services/token)  
- [@hashgraph/sdk (TypeScript/JavaScript)](https://github.com/hashgraph/hedera-sdk-js)  

### ML / Image Processing & AI Microservice
- [OpenRouter AI API (multimodal image–text)](https://openrouter.ai/docs)  
- [Express.js Routing Guide](https://expressjs.com/en/guide/routing.html)  
- [Axios HTTP Client](https://axios-http.com/docs/intro)  
- [dotenv (managing env vars & secrets)](https://github.com/motdotla/dotenv)  
- [Node.js Buffer (Base64 encoding)](https://nodejs.org/api/buffer.html#bufferbuffersfromstring-encoding)  

### Frontend
- [React (Web)](https://reactjs.org/docs/getting-started.html)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [shadcn/ui component library](https://ui.shadcn.com/)  

### Backend & Storage
- [Node.js + Express.js](https://nodejs.org/ • https://expressjs.com/)  
- [IPFS (off-chain storage)](https://docs.ipfs.tech/)  
- [Arweave (permanent storage)](https://docs.arweave.org/)  

### DevOps & CI/CD
- [Docker best practices](https://docs.docker.com/develop/)  
- [GitHub Actions for CI](https://docs.github.com/actions)  

### Testing & Reliability
- [Jest (unit testing)](https://jestjs.io/)  
- [Cypress (end-to-end testing)](https://www.cypress.io/)  
- [Retry Logic in JavaScript](https://zellwk.com/blog/retry-with-javascript/)  

### Architecture & Patterns
- [Clean Architecture (Uncle Bob)](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html)  
- [Domain-Driven Design (Eric Evans)](https://domainlanguage.com/)

---

##  Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0

### Installation

```bash
# Clone and install
git clone <repo-url>
cd NeuroChainX

# Backend
cd binsnap-backend
npm install

# User Frontend
cd ../user-frontend
npm install

# Admin Dashboard
cd ../admin-dashboear-cibe-main
npm install
```

### Configuration

Create `.env` file in `binsnap-backend/` (contact team for credentials):

```env
HEDERA_NETWORK=testnet
ACCOUNT_ID=
PRIVATE_KEY=
HCS_TOPIC_ID=
HTS_TOKEN_ID=
PORT=3000
```

### Run Application

```bash
# Start backend (Terminal 1)
cd binsnap-backend
npm run dev

# Start user frontend (Terminal 2)
cd user-frontend
npm run dev

# Start admin dashboard (Terminal 3)
cd admin-dashboear-cibe-main
npm run dev
```

---

##  Access

- **User App**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5174
- **API**: http://localhost:3000

---

## Development

### Available Commands

```bash
# Backend
npm run dev      # Development server
npm test         # Run tests
npm start        # Production server

# Frontend
npm run dev      # Development server
npm run build    # Production build
npm test         # Run tests
```

### Project Structure
```
NeuroChainX/
├── binsnap-backend/          # API Server
├── user-frontend/            # User Interface
├── admin-dashboear-cibe-main/ # Admin Interface
└── README.md
```

---

##  Troubleshooting

### Common Issues

**Backend won't start:**
- Check Node.js version: `node --version`
- Verify environment variables
- Ensure port 3000 is available

**Frontend build fails:**
- Clear cache: `rm -rf node_modules && npm install`
- Check for compilation errors

**Environment issues:**
- Contact team lead for proper configuration
- Verify all required credentials are provided

---

##  Technology Stack

### Frontend
- [React](https://reactjs.org) - User interface library
- [TypeScript](https://typescriptlang.org) - Type safety
- [Vite](https://vitejs.dev) - Build tool
- [Tailwind CSS](https://tailwindcss.com) - Styling

### Backend
- [Node.js](https://nodejs.org) - JavaScript runtime
- [Express.js](https://expressjs.com) - Web framework

### Development Tools
- [npm](https://npmjs.com) - Package management
- [ESLint](https://eslint.org) - Code quality
- [Prettier](https://prettier.io) - Code formatting




<div align="center">

**🌱 Built for sustainable waste management 🌍**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)

</div>
