const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Anthropic = require("@anthropic-ai/sdk");
const { OAuth2Client } = require("google-auth-library");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ─── MongoDB Connection ───
const MONGO_URI = "mongodb+srv://mike:oCYgexRakFYkvhmR@dev-db.c8pl1gt.mongodb.net/?appName=dev-db";
let mongoClient;
let mongoDb;
let usageSummaryCollection = null;

async function connectMongo() {
  try {
    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    mongoDb = mongoClient.db("test");
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("✅ Connected to MongoDB Atlas");
    console.log("═══════════════════════════════════════════════════════════\n");

    const testCollections = await mongoDb.listCollections().toArray();
    const testCollNames = testCollections.map(c => c.name);
    console.log("📁 [test] Collections:", testCollNames.join(", "));

    // Try to find usage_summary collection
    if (testCollNames.includes("usage_summary")) {
      usageSummaryCollection = mongoDb.collection("usage_summary");
      const count = await usageSummaryCollection.countDocuments();
      console.log(`✅ Found usage_summary in [test] database — ${count} documents`);
    } else {
      const usageTrackingDb = mongoClient.db("usage_tracking");
      const utCollections = await usageTrackingDb.listCollections().toArray();
      const utCollNames = utCollections.map(c => c.name);
      console.log("📁 [usage_tracking] Collections:", utCollNames.join(", ") || "(none)");

      if (utCollNames.includes("usage_summary")) {
        usageSummaryCollection = usageTrackingDb.collection("usage_summary");
        const count = await usageSummaryCollection.countDocuments();
        console.log(`✅ Found usage_summary in [usage_tracking] database — ${count} documents`);
      } else {
        console.log("⚠️ usage_summary collection not found in either database");
        const adminDb = mongoClient.db().admin();
        const dbList = await adminDb.listDatabases();
        for (const dbInfo of dbList.databases) {
          const db = mongoClient.db(dbInfo.name);
          const cols = await db.listCollections().toArray();
          const colNames = cols.map(c => c.name);
          if (colNames.includes("usage_summary")) {
            usageSummaryCollection = db.collection("usage_summary");
            const count = await usageSummaryCollection.countDocuments();
            console.log(`✅ Found usage_summary in [${dbInfo.name}] database — ${count} documents`);
            break;
          }
        }
        if (!usageSummaryCollection) {
          console.log("❌ usage_summary collection not found in any database");
        }
      }
    }

    // Check kpi_projections
    if (testCollNames.includes("kpi_projections")) {
      const kpiCount = await mongoDb.collection("kpi_projections").countDocuments();
      console.log(`✅ Found kpi_projections in [test] database — ${kpiCount} documents`);
    }

    console.log("");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
}

// ─── Claude AI Client ───
const anthropic = new Anthropic({
  apiKey: "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",
});

const GOOGLE_ADS_API_VERSION = "v18";

// ─── Multer config ───
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpDir = path.join(__dirname, "uploads", "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });
const setupUpload = upload.fields([
  { name: "logos", maxCount: 10 },
  { name: "fonts", maxCount: 10 },
  { name: "styleGuides", maxCount: 10 },
  { name: "seedAudience", maxCount: 1 },
]);

// ─── Helpers ───
function getSafeEmail(email) {
  if (!email) return null;
  return email.replace(/[^a-zA-Z0-9@._-]/g, "_");
}

function getUserConfig(email) {
  const safeEmail = getSafeEmail(email);
  if (!safeEmail) return null;
  const jsonPath = path.join(__dirname, "accounts", `${safeEmail}.json`);
  if (!fs.existsSync(jsonPath)) return null;
  return JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
}

function saveUserConfig(email, data) {
  const safeEmail = getSafeEmail(email);
  const accountsDir = path.join(__dirname, "accounts");
  if (!fs.existsSync(accountsDir)) fs.mkdirSync(accountsDir, { recursive: true });
  const jsonPath = path.join(accountsDir, `${safeEmail}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
}

function getAgentLogs(email) {
  const safeEmail = getSafeEmail(email);
  const logsPath = path.join(__dirname, "accounts", `${safeEmail}_agent_logs.json`);
  if (!fs.existsSync(logsPath)) return [];
  return JSON.parse(fs.readFileSync(logsPath, "utf-8"));
}

function appendAgentLog(email, log) {
  const safeEmail = getSafeEmail(email);
  const accountsDir = path.join(__dirname, "accounts");
  if (!fs.existsSync(accountsDir)) fs.mkdirSync(accountsDir, { recursive: true });
  const logsPath = path.join(accountsDir, `${safeEmail}_agent_logs.json`);
  const logs = fs.existsSync(logsPath) ? JSON.parse(fs.readFileSync(logsPath, "utf-8")) : [];
  logs.unshift({ ...log, id: Date.now() + Math.random(), timestamp: new Date().toISOString() });
  if (logs.length > 500) logs.length = 500;
  fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));
  return logs;
}

function serializeMongoDoc(doc) {
  if (doc === null || doc === undefined) return doc;
  if (typeof doc !== "object") return doc;
  if (doc._bsontype === "ObjectId" || (doc.constructor && doc.constructor.name === "ObjectId")) {
    return doc.toString();
  }
  if (doc instanceof Date) {
    return doc.toISOString();
  }
  if (Array.isArray(doc)) {
    return doc.map(serializeMongoDoc);
  }
  const result = {};
  for (const key of Object.keys(doc)) {
    result[key] = serializeMongoDoc(doc[key]);
  }
  return result;
}

// ═══════════════════════════════════════════════════════════
// ─── MONGODB DATA FETCHING ───
// ═══════════════════════════════════════════════════════════

async function fetchAnalyticsFromMongo(propertyId) {
  if (!mongoDb) { console.log("[MongoDB] Not connected"); return null; }
  const collection = mongoDb.collection("analyticsreports");
  const filter = propertyId ? { propertyId } : {};
  const docs = await collection.find(filter).toArray();
  if (docs.length === 0) { console.log("[MongoDB] No analytics documents found"); return null; }
  console.log(`[MongoDB] Fetched ${docs.length} analytics documents`);

  const dailyMap = {};
  const channelMap = {};

  for (const doc of docs) {
    const dim = doc.dimensions || {};
    const met = doc.metrics || {};
    const rawDate = dim.date || "";
    const dateStr = rawDate.length === 8 ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}` : rawDate;

    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = { date: dateStr, sessions: 0, users: 0, newUsers: 0, pageViews: 0, bounceRateSum: 0, bounceRateCount: 0, avgSessionDurationSum: 0, avgSessionDurationCount: 0, conversions: 0 };
    }
    const day = dailyMap[dateStr];
    day.sessions += met.sessions || 0;
    day.users += met.users || 0;
    day.newUsers += met.newUsers || 0;
    day.pageViews += met.pageViews || 0;
    day.conversions += met.conversions || 0;
    if (met.bounceRate !== undefined) { day.bounceRateSum += (met.bounceRate || 0) * (met.sessions || 1); day.bounceRateCount += met.sessions || 1; }
    if (met.avgSessionDuration !== undefined) { day.avgSessionDurationSum += (met.avgSessionDuration || 0) * (met.sessions || 1); day.avgSessionDurationCount += met.sessions || 1; }

    const channel = `${dim.source || "(direct)"} / ${dim.medium || "(none)"}`;
    if (!channelMap[channel]) {
      channelMap[channel] = { source: dim.source || "(direct)", medium: dim.medium || "(none)", sessions: 0, users: 0, newUsers: 0, pageViews: 0, conversions: 0, bounceRateSum: 0, bounceRateCount: 0 };
    }
    const ch = channelMap[channel];
    ch.sessions += met.sessions || 0; ch.users += met.users || 0; ch.newUsers += met.newUsers || 0; ch.pageViews += met.pageViews || 0; ch.conversions += met.conversions || 0;
    ch.bounceRateSum += (met.bounceRate || 0) * (met.sessions || 1); ch.bounceRateCount += met.sessions || 1;
  }

  const daily = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date)).map((d) => ({
    date: d.date, sessions: d.sessions, users: d.users, newUsers: d.newUsers, pageViews: d.pageViews, conversions: d.conversions,
    bounceRate: d.bounceRateCount > 0 ? parseFloat((d.bounceRateSum / d.bounceRateCount).toFixed(4)) : 0,
    avgSessionDuration: d.avgSessionDurationCount > 0 ? parseFloat((d.avgSessionDurationSum / d.avgSessionDurationCount).toFixed(2)) : 0,
  }));

  const channels = Object.values(channelMap).sort((a, b) => b.sessions - a.sessions).map((ch) => ({
    source: ch.source, medium: ch.medium, sessions: ch.sessions, users: ch.users, newUsers: ch.newUsers, pageViews: ch.pageViews, conversions: ch.conversions,
    bounceRate: ch.bounceRateCount > 0 ? parseFloat((ch.bounceRateSum / ch.bounceRateCount).toFixed(4)) : 0,
  }));

  const totals = daily.reduce((acc, d) => ({ sessions: acc.sessions + d.sessions, users: acc.users + d.users, newUsers: acc.newUsers + d.newUsers, pageViews: acc.pageViews + d.pageViews, conversions: acc.conversions + d.conversions }), { sessions: 0, users: 0, newUsers: 0, pageViews: 0, conversions: 0 });
  const totalBounceRateSum = daily.reduce((s, d) => s + d.bounceRate * d.sessions, 0);
  totals.bounceRate = totals.sessions > 0 ? parseFloat((totalBounceRateSum / totals.sessions).toFixed(4)) : 0;

  const midpoint = Math.floor(daily.length / 2);
  const firstHalf = daily.slice(0, midpoint);
  const secondHalf = daily.slice(midpoint);
  const sumMetric = (arr, key) => arr.reduce((s, d) => s + (d[key] || 0), 0);
  const pct = (curr, prev) => (prev > 0 ? parseFloat((((curr - prev) / prev) * 100).toFixed(1)) : 0);
  const changes = {
    sessions: pct(sumMetric(secondHalf, "sessions"), sumMetric(firstHalf, "sessions")),
    users: pct(sumMetric(secondHalf, "users"), sumMetric(firstHalf, "users")),
    pageViews: pct(sumMetric(secondHalf, "pageViews"), sumMetric(firstHalf, "pageViews")),
    conversions: pct(sumMetric(secondHalf, "conversions"), sumMetric(firstHalf, "conversions")),
  };

  return { source: "mongodb", daily, channels, totals, changes };
}

