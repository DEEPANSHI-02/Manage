# User Management System

A comprehensive React-based user management system demonstrating enterprise-level frontend development practices, state management, and modern UI/UX design.

## 🚀 Features

- **Multi-tenant Architecture**: Support for multiple tenants with isolated data
- **Role-based Access Control**: Granular permissions and role management
- **Comprehensive CRUD Operations**: Full create, read, update, delete functionality
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern React Patterns**: Hooks, context, and functional components
- **Mock API Integration**: Realistic API simulation with proper error handling
- **Professional UI/UX**: Clean, intuitive interface with loading states and feedback

## 🏗️ System Architecture

### Core Modules

1. **Authentication & Session Management**
   - JWT token-based authentication
   - Session persistence and management
   - Automatic logout on token expiration

2. **Tenant Management**
   - Multi-tenant support with data isolation
   - Tenant configuration and settings
   - CRUD operations for tenant administration

3. **Organization Management**
   - Hierarchical organization structures
   - Organization profiles and settings
   - User-organization assignments

4. **User Management**
   - Comprehensive user administration
   - Profile management and role assignments
   - User status and activity tracking

5. **Role & Privilege Management**
   - Dynamic role creation and assignment
   - Granular privilege control
   - Role-privilege mapping

6. **Legal Entity Management**
   - Legal entity registration and compliance
   - Multi-jurisdiction support
   - Document and relationship management

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with functional components
- **Routing**: React Router v6
- **State Management**: Zustand for lightweight, scalable state management
- **Form Handling**: React Hook Form with built-in validation
- **HTTP Client**: Axios for API communication
- **UI Framework**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for consistent iconography
- **Notifications**: React Hot Toast for user feedback
- **Build Tool**: Vite for fast development and building

## 📦 Installation & Setup

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user-management-system
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
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## 🔐 Demo Credentials

The application includes pre-configured demo users for testing:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | admin@techcorp.com | admin123 | Full system access |
| **Manager** | sarah.manager@techcorp.com | manager123 | Management privileges |
| **User** | mike.developer@techcorp.com | user123 | Standard user access |

## 📱 Application Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (buttons, modals, etc.)
│   └── layout/          # Layout components (sidebar, header)
├── hooks/               # Custom React hooks
├── pages/               # Route-based page components
├── services/            # API services and mock data
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (buttons, modals, etc.)
│   └── layout/          # Layout components (sidebar, header)
├── hooks/               # Custom React hooks
├── pages/               # Route-based page components
├── services/            # API services and mock data
├── store/               # State management (Zustand stores)
├── utils/               # Helper functions and utilities
├── App.jsx              # Main application component
├── index.js             # Application entry point
├── App.css              # Application-specific styles
└── index.css            # Global styles with Tailwind
```

## 🎯 Key Features Implementation

### Authentication Flow
- Secure login with email/password validation
- JWT token management with automatic refresh
- Protected routes with role-based access control
- Session persistence across browser sessions

### Dashboard Analytics
- Real-time statistics and metrics
- Recent activity feed
- Quick action shortcuts
- System status monitoring

### Data Management
- Advanced search and filtering capabilities
- Sortable data tables with pagination
- Bulk operations support
- Export/import functionality

### User Experience
- Responsive design for all screen sizes
- Loading states and skeleton screens
- Toast notifications for user feedback
- Error boundaries for graceful error handling

## 🧪 Testing

### Running Tests
```bash
npm test
# or
yarn test
```

### Test Coverage
```bash
npm run test:coverage
# or
yarn test:coverage
```

The application includes comprehensive test coverage for:
- Component rendering and interaction
- Authentication flows
- API service methods
- State management logic
- Form validation

## 🔧 Development Guidelines

### Code Style
The project follows the Airbnb React/JSX Style Guide:
- ESLint configuration for code quality
- Prettier for consistent formatting
- Descriptive component and function naming
- Comprehensive JSDoc documentation

### Component Architecture
- **Atomic Design**: Components organized by complexity (atoms → molecules → organisms)
- **Container/Presentational**: Separation of business logic and UI
- **Custom Hooks**: Reusable business logic extraction
- **Prop Validation**: Comprehensive prop type definitions

### State Management
- **Global State**: User authentication and app-wide settings
- **Local State**: Component-specific UI state
- **Server State**: API data with caching and synchronization
- **Form State**: React Hook Form for complex form handling

## 📊 Performance Optimizations

- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Responsive images with lazy loading
- **Memoization**: React.memo and useMemo for expensive operations
- **Virtual Scrolling**: For large data sets (planned feature)

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Authentication and session management
- ✅ Dashboard with analytics
- ✅ Tenant management (basic CRUD)
- 🔄 User management implementation
- 🔄 Organization management

### Phase 2 (Next)
- 📋 Role and privilege management
- 📋 Legal entity management
- 📋 Advanced search and filtering
- 📋 Bulk operations

### Phase 3 (Future)
- 📋 Real-time notifications
- 📋 Advanced analytics and reporting
- 📋 API integrations
- 📋 Mobile application

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📄 API Documentation

### Authentication Endpoints
```javascript
POST /api/v1/auth/login
// Request: { email, password, tenant_id? }
// Response: { access_token, refresh_token, user }

GET /api/v1/me
// Response: Current user profile

PUT /api/v1/me
// Request: Updated user data
// Response: Updated user profile
```

### Tenant Management
```javascript
GET /api/v1/tenants
POST /api/v1/tenants
GET /api/v1/tenants/{id}
PUT /api/v1/tenants/{id}
GET /api/v1/tenants/{id}/settings
PUT /api/v1/tenants/{id}/settings
```

For complete API documentation, see the [API Reference](./docs/api-reference.md).

## 🔍 Troubleshooting

### Common Issues

**1. Port 5173 already in use**
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9
# Or use a different port
npm run dev -- --port 3000
```

**2. Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. Build failures**
```bash
# Clear build cache
rm -rf dist
npm run build
```

### Performance Issues
- Check browser developer tools for console errors
- Verify network requests in the Network tab
- Use React Developer Tools for component debugging

## 📞 Support

For questions and support:
- 📧 Email: ved@mstack.co
- 📖 Documentation: [Project Wiki](./docs)
- 🐛 Bug Reports: [GitHub Issues](./issues)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **Zustand** for simple state management
- **Vercel** for deployment and hosting

---

**Built with ❤️ for enterprise user management**