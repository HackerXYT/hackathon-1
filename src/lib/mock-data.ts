// Mock data — only agent statuses are used as fallback when real data isn't available

export const mockAgentStatuses = {
  analyst: { status: "active" as const, lastAction: "Scanning ad performance data", uptime: "99.8%" },
  creative: { status: "active" as const, lastAction: "Generating new ad variations", uptime: "99.5%" },
  mediaBuyer: { status: "active" as const, lastAction: "Optimizing bid strategies", uptime: "99.9%" },
  accountManager: { status: "active" as const, lastAction: "Compiled weekly report", uptime: "99.7%" },
};