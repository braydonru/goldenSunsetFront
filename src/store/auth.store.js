// src/store/auth.store.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: true, // 👈 IMPORTANTE

            setAuth: (user, token) =>
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    loading: false,
                },
                ),

            clearAuth: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    loading: false,
                }),

            setLoading: (value) => set({ loading: value }),
        }),

        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state.setLoading(false)   // 👈 cuando termina de hidratar
            }
        }
    )
)

