"use client"

import { AppProvider, useApp } from "@/contexts/app-context"
import { AuthWrapper, RoleBasedRedirect } from "@/components/auth"
import NavigationSidebar from "@/components/navigation-sidebar"
import EnhancedTopbar from "@/components/enhanced-topbar"
import DashboardPage from "@/components/pages/dashboard-page"
import ChatPage from "@/components/pages/chat-page"
import BulkSenderPage from "@/components/pages/bulk-sender-page"
import WarmupPage from "@/components/pages/warmup-page"
import ContactsPage from "@/components/pages/contacts-page"
import ReportsPage from "@/components/pages/reports-page"
import SettingsPage from "@/components/pages/settings-page"
import ConnectPage from "@/components/pages/connect-page"
import AIConfigPage from "@/components/pages/ai-config-page"
import AIAssistantPage from "@/components/pages/ai-assistant-page"
import AdminDashboardPage from "@/components/pages/admin-dashboard-page"
import AdminProfilePage from "@/components/pages/admin-profile-page"
import AdminUsersPage from "@/components/pages/admin-users-page"
import AdminCustomerEditPage from "@/components/pages/admin-customer-edit-page"
import LangChainConfigPage from "@/components/pages/langchain-config-page"
import WarmupTest from "@/components/warmup-test"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

function AppContent() {
  const { currentPage } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "chat":
        return <ChatPage />
      case "bulk-sender":
        return <BulkSenderPage />
      case "warmup":
        return <WarmupPage />
      case "contacts":
        return <ContactsPage />
      case "reports":
        return <ReportsPage />
      case "ai-assistant":
        return <AIAssistantPage />
      case "connect":
        return <ConnectPage />
      case "ai-config":
        return <AIConfigPage />
      case "langchain-config":
        return <LangChainConfigPage />
      case "settings":
        return <SettingsPage />
      case "admin-dashboard":
        return <AdminDashboardPage />
      case "admin-profile":
        return <AdminProfilePage />
      case "admin-users":
        return <AdminUsersPage />
      case "admin-customer-edit":
        return <AdminCustomerEditPage />
      case "admin-redirect":
        return <RoleBasedRedirect />
      case "warmup-test":
        return <WarmupTest />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-slate-50/30">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 bottom-0 w-[280px] z-[71] hidden lg:block">
        <NavigationSidebar />
      </div>
      
      {/* Fixed Topbar */}
      <div className="fixed top-0 left-0 right-0 z-[1] h-16">
        <EnhancedTopbar />
      </div>
      
      {/* Main Content Area */}
      <div className="pt-16 lg:pl-[280px]">
        {currentPage === 'ai-assistant' ? (
          // Layout fullscreen para o assistente IA (sem padding adicional)
          <div className="h-[calc(100vh-64px)]">
            {renderCurrentPage()}
          </div>
        ) : (
          // Layout normal para outras páginas
          <div className="p-6">
            {renderCurrentPage()}
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-[80]"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Menu de Navegação</SheetTitle>
          </SheetHeader>
          <NavigationSidebar />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <AuthWrapper>
        <AppContent />
      </AuthWrapper>
    </AppProvider>
  )
}
