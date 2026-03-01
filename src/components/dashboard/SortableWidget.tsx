import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Maximize2, Minimize2 } from "lucide-react";
import { type PlacedWidget, getWidgetDef, sizeToColSpan, type WidgetSize } from "@/lib/dashboard-widgets";
import { cn } from "@/lib/utils";

interface SortableWidgetProps {
  widget: PlacedWidget;
  editing: boolean;
  onRemove: (instanceId: string) => void;
  children: React.ReactNode;
}

export function SortableWidget({ widget, editing, onRemove, children }: SortableWidgetProps) {
  const def = getWidgetDef(widget.widgetId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: widget.instanceId,
    disabled: !editing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        sizeToColSpan(widget.size),
        isDragging && "opacity-50",
        editing && "relative"
      )}
    >
      {/* Edit overlay */}
      {editing && (
        <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1">
          <button
            onClick={() => onRemove(widget.instanceId)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div
        className={cn(
          "h-full",
          editing && "ring-2 ring-primary/20 ring-dashed rounded-xl cursor-grab active:cursor-grabbing"
        )}
        {...(editing ? { ...attributes, ...listeners } : {})}
      >
        {/* Drag handle indicator */}
        {editing && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
            <GripVertical className="h-3 w-3 text-primary" />
            <span className="text-[9px] text-primary font-medium">{def?.title}</span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}