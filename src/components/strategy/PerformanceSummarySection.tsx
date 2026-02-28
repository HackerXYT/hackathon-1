import { MousePointer, Users, Eye, Clock, Target, BarChart3, Search, Globe, AlertTriangle } from "lucide-react";
import type { PerformanceSummaryData } from "@/lib/api";

interface Props {
  data: PerformanceSummaryData;
}

export function PerformanceSummarySection({ data }: Props) {
  const ga4 = data.ga4 || {} as any;
  const sc = data.searchConsole || {} as any;
  const ads = data.googleAds || {} as any;

  const metrics = [
    { label: "Sessions", value: (ga4.totalSessions ?? 0).toLocaleString(), icon: MousePointer, sub: "GA4" },
    { label: "Users", value: (ga4.totalUsers ?? 0).toLocaleString(), icon: Users, sub: `${(ga4.newUserRate ?? 0).toFixed(0)}% new` },
    { label: "Page Views", value: (ga4.totalPageViews ?? 0).toLocaleString(), icon: Eye, sub: "GA4" },
    { label: "Avg Duration", value: `${Math.round(ga4.avgSessionDuration ?? 0)}s`, icon: Clock, sub: `${((ga4.avgSessionDuration ?? 0) / 60).toFixed(1)} min` },
    { label: "Bounce Rate", value: `${((ga4.avgBounceRate ?? 0) * 100).toFixed(1)}%`, icon: BarChart3, sub: "GA4" },
    { label: "Conversions", value: (ga4.totalConversions ?? 0).toLocaleString(), icon: Target, sub: `$${ga4.totalRevenue ?? 0}` },
    { label: "Search Clicks", value: (sc.totalClicks ?? 0).toLocaleString(), icon: Search, sub: `${sc.totalImpressions ?? 0} imp` },
    { label: "Avg Position", value: (sc.avgPosition ?? 0).toFixed(1), icon: Globe, sub: `${(sc.avgCtr ?? 0).toFixed(1)}% CTR` },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
        <BarChart3 className="h-3.5 w-3.5 text-primary" />
        Performance Summary
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="glass-card p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <m.icon className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] text-muted-foreground">{m.label}</span>
            </div>
            <p className="text-lg font-display font-bold text-foreground">{m.value}</p>
            <p className="text-[10px] text-muted-foreground">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Google Ads summary */}
      {(ads.recordCount ?? 0) > 0 ? (
        <div className="glass-card p-4">
          <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-2">Google Ads</h4>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Impressions:</span>{" "}
              <span className="font-medium text-foreground">{(ads.totalImpressions ?? 0).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Clicks:</span>{" "}
              <span className="font-medium text-foreground">{(ads.totalClicks ?? 0).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cost:</span>{" "}
              <span className="font-medium text-foreground">€{(ads.totalCost ?? 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="text-xs text-muted-foreground">No Google Ads data — €0 spend recorded for this period</span>
        </div>
      )}

      {/* Top queries */}
      {Array.isArray(sc.topQueries) && sc.topQueries.length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-2">Top Search Queries</h4>
          <div className="flex flex-wrap gap-1.5">
            {sc.topQueries.map((q: string) => (
              <span key={q} className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{q}</span>
            ))}
          </div>
        </div>
      )}

      {/* Top pages */}
      {Array.isArray(sc.topPages) && sc.topPages.length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-2">Top Pages</h4>
          {sc.topPages.map((p: string) => (
            <a key={p} href={p} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline block truncate">{p}</a>
          ))}
        </div>
      )}
    </div>
  );
}