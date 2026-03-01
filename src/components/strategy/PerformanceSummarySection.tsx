import { MousePointer, Users, Eye, Clock, Target, BarChart3, Search, Globe, AlertTriangle } from "lucide-react";
import type { PerformanceSummaryData } from "@/lib/api";

interface Props {
  data: PerformanceSummaryData;
}

export function PerformanceSummarySection({ data }: Props) {
  const ga4 = data.ga4 || {} as any;
  const sc = data.searchConsole || {} as any;
  const ads = data.googleAds || {} as any;

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
        <BarChart3 className="h-3.5 w-3.5 text-primary" />
        Performance Summary
      </h3>

      {/* GA4 Website Metrics */}
      <div className="glass-card p-4 space-y-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Website Analytics (GA4)</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Sessions", value: (ga4.totalSessions ?? 0).toLocaleString(), icon: MousePointer },
            { label: "Users", value: (ga4.totalUsers ?? 0).toLocaleString(), icon: Users },
            { label: "Page Views", value: (ga4.totalPageViews ?? 0).toLocaleString(), icon: Eye },
            { label: "Avg Duration", value: `${((ga4.avgSessionDuration ?? 0) / 60).toFixed(1)} min`, icon: Clock },
            { label: "Bounce Rate", value: `${((ga4.avgBounceRate ?? 0) * 100).toFixed(1)}%`, icon: BarChart3 },
            { label: "Conversions", value: (ga4.totalConversions ?? 0).toLocaleString(), icon: Target },
          ].map((m) => (
            <div key={m.label} className="p-2.5 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-1.5 mb-1">
                <m.icon className="h-3 w-3 text-primary" />
                <span className="text-[10px] text-muted-foreground">{m.label}</span>
              </div>
              <p className="text-base font-display font-bold text-foreground">{m.value}</p>
            </div>
          ))}
        </div>
        {(ga4.newUserRate ?? 0) > 0 && (
          <p className="text-[10px] text-muted-foreground">
            New user rate: <span className="text-foreground font-medium">{(ga4.newUserRate ?? 0).toFixed(0)}%</span> • Revenue: <span className="text-foreground font-medium">${ga4.totalRevenue ?? 0}</span>
          </p>
        )}
      </div>

      {/* Search Console */}
      {(sc.totalClicks ?? 0) > 0 || (sc.totalImpressions ?? 0) > 0 ? (
        <div className="glass-card p-4 space-y-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Search className="h-3 w-3 text-primary" /> Search Console
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 rounded-lg bg-secondary/30">
              <span className="text-[10px] text-muted-foreground">Clicks</span>
              <p className="text-base font-display font-bold text-foreground">{(sc.totalClicks ?? 0).toLocaleString()}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/30">
              <span className="text-[10px] text-muted-foreground">Impressions</span>
              <p className="text-base font-display font-bold text-foreground">{(sc.totalImpressions ?? 0).toLocaleString()}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/30">
              <span className="text-[10px] text-muted-foreground">CTR</span>
              <p className="text-base font-display font-bold text-foreground">{(sc.avgCtr ?? 0).toFixed(1)}%</p>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/30">
              <span className="text-[10px] text-muted-foreground">Avg Position</span>
              <p className="text-base font-display font-bold text-foreground">{(sc.avgPosition ?? 0).toFixed(1)}</p>
            </div>
          </div>

          {Array.isArray(sc.topQueries) && sc.topQueries.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground mb-1.5">Top Queries</p>
              <div className="flex flex-wrap gap-1.5">
                {sc.topQueries.map((q: string) => (
                  <span key={q} className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{q}</span>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(sc.topPages) && sc.topPages.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground mb-1">Top Pages</p>
              {sc.topPages.map((p: string) => (
                <a key={p} href={p} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline block truncate">{p}</a>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Google Ads */}
      {(ads.recordCount ?? 0) > 0 ? (
        <div className="glass-card p-4 space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="h-3 w-3 text-primary" /> Google Ads
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-secondary/30">
              <span className="text-[10px] text-muted-foreground">Impressions</span>
              <p className="text-base font-display font-bold text-foreground">{(ads.totalImpressions ?? 0).toLocaleString()}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/30">
              <span className="text-[10px] text-muted-foreground">Clicks</span>
              <p className="text-base font-display font-bold text-foreground">{(ads.totalClicks ?? 0).toLocaleString()}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/30">
              <span className="text-[10px] text-muted-foreground">Cost</span>
              <p className="text-base font-display font-bold text-foreground">€{(ads.totalCost ?? 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
          <span className="text-xs text-muted-foreground">No Google Ads data — €0 spend recorded for this period</span>
        </div>
      )}
    </div>
  );
}