async function fetchSearchConsoleFromMongo(siteUrl) {
  if (!mongoDb) return null;
  const collection = mongoDb.collection("searchconsolereports");
  const filter = siteUrl ? { siteUrl } : {};
  const docs = await collection.find(filter).toArray();
  if (docs.length === 0) return null;
  console.log(`[MongoDB] Fetched ${docs.length} search console documents`);

  const queryMap = {};
  for (const doc of docs) {
    const q = doc.query || "(unknown)";
    if (!queryMap[q]) { queryMap[q] = { query: q, clicks: 0, impressions: 0, ctrSum: 0, ctrCount: 0, positionSum: 0, positionCount: 0 }; }
    queryMap[q].clicks += doc.clicks || 0; queryMap[q].impressions += doc.impressions || 0;
    queryMap[q].ctrSum += (doc.ctr || 0) * (doc.impressions || 1); queryMap[q].ctrCount += doc.impressions || 1;
    queryMap[q].positionSum += (doc.position || 0) * (doc.impressions || 1); queryMap[q].positionCount += doc.impressions || 1;
  }
  const queries = Object.values(queryMap).sort((a, b) => b.impressions - a.impressions).map((q) => ({
    query: q.query, clicks: q.clicks, impressions: q.impressions,
    ctr: q.ctrCount > 0 ? parseFloat((q.ctrSum / q.ctrCount).toFixed(4)) : 0,
    position: q.positionCount > 0 ? parseFloat((q.positionSum / q.positionCount).toFixed(1)) : 0,
  }));

  const pageMap = {};
  for (const doc of docs) { const p = doc.page || "(unknown)"; if (!pageMap[p]) { pageMap[p] = { page: p, clicks: 0, impressions: 0 }; } pageMap[p].clicks += doc.clicks || 0; pageMap[p].impressions += doc.impressions || 0; }
  const pages = Object.values(pageMap).sort((a, b) => b.impressions - a.impressions);

  const totals = { clicks: docs.reduce((s, d) => s + (d.clicks || 0), 0), impressions: docs.reduce((s, d) => s + (d.impressions || 0), 0) };
  totals.ctr = totals.impressions > 0 ? parseFloat((totals.clicks / totals.impressions).toFixed(4)) : 0;
  totals.avgPosition = docs.length > 0 ? parseFloat((docs.reduce((s, d) => s + (d.position || 0), 0) / docs.length).toFixed(1)) : 0;

  return { source: "mongodb", queries, pages, totals };
}

async function fetchStrategyFromMongo() {
  if (!mongoDb) return [];
  const collection = mongoDb.collection("strategy-response");
  const docs = await collection.find({}).sort({ generatedAt: -1 }).toArray();
  console.log(`[MongoDB] Fetched ${docs.length} strategy-response documents`);
  return docs.map(serializeMongoDoc);
}

async function fetchContentFromMongo() {
  if (!mongoDb) return [];
  const collection = mongoDb.collection("content-response");
  const docs = await collection.find({}).sort({ generatedAt: -1 }).toArray();
  console.log(`[MongoDB] Fetched ${docs.length} content-response documents`);
  return docs.map(serializeMongoDoc);
}

async function fetchCompanyReportsFromMongo() {
  if (!mongoDb) return [];
  const collection = mongoDb.collection("company_report");
  const docs = await collection.find({}).sort({ scrapedAt: -1 }).toArray();
  console.log(`[MongoDB] Fetched ${docs.length} company_report documents`);
  return docs.map(serializeMongoDoc);
}

async function fetchCompetitorResponseFromMongo() {
  if (!mongoDb) return [];
  const collection = mongoDb.collection("competitor-response");
  const docs = await collection.find({}).sort({ generatedAt: -1 }).toArray();
  console.log(`[MongoDB] Fetched ${docs.length} competitor-response documents`);
  return docs.map(serializeMongoDoc);
}

