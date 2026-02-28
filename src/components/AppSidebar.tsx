import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  RefreshCw,
  FileText,
  Settings,
  Zap,
  Megaphone,
  Building2,
  Shield,
  PenTool,
  Swords,
} from "lucide-react";
import { useUserConfig } from "@/hooks/use-user-config";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Company", url: "/company", icon: Building2 },
  { title: "Traffic Analytics", url: "/ads", icon: Megaphone },
  { title: "Strategy & Insights", url: "/strategy", icon: Shield },
  { title: "Content Library", url: "/content", icon: PenTool },
  { title: "Competitors", url: "/competitors", icon: Swords },
  { title: "Agent Loop", url: "/loop", icon: RefreshCw },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { data: config } = useUserConfig();

  const connectedCount = config?.accounts?.connectedPlatforms?.length || 0;
  const agentCount = connectedCount > 0 ? 4 : 0;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold text-foreground">No-Human</span>
              <span className="text-[11px] text-muted-foreground">Marketing Agency</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((navItem) => (
                <SidebarMenuItem key={navItem.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={navItem.url}
                      end={navItem.url === "/"}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <navItem.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="text-sm">{navItem.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="glass-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-2 w-2 rounded-full ${connectedCount > 0 ? "bg-success animate-pulse-glow" : "bg-muted-foreground/30"}`} />
              <span className="text-xs text-muted-foreground">
                {connectedCount > 0 ? "Systems online" : "No platforms connected"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground/60">
              {agentCount} agents {agentCount > 0 ? "active" : "idle"} • {connectedCount} platform{connectedCount !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}