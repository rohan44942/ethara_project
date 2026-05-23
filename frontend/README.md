# 🎨 Team Task Manager - Frontend

React + Vite frontend application for team collaboration and task management.

## 🚀 Features

### ✅ Implemented
- **Authentication** - Login/Signup with JWT
- **Dashboard** - Overview with statistics and recent activities
- **Projects Management** - Create, view, update, delete projects
- **Project Details** - Tabbed interface (Overview, Tasks, Team)
- **Task Management** - Kanban-style board with drag-and-drop
- **Team Management** - Add/remove members, role management
- **Task Filters** - Search, status, priority, assignee filters
- **Responsive Design** - Mobile-first approach
- **Dark Mode Ready** - Theme system in place

### 🎨 UI Components
- **Common Components**: Button, Input, Card, Modal, Toast, Badge, LoadingSpinner, ConfirmDialog
- **Layout Components**: Navbar, Sidebar, Layout wrapper
- **Task Components**: TaskCard, TaskForm, TaskFilters
- **Project Components**: MemberCard, AddMemberModal

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📦 Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your API URL
VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── tasks/           # Task-related components
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskFilters.jsx
│   │   └── projects/        # Project-related components
│   │       ├── MemberCard.jsx
│   │       └── AddMemberModal.jsx
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectDetails.jsx
│   │   ├── Tasks.jsx
│   │   └── Profile.jsx
│   ├── store/               # Redux store
│   │   ├── index.js
│   │   ├── api/
│   │   │   └── apiSlice.js  # RTK Query API
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── projectSlice.js
│   │       ├── taskSlice.js
│   │       └── uiSlice.js
│   ├── utils/               # Utility functions
│   │   └── axios.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)

# Build
npm run build           # Build for production

# Preview
npm run preview         # Preview production build

# Lint
npm run lint            # Run ESLint
```

## 🔌 API Integration

The app uses RTK Query for API calls. All endpoints are defined in `src/store/api/apiSlice.js`:

### Authentication
- `login` - POST /auth/login
- `signup` - POST /auth/signup
- `getCurrentUser` - GET /auth/me

### Projects
- `getProjects` - GET /projects
- `getProject` - GET /projects/:id
- `createProject` - POST /projects
- `updateProject` - PUT /projects/:id
- `deleteProject` - DELETE /projects/:id

### Tasks
- `getProjectTasks` - GET /projects/:id/tasks
- `getTask` - GET /tasks/:id
- `createTask` - POST /projects/:id/tasks
- `updateTask` - PUT /tasks/:id
- `deleteTask` - DELETE /tasks/:id
- `updateTaskStatus` - PATCH /tasks/:id/status

### Team
- `getProjectMembers` - GET /projects/:id/members
- `addMember` - POST /projects/:id/members
- `removeMember` - PATCH /projects/:id/members/:userId
- `updateMemberRole` - PUT /projects/:id/members/:userId

### Dashboard
- `getDashboard` - GET /dashboard

## 🎨 Styling

### Tailwind Configuration

Custom colors defined in `tailwind.config.js`:

```js
colors: {
  primary: {
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
    light: '#60a5fa',
  },
  secondary: {
    DEFAULT: '#8b5cf6',
    dark: '#7c3aed',
    light: '#a78bfa',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
}
```

### Component Variants

Buttons support multiple variants:
- `primary` (default)
- `secondary`
- `outline`
- `ghost`

## 🔐 Authentication Flow

1. User logs in/signs up
2. JWT token stored in Redux + localStorage
3. Token included in all API requests via Axios interceptor
4. Protected routes check authentication status
5. Auto-redirect to login if token expires

## 📱 Responsive Design

- **Mobile**: < 768px - Hamburger menu, stacked layout
- **Tablet**: 768px - 1024px - Collapsible sidebar
- **Desktop**: > 1024px - Full sidebar, multi-column layout

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output in `dist/` folder.

### Environment Variables

```env
VITE_API_URL=https://your-api-url.com/api
```

### Deploy to Railway

1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push

## 🧪 Testing (Coming Soon)

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 📝 Code Style

- **ESLint** - Code linting
- **Prettier** - Code formatting (recommended)
- **Component naming** - PascalCase
- **File naming** - PascalCase for components, camelCase for utilities

## 🐛 Troubleshooting

### Tailwind styles not working
```bash
# Restart dev server
npm run dev
```

### API connection issues
- Check VITE_API_URL in .env
- Ensure backend is running
- Check CORS settings

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

MIT License

## 🙏 Credits

- **UI Components**: Custom built with Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: Redux Toolkit

---

Built with ❤️ for team collaboration