async function fetchKpiProjectionsFromMongo() {
  if (!mongoDb) { console.log("[MongoDB] Not connected"); return []; }
  const collection = mongoDb.collection("kpi_projections");
  const docs = await collection.find({}).sort({ created_at: -1 }).toArray();
  console.log(`[MongoDB] Fetched ${docs.length} kpi_projections documents`);
  return docs.map(serializeMongoDoc);
}

function transformAnalyticsForDashboard(analyticsData, searchConsoleData) {
  if (!analyticsData) return null;
  const daily = analyticsData.daily.map((d) => {
    const sessions = d.sessions || 0; const users = d.users || 0; const pageViews = d.pageViews || 0; const conversions = d.conversions || 0; const bounceRate = d.bounceRate || 0;
    return { date: d.date, impressions: users, clicks: sessions, costMicros: 0, spend: 0, conversions, conversionsValue: 0, ctr: users > 0 ? parseFloat(((sessions / users) * 100).toFixed(2)) : 0, cpc: 0, roas: 0, cpa: 0, sessions, users, newUsers: d.newUsers || 0, pageViews, bounceRate: parseFloat((bounceRate * 100).toFixed(2)), avgSessionDuration: d.avgSessionDuration || 0 };
  });
  const totals = { impressions: analyticsData.totals.users || 0, clicks: analyticsData.totals.sessions || 0, spend: 0, conversions: analyticsData.totals.conversions || 0, conversionsValue: 0, roas: 0, cpa: 0, ctr: analyticsData.totals.users > 0 ? parseFloat(((analyticsData.totals.sessions / analyticsData.totals.users) * 100).toFixed(2)) : 0, sessions: analyticsData.totals.sessions || 0, users: analyticsData.totals.users || 0, newUsers: analyticsData.totals.newUsers || 0, pageViews: analyticsData.totals.pageViews || 0, bounceRate: parseFloat(((analyticsData.totals.bounceRate || 0) * 100).toFixed(2)) };
  const changes = { impressions: analyticsData.changes.users || 0, clicks: analyticsData.changes.sessions || 0, spend: 0, conversions: analyticsData.changes.conversions || 0, roas: 0, cpa: 0, sessions: analyticsData.changes.sessions || 0, users: analyticsData.changes.users || 0, pageViews: analyticsData.changes.pageViews || 0 };
  const campaigns = (analyticsData.channels || []).map((ch, i) => ({ id: `ch_${i}`, name: `${ch.source} / ${ch.medium}`, status: "ENABLED", channelType: ch.medium === "cpc" ? "PAID_SEARCH" : ch.medium === "organic" ? "ORGANIC_SEARCH" : ch.medium === "social" ? "SOCIAL" : ch.medium === "referral" ? "REFERRAL" : "DIRECT", budgetMicros: "0", impressions: ch.users || 0, clicks: ch.sessions || 0, costMicros: 0, conversions: ch.conversions || 0, ctr: ch.users > 0 ? parseFloat(((ch.sessions / ch.users) * 100).toFixed(2)) : 0, avgCpcMicros: 0, costPerConversionMicros: 0, sessions: ch.sessions, users: ch.users, newUsers: ch.newUsers, pageViews: ch.pageViews, bounceRate: parseFloat(((ch.bounceRate || 0) * 100).toFixed(2)) }));
  return { source: "mongodb", totals, changes, daily, campaigns, channels: analyticsData.channels || [], searchConsole: searchConsoleData || null };
}

async function getAnalyticsForUser(email, dateRange) {
  const config = getUserConfig(email);
  const propertyId = config?.analytics?.propertyId || null;
  const siteUrl = config?.analytics?.siteUrl || null;
  const analyticsData = await fetchAnalyticsFromMongo(propertyId);
  const searchConsoleData = await fetchSearchConsoleFromMongo(siteUrl);
  if (analyticsData) { const result = transformAnalyticsForDashboard(analyticsData, searchConsoleData); console.log(`[Analytics] ✅ MongoDB data for ${email}: ${result.daily.length} days, ${result.campaigns.length} channels`); return result; }
  console.log(`[Analytics] ⚠️ No data in MongoDB for ${email}`);
  return { source: "mongodb", totals: { impressions: 0, clicks: 0, spend: 0, conversions: 0, conversionsValue: 0, roas: 0, cpa: 0, ctr: 0, sessions: 0, users: 0, newUsers: 0, pageViews: 0, bounceRate: 0 }, changes: { impressions: 0, clicks: 0, spend: 0, conversions: 0, roas: 0, cpa: 0, sessions: 0, users: 0, pageViews: 0 }, daily: [], campaigns: [], channels: [], searchConsole: searchConsoleData || null };
}

// ═══════════════════════════════════════════════════════════
// ─── USAGE SUMMARY DATA FETCHING ───
// ═══════════════════════════════════════════════════════════

async function fetchUsageSummaryDocs(limit = 5, skip = 0) {
  if (!usageSummaryCollection) {
    console.log("[UsageSummary] Collection not available");
    return { documents: [], count: 0 };
  }
  const count = await usageSummaryCollection.countDocuments();
  const docs = await usageSummaryCollection.find({}).sort({ recorded_at: -1 }).skip(skip).limit(limit).toArray();
  console.log(`[UsageSummary] Fetched ${docs.length} of ${count} documents`);
  return { documents: docs.map(serializeMongoDoc), count };
}

async function fetchUsageSummaryStats() {
  if (!usageSummaryCollection) {
    console.log("[UsageSummary] Collection not available for stats");
    return null;
  }
  const count = await usageSummaryCollection.countDocuments();
  const docs = await usageSummaryCollection.find({}).toArray();
  console.log(`[UsageSummary] Computing stats from ${docs.length} documents`);

  let totalCost = 0, totalInputTokens = 0, totalOutputTokens = 0;
  let totalCacheRead = 0, totalCacheWrite = 0;
  let totalActions = 0, totalConversations = 0;
  const dailyMap = {};

  for (const doc of docs) {
    totalCost += doc.cost_usd || 0;
    totalInputTokens += doc.input_tokens || 0;
    totalOutputTokens += doc.output_tokens || 0;
    totalCacheRead += doc.cache_read || 0;
    totalCacheWrite += doc.cache_write || 0;
    totalActions += doc.total_actions || 0;
    totalConversations += doc.total_conv || 0;

    let date = null;
    if (doc.recorded_at) {
      try {
        date = new Date(doc.recorded_at).toISOString().slice(0, 10);
      } catch {
        date = null;
      }
    }
    if (date) {
      if (!dailyMap[date]) {
        dailyMap[date] = { date, cost: 0, sessions: 0, inputTokens: 0, outputTokens: 0, cacheRead: 0, cacheWrite: 0, actions: 0, conversations: 0 };
      }
      dailyMap[date].cost += doc.cost_usd || 0;
      dailyMap[date].sessions += 1;
      dailyMap[date].inputTokens += doc.input_tokens || 0;
      dailyMap[date].outputTokens += doc.output_tokens || 0;
      dailyMap[date].cacheRead += doc.cache_read || 0;
      dailyMap[date].cacheWrite += doc.cache_write || 0;
      dailyMap[date].actions += doc.total_actions || 0;
      dailyMap[date].conversations += doc.total_conv || 0;
    }
  }

  const daily = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

  const result = {
    totalSessions: count,
    totalCost: parseFloat(totalCost.toFixed(6)),
    totalInputTokens,
    totalOutputTokens,
    totalCacheRead,
    totalCacheWrite,
    totalActions,
    totalConversations,
    daily,
  };

  console.log(`[UsageSummary] Stats: ${count} sessions, $${result.totalCost} cost, ${daily.length} daily points`);
  return result;
}

