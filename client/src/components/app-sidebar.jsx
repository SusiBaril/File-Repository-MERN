"use client"

import * as React from "react"
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

// This is sample data.
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
      icon: LayoutDashboard, // better than SquareTerminal
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard/overview",
        },
        {
          title: "Starred Files",
          url: "/dashboard/starred",
        },
      ],
    },
    {
      title: "File Repository",
      url: "#",
      icon: FolderOpen, // clearly represents files & folders
      items: [
        {
          title: "All Files",
          url: "#",
        },
        {
          title: "Folders",
          url: "#",
        },
        {
          title: "Shared With Me",
          url: "#",
        },
        {
          title: "Trash",
          url: "#",
        },
      ],
    },
    {
      title: "Activity",
      url: "#",
      icon: Activity, // logs, tracking, history
      items: [
        {
          title: "Upload History",
          url: "#",
        },
        {
          title: "Download Logs",
          url: "#",
        },
        {
          title: "File Changes",
          url: "#",
        },
        {
          title: "Audit Trail",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2, // simpler & more recognizable
      items: [
        {
          title: "General Settings",
          url: "#",
        },
        {
          title: "User & Permissions",
          url: "#",
        },
        {
          title: "Storage & Quota",
          url: "#",
        },
        {
          title: "Security",
          url: "#",
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

export function AppSidebar({
  ...props
}) {
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
