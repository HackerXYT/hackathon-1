import {
  TrendingUp, TrendingDown, MousePointer, Users, Eye, BarChart3,
  Target, Globe, FileText, Search, CheckCircle, Loader2, Pause,
  Paintbrush, DollarSign, MessageSquare,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Line,
} from "recharts";
import { mockAgentStatuses } from "@/lib/mock-data";
import type { GoogleAdsAnalytics, UserConfig } from "@/lib/api";

interface WidgetProps {
  widgetId: string;
  analytics: GoogleAdsAnalytics | undefined;
  config: UserConfig | null | undefined;
  bounceChange: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="font-medium text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="flex justify-between gap-4">
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-medium">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const goalLabels: Record<string, string> = {
  sales: "Sales", leads: "Leads", traffic: "Website Traffic",
  awareness: "Brand Awareness", engagement: "Engagement", custom: "Custom Goal",
};

const agentStatusConfig = {
  active: { color: "text-success", icon: CheckCircle, label: "Active" },
  generating: { color: "text-warning", icon: Loader2, label: "Working" },
  idle: { color: "text-muted-foreground", icon: Pause, label: "Idle" },
};

const agentList = [
  { key: "analyst" as const, title: "Analyst", icon: Eye },
  { key: "creative" as const, title: "Creative", icon: Paintbrush },
  { key: "mediaBuyer" as const, title: "Media Buyer", icon: DollarSign },
  { key: "accountManager" as const, title: "Account Mgr", icon: MessageSquare },
];