// ═══════════════════════════════════════════════════════════
// ─── GOOGLE ADS API ───
// ═══════════════════════════════════════════════════════════

function createOAuth2Client(gadsConfig) { return new OAuth2Client(gadsConfig.clientId, gadsConfig.clientSecret, gadsConfig.redirectUri || `http://localhost:${PORT}/api/google-ads/callback`); }

function getDateRange(rangeStr) {
  const now = new Date(); const endDate = new Date(now); endDate.setDate(endDate.getDate() - 1);
  let startDate, prevStartDate, prevEndDate;
  if (rangeStr === "LAST_7_DAYS") { startDate = new Date(endDate); startDate.setDate(startDate.getDate() - 6); prevEndDate = new Date(startDate); prevEndDate.setDate(prevEndDate.getDate() - 1); prevStartDate = new Date(prevEndDate); prevStartDate.setDate(prevStartDate.getDate() - 6); } else { startDate = new Date(endDate); startDate.setDate(startDate.getDate() - 29); prevEndDate = new Date(startDate); prevEndDate.setDate(prevEndDate.getDate() - 1); prevStartDate = new Date(prevEndDate); prevStartDate.setDate(prevStartDate.getDate() - 29); }
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { startDate: fmt(startDate), endDate: fmt(endDate), prevStartDate: fmt(prevStartDate), prevEndDate: fmt(prevEndDate) };
}

async function refreshTokenIfNeeded(gadsConfig, email) {
  if (!gadsConfig.tokens?.refresh_token) return;
  const isExpired = gadsConfig.tokens.expiry_date && Date.now() >= gadsConfig.tokens.expiry_date - 120000;
  if (!isExpired && gadsConfig.tokens.expiry_date) return;
  const oauth2Client = createOAuth2Client(gadsConfig); oauth2Client.setCredentials(gadsConfig.tokens);
  const { credentials } = await oauth2Client.refreshAccessToken();
  gadsConfig.tokens = { ...gadsConfig.tokens, ...credentials };
  if (email) { const config = getUserConfig(email); if (config) { config.googleAds.tokens = gadsConfig.tokens; saveUserConfig(email, config); } }
}

// ═══════════════════════════════════════════════════════════
// ─── CLAUDE AI AGENT FUNCTIONS ───
// ═══════════════════════════════════════════════════════════

async function callClaude(systemPrompt, userMessage) {
  const response = await anthropic.messages.create({ model: "claude-sonnet-4-20250514", max_tokens: 4096, system: systemPrompt, messages: [{ role: "user", content: userMessage }] });
  return response.content[0].text;
}

async function runAnalystAgent(email) {
  const config = getUserConfig(email); if (!config) throw new Error("User not found");
  const analytics = await getAnalyticsForUser(email); const budget = config.budget || {}; const creative = config.creative || {}; const audience = config.audience || {}; const company = config.company || {}; const connected = config.accounts?.connectedPlatforms || []; const recentLogs = getAgentLogs(email).slice(0, 20);
  const systemPrompt = `You are the Analyst Agent for an autonomous AI marketing agency called "No-Human." Your role is constant surveillance and data mining across ad platforms and website analytics.\nYou analyze website traffic, user behavior, conversion rates, bounce rates, traffic sources, and identify opportunities and issues.\nYou must respond with a valid JSON object (no markdown, no code blocks) with this exact structure:\n{\n  "findings": [\n    { "type": "fatigue|opportunity|anomaly|warning|cpa_alert|trend|guardrail", "severity": "high|medium|low", "message": "Human-readable finding", "trigger_for": "creative_director|media_buyer|account_manager|none", "trigger_message": "Message to send to the other agent (or null)" }\n  ],\n  "summary": "One paragraph executive summary of the account health",\n  "health_score": 0-100,\n  "recommended_actions": ["action1", "action2"]\n}`;
  const searchConsoleInfo = analytics.searchConsole ? `\nSEARCH CONSOLE:\nTotal Clicks: ${analytics.searchConsole.totals.clicks}, Impressions: ${analytics.searchConsole.totals.impressions}, CTR: ${(analytics.searchConsole.totals.ctr * 100).toFixed(2)}%, Avg Position: ${analytics.searchConsole.totals.avgPosition}\nTop Queries: ${analytics.searchConsole.queries.slice(0, 5).map(q => `"${q.query}" (${q.clicks} clicks, ${q.impressions} imp, pos ${q.position})`).join(", ")}` : "";
  const userMessage = `Analyze this website and advertising account:\nCOMPANY: ${company.name || "Unknown"} (${company.industry || "Unknown"})\nUSP: ${company.unique_selling_proposition || "Not set"}\nDATA SOURCE: MongoDB (Real Google Analytics + Search Console data)\nBUDGET: Strategy=${budget.northStar || "growth"}, Daily=$${budget.dailyBudget || 0}, Monthly=$${budget.monthlyBudget || 0}, Target CPA=$${budget.targetCpa || 0}, Scaling=${budget.scalingLimit || 150}%\nAUDIENCE: Age=${audience.personaAge || "?"}, Location=${audience.personaLocation || "?"}, Interests=${audience.personaInterests || "?"}\nCREATIVE: ValueProps=${(creative.valueProps || []).join(", ") || "None"}, Constraints=${(creative.negativeConstraints || []).join(", ") || "None"}, Risk=${creative.vibe || 5}/10\nPLATFORMS: ${connected.join(", ") || "None"}\n\nWEBSITE ANALYTICS (from Google Analytics):\nSessions: ${analytics.totals.sessions || 0} (${analytics.changes.sessions > 0 ? "+" : ""}${analytics.changes.sessions || 0}%)\nUsers: ${analytics.totals.users || 0} (${analytics.changes.users > 0 ? "+" : ""}${analytics.changes.users || 0}%)\nPage Views: ${analytics.totals.pageViews || 0} (${analytics.changes.pageViews > 0 ? "+" : ""}${analytics.changes.pageViews || 0}%)\nBounce Rate: ${analytics.totals.bounceRate || 0}%\nConversions: ${analytics.totals.conversions || 0}\n\nTRAFFIC CHANNELS:\n${analytics.campaigns.map((c) => `- ${c.name} [${c.channelType}] Sessions=${c.sessions} Users=${c.users} PageViews=${c.pageViews} BounceRate=${c.bounceRate}%`).join("\n")}\n${searchConsoleInfo}\n\nRECENT ACTIVITY:\n${recentLogs.slice(0, 10).map((l) => `[${l.agent}] ${l.message}`).join("\n") || "None"}`;
  const aiResponse = await callClaude(systemPrompt, userMessage);
  let parsed; try { parsed = JSON.parse(aiResponse); } catch { const m = aiResponse.match(/\{[\s\S]*\}/); parsed = m ? JSON.parse(m[0]) : { findings: [{ type: "warning", severity: "medium", message: aiResponse.slice(0, 500), trigger_for: "none", trigger_message: null }], summary: "Analysis completed.", health_score: 50, recommended_actions: [] }; }
  for (const f of (parsed.findings || [])) appendAgentLog(email, { agent: "analyst", action: `finding_${f.type}`, message: f.message, severity: f.severity || "info", meta: f });
  appendAgentLog(email, { agent: "analyst", action: "scan_complete", message: `Scan complete — Health: ${parsed.health_score}/100. ${parsed.summary}`, severity: "info", meta: { health_score: parsed.health_score } });
  return { ...parsed, analytics };
}

