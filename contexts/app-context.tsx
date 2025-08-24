"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

type Page = 
  | 'dashboard'
  | 'chat'
  | 'bulk-sender'
  | 'warmup'
  | 'contacts'
  | 'reports'
  | 'settings'
  | 'connect'
  | 'ai-config'
  | 'langchain-config'
  | 'ai-assistant'
  | 'admin-dashboard'
  | 'admin-profile'
  | 'admin-users'
  | 'admin-customer-edit'
  | 'admin-redirect'
  | 'warmup-test'

interface AppContextType {
  currentPage: Page
  navigateToPage: (page: Page) => void
  navigateTo: (page: Page) => void
  user: {
    name: string
    email: string
    avatar?: string
  }
  notifications: {
    unreadChats: number
    runningCampaigns: number
    pendingWarmups: number
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  
  const navigateToPage = useCallback((page: Page) => {
    setCurrentPage(page)
  }, [])

  const value: AppContextType = {
    currentPage,
    navigateToPage,
    navigateTo: navigateToPage,
    user: {
      name: 'João Silva',
      email: 'joao@empresa.com',
      avatar: '/placeholder-user.jpg'
    },
    notifications: {
      unreadChats: 5,
      runningCampaigns: 2,
      pendingWarmups: 1
    }
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
