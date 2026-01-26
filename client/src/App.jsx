import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import DashboardOverview from './page/Home';

function App() {

  return (
    <Router>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </div>
          </header>
          {/* Content */}
          <div className="flex flex-1 flex-col gap-4 pt-0 bg-[#dadada]">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/dashboard/overview" element={<DashboardOverview />} />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Router>
  )
}

export default App
