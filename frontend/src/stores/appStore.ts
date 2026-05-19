import { create } from 'zustand'
import type { User, AppState, ModalState } from '@types'
import { api } from '@services/api'
import { telegram } from '@services/telegram'

interface AppStore extends AppState {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchUser: (telegramId: number) => Promise<void>
  logout: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchUser: async (telegramId: number) => {
    set({ loading: true, error: null })
    try {
      const user = await api.getUserByTelegramId(telegramId)
      set({ user, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user'
      set({ error: errorMessage, loading: false })
    }
  },

  logout: () => {
    set({ user: null })
    telegram.close()
  },
}))

interface ModalStore {
  modal: ModalState
  showModal: (title: string, message: string, type: ModalState['type']) => void
  hideModal: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  modal: {
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  },

  showModal: (title, message, type) =>
    set({
      modal: {
        isOpen: true,
        title,
        message,
        type,
      },
    }),

  hideModal: () =>
    set({
      modal: {
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
      },
    }),
}))
