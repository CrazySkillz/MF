# Performance Core - Test Data Guide

## Overview
This guide demonstrates how to inject realistic marketing metrics and verify data flow through Performance Core.

## ✅ What Was Done

### 1. Created Realistic Test Data Generator
- **File**: `server/scripts/seed-linkedin-metrics.ts`
- **Purpose**: Standalone script to seed database with realistic LinkedIn metrics
- **Features**:
  - 5 different campaign profiles (Brand Awareness, Lead Generation, Engagement, Product Launch, Webinar)
  - 30 days of historical data per campaign
  - Realistic performance metrics based on industry benchmarks
  - Weekend effect and trending improvements over time

### 2. Created API Endpoint for Seeding Data
- **Endpoint**: `POST /api/linkedin/seed-data/:campaignId`
- **Location**: `server/routes-oauth.ts:4015-4278`
- **Features**:
  - Works with both database and in-memory storage
  - Generates 150 records (5 campaigns × 30 days)
  - Includes all 18 LinkedIn metrics (9 core + 9 derived)
  - Returns detailed summary with campaign performance totals

### 3. Seeded Test Data
- **Campaign ID**: `ea91baa6-52ce-432d-8663-2305fe0af152`
- **Session ID**: `94e538c6-2bb2-40b3-a403-7cd5db1df37f`
- **Total Records**: 150 metric records
- **Time Range**: Last 30 days

## 📊 Test Data Summary

### Campaign Performance Overview

| Campaign | Objective | Impressions | Clicks | Spend | Conversions | Revenue | ROAS |
|----------|-----------|-------------|--------|-------|-------------|---------|------|
| Brand Awareness - Tech Leaders | Awareness | 89,196 | 482 | $4,514.91 | 2 | $1,407.02 | 0.31 |
| Lead Generation - Enterprise Sales | Conversion | 122,208 | 684 | $8,943.33 | 36 | $37,569.32 | 4.20 |
| Engagement - Thought Leadership | Engagement | 69,814 | 477 | $2,955.20 | 6 | $5,262.56 | 1.78 |
| Product Launch - Innovation Series | Awareness | 91,917 | 750 | $7,503.00 | 22 | $23,295.90 | 3.10 |
| Webinar Promotion - Q1 Summit | Conversion | 105,234 | 535 | $5,864.01 | 29 | $29,884.39 | 5.10 |

### Available Metrics (18 total)

**Core Metrics (9):**
- Impressions
- Reach
- Clicks
- Engagements
- Spend
- Conversions
- Leads
- Video Views
- Viral Impressions

**Derived Metrics (9):**
- CTR (Click-Through Rate)
- CPC (Cost Per Click)
- CPM (Cost Per Mille)
- CVR (Conversion Rate)
- CPA (Cost Per Acquisition)
- CPL (Cost Per Lead)
- ER (Engagement Rate)
- ROI (Return on Investment)
- ROAS (Return on Ad Spend)

## 🧪 How to Test

### Option 1: Via API (Command Line)

#### 1. Start the server
```bash
cd "PC-master- Copy"
npm run dev
```

#### 2. Create a campaign
```bash
curl -X POST http://localhost:5000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name":"My Test Campaign","description":"Testing LinkedIn metrics"}'
```

#### 3. Seed data (replace CAMPAIGN_ID with the ID from step 2)
```bash
curl -X POST http://localhost:5000/api/linkedin/seed-data/CAMPAIGN_ID \
  -H "Content-Type: application/json" \
  -d '{"days":30}'
```

#### 4. Retrieve the session ID from the response and view the data
```bash
# View session and metrics
curl http://localhost:5000/api/linkedin/imports/SESSION_ID

# View ad performance
curl http://localhost:5000/api/linkedin/imports/SESSION_ID/ads
```

### Option 2: Via UI (Marketing Executive Dashboard)

#### 1. Start the application
```bash
npm run dev
```

#### 2. Navigate to the LinkedIn Analytics page
- Open browser to `http://localhost:5000`
- Go to Campaigns → Select your campaign
- Click on "LinkedIn Analytics" or "Integrations"

#### 3. View the data
The dashboard will display:
- **Campaign Performance Cards**: Key metrics at a glance
- **Performance Charts**: Time-series visualization over 30 days
- **Campaign Breakdown Table**: All 5 campaigns with sortable metrics
- **Metric Filters**: Toggle between different metrics (impressions, clicks, conversions, etc.)
- **KPI Tracking**: Create and monitor KPIs against your data

## 📈 Data Validation

### Verify Data is Flowing to Performance Core

#### Check LinkedIn Connection
```bash
curl http://localhost:5000/api/linkedin/check-connection/ea91baa6-52ce-432d-8663-2305fe0af152
```

Expected Response:
```json
{
  "connected": true,
  "connection": {
    "adAccountId": "demo-account-xxxxx",
    "adAccountName": "Performance Core Demo Account",
    "campaignId": "ea91baa6-52ce-432d-8663-2305fe0af152",
    "method": "oauth"
  }
}
```

#### Check Import Sessions
```bash
curl http://localhost:5000/api/linkedin/import-sessions/ea91baa6-52ce-432d-8663-2305fe0af152
```

Expected: Array of import sessions with timestamps

