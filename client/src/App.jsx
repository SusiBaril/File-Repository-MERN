import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion"; // Install: npm install framer-motion

// Dashboard Pages
import DashboardOverview from './page/Home';
import Starred from './page/Dashboard/Starred';

//File Repository Pages
import AllFile from './page/FileRepository/AllFile';
import Folders from './page/FileRepository/Folders';
import SharedWithMe from './page/FileRepository/SharedWithMe';
import Trash from './page/FileRepository/Trash';

// Animated Routes Component
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Routes location={location} key={location.pathname}>
          {/* Dashboard Pages */}
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/dashboard/overview" element={<DashboardOverview />} />
          <Route path="/dashboard/starred" element={<Starred />} />

          {/* File Repository Pages */}
          <Route path="/file-repository/all-file" element={<AllFile />} />
          <Route path="/file-repository/folders" element={<Folders />} />
          <Route path="/file-repository/shared-with-me" element={<SharedWithMe />} />
          <Route path="/file-repository/trash" element={<Trash />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

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
          
          {/* Content with smooth transitions */}
          <div className="flex flex-1 flex-col gap-4 pt-0 bg-[#dadada] relative overflow-hidden">
            <AnimatedRoutes />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Router>
  )
}

export default App