const API_BASE = "http://localhost:3000";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getEmail(): string {
  return localStorage.getItem("email") || "";
}

export interface UploadedFileInfo { originalName: string; savedAs: string; size: number; mimetype: string; url: string; }

export interface UserConfig {
  email: string; goal: string;
  accounts: { platforms: { id: string; name: string; category: "ad" | "conversion" | "crm"; status: "connected" | "disconnected"; }[]; connectedPlatforms: string[]; };
  budget: { northStar: "growth" | "profit"; targetCpa: number; dailyBudget: number; monthlyBudget: number; scalingLimit: number; };
  audience: { personaAge: string; personaLocation: string; personaInterests: string; };
  creative: { negativeConstraints: string[]; competitors: string[]; valueProps: string[]; vibe: number; };
  reporting: { deliveryChannel: string; reportFrequency: string; escalationTrigger: string; cpaSpikeThreshold: number; };
  uploadedFiles?: { logos?: UploadedFileInfo[]; fonts?: UploadedFileInfo[]; styleGuides?: UploadedFileInfo[]; seedAudience?: UploadedFileInfo[]; };
  googleAds?: { connected: boolean; customerId?: string; connectedAt?: string; };
  analytics?: { propertyId?: string; siteUrl?: string; };
  company?: CompanyData;
}

export interface CompanyData { name?: string; website?: string; industry?: string; description?: string; targetMarket?: string; unique_selling_proposition?: string; }

export interface GoogleAdsAnalytics {
  source: "mongodb" | "google_ads_api" | "mock";
  totals: { impressions: number; clicks: number; spend: number; conversions: number; conversionsValue: number; roas: number; cpa: number; ctr: number; sessions?: number; users?: number; newUsers?: number; pageViews?: number; bounceRate?: number; };
  changes: { impressions: number; clicks: number; spend: number; conversions: number; roas: number; cpa: number; sessions?: number; users?: number; pageViews?: number; };
  daily: { date: string; impressions: number; clicks: number; costMicros: number; spend: number; conversions: number; conversionsValue: number; ctr: number; cpc: number; roas: number; cpa: number; sessions?: number; users?: number; newUsers?: number; pageViews?: number; bounceRate?: number; avgSessionDuration?: number; }[];
  campaigns: any[];
  channels?: any[];
  searchConsole?: any;
}

export interface AgentLog { id: number; timestamp: string; agent: string; action: string; message: string; severity: string; meta?: Record<string, unknown>; }

// ─── Strategy & Content types ───
export interface SwotItem { point: string; rationale: string; dataSource: string; }

export interface PerformanceSummaryData {
  ga4?: {
    totalSessions: number; totalUsers: number; totalNewUsers: number; totalPageViews: number;
    avgBounceRate: number; avgSessionDuration: number; totalConversions: number; totalRevenue: number;
    newUserRate: number; topSources: string[]; recordCount: number;
  };
  googleAds?: {
    totalImpressions: number; totalClicks: number; totalCost: number; totalConversions: number;
    totalConversionValue: number; avgCtr: number; avgCpc: number; avgRoas: number;
    campaignCount: number; recordCount: number;
  };
  searchConsole?: {
    totalClicks: number; totalImpressions: number; avgCtr: number; avgPosition: number;
    topQueries: string[]; topPages: string[]; recordCount: number;
  };
}

export interface CompanyProfileData {
  companyName?: string; domain?: string; seoScore?: number;
  topKeywords?: string[]; techStack?: string[]; socialChannels?: string[];
  ctaTypes?: string[]; wordCount?: number; readabilityScore?: string;
  hasStructuredData?: boolean; internalLinks?: number; externalLinks?: number;
  scrapedAt?: string;
}

export interface CompetitorAnalyzed {
  name: string; url: string; positioning: string;
  keyServices: string[]; perceivedStrengths: string[]; perceivedWeaknesses: string[];
}

export interface CompetitorIntelligenceData {
  competitorsAnalyzed?: CompetitorAnalyzed[];
  orbitalAdvantages?: string[];
  gapsInMarket?: string[];
  positioningWedge?: { angle: string; rationale: string; messagingSuggestion: string; };
  counterStrategies?: string[];
  competitorExecutiveSummary?: string;
  analysedAt?: string;
}

