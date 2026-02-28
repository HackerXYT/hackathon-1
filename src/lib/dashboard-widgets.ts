export type WidgetSize = "small" | "medium" | "large" | "full";

export interface WidgetDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "metrics" | "charts" | "tables" | "agents";
  defaultSize: WidgetSize;
  allowedSizes: WidgetSize[];
}

export interface PlacedWidget {
  instanceId: string;
  widgetId: string;
  size: WidgetSize;
  order: number;
}

export const WIDGET_REGISTRY: WidgetDefinition[] = [
  // Metric cards
  { id: "sessions", title: "Sessions", description: "Total website sessions", icon: "🖱️", category: "metrics", defaultSize: "small", allowedSizes: ["small"] },
  { id: "users", title: "Users", description: "Total unique users", icon: "👥", category: "metrics", defaultSize: "small", allowedSizes: ["small"] },
  { id: "pageViews", title: "Page Views", description: "Total page views", icon: "👁️", category: "metrics", defaultSize: "small", allowedSizes: ["small"] },
  { id: "bounceRate", title: "Bounce Rate", description: "Average bounce rate", icon: "📊", category: "metrics", defaultSize: "small", allowedSizes: ["small"] },
  { id: "newUsers", title: "New Users", description: "First-time visitors", icon: "🆕", category: "metrics", defaultSize: "small", allowedSizes: ["small"] },
  { id: "conversions", title: "Conversions", description: "Total conversions", icon: "🎯", category: "metrics", defaultSize: "small", allowedSizes: ["small"] },
  { id: "channels", title: "Channels Count", description: "Number of traffic channels", icon: "🌐", category: "metrics", defaultSize: "small", allowedSizes: ["small"] },
  { id: "dataSource", title: "Data Source", description: "Current data source", icon: "💾", category: "metrics", defaultSize: "small", allowedSizes: ["small"] },

  // Charts
  { id: "sessionsChart", title: "Sessions & Users Chart", description: "Daily sessions and users trend", icon: "📈", category: "charts", defaultSize: "medium", allowedSizes: ["medium", "large", "full"] },
  { id: "pageViewsChart", title: "Page Views & Bounce", description: "Daily page views with bounce rate overlay", icon: "📉", category: "charts", defaultSize: "medium", allowedSizes: ["medium", "large", "full"] },
  { id: "channelBarChart", title: "Channel Sessions Bar", description: "Horizontal bar chart of channel sessions", icon: "📊", category: "charts", defaultSize: "medium", allowedSizes: ["medium", "large"] },

  // Tables
  { id: "channelTable", title: "Traffic Channels Table", description: "Detailed breakdown of all traffic channels", icon: "📋", category: "tables", defaultSize: "large", allowedSizes: ["large", "full"] },
  { id: "searchConsole", title: "Search Console Queries", description: "Top search queries from Google Search Console", icon: "🔍", category: "tables", defaultSize: "large", allowedSizes: ["large", "full"] },

  // Agents
  { id: "agentStatus", title: "Agent Status", description: "Live status of all 4 AI agents", icon: "🤖", category: "agents", defaultSize: "full", allowedSizes: ["medium", "large", "full"] },
  { id: "configSummary", title: "Config Summary", description: "Goal, budget, and data source overview", icon: "⚙️", category: "agents", defaultSize: "full", allowedSizes: ["full"] },
];

export const DEFAULT_LAYOUT: PlacedWidget[] = [
  { instanceId: "w1", widgetId: "configSummary", size: "full", order: 0 },
  { instanceId: "w2", widgetId: "agentStatus", size: "full", order: 1 },
  { instanceId: "w3", widgetId: "sessions", size: "small", order: 2 },
  { instanceId: "w4", widgetId: "users", size: "small", order: 3 },
  { instanceId: "w5", widgetId: "pageViews", size: "small", order: 4 },
  { instanceId: "w6", widgetId: "bounceRate", size: "small", order: 5 },
  { instanceId: "w7", widgetId: "newUsers", size: "small", order: 6 },
  { instanceId: "w8", widgetId: "conversions", size: "small", order: 7 },
  { instanceId: "w9", widgetId: "channels", size: "small", order: 8 },
  { instanceId: "w10", widgetId: "dataSource", size: "small", order: 9 },
  { instanceId: "w11", widgetId: "sessionsChart", size: "medium", order: 10 },
  { instanceId: "w12", widgetId: "pageViewsChart", size: "medium", order: 11 },
  { instanceId: "w13", widgetId: "channelBarChart", size: "medium", order: 12 },
  { instanceId: "w14", widgetId: "channelTable", size: "large", order: 13 },
  { instanceId: "w15", widgetId: "searchConsole", size: "large", order: 14 },
];

const STORAGE_KEY = "dashboard_layout";

export function loadLayout(): PlacedWidget[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_LAYOUT;
    }
  }
  return DEFAULT_LAYOUT;
}

export function saveLayout(layout: PlacedWidget[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
}

export function getWidgetDef(widgetId: string): WidgetDefinition | undefined {
  return WIDGET_REGISTRY.find((w) => w.id === widgetId);
}

export function sizeToColSpan(size: WidgetSize): string {
  switch (size) {
    case "small": return "col-span-1";
    case "medium": return "col-span-1 lg:col-span-2";
    case "large": return "col-span-1 lg:col-span-3";
    case "full": return "col-span-1 lg:col-span-4";
  }
}