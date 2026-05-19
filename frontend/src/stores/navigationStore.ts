import { create } from 'zustand'

export type Page =
  | 'home'
  | 'admin/developers'
  | 'admin/access'
  | 'admin/schedule'
  | 'manager/schedule'
  | 'manager/book-call'
  | 'manager/my-calls'
  | 'developer/schedule'

interface NavigationState {
  currentPage: Page
  navigate: (page: Page) => void
  goHome: () => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: 'home',
  navigate: (page: Page) => set({ currentPage: page }),
  goHome: () => set({ currentPage: 'home' }),
}))
