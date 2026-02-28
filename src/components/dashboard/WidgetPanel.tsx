import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { WIDGET_REGISTRY, type PlacedWidget } from "@/lib/dashboard-widgets";
import { useState } from "react";

interface WidgetPanelProps {
  open: boolean;
  onClose: () => void;
  placedWidgets: PlacedWidget[];
  onAddWidget: (widgetId: string, size: PlacedWidget["size"]) => void;
}

const categories = [
  { key: "metrics", label: "Metrics", emoji: "📊" },
  { key: "charts", label: "Charts", emoji: "📈" },
  { key: "tables", label: "Tables", emoji: "📋" },
  { key: "agents", label: "Agents & Config", emoji: "🤖" },
] as const;

export function WidgetPanel({ open, onClose, placedWidgets, onAddWidget }: WidgetPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string>("metrics");

  const filteredWidgets = WIDGET_REGISTRY.filter((w) => w.category === activeCategory);

  const getPlacedCount = (widgetId: string) =>
    placedWidgets.filter((pw) => pw.widgetId === widgetId).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-background border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div>
                <h2 className="text-sm font-display font-bold text-foreground">Add Widgets</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">Tap a widget to add it to your dashboard</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 p-3 border-b border-border/30 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.key
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Widget List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredWidgets.map((widget) => {
                const count = getPlacedCount(widget.id);
                return (
                  <button
                    key={widget.id}
                    onClick={() => onAddWidget(widget.id, widget.defaultSize)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-secondary/20 hover:border-primary/30 hover:bg-secondary/40 transition-all text-left group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg shrink-0">
                      {widget.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{widget.title}</p>
                        {count > 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            ×{count}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{widget.description}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        Size: {widget.defaultSize} • {widget.allowedSizes.join(", ")}
                      </p>
                    </div>
                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}