function MetricWidget({
  label, value, change, icon: Icon, suffix = "", invertTrend = false,
}: {
  label: string; value: string; change: number; icon: React.ElementType; suffix?: string; invertTrend?: boolean;
}) {
  const isPositive = invertTrend ? change < 0 : change > 0;
  return (
    <div className="glass-card-hover p-5 h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {change !== 0 && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
            {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-foreground">{value}{suffix}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function SmallMetricWidget({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="glass-card p-4 h-full">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <p className="text-lg font-display font-bold text-foreground">{value}</p>
    </div>
  );
}

export function WidgetRenderer({ widgetId, analytics, config, bounceChange }: WidgetProps) {
  const totals = analytics?.totals as any;
  const changes = analytics?.changes as any;

  const dailyChartData = (analytics?.daily || []).map((d: any) => ({
    date: d.date?.slice(5),
    sessions: d.sessions || d.clicks || 0,
    users: d.users || d.impressions || 0,
    pageViews: d.pageViews || 0,
    bounceRate: d.bounceRate || 0,
  }));

  const channelChartData = (analytics?.campaigns || []).slice(0, 8).map((c: any) => ({
    name: c.name.length > 25 ? c.name.slice(0, 23) + "…" : c.name,
    sessions: c.sessions || c.clicks || 0,
  }));

  const searchConsole = (analytics as any)?.searchConsole || null;

  switch (widgetId) {
    case "sessions":
      return <MetricWidget label="Sessions" value={(totals?.sessions || totals?.clicks || 0).toLocaleString()} change={changes?.sessions || changes?.clicks || 0} icon={MousePointer} />;
    case "users":
      return <MetricWidget label="Users" value={(totals?.users || totals?.impressions || 0).toLocaleString()} change={changes?.users || changes?.impressions || 0} icon={Users} />;
    case "pageViews":
      return <MetricWidget label="Page Views" value={(totals?.pageViews || 0).toLocaleString()} change={changes?.pageViews || 0} icon={Eye} />;
    case "bounceRate":
      return <MetricWidget label="Bounce Rate" value={(totals?.bounceRate || 0).toFixed(1)} change={bounceChange} icon={BarChart3} suffix="%" invertTrend />;
    case "newUsers":
      return <SmallMetricWidget label="New Users" value={(totals?.newUsers || 0).toLocaleString()} icon={Users} />;
    case "conversions":
      return <SmallMetricWidget label="Conversions" value={(totals?.conversions || 0).toLocaleString()} icon={Target} />;
    case "channels":
      return <SmallMetricWidget label="Channels" value={String((analytics?.campaigns || []).length)} icon={Globe} />;
    case "dataSource":
      return <SmallMetricWidget label="Data Source" value={analytics?.source === "mongodb" ? "MongoDB" : (analytics?.source || "—")} icon={FileText} />;

    case "sessionsChart":
      return (
        <div className="glass-card p-5 h-full">
          <h3 className="text-sm font-display font-semibold text-foreground mb-4">Daily Sessions & Users</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dailyChartData}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(187,96%,42%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(187,96%,42%)" stopOpacity={0} /></linearGradient>
                <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(250,80%,62%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(250,80%,62%)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,25%,16%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215,20%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215,20%,55%)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sessions" name="Sessions" stroke="hsl(187,96%,42%)" fill="url(#sg)" strokeWidth={2} />
              <Area type="monotone" dataKey="users" name="Users" stroke="hsl(250,80%,62%)" fill="url(#ug)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );

    case "pageViewsChart":
      return (
        <div className="glass-card p-5 h-full">
          <h3 className="text-sm font-display font-semibold text-foreground mb-4">Page Views & Bounce Rate</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dailyChartData}>
              <defs>
                <linearGradient id="pvg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(152,69%,40%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(152,69%,40%)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,25%,16%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215,20%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(215,20%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(215,20%,55%)" }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="left" type="monotone" dataKey="pageViews" name="Page Views" stroke="hsl(152,69%,40%)" fill="url(#pvg)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="bounceRate" name="Bounce Rate (%)" stroke="hsl(0,72%,51%)" strokeWidth={2} dot={false} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );

    case "channelBarChart":
      return (
        <div className="glass-card p-5 h-full">
          <h3 className="text-sm font-display font-semibold text-foreground mb-4">Channel Sessions</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={channelChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,25%,16%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215,20%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "hsl(215,20%,55%)" }} axisLine={false} tickLine={false} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sessions" name="Sessions" fill="hsl(187,96%,42%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );

    case "channelTable":
      return (
        <div className="glass-card p-5 h-full overflow-x-auto">
          <h3 className="text-sm font-display font-semibold text-foreground mb-4">Traffic Channels</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wider">
                <th className="pb-3 pr-4">Source / Medium</th><th className="pb-3 pr-4">Type</th><th className="pb-3 pr-4 text-right">Sessions</th><th className="pb-3 pr-4 text-right">Users</th><th className="pb-3 text-right">Bounce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {(analytics?.campaigns || []).map((c: any) => (
                <tr key={c.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-2.5 pr-4 text-xs font-medium text-foreground">{c.name}</td>
                  <td className="py-2.5 pr-4"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.channelType === "PAID_SEARCH" ? "bg-warning/10 text-warning" : c.channelType === "ORGANIC_SEARCH" ? "bg-success/10 text-success" : c.channelType === "SOCIAL" ? "bg-accent/10 text-accent" : c.channelType === "REFERRAL" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{c.channelType}</span></td>
                  <td className="py-2.5 pr-4 text-right text-xs">{(c.sessions || 0).toLocaleString()}</td>
                  <td className="py-2.5 pr-4 text-right text-xs text-muted-foreground">{(c.users || 0).toLocaleString()}</td>
                  <td className="py-2.5 text-right"><span className={`text-xs font-mono font-medium ${(c.bounceRate || 0) > 70 ? "text-destructive" : (c.bounceRate || 0) < 40 ? "text-success" : "text-warning"}`}>{(c.bounceRate || 0).toFixed(1)}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {(analytics?.campaigns || []).length === 0 && <p className="text-xs text-muted-foreground text-center py-6">No channel data available</p>}
        </div>
      );

    case "searchConsole":
      if (!searchConsole || !searchConsole.queries?.length) {
        return (
          <div className="glass-card p-5 h-full flex items-center justify-center">
            <p className="text-xs text-muted-foreground">No Search Console data available</p>
          </div>
        );
      }
      return (
        <div className="glass-card p-5 h-full overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-display font-semibold text-foreground">Search Console — Top Queries</h3>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{searchConsole.totals.clicks} clicks</span>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wider"><th className="pb-3 pr-4">Query</th><th className="pb-3 pr-4 text-right">Clicks</th><th className="pb-3 pr-4 text-right">Impressions</th><th className="pb-3 text-right">Position</th></tr></thead>
            <tbody className="divide-y divide-border/30">
              {searchConsole.queries.map((q: any, i: number) => (
                <tr key={i} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-2.5 pr-4 text-xs font-medium text-foreground">{q.query}</td>
                  <td className="py-2.5 pr-4 text-right text-xs font-medium text-primary">{q.clicks}</td>
                  <td className="py-2.5 pr-4 text-right text-xs text-muted-foreground">{q.impressions}</td>
                  <td className="py-2.5 text-right text-xs text-muted-foreground">{q.position.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "agentStatus":
      return (
        <div className="glass-card p-4 h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">Agent Status</h3>
            <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" /><span className="text-[11px] text-muted-foreground">All systems online</span></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {agentList.map((agent) => {
              const status = mockAgentStatuses[agent.key];
              const s = agentStatusConfig[status.status];
              return (
                <div key={agent.key} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0"><agent.icon className="h-4 w-4 text-primary" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{agent.title}</p>
                    <div className="flex items-center gap-1 mt-0.5"><s.icon className={`h-3 w-3 ${s.color} ${status.status === "generating" ? "animate-spin" : ""}`} /><span className={`text-[10px] font-medium ${s.color}`}>{s.label}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "configSummary": {
      const goal = config?.goal || null;
      const budget = config?.budget || null;
      return (
        <div className="glass-card p-4 h-full">
          <div className="flex flex-wrap items-center gap-4">
            {goal && (<div className="flex items-center gap-2"><Target className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">Goal:</span><span className="text-xs font-medium text-foreground capitalize">{goalLabels[goal] || goal}</span></div>)}
            {budget && (<><div className="h-4 w-px bg-border" /><div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">Budget:</span><span className="text-xs font-medium text-foreground">${budget.dailyBudget}/day • ${budget.monthlyBudget.toLocaleString()}/mo</span></div></>)}
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">Data:</span><span className="text-xs font-medium text-foreground">{analytics?.source === "mongodb" ? "MongoDB (GA4)" : "Loading..."}</span></div>
          </div>
        </div>
      );
    }

    default:
      return (
        <div className="glass-card p-5 h-full flex items-center justify-center">
          <p className="text-xs text-muted-foreground">Unknown widget: {widgetId}</p>
        </div>
      );
  }
}