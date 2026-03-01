# API Documentation

## 📋 Table of Contents
1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Base URL & Headers](#base-url--headers)
4. [Response Format](#response-format)
5. [Error Handling](#error-handling)
6. [Endpoints](#endpoints)
7. [Rate Limiting](#rate-limiting)
8. [Pagination](#pagination)

---

## 🔍 API Overview

The AI Marketing Loop API provides RESTful endpoints for managing marketing data, campaigns, analytics, and AI-powered insights. All requests and responses use JSON format.

**API Version**: 1.0.0  
**Base URL**: `http://localhost:3000/api` (development)  
**Protocol**: HTTP/HTTPS

---

## 🔐 Authentication

### JWT Bearer Token Authentication

All protected endpoints require a Bearer token in the Authorization header.

#### Authentication Endpoints

##### Login
```
POST /auth/login

Request:
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response (200 OK):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin"
  }
}
```

##### Register
```
POST /auth/register

Request:
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201 Created):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "newuser@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

##### Refresh Token
```
POST /auth/refresh

Request:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200 OK):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### Logout
```
POST /auth/logout

Headers:
Authorization: Bearer {accessToken}

Response (200 OK):
{
  "message": "Logged out successfully"
}
```

##### Get Current User
```
GET /auth/me

Headers:
Authorization: Bearer {accessToken}

Response (200 OK):
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "admin",
  "createdAt": "2024-01-15T10:30:00Z",
  "lastLogin": "2024-03-01T14:22:00Z"
}
```

---

## 📝 Base URL & Headers

### Standard Headers
```
Content-Type: application/json
Authorization: Bearer {accessToken}
X-API-Version: 1.0
```

### Example Request
```bash
curl -X GET http://localhost:3000/api/companies \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

## 📦 Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response payload
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

---

## ❌ Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET/PUT request |
| 201 | Created | Successful POST request |
| 204 | No Content | Successful DELETE request |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (unique constraint) |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Error Response Examples

#### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "budget",
        "message": "Budget must be a positive number"
      }
    ]
  }
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Access token is missing or invalid"
  }
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Company not found"
  }
}
```

---

## 🔗 Endpoints

### Companies

#### List Companies
```
GET /companies

Headers:
Authorization: Bearer {token}

Query Parameters:
- limit: integer (default: 10, max: 100)
- offset: integer (default: 0)
- sort: string (default: -createdAt)

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Acme Corporation",
      "industry": "Technology",
      "website": "https://acme.com",
      "description": "Leading tech company",
      "logo": "https://cdn.example.com/logo.png",
      "budget": 50000,
      "currency": "USD",
      "targetAudience": {
        "ageRange": "25-45",
        "interests": ["technology", "startups"],
        "location": "United States"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-02-20T14:15:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0
  }
}
```

#### Get Single Company
```
GET /companies/{id}

Headers:
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Acme Corporation",
    "industry": "Technology",
    "website": "https://acme.com",
    "description": "Leading tech company",
    "logo": "https://cdn.example.com/logo.png",
    "budget": 50000,
    "currency": "USD",
    "targetAudience": {
      "ageRange": "25-45",
      "interests": ["technology", "startups"],
      "location": "United States"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-02-20T14:15:00Z"
  }
}
```

#### Create Company
```
POST /companies

Headers:
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "Acme Corporation",
  "industry": "Technology",
  "website": "https://acme.com",
  "description": "Leading tech company",
  "budget": 50000,
  "currency": "USD",
  "targetAudience": {
    "ageRange": "25-45",
    "interests": ["technology", "startups"],
    "location": "United States"
  }
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Acme Corporation",
    // ... rest of data
  }
}
```

#### Update Company
```
PUT /companies/{id}

Headers:
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "Acme Corporation Updated",
  "budget": 75000
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Acme Corporation Updated",
    // ... rest of data
  }
}
```

#### Delete Company
```
DELETE /companies/{id}

Headers:
Authorization: Bearer {token}

Response (204 No Content):
```

---

### Campaigns

#### List Campaigns
```
GET /campaigns

Query Parameters:
- companyId: string (optional)
- status: string (draft|active|paused|completed)
- platform: string (google|facebook|linkedin|tiktok)
- limit: integer
- offset: integer

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "companyId": "507f1f77bcf86cd799439011",
      "name": "Summer Campaign 2024",
      "description": "Q3 marketing campaign",
      "status": "active",
      "platform": "google",
      "budget": 10000,
      "startDate": "2024-06-01T00:00:00Z",
      "endDate": "2024-08-31T23:59:59Z",
      "metrics": {
        "impressions": 1500000,
        "clicks": 45000,
        "conversions": 1350,
        "spend": 8500,
        "roas": 2.5
      },
      "createdAt": "2024-05-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 10,
    "offset": 0
  }
}
```

#### Create Campaign
```
POST /campaigns

Request Body:
{
  "companyId": "507f1f77bcf86cd799439011",
  "name": "Summer Campaign 2024",
  "description": "Q3 marketing campaign",
  "platform": "google",
  "budget": 10000,
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-08-31T23:59:59Z"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    // ... campaign data
  }
}
```

#### Update Campaign Status
```
PATCH /campaigns/{id}/status

Request Body:
{
  "status": "paused"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "status": "paused",
    // ... rest of campaign data
  }
}
```

---

### Analytics

#### Get Dashboard Metrics
```
GET /analytics/dashboard

Query Parameters:
- companyId: string (required)
- startDate: ISO8601 date
- endDate: ISO8601 date

Response (200 OK):
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 125000,
      "conversions": 3250,
      "conversionRate": 3.2,
      "roas": 2.8,
      "cpa": 45.50
    },
    "topCampaigns": [
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "Summer Campaign",
        "metrics": {
          "spend": 25000,
          "revenue": 62500,
          "roas": 2.5
        }
      }
    ],
    "trends": {
      "daily": [
        {
          "date": "2024-02-01",
          "revenue": 4000,
          "conversions": 125
        }
      ]
    }
  }
}
```

#### Get Campaign Analytics
```
GET /analytics/campaigns/{campaignId}

Query Parameters:
- startDate: ISO8601 date
- endDate: ISO8601 date
- granularity: day|week|month

Response (200 OK):
{
  "success": true,
  "data": {
    "campaign": {
      "id": "507f1f77bcf86cd799439012",
      "name": "Summer Campaign"
    },
    "metrics": {
      "impressions": 1500000,
      "clicks": 45000,
      "ctr": 3.0,
      "conversions": 1350,
      "conversionRate": 3.0,
      "spend": 8500,
      "revenue": 21250,
      "roas": 2.5,
      "cpc": 0.19,
      "cpa": 6.30
    },
    "daily": [
      {
        "date": "2024-06-01",
        "impressions": 50000,
        "clicks": 1500,
        "conversions": 45
      }
    ]
  }
}
```

---

### Strategy

#### Generate Strategy
```
POST /strategy/generate

Headers:
Authorization: Bearer {token}

Request Body:
{
  "companyId": "507f1f77bcf86cd799439011"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "607f1f77bcf86cd799439020",
    "companyId": "507f1f77bcf86cd799439011",
    "generatedAt": "2024-03-01T10:30:00Z",
    "recommendations": [
      {
        "id": "rec_1",
        "action": "Increase Google Ads Budget",
        "rationale": "High ROAS from Google Ads campaigns",
        "priority": "high",
        "category": "budget_allocation",
        "dataSource": "campaign_analytics",
        "expectedImpact": {
          "metric": "revenue",
          "value": 25000,
          "timeframe": "30_days"
        }
      },
      {
        "id": "rec_2",
        "action": "Launch Competitor Survey",
        "rationale": "Limited competitor tracking data",
        "priority": "medium",
        "category": "research",
        "dataSource": "competitor_intelligence"
      }
    ],
    "marketAnalysis": {
      "opportunities": ["expansion_into_seo", "video_marketing"],
      "threats": ["increased_cpc", "competitive_pressure"]
    },
    "competitorInsights": [
      {
        "competitor": "CompetitorX",
        "strength": "Strong social media presence",
        "weakness": "Limited email marketing"
      }
    ]
  }
}
```

#### List Strategy History
```
GET /strategy/history

Query Parameters:
- companyId: string (required)
- limit: integer
- offset: integer

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "607f1f77bcf86cd799439020",
      "companyId": "507f1f77bcf86cd799439011",
      "generatedAt": "2024-03-01T10:30:00Z",
      "recommendationCount": 12
    }
  ]
}
```

---

### Competitor Intelligence

#### Get Competitor Analysis
```
GET /competitor/analysis

Query Parameters:
- companyId: string (required)

Response (200 OK):
{
  "success": true,
  "data": {
    "competitors": [
      {
        "id": "507f1f77bcf86cd799439013",
        "name": "CompetitorX",
        "website": "https://competitorx.com",
        "analysis": {
          "seoScore": 78,
          "domainAuthority": 52,
          "estimatedMonthlyTraffic": 150000,
          "backlinks": 3500,
          "topKeywords": ["marketing software", "analytics platform"],
          "contentQuality": "high"
        },
        "strengths": [
          "Strong social media",
          "High domain authority"
        ],
        "weaknesses": [
          "Limited partnerships",
          "Slower load time"
        ]
      }
    ]
  }
}
```

#### Add Competitor
```
POST /competitor/add

Request Body:
{
  "companyId": "507f1f77bcf86cd799439011",
  "name": "CompetitorX",
  "website": "https://competitorx.com"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "name": "CompetitorX",
    "website": "https://competitorx.com"
  }
}
```

---

### Content Library

#### List Content Assets
```
GET /content/library

Query Parameters:
- companyId: string (required)
- category: string (logos|fonts|images|guides)
- limit: integer
- offset: integer

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439014",
      "name": "Primary Logo",
      "category": "logos",
      "fileUrl": "https://cdn.example.com/logo.png",
      "fileSize": 45600,
      "mimeType": "image/png",
      "uploadedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Upload Content Asset
```
POST /content/upload

Headers:
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- file: File
- companyId: string
- category: string

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "name": "Primary Logo",
    "fileUrl": "https://cdn.example.com/logo.png"
  }
}
```

#### Get Content Recommendations
```
GET /content/recommendations

Query Parameters:
- companyId: string (required)

Response (200 OK):
{
  "success": true,
  "data": {
    "contentIdeas": [
      {
        "id": "idea_1",
        "title": "Top 10 Marketing Trends 2024",
        "description": "Blog post about emerging marketing trends",
        "format": "blog_post",
        "estimatedLength": 2500,
        "recommendedPublishDate": "2024-03-15"
      }
    ]
  }
}
```

---

### Reports

#### List Reports
```
GET /reports

Query Parameters:
- companyId: string (required)
- type: string (campaign|financial|traffic|custom)
- limit: integer
- offset: integer

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439015",
      "name": "February Marketing Report",
      "type": "financial",
      "createdAt": "2024-02-28T23:59:59Z",
      "dateRange": {
        "startDate": "2024-02-01",
        "endDate": "2024-02-29"
      },
      "metrics": {
        "revenue": 85000,
        "spend": 25000,
        "roi": 3.4
      }
    }
  ]
}
```

#### Generate Report
```
POST /reports/generate