async function runCreativeDirectorAgent(email, analystTrigger) {
  const config = getUserConfig(email); if (!config) throw new Error("User not found");
  const creative = config.creative || {}; const company = config.company || {}; const analytics = await getAnalyticsForUser(email);
  const systemPrompt = `You are the Creative Director Agent for "No-Human." You generate ad creative assets based on brand DNA and analyst triggers.\nRespond with valid JSON (no markdown):\n{ "creatives": [{ "type": "headline|description|video_concept|image_concept|hook", "platform": "Google Ads|Meta|TikTok|All", "content": "text", "rationale": "why", "estimated_impact": "high|medium|low", "variation_of": "what it replaces or null" }], "strategy_note": "strategy", "brand_compliance": true, "constraints_applied": [] }`;
  const userMessage = `Generate creatives for:\nCOMPANY: ${company.name || "Unknown"} (${company.industry || "?"})\nUSP: ${company.unique_selling_proposition || "?"}\nVALUE PROPS: ${(creative.valueProps || []).join(", ") || "None"}\nCONSTRAINTS: ${(creative.negativeConstraints || []).join(", ") || "None"}\nCOMPETITORS: ${(creative.competitors || []).join(", ") || "None"}\nRISK: ${creative.vibe || 5}/10\nSessions: ${analytics.totals.sessions || 0}, Users: ${analytics.totals.users || 0}, Bounce Rate: ${analytics.totals.bounceRate || 0}%\n${analystTrigger ? `\nTRIGGER: ${analystTrigger}` : ""}\nGenerate 5-8 assets.`;
  const aiResponse = await callClaude(systemPrompt, userMessage);
  let parsed; try { parsed = JSON.parse(aiResponse); } catch { const m = aiResponse.match(/\{[\s\S]*\}/); parsed = m ? JSON.parse(m[0]) : { creatives: [], strategy_note: aiResponse.slice(0, 500), brand_compliance: true, constraints_applied: [] }; }
  for (const c of (parsed.creatives || [])) appendAgentLog(email, { agent: "creative_director", action: `creative_${c.type}`, message: `[${c.platform}] [${c.type}] "${c.content}" — ${c.rationale}`, severity: c.estimated_impact === "high" ? "high" : "medium", meta: c });
  appendAgentLog(email, { agent: "creative_director", action: "generation_complete", message: `Generated ${(parsed.creatives || []).length} creatives. ${parsed.strategy_note}`, severity: "info" });
  return parsed;
}

async function runMediaBuyerAgent(email, analystTrigger) {
  const config = getUserConfig(email); if (!config) throw new Error("User not found");
  const budget = config.budget || {}; const analytics = await getAnalyticsForUser(email);
  const systemPrompt = `You are the Media Buyer Agent for "No-Human." You handle budgeting, bidding, and scaling.\nRules: Never exceed monthly cap. Scale winners 10% every 4 hours. Kill campaigns >30% over CPA target. Move budget from losers to winners.\nRespond with valid JSON (no markdown):\n{ "actions": [{ "type": "scale_budget|reduce_budget|pause_campaign|enable_campaign|adjust_bid|reallocate", "campaign": "name", "details": "what", "amount": "how much", "urgency": "immediate|scheduled|monitoring", "rationale": "why" }], "budget_summary": { "total_daily_recommended": 0, "monthly_projected": 0, "within_cap": true, "efficiency_score": 0 }, "strategy_note": "strategy" }`;
  const userMessage = `Optimize budgets:\nSTRATEGY: ${budget.northStar || "growth"}, Daily=$${budget.dailyBudget || 0}, Monthly=$${budget.monthlyBudget || 0}, Target CPA=$${budget.targetCpa || 0}, Scaling=${budget.scalingLimit || 150}%\nWEBSITE: Sessions=${analytics.totals.sessions || 0}, Users=${analytics.totals.users || 0}, Conversions=${analytics.totals.conversions || 0}\nCHANNELS:\n${analytics.campaigns.map((c) => `- ${c.name} [${c.channelType}] Sessions=${c.sessions} Users=${c.users} Conversions=${c.conversions} BounceRate=${c.bounceRate}%`).join("\n")}\nDAYS LEFT: ${30 - new Date().getDate()}, REMAINING BUDGET: $${((budget.monthlyBudget || 0)).toFixed(2)}\n${analystTrigger ? `\nTRIGGER: ${analystTrigger}` : ""}`;
  const aiResponse = await callClaude(systemPrompt, userMessage);
  let parsed; try { parsed = JSON.parse(aiResponse); } catch { const m = aiResponse.match(/\{[\s\S]*\}/); parsed = m ? JSON.parse(m[0]) : { actions: [], budget_summary: { total_daily_recommended: 0, monthly_projected: 0, within_cap: true, efficiency_score: 50 }, strategy_note: aiResponse.slice(0, 500) }; }
  for (const a of (parsed.actions || [])) appendAgentLog(email, { agent: "media_buyer", action: a.type, message: `[${(a.urgency || "").toUpperCase()}] ${a.campaign}: ${a.details} (${a.amount}) — ${a.rationale}`, severity: a.urgency === "immediate" ? "high" : "medium", meta: a });
  appendAgentLog(email, { agent: "media_buyer", action: "optimization_complete", message: `${(parsed.actions || []).length} actions. Efficiency: ${parsed.budget_summary?.efficiency_score}/100. ${parsed.strategy_note}`, severity: "info", meta: parsed.budget_summary });
  return parsed;
}

