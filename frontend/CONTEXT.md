# Frontend — Project Context

---

## 📌 IMPORTANT: Documentation Maintenance

**Every time you change code, update this CONTEXT.md file** with:
- ✅ New pages added
- ✅ New components created
- ✅ New services/modules
- ✅ UI changes
- ✅ API integration changes
- ✅ New features for roles
- ✅ Bug fixes

---

## Project Overview

A **modern React + TypeScript + Vite** frontend for Telegram Mini App. Provides role-based interfaces (Admin, Sales Manager, Developer) with modular architecture, Tailwind CSS styling, and full integration with FastAPI backend.

**Technology**: React 18 + TypeScript + Vite + Tailwind CSS + Zustand  
**Architecture**: Component-based with modular feature modules  
**Deployment**: Telegram Mini App (in-app web browser)

---

## Tech Stack

- **Language**: TypeScript 5.3
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.3 + PostCSS
- **State Management**: Zustand 4.4
- **HTTP Client**: Axios 1.6
- **Telegram SDK**: @telegram-apps/sdk 0.3
- **Package Manager**: npm/pnpm

---

## Project Structure

```
frontend/
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── common/                # Base UI components (shadcn-style)
│   │   │   ├── Button.tsx         # Button with variants (primary, danger, etc.)
│   │   │   ├── Card.tsx           # Card layout components
│   │   │   ├── Modal.tsx          # Modal dialog with types (success, error, etc.)
│   │   │   ├── Input.tsx          # Input & TextArea with validation
│   │   │   ├── Badge.tsx          # Badge, EmptyState, LoadingSpinner, Skeleton
│   │   │   └── index.ts           # Exports
│   │   ├── layout/                # Layout components
│   │   │   └── Header.tsx         # Header & Navigation & Layout wrapper
│   │   └── forms/                 # Form components (future)
│   │
│   ├── pages/                     # Full page components
│   │   ├── Home.tsx               # Home/Dashboard (role-neutral)
│   │   ├── admin/                 # Admin pages (future)
│   │   │   ├── Developers.tsx
│   │   │   ├── Users.tsx
│   │   │   ├── Schedules.tsx
│   │   │   └── index.ts
│   │   ├── sales-manager/         # Sales manager pages (future)
│   │   │   ├── Schedule.tsx
│   │   │   ├── BookCall.tsx
│   │   │   ├── MySuspensions.tsx
│   │   │   └── index.ts
│   │   └── developer/             # Developer pages (future)
│   │       ├── MySchedule.tsx
│   │       └── index.ts
│   │
│   ├── modules/                   # Feature modules (organized by domain)
│   │   ├── users/                # User management
│   │   │   ├── useUsers.ts       # Hook for users
│   │   │   ├── UsersList.tsx     # Users list component
│   │   │   └── index.ts
│   │   ├── developers/           # Developer management
│   │   ├── calls/                # Call scheduling
│   │   └── notifications/        # Notifications
│   │
│   ├── services/                 # External services
│   │   ├── api.ts               # Axios API client (all endpoints)
│   │   └── telegram.ts          # Telegram Web App wrapper
│   │
│   ├── hooks/                    # Custom React hooks (future)
│   ├── stores/                   # Zustand stores
│   │   └── appStore.ts          # Global app state + modal state
│   │
│   ├── types/                    # TypeScript definitions
│   │   └── index.ts             # All types in one file
│   │
│   ├── utils/                    # Utility functions (future)
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles + Tailwind imports
│
├── public/                       # Static assets
├── index.html                   # HTML entry with Telegram script
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
├── README.md
└── CONTEXT.md                   # This file
```

---

## Component Architecture

### Component Hierarchy

```
App
├── Home (Home page)
│   ├── Header
│   ├── Content (role-based)
│   │   ├── Admin View
│   │   │   ├── Card (Dev List)
│   │   │   └── Card (Stats)
│   │   ├── Sales Manager View
│   │   │   └── Card (Quick Info)
│   │   └── Developer View
│   │       └── Card (My Schedule)
│   └── Navigation (bottom nav)
├── Modal (Global modal)
└── Other Pages (role-specific)
```

### Component Reusability

**shadcn-style approach**:
- Small, focused components
- Variants for different states
- Easy to compose together
- Consistent styling via Tailwind

**Examples**:
```tsx
// Button variants
<Button variant="primary" />
<Button variant="danger" size="sm" isLoading />

// Card composition
<Card>
  <CardHeader><CardTitle>Title</CardTitle></CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

---

## State Management (Zustand)

### Global App State

```typescript
useAppStore: {
  user: User | null              // Current user
  loading: boolean               // Loading state
  error: string | null           // Error message
  setUser(user)                  // Set user
  fetchUser(telegramId)          // Fetch from API
  logout()                       // Clear user
}
```

### Modal State

```typescript
useModalStore: {
  modal: {
    isOpen: boolean
    title: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
  }
  showModal(title, message, type)
  hideModal()
}
```

---

## API Integration

### API Client (`services/api.ts`)

Type-safe Axios client with endpoints for:
- Users (CRUD, get by Telegram ID)
- Developers (CRUD)
- Calls (CRUD, filtering by developer/manager)
- Access (grant, revoke, list)
- Notifications (CRUD, toggle)

### Usage

```tsx
import { api } from '@services/api'

// Get user
const user = await api.getUserByTelegramId(telegramId)

// Create call
const call = await api.createCall({
  developer_id: 1,
  sales_manager_id: 2,
  title: 'Interview',
  start_time: new Date().toISOString(),
  end_time: new Date().toISOString(),
})