export interface StrategyResponse {
  _id: string;
  dateRange: { startDate: string; endDate: string; };
  dataSummary?: PerformanceSummaryData;
  performanceSummary?: PerformanceSummaryData;
  companyProfile?: CompanyProfileData;
  competitorIntelligence?: CompetitorIntelligenceData;
  swot: { strengths: SwotItem[]; weaknesses: SwotItem[]; opportunities: SwotItem[]; threats: SwotItem[]; };
  executiveSummary: string;
  recommendations: unknown[];
  generatedAt: string;
  analysisModel: string;
}

export interface ContentPiece {
  format: string;
  platform?: string;
  title?: string;
  body: string;
  cta?: string;
  hashtags?: string[];
  rationale?: string;
}

export interface ContentResponse {
  _id: string;
  strategyResponseId: string;
  dateRange: { startDate: string; endDate: string; };
  content: ContentPiece[];
  generatedAt: string;
  modelName: string;
}

// ─── Company Report (website scrape) types ───
export interface CompanyReportSeoScore {
  overall: number;
  titlePresent: boolean; titleLength: number; descriptionPresent: boolean; descriptionLength: number;
  h1Count: number; h1Unique: boolean; canonicalPresent: boolean; robotsIndexable: boolean;
  hasStructuredData: boolean; hasOpenGraph: boolean; hasTwitterCard: boolean;
  internalLinksCount: number; externalLinksCount: number; imagesWithAlt: number; imagesMissingAlt: number;
  wordCount: number; readabilityScore: string; mobileViewport: boolean; httpsEnabled: boolean;
  issues: string[]; recommendations: string[];
}

export interface CompanyReportPerformance {
  htmlSizeKb: number; totalExternalScripts: number; totalStylesheets: number;
  lazyImagesCount: number; hasWebP: boolean; hasFontPreload: boolean;
  hasDnsPreconnect: boolean; hasMinifiedResources: boolean; estimatedLoadScore: string;
}

export interface CompanyReport {
  _id: string; type: "own" | "competitor"; url: string; domain: string; companyName: string;
  scrapedAt: string; httpStatus: number; finalUrl: string;
  meta: { title: string; description: string; [key: string]: any; };
  wordCount: number;
  topKeywords: { word: string; count: number; density: number; }[];
  techStack: { cms?: string; analytics: string[]; chatWidgets: string[]; adPixels: string[]; fonts: string[]; ssl: boolean; detected: string[]; };
  performanceHints: CompanyReportPerformance;
  seoScore: CompanyReportSeoScore;
  socialPresence: Record<string, string | string[]>;
  contactInfo: { email?: string; phone?: string; };
  navigation: string[];
  ctas: { text: string; type: string; href?: string; location: string; }[];
  headings: { h1: string[]; h2: string[]; h3: string[]; h4: string[]; h5: string[]; h6: string[]; };
}

// ─── Competitor Response types ───
export interface CompetitorAnalysisEntry {
  url: string; name: string; scrapedContent: string; positioning: string;
  targetAudience: string; keyServices: string[]; messagingAngle: string;
  perceivedStrengths: string[]; perceivedWeaknesses: string[];
}

export interface CompetitorResponse {
  _id: string; generatedAt: string; analysisModel: string;
  userContext: {
    companyName: string; website: string; industry: string; goal: string;
    audience: { age: string; location: string; interests: string; };
    valueProps: string[];
  };
  analysis: {
    competitors: CompetitorAnalysisEntry[];
    orbitalAdvantages: string[];
    gapsInMarket: string[];
    positioningWedge: { angle: string; rationale: string; messagingSuggestion: string; };
    counterStrategies: string[];
    executiveSummary: string;
  };
}

// ─── User Config ───
export async function fetchUserConfig(): Promise<UserConfig | null> {
  const email = getEmail(); if (!email) return null;
  const res = await fetch(`${API_BASE}/api/config?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() });
  if (res.status === 404) return null; if (!res.ok) throw new Error(`Failed: ${res.statusText}`); return res.json();
}

export async function updateUserConfig(partial: Record<string, unknown>): Promise<void> {
  const email = getEmail(); if (!email) throw new Error("No email");
  const res = await fetch(`${API_BASE}/api/config`, { method: "PATCH", headers: { ...getAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ email, ...partial }) });
  if (!res.ok) throw new Error(`Failed: ${res.statusText}`);
}

export async function deleteUploadedFile(field: string, savedAs: string): Promise<void> {
  const email = getEmail(); if (!email) throw new Error("No email");
  const safeEmail = email.replace(/[^a-zA-Z0-9@._-]/g, "_");
  const res = await fetch(`${API_BASE}/api/files/${safeEmail}/${field}/${savedAs}`, { method: "DELETE", headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed: ${res.statusText}`);
}