async function runAccountManagerAgent(email) {
  const config = getUserConfig(email); if (!config) throw new Error("User not found");
  const reporting = config.reporting || {}; const budget = config.budget || {}; const company = config.company || {}; const analytics = await getAnalyticsForUser(email);
  const recentLogs = getAgentLogs(email).slice(0, 50);
  const activity = { analyst: recentLogs.filter((l) => l.agent === "analyst").slice(0, 10), creative_director: recentLogs.filter((l) => l.agent === "creative_director").slice(0, 10), media_buyer: recentLogs.filter((l) => l.agent === "media_buyer").slice(0, 10) };
  const searchConsoleInfo = analytics.searchConsole ? `\nSEARCH CONSOLE: ${analytics.searchConsole.totals.clicks} clicks, ${analytics.searchConsole.totals.impressions} impressions, CTR ${(analytics.searchConsole.totals.ctr * 100).toFixed(2)}%, Avg Pos ${analytics.searchConsole.totals.avgPosition}` : "";
  const systemPrompt = `You are the Account Manager Agent for "No-Human." You translate complex data into simple client updates.\nRespond with valid JSON (no markdown):\n{ "report": { "greeting": "Hi!", "executive_summary": "summary", "performance_highlights": [{ "metric": "name", "value": "val", "trend": "up|down|stable", "context": "why" }], "agent_actions_summary": "what agents did", "wins": [], "concerns": [], "next_steps": [], "closing": "bye" }, "delivery": { "channel": "email", "frequency": "daily", "urgency": "routine" }, "alerts": [{ "type": "info|warning|critical", "message": "msg" }], "video_brief_script": "60-second script" }`;
  const userMessage = `Generate report for:\nCLIENT: ${company.name || "Client"} (${company.industry || "?"})\nDATA SOURCE: MongoDB (Real Google Analytics + Search Console)\nDELIVERY: ${reporting.deliveryChannel || "email"} (${reporting.reportFrequency || "daily"})\nWEBSITE: Sessions=${analytics.totals.sessions || 0} (${analytics.changes.sessions > 0 ? "+" : ""}${analytics.changes.sessions || 0}%), Users=${analytics.totals.users || 0}, PageViews=${analytics.totals.pageViews || 0}, BounceRate=${analytics.totals.bounceRate || 0}%, Conversions=${analytics.totals.conversions || 0}\nBUDGET: $${budget.dailyBudget || 0}/day, $${budget.monthlyBudget || 0}/mo, Strategy=${budget.northStar || "growth"}\n${searchConsoleInfo}\nANALYST: ${activity.analyst.map((l) => l.message).join(" | ") || "None"}\nCREATIVE: ${activity.creative_director.map((l) => l.message).join(" | ") || "None"}\nMEDIA BUYER: ${activity.media_buyer.map((l) => l.message).join(" | ") || "None"}\nTOP CHANNELS: ${analytics.campaigns.slice(0, 5).map((c) => `${c.name}: ${c.sessions} sessions, ${c.users} users`).join("; ")}`;
  const aiResponse = await callClaude(systemPrompt, userMessage);
  let parsed; try { parsed = JSON.parse(aiResponse); } catch { const m = aiResponse.match(/\{[\s\S]*\}/); parsed = m ? JSON.parse(m[0]) : { report: { greeting: "Hi!", executive_summary: aiResponse.slice(0, 500), performance_highlights: [], agent_actions_summary: "", wins: [], concerns: [], next_steps: [], closing: "Talk soon!" }, delivery: { channel: "email", frequency: "daily", urgency: "routine" }, alerts: [], video_brief_script: "" }; }
  appendAgentLog(email, { agent: "account_manager", action: "report_generated", message: `Report: ${parsed.report?.executive_summary || "Generated"}`, severity: "info", meta: { report: parsed.report, delivery: parsed.delivery } });
  for (const a of (parsed.alerts || [])) appendAgentLog(email, { agent: "account_manager", action: `alert_${a.type}`, message: a.message, severity: a.type === "critical" ? "high" : "medium" });
  if (parsed.video_brief_script) appendAgentLog(email, { agent: "account_manager", action: "video_brief", message: `Video Brief: ${parsed.video_brief_script.slice(0, 200)}...`, severity: "info", meta: { full_script: parsed.video_brief_script } });
  return { ...parsed, analytics };
}

async function runFullAgentLoop(email) {
  const results = { analyst: null, creative_director: null, media_buyer: null, account_manager: null, errors: [] };
  appendAgentLog(email, { agent: "system", action: "loop_started", message: "🔄 Full Agent Loop initiated", severity: "info" });
  try { results.analyst = await runAnalystAgent(email); appendAgentLog(email, { agent: "system", action: "loop_step", message: "✅ 1/4: Analyst complete", severity: "info" }); } catch (e) { results.errors.push({ agent: "analyst", error: e.message }); appendAgentLog(email, { agent: "system", action: "loop_error", message: `❌ Analyst: ${e.message}`, severity: "high" }); }
  const findings = results.analyst?.findings || [];
  const creativeTriggers = findings.filter((f) => f.trigger_for === "creative_director").map((f) => f.trigger_message).filter(Boolean);
  const buyerTriggers = findings.filter((f) => f.trigger_for === "media_buyer").map((f) => f.trigger_message).filter(Boolean);
  try { results.creative_director = await runCreativeDirectorAgent(email, creativeTriggers.join("\n") || null); appendAgentLog(email, { agent: "system", action: "loop_step", message: `✅ 2/4: Creative Director — ${results.creative_director?.creatives?.length || 0} creatives`, severity: "info" }); } catch (e) { results.errors.push({ agent: "creative_director", error: e.message }); appendAgentLog(email, { agent: "system", action: "loop_error", message: `❌ Creative: ${e.message}`, severity: "high" }); }
  try { results.media_buyer = await runMediaBuyerAgent(email, buyerTriggers.join("\n") || null); appendAgentLog(email, { agent: "system", action: "loop_step", message: `✅ 3/4: Media Buyer — ${results.media_buyer?.actions?.length || 0} actions`, severity: "info" }); } catch (e) { results.errors.push({ agent: "media_buyer", error: e.message }); appendAgentLog(email, { agent: "system", action: "loop_error", message: `❌ Media Buyer: ${e.message}`, severity: "high" }); }
  try { results.account_manager = await runAccountManagerAgent(email); appendAgentLog(email, { agent: "system", action: "loop_step", message: "✅ 4/4: Account Manager complete", severity: "info" }); } catch (e) { results.errors.push({ agent: "account_manager", error: e.message }); appendAgentLog(email, { agent: "system", action: "loop_error", message: `❌ Account Manager: ${e.message}`, severity: "high" }); }
  appendAgentLog(email, { agent: "system", action: "loop_complete", message: `🔄 Loop done — ${4 - results.errors.length}/4 succeeded.${results.errors.length > 0 ? ` Errors: ${results.errors.map((e) => e.agent).join(", ")}` : ""}`, severity: results.errors.length > 0 ? "medium" : "info" });
  return results;
}

// ═══════════════════════════════════════════════════════════
// ─── ROUTES ───
// ═══════════════════════════════════════════════════════════

app.get("/", (req, res) => res.json({ message: "Server running 🚀", mongodb: !!mongoClient, usageSummary: !!usageSummaryCollection }));
app.post("/api/login", (req, res) => res.json({ message: "Login successful" }));

// ─── Strategy & Content from MongoDB ───
app.get("/api/strategy", async (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ error: "No auth" });
  const docs = await fetchStrategyFromMongo();
  res.json({ strategies: docs });
});

