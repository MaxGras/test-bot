# Frontend — Telegram Mini App

Modern React + TypeScript + Vite frontend for Telegram Mini App. Features role-based interfaces, Tailwind CSS styling, and modular architecture.

## 🎯 Features

✅ **Telegram Mini App Integration** - Direct connection to Telegram using Web App API  
✅ **Role-Based UI** - Different interfaces for admin, sales manager, and developer roles  
✅ **Component Library** - Reusable shadcn-style UI components  
✅ **Modular Architecture** - Organized by feature modules, easy to extend  
✅ **Tailwind CSS** - Utility-first styling for responsive design  
✅ **TypeScript** - Full type safety for components and API calls  
✅ **Zustand State Management** - Lightweight store for global app state  
✅ **API Integration** - Axios client connected to FastAPI backend  

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── common/             # Basic components (Button, Card, Modal, etc.)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── index.ts
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Navigation.tsx
│   │   └── forms/              # Form components (future)
│   │
│   ├── pages/                  # Page components
│   │   ├── Home.tsx            # Home/Dashboard page
│   │   ├── admin/              # Admin pages (future)
│   │   ├── sales-manager/      # Sales manager pages (future)
│   │   └── developer/          # Developer pages (future)
│   │
│   ├── modules/                # Feature modules (organized by feature)
│   │   ├── users/             # User management module
│   │   ├── developers/        # Developer management
│   │   ├── calls/             # Call scheduling
│   │   └── notifications/     # Notification settings
│   │
│   ├── services/               # API and Telegram services
│   │   ├── api.ts             # Axios API client
│   │   └── telegram.ts        # Telegram Web App wrapper
│   │
│   ├── hooks/                  # Custom React hooks (future)
│   ├── stores/                 # Zustand stores
│   │   └── appStore.ts        # Global app state
│   │
│   ├── types/                  # TypeScript types
│   │   └── index.ts           # All type definitions
│   │
│   ├── utils/                  # Utility functions
│   ├── App.tsx                # Main App component
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles (Tailwind)
│
├── public/                     # Static assets
├── index.html                 # HTML entry point
├── package.json               # Dependencies
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── .env.example               # Environment variables example
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (or nvm)
- npm or pnpm

### Installation

```bash
cd /Users/admin/wk-prj/tg-bot/new-bot/frontend

# Install dependencies
npm install
# or
pnpm install
```

### Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```ini
VITE_API_URL=http://localhost:8000/api/v1
```

### Development

```bash
npm run dev

# App will be available at http://localhost:5173
```

### Build

```bash
npm run build

# Output in dist/ folder
```

### Preview Production Build

```bash
npm run preview
```

## 🏗️ Architecture

### Layers

| Layer | Purpose | Location |
|-------|---------|----------|
| **Components** | Reusable UI elements | `components/` |
| **Pages** | Page-level components | `pages/` |
| **Modules** | Feature-specific logic | `modules/` |
| **Services** | API & external services | `services/` |
| **Stores** | Global state (Zustand) | `stores/` |
| **Types** | TypeScript definitions | `types/` |
| **Utils** | Helper functions | `utils/` |

### Data Flow

```
Telegram User
    ↓
App Component
    ↓
Home Page (fetches user data)
    ↓
Zustand Store (global state)
    ↓
Service Layer (API calls)
    ↓
FastAPI Backend
```

## 🎨 UI Components

### Common Components (shadcn-style)

```tsx
import { Button, Card, Modal, Input, Badge } from '@components/common'

// Button variants
<Button variant="primary" size="md">Click me</Button>
<Button variant="danger" isLoading={true}>Loading...</Button>

// Card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardBody>Content</CardBody>
</Card>

// Modal
<Modal
  isOpen={true}
  title="Confirm"
  message="Are you sure?"
  type="warning"
  onClose={handleClose}
/>

// Input
<Input
  label="Email"
  type="email"
  placeholder="user@example.com"
  error={errorMessage}
/>

// Badge
<Badge variant="success">Active</Badge>
```

## 🔌 API Integration

### Using the API Client

```tsx
import { api } from '@services/api'