export function getFileUrl(relativePath: string): string { return `${API_BASE}${relativePath}`; }

// ─── Company ───
export async function fetchCompany(): Promise<CompanyData> {
  const email = getEmail();
  const res = await fetch(`${API_BASE}/api/company?email=${encodeURIComponent(email)}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed"); const data = await res.json(); return data.company || {};
}

export async function updateCompany(companyData: Partial<CompanyData>): Promise<void> {
  const email = getEmail();
  const res = await fetch(`${API_BASE}/api/company`, { method: "PATCH", headers: { ...getAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ email, ...companyData }) });
  if (!res.ok) throw new Error("Failed");
}

// ─── Google Ads / Analytics ───
export async function fetchGoogleAdsAnalytics(dateRange?: string): Promise<GoogleAdsAnalytics> {
  const email = getEmail(); const params = new URLSearchParams({ email }); if (dateRange) params.set("dateRange", dateRange);
  const res = await fetch(`${API_BASE}/api/google-ads/analytics?${params}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed"); return res.json();
}

// ─── Strategy & Content ───
export async function fetchStrategy(): Promise<StrategyResponse[]> {
  const res = await fetch(`${API_BASE}/api/strategy`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed"); const data = await res.json(); return data.strategies || [];
}

export async function fetchContent(): Promise<ContentResponse[]> {
  const res = await fetch(`${API_BASE}/api/content`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed"); const data = await res.json(); return data.contentResponses || [];
}

// ─── Company Reports (website scrapes) ───
export async function fetchCompanyReports(): Promise<CompanyReport[]> {
  const res = await fetch(`${API_BASE}/api/company-reports`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed"); const data = await res.json(); return data.reports || [];
}

// ─── Competitor Response (AI analysis) ───
export async function fetchCompetitorResponse(): Promise<CompetitorResponse[]> {
  const res = await fetch(`${API_BASE}/api/competitor-response`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed"); const data = await res.json(); return data.responses || [];
}

// ─── Agents ───
export async function fetchAgentLogs(agent?: string): Promise<AgentLog[]> {
  const email = getEmail(); const params = new URLSearchParams({ email }); if (agent) params.set("agent", agent);
  const res = await fetch(`${API_BASE}/api/agents/logs?${params}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed"); const data = await res.json(); return data.logs || [];
}

export async function triggerAnalystScan(): Promise<any> {
  const email = getEmail();
  const res = await fetch(`${API_BASE}/api/agents/analyst/scan`, { method: "POST", headers: { ...getAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
  if (!res.ok) throw new Error("Failed"); return res.json();
}

export async function triggerMediaBuyerOptimize(): Promise<any> {
  const email = getEmail();
  const res = await fetch(`${API_BASE}/api/agents/media-buyer/optimize`, { method: "POST", headers: { ...getAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
  if (!res.ok) throw new Error("Failed"); return res.json();
}

export async function triggerCreativeDirectorGenerate(): Promise<any> {
  const email = getEmail();
  const res = await fetch(`${API_BASE}/api/agents/creative-director/generate`, { method: "POST", headers: { ...getAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
  if (!res.ok) throw new Error("Failed"); return res.json();
}

export async function triggerAccountManagerReport(): Promise<any> {
  const email = getEmail();
  const res = await fetch(`${API_BASE}/api/agents/account-manager/report`, { method: "POST", headers: { ...getAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
  if (!res.ok) throw new Error("Failed"); return res.json();
}

export async function triggerFullAgentLoop(): Promise<any> {
  const email = getEmail();
  const res = await fetch(`${API_BASE}/api/agents/loop`, { method: "POST", headers: { ...getAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
  if (!res.ok) throw new Error("Failed"); return res.json();
}