Request Body:
{
  "companyId": "507f1f77bcf86cd799439011",
  "type": "financial",
  "startDate": "2024-02-01",
  "endDate": "2024-02-29",
  "includeMetrics": ["revenue", "spend", "roi", "conversions"]
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439015",
    "name": "February Marketing Report",
    "url": "https://api.example.com/reports/507f1f77bcf86cd799439015"
  }
}
```

#### Export Report
```
POST /reports/{id}/export

Query Parameters:
- format: pdf|excel|csv

Response (200 OK):
File download
```

---

## 🚦 Rate Limiting

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1704067200
```

### Rate Limit Tiers

| Tier | Requests/Hour | Requests/Day |
|------|---------------|-------------|
| Free | 100 | 1,000 |
| Pro | 1,000 | 10,000 |
| Enterprise | Unlimited | Unlimited |

### Rate Limit Error
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Retry after 3600 seconds"
  }
}
```

---

## 📄 Pagination

### Pagination Parameters
```
GET /companies?limit=20&offset=40

Response includes:
{
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 40,
    "hasMore": true
  }
}
```

### Pagination Defaults
- Default limit: 10
- Maximum limit: 100
- Default offset: 0

---

## 📖 Example API Client (JavaScript)

```javascript
class MarketingLoopAPI {
  constructor(baseURL, accessToken) {
    this.baseURL = baseURL;
    this.accessToken = accessToken;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  // Authentication
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Companies
  async getCompanies(limit = 10, offset = 0) {
    return this.request(`/companies?limit=${limit}&offset=${offset}`);
  }

  async getCompany(id) {
    return this.request(`/companies/${id}`);
  }

  async createCompany(data) {
    return this.request('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Campaigns
  async getCampaigns(companyId) {
    return this.request(`/campaigns?companyId=${companyId}`);
  }

  async createCampaign(data) {
    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Analytics
  async getDashboardMetrics(companyId, startDate, endDate) {
    return this.request(
      `/analytics/dashboard?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  // Strategy
  async generateStrategy(companyId) {
    return this.request('/strategy/generate', {
      method: 'POST',
      body: JSON.stringify({ companyId }),
    });
  }
}

// Usage Example
const api = new MarketingLoopAPI(
  'http://localhost:3000/api',
  localStorage.getItem('accessToken')
);

// Get companies
const { data: companies } = await api.getCompanies();
console.log(companies);

// Create a campaign
const campaign = await api.createCampaign({
  companyId: 'company_id',
  name: 'Q1 Campaign',
  budget: 10000,
  platform: 'google',
});
```

---

**Last Updated**: March 2026
