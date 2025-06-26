# User Management System

A robust, multi-tenant user management platform built with React, Tailwind CSS, Zustand, and a mock API. This system demonstrates enterprise-grade frontend architecture, role-based access, and modern UI/UX for both system and tenant administrators.

---

## 🚀 Features (Implemented)

- **Multi-tenant Architecture**: Isolated data and management for each tenant
- **Role-based Access Control**: System admin and tenant admin roles with protected routes
- **Comprehensive CRUD Operations**: Users, roles, privileges, organizations, legal entities
- **Tenant Settings**: Edit tenant info, preferences, and branding
- **Analytics & Reports**: User/org/role metrics, charts, and CSV export
- **Notifications**: Mock notifications with mark-as-read and clear-all
- **Responsive Design**: Mobile-first, Tailwind-powered UI
- **Modern React Patterns**: Hooks, context, functional components
- **State Management**: Zustand for scalable state
- **Form Handling**: React Hook Form with validation
- **Mock API Integration**: Realistic API simulation for all modules
- **Professional UI/UX**: Clean, intuitive interface with loading states and feedback
- **Sidebar & Dashboard Navigation**: Quick access to all modules
- **Protected Routing**: Role-based route guards
- **Toast Notifications**: User feedback with React Hot Toast
- **Build Tool**: Vite for fast development

---

## 🏗️ System Architecture

### Core Modules

1. **Authentication & Session Management**
   - Email/password login (mocked)
   - Session persistence
   - Role-based protected routes

2. **Tenant Management**
   - Multi-tenant support (mocked)
   - Tenant settings and preferences

3. **Organization Management**
   - CRUD for organizations
   - User-organization assignments

4. **User Management**
   - CRUD for users
   - Role assignments
   - Status and activity tracking

5. **Role & Privilege Management**
   - CRUD for roles and privileges
   - Assign privileges to roles

6. **Legal Entity Management**
   - CRUD for legal entities

7. **Analytics & Reports**
   - Dashboard metrics and charts
   - Export user growth as CSV

8. **Notifications**
   - Mock notifications for tenant admins
   - Mark all as read, clear all

9. **Settings**
   - Edit tenant info, preferences, and branding

---

## 🛠️ Technology Stack

- **Frontend**: React 18 (functional components)
- **Routing**: React Router v6
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios (for mock API)
- **UI Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UserManagement
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
# or
yarn build
```
The build artifacts will be stored in the `dist/` directory.

---

## 📱 Application Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (buttons, modals, etc.)
│   └── layout/          # Layout components (sidebar, header)
├── hooks/               # Custom React hooks
├── pages/               # Route-based page components
├── services/            # API services and mock data
├── store/               # Zustand stores
├── utils/               # Helper functions
├── App.jsx              # Main app component
└── index.js             # Entry point
```

---

## 🎯 Key Features Implementation

- **Authentication**: Mock login, session persistence, protected routes
- **Dashboard Analytics**: Metrics, charts, recent activity, export as CSV
- **User, Role, Privilege, Organization, Legal Entity Management**: Full CRUD, search, filtering, modals
- **Tenant Settings**: Edit info, preferences, branding
- **Notifications**: Mock notifications, mark as read, clear all
- **Responsive UI**: Tailwind, mobile-first
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **UI/UX**: Loading states, toasts, error handling

---

## 🗺️ Roadmap

- [x] Multi-tenant, role-based user management
- [x] CRUD for users, roles, privileges, orgs, legal entities
- [x] Tenant settings and preferences
- [x] Analytics & reports (basic metrics, CSV export)
- [x] Notifications (mock)
- [x] Responsive, modern UI/UX
- [ ] Real-time features (future)
- [ ] Advanced analytics/reporting (future)
- [ ] API integrations (future)
- [ ] Mobile app (future)

---

## 📄 API (Mock)

All data is served from a local mock API (see `src/services/mockApi.js`). No real backend is required.

---

## 📞 Support

For questions and support:
- 📧 Email: deepanshik825@gmail.com

---

**Built with ❤️ for enterprise user management**