// Fetch users
const users = await api.listUsers(0, 10)

// Create call
const call = await api.createCall({
  developer_id: 1,
  sales_manager_id: 2,
  title: 'Interview',
  start_time: new Date().toISOString(),
  end_time: new Date().toISOString(),
})

// List calls for developer
const calls = await api.listCalls(0, 100, developerId)
```

### API Client Methods

- **Users**: `getUser`, `getUserByTelegramId`, `createUser`, `listUsers`, `updateUser`, `deleteUser`
- **Developers**: `getDeveloper`, `listDevelopers`, `createDeveloper`, `updateDeveloper`, `deleteDeveloper`
- **Calls**: `getCall`, `listCalls`, `createCall`, `updateCall`, `deleteCall`
- **Access**: `grantAccess`, `listAccess`, `revokeAccess`
- **Notifications**: `getNotificationSettings`, `listNotificationSettings`, `updateNotificationSettings`, `toggleNotifications`

## 📱 Telegram Integration

### Initialize Telegram

```tsx
import { telegram } from '@services/telegram'

useEffect(() => {
  telegram.init()
  const user = telegram.getTelegramUser()
}, [])
```

### Telegram Methods

```tsx
// User info
telegram.getTelegramUser() // Returns TelegramUser | null
telegram.getInitData() // Returns init data string

// Main button
telegram.setMainButtonText('Save')
telegram.showMainButton()
telegram.hideMainButton()
telegram.onMainButtonClick(() => {
  // Handle click
})

// Close app
telegram.close()
```

## 🎯 Role-Based Pages

### Admin
- Manage developers (create, edit, delete)
- Manage access (grant, revoke)
- View all schedules
- View and delete calls
- User management

### Sales Manager
- View developer schedules
- Book calls with developers
- Manage own calls (suspend/delete)
- Toggle notifications per developer

### Developer
- View own scheduled calls
- View profile

## 🔄 State Management with Zustand

### Global App State

```tsx
import { useAppStore } from '@stores/appStore'

function MyComponent() {
  const { user, loading, error, fetchUser } = useAppStore()

  useEffect(() => {
    fetchUser(telegramId)
  }, [fetchUser])

  return <div>{user?.first_name}</div>
}
```

### Modal State

```tsx
import { useModalStore } from '@stores/appStore'

function ShowSuccess() {
  const { showModal } = useModalStore()
  
  showModal('Success!', 'Call created', 'success')
}
```

## 🎨 Tailwind CSS Customization

Theme colors in `tailwind.config.js`:
- `primary-*`: Main brand color (blue)
- `secondary-*`: Text and neutral colors (slate)
- `success-*`: Success states (green)
- `danger-*`: Error states (red)
- `warning-*`: Warning states (amber)

Safe area insets for notches:
```tsx
<div className="pt-safe-top pb-safe-bottom">Content</div>
```

## 🧪 Testing (Future)

```bash
npm run test
npm run test:coverage
```

## 📦 Building for Production

```bash
npm run build

# Output: dist/ folder ready for deployment
```

## 🌐 Deployment

### As Telegram Mini App

1. Build the app: `npm run build`
2. Deploy `dist/` folder to web server
3. Set Telegram Bot's Web App URL to your deployment

### Example with Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📚 Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **Telegram Web App API** - Integration

## 🔄 Contributing

1. Create a feature branch
2. Make changes following the component structure
3. Test in Telegram Mini App
4. Submit PR

## 📖 Related Files

- **[../ARCHITECTURE.md](../ARCHITECTURE.md)** - Overall project architecture
- **[../backend/CONTEXT.md](../backend/CONTEXT.md)** - Backend documentation
- **[../README.md](../README.md)** - Main project README
- **[../backend/requirements.txt](../backend/requirements.txt)** - Backend dependencies

## 🚀 Quick Tips

- Use `@components/common` for all UI elements
- Use `@services/api` for API calls
- Store global state in `useAppStore`
- Keep components small and focused
- Use TypeScript for better DX
- Test with actual Telegram Mini App when possible

---

**Last Updated**: May 19, 2026  
**Author**: Development Team
