import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardLayout({
  children,
  hideSidebar = false
}: {
  children: React.ReactNode;
  hideSidebar?: boolean;
}) {
  // If hideSidebar is true, render minimal layout without sidebar
  if (hideSidebar) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    );
  }

  // Default layout with sidebar
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border/50 px-4 backdrop-blur-sm bg-background/80 sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <Link to="/reports" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </Link>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}