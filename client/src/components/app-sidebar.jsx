"use client"

import * as React from "react"
import { useLocation } from "react-router-dom" // Add this import
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  LayoutDashboard,
  FolderOpen,
  Activity
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }) {
  const location = useLocation() // Get current location

  // This is sample data with dynamic isActive
  const data = {
    user: {
      name: "Keegan Rosales",
      email: "rosaleskeegan@gmail.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Hotdog",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard/overview",
        icon: LayoutDashboard,
        isActive: location.pathname.startsWith("/dashboard"), // Dynamic based on current path
        items: [
          {
            title: "Overview",
            url: "/dashboard/overview",
            isActive: location.pathname === "/dashboard/overview", // Specific item active state
          },
          {
            title: "Starred Files",
            url: "/dashboard/starred",
            isActive: location.pathname === "/dashboard/starred",
          },
        ],
      },
      {
        title: "File Repository",
        url: "/file-repository/all-file",
        icon: FolderOpen,
        isActive: location.pathname.startsWith("/file-repository"), // Dynamic based on current path
        items: [
          {
            title: "All Files",
            url: "/file-repository/all-file",
            isActive: location.pathname === "/file-repository/all-file",
          },
          {
            title: "Folders",
            url: "/file-repository/folders",
            isActive: location.pathname === "/file-repository/folders",
          },
          {
            title: "Shared With Me",
            url: "/file-repository/shared-with-me",
            isActive: location.pathname === "/file-repository/shared-with-me",
          },
          {
            title: "Trash",
            url: "/file-repository/trash",
            isActive: location.pathname === "/file-repository/trash",
          },
        ],
      },
      {
        title: "Activity",
        url: "#",
        icon: Activity,
        isActive: location.pathname.startsWith("/activity"), // Dynamic based on current path
        items: [
          {
            title: "Upload History",
            url: "/activity/upload-history",
            isActive: location.pathname === "/activity/upload-history",
          },
          {
            title: "Download Logs",
            url: "/activity/download-logs",
            isActive: location.pathname === "/activity/download-logs",
          },
          {
            title: "File Changes",
            url: "/activity/file-changes",
            isActive: location.pathname === "/activity/file-changes",
          },
          {
            title: "Audit Trail",
            url: "/activity/audit-trail",
            isActive: location.pathname === "/activity/audit-trail",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        isActive: location.pathname.startsWith("/settings"), // Dynamic based on current path
        items: [
          {
            title: "General Settings",
            url: "/settings/general",
            isActive: location.pathname === "/settings/general",
          },
          {
            title: "User & Permissions",
            url: "/settings/users",
            isActive: location.pathname === "/settings/users",
          },
          {
            title: "Storage & Quota",
            url: "/settings/storage",
            isActive: location.pathname === "/settings/storage",
          },
          {
            title: "Security",
            url: "/settings/security",
            isActive: location.pathname === "/settings/security",
          },
        ],
      },    
    ],
    repository: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects repository={data.repository} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}