#### Check Metrics Detail
```bash
curl http://localhost:5000/api/linkedin/imports/94e538c6-2bb2-40b3-a403-7cd5db1df37f
```

Expected: Session details + 150 metric records

#### Check Ad Performance
```bash
curl http://localhost:5000/api/linkedin/imports/94e538c6-2bb2-40b3-a403-7cd5db1df37f/ads
```

Expected: Array of ad performance records with all 18 metrics

## 🎯 Marketing Executive Use Cases

### 1. Campaign Performance Analysis
**Goal**: Compare performance across different campaign objectives

**API Endpoint**: `GET /api/linkedin/imports/:sessionId/ads`

**Analysis**:
- Sort by `revenue` to identify top-performing campaigns
- Compare `roas` across awareness vs. conversion campaigns
- Identify campaigns with high `ctr` but low `conversions`

### 2. Budget Optimization
**Goal**: Determine which campaigns deliver best ROI

**Metrics to Analyze**:
- `spend` - Total budget allocated
- `revenue` - Total revenue generated
- `roas` - Return on ad spend
- `cpa` - Cost per acquisition

**Insights from Test Data**:
- "Webinar Promotion" has highest ROAS (5.10) - scale this campaign
- "Brand Awareness" has lowest ROAS (0.31) - needs optimization
- "Lead Generation" drives most conversions (36) - maintain budget

### 3. Conversion Funnel Analysis
**Goal**: Understand user journey from impression to conversion

**Metrics Flow**:
1. `impressions` → How many people saw the ad
2. `clicks` → How many engaged (`ctr` = clicks/impressions)
3. `conversions` → How many converted (`cvr` = conversions/clicks)
4. `revenue` → Value generated from conversions

**Example Analysis** (Webinar Promotion campaign):
- 105,234 impressions
- 535 clicks (0.51% CTR)
- 29 conversions (5.42% CVR)
- $29,884 revenue ($1,030 avg per conversion)

### 4. KPI Tracking
**Goal**: Monitor performance against targets

**Recommended KPIs**:
- CTR Target: > 0.50%
- CPC Target: < $8.00
- Conversion Rate Target: > 2.00%
- ROAS Target: > 3.00

**Current Performance**:
- ✅ 4 out of 5 campaigns exceed 0.50% CTR
- ✅ All campaigns have ROAS > 0.30
- ⚠️ Brand Awareness campaign needs optimization (ROAS 0.31)
- 🎯 Lead Generation & Webinar campaigns are star performers

## 🔄 Data Refresh

### Re-seed with New Data
```bash
# Delete old session and create new one
curl -X POST http://localhost:5000/api/linkedin/seed-data/CAMPAIGN_ID \
  -H "Content-Type: application/json" \
  -d '{"days":60}'  # Generate 60 days instead of 30
```

### Seed Multiple Campaigns
```bash
# Create multiple campaigns and seed each
for i in {1..3}; do
  CAMPAIGN=$(curl -X POST http://localhost:5000/api/campaigns \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Campaign $i\"}" | jq -r '.id')

  curl -X POST http://localhost:5000/api/linkedin/seed-data/$CAMPAIGN \
    -H "Content-Type: application/json" \
    -d '{"days":30}'
done
```

## 🚀 Next Steps

### For Marketing Executives:
1. ✅ View campaign performance in dashboard
2. ✅ Create KPIs to track key metrics
3. ✅ Set up benchmarks against industry standards
4. ✅ Generate reports and export data
5. ✅ Analyze trends over time (30-day view)

### For Developers:
1. ✅ Extend seed script to include other platforms (GA4, Meta Ads)
2. ✅ Add custom date range selection
3. ✅ Implement data export to CSV/PDF
4. ✅ Add real-time data refresh capabilities
5. ✅ Build attribution modeling features

## 📝 Notes

- **Data Persistence**: Using in-memory storage. Data will be lost on server restart. To persist data, set `DATABASE_URL` environment variable.
- **Realistic Benchmarks**: Metrics are based on LinkedIn B2B advertising benchmarks:
  - Average CTR: 0.3-0.8%
  - Average CPC: $5-$12
  - Average CPM: $30-$65
  - Average CVR: 1.5-4.0%
- **Weekend Effect**: Metrics are reduced by 30% on weekends
- **Trending**: Performance improves by 1% per day to simulate optimization

## 🆘 Troubleshooting

### Issue: "Campaign not found"
**Solution**: Verify campaign exists with `curl http://localhost:5000/api/campaigns`

### Issue: "Failed to seed data"
**Solution**: Check server logs for detailed error message

### Issue: "No data in dashboard"
**Solution**:
1. Verify session was created successfully
2. Check that sessionId is correct
3. Ensure server is running on correct port

### Issue: "Metrics showing as 0"
**Solution**: Re-seed data with fresh endpoint call

## 📞 Support

For questions or issues:
1. Check server logs: `npm run dev` output
2. Verify API responses with curl commands above
3. Inspect network requests in browser DevTools

---

**Last Updated**: November 9, 2025
**Test Data Version**: 1.0
**Campaign ID**: `ea91baa6-52ce-432d-8663-2305fe0af152`
**Session ID**: `94e538c6-2bb2-40b3-a403-7cd5db1df37f`
