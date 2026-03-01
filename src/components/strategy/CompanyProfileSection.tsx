import { Building2, Globe, Code, Hash, Link2, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import type { CompanyProfileData } from "@/lib/api";

interface Props {
  data: CompanyProfileData;
}

function SeoScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-destructive";
  const bg = score >= 80 ? "border-success" : score >= 60 ? "border-warning" : "border-destructive";
  return (
    <div className={`flex items-center justify-center h-16 w-16 rounded-full border-[3px] ${bg} font-display font-bold text-xl ${color}`}>
      {score}
    </div>
  );
}

export function CompanyProfileSection({ data }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
        <Building2 className="h-3.5 w-3.5 text-primary" />
        Company Profile
      </h3>

      {/* Identity & SEO Score */}
      <div className="glass-card p-5">
        <div className="flex items-start gap-5">
          {data.seoScore != null && (
            <div className="flex flex-col items-center gap-1 shrink-0">
              <SeoScoreRing score={data.seoScore} />
              <span className="text-[10px] text-muted-foreground">SEO Score</span>
            </div>
          )}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              {data.companyName && (
                <h4 className="text-sm font-display font-semibold text-foreground">{data.companyName}</h4>
              )}
              {data.domain && (
                <a href={`https://${data.domain}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                  {data.domain} <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>

            {/* Site Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2 rounded-lg bg-secondary/30">
                <p className="text-[10px] text-muted-foreground">Words</p>
                <p className="text-sm font-bold text-foreground">{data.wordCount ?? 0}</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/30">
                <p className="text-[10px] text-muted-foreground">Readability</p>
                <p className="text-sm font-bold text-foreground capitalize">{data.readabilityScore ?? "—"}</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/30">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Link2 className="h-3 w-3" /> Internal</p>
                <p className="text-sm font-bold text-foreground">{data.internalLinks ?? 0}</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/30">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><ExternalLink className="h-3 w-3" /> External</p>
                <p className="text-sm font-bold text-foreground">{data.externalLinks ?? 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {data.hasStructuredData ? (
                <span className="flex items-center gap-1 text-[11px] text-success font-medium"><CheckCircle className="h-3 w-3" /> Structured Data</span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-warning font-medium"><XCircle className="h-3 w-3" /> No Structured Data</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tech & Keywords grouped together */}
      {((Array.isArray(data.techStack) && data.techStack.length > 0) || (Array.isArray(data.topKeywords) && data.topKeywords.length > 0)) && (
        <div className="glass-card p-4 space-y-4">
          {Array.isArray(data.techStack) && data.techStack.length > 0 && (
            <div>
              <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-accent" /> Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[...new Set(data.techStack)].map((t) => (
                  <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium">{t}</span>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(data.topKeywords) && data.topKeywords.length > 0 && (
            <div>
              <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-primary" /> Top Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {data.topKeywords.map((kw) => (
                  <span key={kw} className="text-[11px] px-2 py-0.5 rounded bg-secondary text-foreground font-mono">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Social Channels */}
      {Array.isArray(data.socialChannels) && data.socialChannels.length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-primary" /> Social Channels
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {data.socialChannels.map((ch) => (
              <span key={ch} className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium capitalize">{ch}</span>
            ))}
          </div>
        </div>
      )}

      {data.scrapedAt && (
        <p className="text-[10px] text-muted-foreground/60">Scraped {new Date(data.scrapedAt).toLocaleString()}</p>
      )}
    </div>
  );
}