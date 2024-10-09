import { create } from 'zustand'
import { User } from '@/lib/prisma'
import { getUser } from '@/actions/user'

interface UserState {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  clearCurrentUser: () => void
  reloadCurrentUser: () => void
  isAIUsageLimitExceeded: () => boolean // 新增函数声明
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  clearCurrentUser: () => set({ currentUser: null }),
  reloadCurrentUser: async () => {
    const { currentUser, setCurrentUser } = get();
    if (currentUser) {
      const user = await getUser(currentUser.id);
      setCurrentUser(user);
    }
  },
  isAIUsageLimitExceeded: () => {
    const { currentUser } = get();
    if (!currentUser) return false;
    
    return currentUser.useAICount >= currentUser.maxUseAICount;
  }
}))

