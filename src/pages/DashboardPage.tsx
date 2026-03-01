import { motion } from "framer-motion";
import { Loader2, RefreshCw, Pencil, Check, RotateCcw, Plus, Globe } from "lucide-react";
import { useUserConfig } from "@/hooks/use-user-config";
import { useQuery } from "@tanstack/react-query";
import { fetchGoogleAdsAnalytics } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useDashboardLayout } from "@/hooks/use-dashboard-layout";
import { WidgetPanel } from "@/components/dashboard/WidgetPanel";
import { SortableWidget } from "@/components/dashboard/SortableWidget";
import { WidgetRenderer } from "@/components/dashboard/WidgetRenderer";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { data: config } = useUserConfig();
  const [panelOpen, setPanelOpen] = useState(false);

  const {
    data: analytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["dashboardAnalytics"],
    queryFn: () => fetchGoogleAdsAnalytics("LAST_30_DAYS"),
    retry: 1,
    staleTime: 1000 * 60,
  });

  const {
    widgets,
    editing,
    setEditing,
    addWidget,
    removeWidget,
    moveWidget,
    resetLayout,
  } = useDashboardLayout();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = widgets.findIndex((w) => w.instanceId === active.id);
    const toIndex = widgets.findIndex((w) => w.instanceId === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      moveWidget(fromIndex, toIndex);
    }
  };

  // Compute bounce rate change safely
  const dailyData = analytics?.daily || [];
  const mid = Math.floor(dailyData.length / 2);
  const avgBounce = (arr: any[]) => {
    const total = arr.reduce((s, d) => s + (d.sessions || d.clicks || 0), 0);
    if (total === 0) return 0;
    return arr.reduce((s, d) => s + (d.bounceRate || 0) * (d.sessions || d.clicks || 0), 0) / total;
  };
  const prevBounce = avgBounce(dailyData.slice(0, mid));
  const currBounce = avgBounce(dailyData.slice(mid));
  const bounceChange = prevBounce > 0 ? parseFloat((((currBounce - prevBounce) / prevBounce) * 100).toFixed(1)) : 0;

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4 max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {editing ? "Drag widgets to rearrange • Tap ✕ to remove • Add from panel" : "Real-time website analytics from Google Analytics & Search Console"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {editing && (
              <>
                <Button variant="outline" size="sm" onClick={() => setPanelOpen(true)} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Add Widget
                </Button>
                <Button variant="ghost" size="sm" onClick={resetLayout} className="gap-1.5 text-muted-foreground">
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
              </>
            )}
            <Button
              variant={editing ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setEditing(!editing);
                if (editing) setPanelOpen(false);
              }}
              className="gap-1.5"
            >
              {editing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
              {editing ? "Done" : "Customize"}
            </Button>
            {!editing && (
              <Button variant="ghost" size="sm" onClick={() => refetchAnalytics()} className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </Button>
            )}
          </div>
        </motion.div>

        {/* Loading state */}
        {analyticsLoading && (
          <motion.div variants={item} className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="ml-3 text-sm text-muted-foreground">Loading analytics from MongoDB...</span>
          </motion.div>
        )}

        {/* Error state */}
        {analyticsError && !analyticsLoading && (
          <motion.div variants={item} className="glass-card p-8 text-center">
            <Globe className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-base font-display font-semibold text-foreground mb-1">Unable to load analytics</h3>
            <p className="text-sm text-muted-foreground mb-4">Make sure the backend server is running on localhost:3000</p>
            <Button onClick={() => refetchAnalytics()} variant="outline" size="sm" className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
          </motion.div>
        )}

        {/* Widget Grid */}
        {analytics && !analyticsError && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={widgets.map((w) => w.instanceId)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {widgets.map((widget) => (
                  <SortableWidget
                    key={widget.instanceId}
                    widget={widget}
                    editing={editing}
                    onRemove={removeWidget}
                  >
                    <WidgetRenderer
                      widgetId={widget.widgetId}
                      analytics={analytics}
                      config={config}
                      bounceChange={bounceChange}
                    />
                  </SortableWidget>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Empty state */}
        {analytics && !analyticsError && widgets.length === 0 && (
          <motion.div variants={item} className="glass-card p-12 text-center">
            <Globe className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">No widgets on your dashboard</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
              Click "Customize" then "Add Widget" to build your personalized dashboard.
            </p>
            <Button onClick={() => { setEditing(true); setPanelOpen(true); }} className="gap-2">
              <Plus className="h-4 w-4" /> Add Widgets
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Widget Panel */}
      <WidgetPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        placedWidgets={widgets}
        onAddWidget={addWidget}
      />
    </>
  );
}