// List calls for developer
const { total, items } = await api.listCalls(0, 50, developerId)
```

---

## Telegram Integration

### Initialize on App Load

```tsx
useEffect(() => {
  telegram.init()
  const user = telegram.getTelegramUser()
  if (user) {
    fetchUser(user.id)
  }
}, [])
```

### Main Button Control

```tsx
const handleSave = async () => {
  telegram.disableMainButton()
  try {
    await api.createCall(callData)
    telegram.showAlert('Success!')
  } finally {
    telegram.enableMainButton()
  }
}

telegram.setMainButtonText('Save')
telegram.showMainButton()
telegram.onMainButtonClick(handleSave)
```

---

## Role-Based Interfaces

### Admin
- **Pages**: Developers, Users, Schedules
- **Features**:
  - Manage developers (create, edit, delete)
  - Manage access (grant, revoke)
  - View all developer schedules
  - Delete calls
  - View call details

### Sales Manager
- **Pages**: Schedule, Book Call, Manage Calls
- **Features**:
  - View developer schedules by date
  - Book calls with developers
  - Manage own calls (suspend/delete)
  - Toggle notifications per developer
  - View past calls

### Developer
- **Pages**: My Schedule
- **Features**:
  - View scheduled calls
  - View call details
  - View own profile

---

## UI Kit (Tailwind-based)

### Colors
- **Primary**: Blue (0-9: 50, 100, 500, 600, 700)
- **Secondary**: Slate (text/neutral)
- **Success**: Green
- **Danger**: Red
- **Warning**: Amber

### Components

| Component | Location | Usage |
|-----------|----------|-------|
| **Button** | `common/Button.tsx` | All clickable actions |
| **Card** | `common/Card.tsx` | Content containers |
| **Modal** | `common/Modal.tsx` | Dialogs & confirmations |
| **Input** | `common/Input.tsx` | Form fields |
| **Badge** | `common/Badge.tsx` | Status labels |
| **Header** | `layout/Header.tsx` | Page header |
| **Navigation** | `layout/Header.tsx` | Bottom navigation |
| **LoadingSpinner** | `common/Badge.tsx` | Loading state |
| **EmptyState** | `common/Badge.tsx` | No data state |
| **Skeleton** | `common/Badge.tsx` | Loading placeholder |

---

## Development Workflow

### Add a New Page

1. Create in `pages/role-name/Page.tsx`
2. Use `Layout` component
3. Connect to stores and services
4. Add navigation link

### Add a New Component

1. Create in `components/module/Component.tsx`
2. Export in `components/module/index.ts`
3. Use in pages/modules

### Add a New Feature Module

1. Create `modules/feature/` folder
2. Add `useFeature.ts` (hook)
3. Add component files
4. Export in `modules/feature/index.ts`

### Connect New Endpoint

1. Add method in `services/api.ts`
2. Use in service/hook
3. Call from component

---

## Environment Variables

Create `.env`:
```ini
VITE_API_URL=http://localhost:8000/api/v1
```

In code:
```tsx
const API_URL = import.meta.env.VITE_API_URL
```

---

## Building & Deployment

### Development
```bash
npm run dev
# http://localhost:5173
```

### Production Build
```bash
npm run build
# Output: dist/
```

### Telegram Mini App Setup
1. Build: `npm run build`
2. Deploy `dist/` to web server
3. Set Bot Web App URL in Telegram BotFather

---

## TypeScript Types

All types in `types/index.ts`:
- `User`, `Developer`, `Call`, `Access`, `NotificationSettings`
- `UserRole`, `ListResponse`, `ApiError`
- `TelegramUser`, `TelegramWebApp`
- `AppState`, `ModalState`

---

## Performance & Best Practices

✅ **Code Splitting**: Vite auto-splits at route level  
✅ **CSS**: Tailwind purges unused styles in production  
✅ **State**: Zustand for minimal re-renders  
✅ **API**: Axios with request/response interceptors (future)  
✅ **Images**: Optimize before adding  

---

## Future Enhancements

- 🔒 Add authentication hooks
- 📝 Add form validation library
- 🧪 Add unit tests (Vitest)
- 📊 Add analytics
- 🔔 Add real-time notifications (WebSocket)
- 🌙 Add dark mode
- 🌐 Add i18n (internationalization)
- 📱 Add PWA support
- 🚀 Add Sentry error tracking

---

## File Quick Reference

| File | Purpose |
|------|---------|
| `App.tsx` | Main component, modal wrapper |
| `main.tsx` | Entry point, renders App |
| `index.css` | Tailwind imports + globals |
| `services/api.ts` | All API calls |
| `services/telegram.ts` | Telegram Web App SDK |
| `stores/appStore.ts` | Global state (Zustand) |
| `types/index.ts` | All TypeScript types |
| `components/common/*` | Reusable UI components |
| `components/layout/*` | Layout components |
| `pages/*` | Page-level components |
| `modules/*` | Feature-specific modules |

---

## Related Documentation

- **[README.md](./README.md)** - Getting started & setup
- **[../backend/CONTEXT.md](../backend/CONTEXT.md)** - Backend docs
- **[../ARCHITECTURE.md](../ARCHITECTURE.md)** - Overall architecture
- **[../README.md](../README.md)** - Main project README

---

## Known Limitations

- Telegram Mini App requires Telegram bot
- Browser local storage only (no persistence)
- Single user per session (Telegram handles auth)
- No offline support yet

---

**Last Updated**: May 19, 2026  
**Author**: Development Team
