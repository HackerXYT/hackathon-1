import { useState, useCallback } from "react";
import {
  loadLayout,
  saveLayout,
  DEFAULT_LAYOUT,
  type PlacedWidget,
} from "@/lib/dashboard-widgets";

export function useDashboardLayout() {
  const [widgets, setWidgets] = useState<PlacedWidget[]>(() => loadLayout());
  const [editing, setEditing] = useState(false);

  const updateWidgets = useCallback((next: PlacedWidget[]) => {
    const ordered = next.map((w, i) => ({ ...w, order: i }));
    setWidgets(ordered);
    saveLayout(ordered);
  }, []);

  const addWidget = useCallback(
    (widgetId: string, size: PlacedWidget["size"]) => {
      const instanceId = `w_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const next = [...widgets, { instanceId, widgetId, size, order: widgets.length }];
      updateWidgets(next);
    },
    [widgets, updateWidgets]
  );

  const removeWidget = useCallback(
    (instanceId: string) => {
      updateWidgets(widgets.filter((w) => w.instanceId !== instanceId));
    },
    [widgets, updateWidgets]
  );

  const moveWidget = useCallback(
    (fromIndex: number, toIndex: number) => {
      const next = [...widgets];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      updateWidgets(next);
    },
    [widgets, updateWidgets]
  );

  const resetLayout = useCallback(() => {
    updateWidgets([...DEFAULT_LAYOUT]);
  }, [updateWidgets]);

  return {
    widgets,
    editing,
    setEditing,
    addWidget,
    removeWidget,
    moveWidget,
    updateWidgets,
    resetLayout,
  };
}