app.get("/api/content", async (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ error: "No auth" });
  const docs = await fetchContentFromMongo();
  res.json({ contentResponses: docs });
});

// ─── Company Reports & Competitor Response from MongoDB ───
app.get("/api/company-reports", async (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ error: "No auth" });
  const docs = await fetchCompanyReportsFromMongo();
  res.json({ reports: docs });
});

app.get("/api/competitor-response", async (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ error: "No auth" });
  const docs = await fetchCompetitorResponseFromMongo();
  res.json({ responses: docs });
});

// ─── KPI Projections from MongoDB ───
app.get("/api/kpi-projections", async (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ error: "No auth" });
  try {
    const docs = await fetchKpiProjectionsFromMongo();
    res.json({ projections: docs });
  } catch (err) {
    console.error("[KpiProjections] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Usage Summary endpoints ───
app.get("/api/usage-summary/stats", async (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ error: "No auth" });
  try {
    const stats = await fetchUsageSummaryStats();
    if (!stats) return res.status(503).json({ error: "usage_summary collection not found in any database" });
    res.json(stats);
  } catch (err) {
    console.error("[UsageSummary] Stats error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/usage-summary/documents", async (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ error: "No auth" });
  try {
    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;
    const result = await fetchUsageSummaryDocs(limit, skip);
    res.json(result);
  } catch (err) {
    console.error("[UsageSummary] Documents error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/usage-summary/debug", async (req, res) => {
  const info = {
    collectionFound: !!usageSummaryCollection,
    mongoConnected: !!mongoClient,
  };
  if (usageSummaryCollection) {
    try {
      const count = await usageSummaryCollection.countDocuments();
      const sample = await usageSummaryCollection.findOne({});
      info.documentCount = count;
      info.sampleDocument = sample ? serializeMongoDoc(sample) : null;
      info.sampleFields = sample ? Object.keys(sample) : [];
    } catch (err) {
      info.error = err.message;
    }
  }
  res.json(info);
});

// ─── MongoDB read-only endpoints ───
app.get("/api/mongo/databases", async (req, res) => { if (!mongoClient) return res.status(503).json({ error: "MongoDB not connected" }); try { const adminDb = mongoClient.db().admin(); const dbList = await adminDb.listDatabases(); res.json({ databases: dbList.databases }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.get("/api/mongo/:database/collections", async (req, res) => { if (!mongoClient) return res.status(503).json({ error: "MongoDB not connected" }); try { const db = mongoClient.db(req.params.database); const collections = await db.listCollections().toArray(); res.json({ collections: collections.map(c => c.name) }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.get("/api/mongo/:database/:collection", async (req, res) => { if (!mongoClient) return res.status(503).json({ error: "MongoDB not connected" }); try { const db = mongoClient.db(req.params.database); const collection = db.collection(req.params.collection); const count = await collection.countDocuments(); const docs = await collection.find({}).limit(100).toArray(); res.json({ collection: req.params.collection, count, documents: docs }); } catch (err) { res.status(500).json({ error: err.message }); } });

app.get("/api/analytics/raw", async (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const data = await fetchAnalyticsFromMongo(req.query.propertyId || null); res.json(data || { error: "No data" }); });
app.get("/api/search-console/raw", async (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const data = await fetchSearchConsoleFromMongo(req.query.siteUrl || null); res.json(data || { error: "No data" }); });

app.get("/api/config", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const email = req.query.email; if (!email) return res.status(400).json({ error: "Email required" }); const config = getUserConfig(email); if (!config) return res.status(404).json({ error: "No config" }); const safeEmail = getSafeEmail(email); const uploadedFiles = config.uploadedFiles || {}; const fileUrls = {}; for (const f of Object.keys(uploadedFiles)) fileUrls[f] = (uploadedFiles[f] || []).map((fi) => ({ originalName: fi.originalName, savedAs: fi.savedAs, size: fi.size, mimetype: fi.mimetype, url: `/api/files/${safeEmail}/${f}/${fi.savedAs}` })); const resp = { ...config, uploadedFiles: fileUrls }; if (resp.googleAds) resp.googleAds = { ...resp.googleAds, connected: !!resp.googleAds.tokens, tokens: undefined, clientSecret: undefined }; res.json(resp); });
app.patch("/api/config", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const body = req.body; if (!body.email) return res.status(400).json({ error: "Email required" }); const safeEmail = getSafeEmail(body.email); const jsonPath = path.join(__dirname, "accounts", `${safeEmail}.json`); let existing = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf-8")) : {}; const merged = { ...existing }; for (const key of Object.keys(body)) { if (key === "email") merged.email = body.email; else if (typeof body[key] === "object" && !Array.isArray(body[key]) && body[key] !== null) merged[key] = { ...(existing[key] || {}), ...body[key] }; else merged[key] = body[key]; } saveUserConfig(body.email, merged); res.json({ message: "Updated" }); });

app.get("/api/files/:email/:field/:filename", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const fp = path.join(__dirname, "uploads", getSafeEmail(req.params.email), req.params.field, req.params.filename); if (!fs.existsSync(fp)) return res.status(404).json({ error: "Not found" }); res.sendFile(fp); });
app.delete("/api/files/:email/:field/:filename", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const { email, field, filename } = req.params; const se = getSafeEmail(email); const fp = path.join(__dirname, "uploads", se, field, filename); if (!fs.existsSync(fp)) return res.status(404).json({ error: "Not found" }); fs.unlinkSync(fp); const jp = path.join(__dirname, "accounts", `${se}.json`); if (fs.existsSync(jp)) { const c = JSON.parse(fs.readFileSync(jp, "utf-8")); if (c.uploadedFiles?.[field]) { c.uploadedFiles[field] = c.uploadedFiles[field].filter((f) => f.savedAs !== filename); fs.writeFileSync(jp, JSON.stringify(c, null, 2)); } } res.json({ message: "Deleted" }); });

app.post("/api/setup", setupUpload, (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); let body; try { body = JSON.parse(req.body.data); } catch { return res.status(400).json({ error: "Invalid JSON" }); } if (!body.email) return res.status(400).json({ error: "Email required" }); const se = getSafeEmail(body.email); const ud = path.join(__dirname, "uploads", se); if (!fs.existsSync(ud)) fs.mkdirSync(ud, { recursive: true }); const fm = {}; const files = req.files || {}; for (const fn of Object.keys(files)) { fm[fn] = []; const fd = path.join(ud, fn); if (!fs.existsSync(fd)) fs.mkdirSync(fd, { recursive: true }); for (const f of files[fn]) { const dp = path.join(fd, f.filename); fs.renameSync(f.path, dp); fm[fn].push({ originalName: f.originalname, savedAs: f.filename, size: f.size, mimetype: f.mimetype, path: dp }); } } body.uploadedFiles = fm; saveUserConfig(body.email, body); res.json({ message: "Saved", filesUploaded: Object.values(fm).flat().length }); });

// ─── Google Ads ───
app.post("/api/google-ads/credentials", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const { email, clientId, clientSecret, developerToken, customerId, managerCustomerId } = req.body; const config = getUserConfig(email) || { email }; config.googleAds = { ...(config.googleAds || {}), clientId, clientSecret, developerToken, customerId, managerCustomerId, redirectUri: `http://localhost:${PORT}/api/google-ads/callback` }; saveUserConfig(email, config); res.json({ message: "Saved" }); });
app.get("/api/google-ads/auth-url", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const email = req.query.email; const config = getUserConfig(email); if (!config?.googleAds?.clientId) return res.status(400).json({ error: "Credentials not set" }); const gads = config.googleAds; const oauth2Client = createOAuth2Client(gads); const url = oauth2Client.generateAuthUrl({ access_type: "offline", prompt: "consent", scope: ["https://www.googleapis.com/auth/adwords"], state: email }); res.json({ url }); });
app.get("/api/google-ads/callback", async (req, res) => { const { code, state: email } = req.query; if (!code || !email) return res.status(400).send("Missing code or email"); const config = getUserConfig(email); if (!config) return res.status(404).send("User not found"); if (!config.googleAds) config.googleAds = {}; try { const oauth2Client = createOAuth2Client(config.googleAds); const { tokens } = await oauth2Client.getToken(code); config.googleAds.tokens = tokens; config.googleAds.connectedAt = new Date().toISOString(); saveUserConfig(email, config); appendAgentLog(email, { agent: "system", action: "google_ads_connected", message: "Google Ads connected via OAuth2.", severity: "info" }); res.send(`<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h2 style="color:#22c55e">✅ Google Ads Connected!</h2><p>Close this window and refresh.</p><script>setTimeout(()=>window.close(),2000)</script></body></html>`); } catch (err) { res.status(500).send(`<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h2 style="color:#ef4444">❌ Failed</h2><p>${err.message}</p></body></html>`); } });
app.get("/api/google-ads/status", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const config = getUserConfig(req.query.email); const g = config?.googleAds || {}; res.json({ credentialsSet: !!(g.clientId && g.clientSecret && g.developerToken), connected: !!g.tokens?.access_token, customerId: g.customerId || null, connectedAt: g.connectedAt || null }); });
app.post("/api/google-ads/disconnect", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const config = getUserConfig(req.body.email); if (config?.googleAds) { delete config.googleAds.tokens; delete config.googleAds.connectedAt; saveUserConfig(req.body.email, config); } res.json({ message: "Disconnected" }); });
app.get("/api/google-ads/debug", async (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const config = getUserConfig(req.query.email); const g = config?.googleAds || {}; let mongoStatus = { connected: !!mongoDb }; if (mongoDb) { const analyticsCount = await mongoDb.collection("analyticsreports").countDocuments(); const searchCount = await mongoDb.collection("searchconsolereports").countDocuments(); const googleAdsCount = await mongoDb.collection("googleadsreports").countDocuments(); mongoStatus = { connected: true, analyticsreports: analyticsCount, searchconsolereports: searchCount, googleadsreports: googleAdsCount }; } res.json({ email: req.query.email, dataSource: "mongodb", mongodb: mongoStatus, googleAds: { hasClientId: !!g.clientId, hasClientSecret: !!g.clientSecret, hasDeveloperToken: !!g.developerToken, customerId: g.customerId || null, managerCustomerId: g.managerCustomerId || null, hasAccessToken: !!g.tokens?.access_token, hasRefreshToken: !!g.tokens?.refresh_token, connectedAt: g.connectedAt || null } }); });
app.get("/api/google-ads/analytics", async (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const email = req.query.email; if (!email) return res.status(400).json({ error: "Email required" }); try { const data = await getAnalyticsForUser(email, req.query.dateRange); res.json(data); } catch (err) { res.status(500).json({ error: err.message }); } });
app.get("/api/google-ads/campaigns", async (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const email = req.query.email; if (!email) return res.status(400).json({ error: "Email required" }); try { const data = await getAnalyticsForUser(email, req.query.dateRange); res.json({ campaigns: data.campaigns }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post("/api/google-ads/campaigns", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const { email, name, budgetAmountMicros } = req.body; appendAgentLog(email, { agent: "media_buyer", action: "campaign_created", message: `Created "${name}" — $${((budgetAmountMicros || 50000000) / 1000000).toFixed(2)}/day`, severity: "info" }); res.json({ message: "Created", result: { id: `c_${Date.now()}` } }); });
app.patch("/api/google-ads/campaigns/:campaignId", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); appendAgentLog(req.body.email, { agent: "media_buyer", action: "campaign_status_changed", message: `Campaign ${req.params.campaignId} → ${req.body.status}`, severity: "info" }); res.json({ message: "Updated" }); });
app.get("/api/google-ads/ads", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); res.json({ ads: [] }); });

// ─── Company ───
app.get("/api/company", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const config = getUserConfig(req.query.email); res.json({ company: config?.company || {} }); });
app.patch("/api/company", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const { email, ...cd } = req.body; if (!email) return res.status(400).json({ error: "Email required" }); const config = getUserConfig(email) || { email }; config.company = { ...(config.company || {}), ...cd }; saveUserConfig(email, config); res.json({ message: "Saved" }); });

// ─── Agent Endpoints ───
app.get("/api/agents/logs", (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); const email = req.query.email; if (!email) return res.status(400).json({ error: "Email required" }); let logs = getAgentLogs(email); if (req.query.agent) logs = logs.filter((l) => l.agent === req.query.agent); res.json({ logs }); });
app.post("/api/agents/analyst/scan", async (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); try { res.json(await runAnalystAgent(req.body.email)); } catch (e) { appendAgentLog(req.body.email, { agent: "analyst", action: "error", message: e.message, severity: "high" }); res.status(500).json({ error: e.message }); } });
app.post("/api/agents/creative-director/generate", async (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); try { res.json(await runCreativeDirectorAgent(req.body.email, req.body.trigger || null)); } catch (e) { appendAgentLog(req.body.email, { agent: "creative_director", action: "error", message: e.message, severity: "high" }); res.status(500).json({ error: e.message }); } });
app.post("/api/agents/media-buyer/optimize", async (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); try { res.json(await runMediaBuyerAgent(req.body.email, req.body.trigger || null)); } catch (e) { appendAgentLog(req.body.email, { agent: "media_buyer", action: "error", message: e.message, severity: "high" }); res.status(500).json({ error: e.message }); } });
app.post("/api/agents/account-manager/report", async (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); try { res.json(await runAccountManagerAgent(req.body.email)); } catch (e) { appendAgentLog(req.body.email, { agent: "account_manager", action: "error", message: e.message, severity: "high" }); res.status(500).json({ error: e.message }); } });
app.post("/api/agents/loop", async (req, res) => { if (!req.headers.authorization) return res.status(401).json({ error: "No auth" }); try { res.json(await runFullAgentLoop(req.body.email)); } catch (e) { appendAgentLog(req.body.email, { agent: "system", action: "loop_error", message: e.message, severity: "high" }); res.status(500).json({ error: e.message }); } });

app.listen(PORT, async () => { console.log(`\n🚀 Server running on http://localhost:${PORT}`); console.log(`   Google Ads API version: ${GOOGLE_ADS_API_VERSION}\n`); await connectMongo(); });