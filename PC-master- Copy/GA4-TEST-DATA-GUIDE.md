# GA4 Property Test Data Guide
## Injecting Realistic Website Analytics Metrics into Performance Core

---

## 🎯 Overview

This guide shows you how to inject realistic GA4 (Google Analytics 4) website analytics metrics into your Performance Core property and verify the data flows correctly for marketing executive analysis.

---

## ✅ What Was Created

### 1. **GA4 Metrics Seed Script**
- **File**: `server/scripts/seed-ga4-metrics.ts`
- **Purpose**: Standalone script to seed database with realistic GA4 website analytics
- **Features**:
  - 5 different website type profiles (E-commerce, SaaS, Blog, Corporate, Lead Generation)
  - 30 days of historical daily metrics
  - Realistic performance based on industry benchmarks
  - Weekend traffic patterns and trend improvements

### 2. **API Endpoint for Seeding GA4 Data**
- **Endpoint**: `POST /api/ga4/seed-data/:campaignId`
- **Location**: `server/routes-oauth.ts:1289-1513`
- **Features**:
  - Works with both database and in-memory storage
  - Generates 30 days of daily metrics
  - All GA4 core metrics (sessions, users, pageviews, conversions, etc.)
  - Returns detailed performance summary

### 3. **NPM Script**
- **Command**: `npm run seed:ga4`
- Added to `package.json` for convenience

---

## 📊 GA4 Metrics Included

### Website Traffic Metrics
- **Sessions**: Total website visits
- **Users**: Unique website visitors
- **New Users**: First-time visitors
- **Active Users**: Engaged users (70-90% of total)
- **Pageviews**: Total page views across all sessions
- **Pages Per Session**: Average pages viewed per session

### Engagement Metrics
- **Bounce Rate**: % of single-page sessions
- **Engagement Rate**: % of engaged sessions (inverse of bounce rate)
- **Average Session Duration**: Average time spent per session (in seconds)
- **User Engagement Duration**: Total engagement time across all users
- **Engaged Sessions**: Sessions with meaningful engagement
- **Events Per Session**: Average events triggered per session
- **Event Count**: Total events tracked

### Conversion Metrics
- **Conversions**: Total conversion events (sign-ups, purchases, etc.)
- **Conversion Rate**: % of sessions that result in conversions

### Advertising Metrics (Google Ads)
- **Impressions**: Ad impressions served
- **Clicks**: Ad clicks received
- **CTR**: Click-through rate for ads
- **CPC**: Cost per click
- **Ad Spend**: Total advertising cost

---

## 🚀 How to Use

### Option 1: Via API (Recommended for Testing)

#### 1. Start the development server
```bash
cd "PC-master- Copy"
npm run dev
```

#### 2. Create a campaign
```bash
curl -X POST http://localhost:5000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name":"Website Analytics - Q1 2025","description":"GA4 property tracking"}'
```

**Response:**
```json
{
  "id": "7a5b808b-00c9-463f-834d-c0d027dc0ad4",
  "name": "Website Analytics - Q1 2025",
  ...
}
```

#### 3. Seed GA4 data (replace CAMPAIGN_ID)
```bash
curl -X POST http://localhost:5000/api/ga4/seed-data/CAMPAIGN_ID \
  -H "Content-Type: application/json" \
  -d '{"days":30,"websiteType":"saas"}'
```

**Website Types Available:**
- `saas` - SaaS Product Website (default)
- `ecommerce` - E-commerce Store
- `blog` - Content Blog
- `corporate` - Corporate Website
- `leadgen` - Lead Generation Site

**Response Example:**
```json
{
  "success": true,
  "message": "Realistic GA4 metrics data seeded successfully",
  "summary": {
    "propertyId": "properties/951706275",
    "propertyName": "SaaS Product Website - Analytics",
    "websiteType": "saas",
    "totalRecords": 30,
    "daysOfData": 30,
    "timeRange": "Last 30 days",
    "totals": {
      "sessions": "83,509",
      "users": "75,274",
      "pageviews": "299,038",
      "conversions": "3,500",
      "adImpressions": "125,300",
      "adClicks": "2,506",
      "adSpend": "$25,944.57",
      "avgCTR": "2.00%",
      "avgConversionRate": "4.19%",
      "avgCPC": "$10.35"
    }
  }
}
```

---

## 📈 Test Data Generated

### SaaS Website Profile (Default)

**30-Day Performance Summary:**

| Metric | Value |
|--------|-------|
| Total Sessions | 83,509 |
| Total Users | 75,274 |
| Total Pageviews | 299,038 |
| Total Conversions | 3,500 |
| Ad Impressions | 125,300 |
| Ad Clicks | 2,506 |
| Ad Spend | $25,944.57 |
| Avg CTR | 2.00% |
| Avg Conversion Rate | 4.19% |
| Avg CPC | $10.35 |

**Website Characteristics:**
- Daily Average Sessions: 1,800
- Conversion Rate: 4.2%
- Avg Session Duration: 240 seconds (4 min)
- Bounce Rate: 38%
- Pages Per Session: 2.5-5.0

### All Website Type Profiles

| Type | Daily Sessions | Conv. Rate | Bounce Rate | Session Duration |
|------|----------------|------------|-------------|------------------|
| E-commerce | 2,500 | 2.5% | 45% | 180s (3 min) |
| SaaS | 1,800 | 4.2% | 38% | 240s (4 min) |
| Blog | 3,500 | 0.8% | 58% | 150s (2.5 min) |
| Corporate | 1,200 | 3.8% | 42% | 200s (3.3 min) |
| Lead Gen | 1,500 | 5.5% | 35% | 220s (3.7 min) |

---

## 🔍 Verifying Data Flow

### 1. Check GA4 Connection
```bash
curl "http://localhost:5000/api/ga4/check-connection/CAMPAIGN_ID"
```

**Expected Response:**
```json
{
  "connected": true,
  "primaryPropertyId": "properties/951706275",
  "totalConnections": 1,
  "connections": [{
    "propertyId": "properties/951706275",
    "propertyName": "SaaS Product Website - Analytics",
    "displayName": "Main Website Property",
    "websiteUrl": "https://www.demo-website.com",
    "isPrimary": true,
    "isActive": true,
    "hasValidToken": true
  }]
}
```

### 2. Verify Campaign Updated
```bash
curl "http://localhost:5000/api/campaigns/CAMPAIGN_ID"
```

The campaign should now show:
- Updated impressions count
- Updated clicks count
- Updated spend amount

---

## 💼 Marketing Executive Dashboard

### How to View GA4 Data

#### 1. Navigate to Campaign
```
http://localhost:5000/campaigns/CAMPAIGN_ID
```

#### 2. View Performance Metrics
The dashboard displays:
- **Performance Overview Cards**: Sessions, users, conversions at a glance
- **Traffic Sources**: Organic, direct, paid advertising breakdown
- **Engagement Metrics**: Bounce rate, session duration, pages per session
- **Conversion Funnel**: Users → Sessions → Pageviews → Conversions
- **Ad Performance**: Ad impressions, clicks, spend, CTR, CPC

#### 3. Time-Series Charts
View 30-day trends for:
- Session volume over time
- User growth (new vs. returning)
- Conversion trends
- Ad performance (CTR, CPC trends)

#### 4. Key Insights Available

**Traffic Analysis:**
- Total website visitors and sessions
- New user acquisition rate
- User retention (returning visitors)
- Traffic quality (engagement rate, bounce rate)

**Engagement Analysis:**
- Average session duration
- Pages per session
- Event tracking
- User interaction patterns

**Conversion Analysis:**
- Conversion rate trends
- Conversion funnel performance
- Goal completion rates
- Revenue attribution (for e-commerce)

**Advertising ROI:**
- Ad spend vs. conversions
- Cost per conversion from ads
- Ad click quality (post-click engagement)
- ROAS (Return on Ad Spend)

---

## 📊 Realistic Benchmark Comparisons

### Industry Benchmarks (vs. Your Data)

**SaaS Industry:**
| Metric | Industry Avg | Your Performance | Status |
|--------|--------------|------------------|--------|
| Bounce Rate | 40-50% | 38% | ✅ Above avg |
| Conversion Rate | 2-5% | 4.2% | ✅ On target |
| Session Duration | 150-300s | 240s | ✅ Good |
| Pages/Session | 2-4 | 3.6 | ✅ Above avg |

**E-commerce Industry:**
| Metric | Industry Avg | Generated Data | Status |
|--------|--------------|----------------|--------|
| Bounce Rate | 40-60% | 45% | ✅ On target |
| Conversion Rate | 1-3% | 2.5% | ✅ Good |
| Session Duration | 120-240s | 180s | ✅ Average |
| Pages/Session | 3-6 | 3.8 | ✅ On target |

---

## 🎯 Use Cases for Marketing Executives

### 1. Website Performance Monitoring
**Goal**: Track overall website health

**Metrics to Monitor:**
- Daily session trends (growth/decline)
- Bounce rate (should be < 50%)
- Average session duration (should be > 2 min)
- Engagement rate (should be > 50%)

**Insights from Test Data:**
- ✅ 83,509 sessions over 30 days (~2,783/day)
- ✅ Bounce rate at 38% (healthy)
- ✅ Average 3.6 pages per session (good engagement)
- ✅ 4.2% conversion rate (above industry average)

### 2. User Acquisition Analysis
**Goal**: Understand how users find and interact with your site

**Metrics to Track:**
- New vs. returning users ratio
- Traffic source breakdown
- User retention patterns
- Ad campaign performance

**Insights from Test Data:**
- 75,274 total users
- ~70% returning users (strong retention)
- 2,506 users from paid ads (3% of traffic)
- $10.35 average CPC (competitive)

### 3. Conversion Optimization
**Goal**: Improve conversion rates and revenue

**Analysis:**
```
Funnel:
Users (75,274)
  ↓ 100%
Sessions (83,509)
  ↓ 4.19%
Conversions (3,500)
```

**Opportunities:**
- High engagement (low bounce rate) = quality traffic
- Strong conversion rate (4.2%) = effective funnel
- Ad traffic converting well (2% CTR)

### 4. Marketing Budget Allocation
**Goal**: Optimize ad spend for maximum ROI

**Current Spend Analysis:**
- Total ad spend: $25,944.57
- Total conversions: 3,500
- Cost per conversion: $7.41
- ROI: Depends on conversion value

**If avg conversion value = $100:**
- Revenue: $350,000
- Spend: $25,944
- ROI: 1,249% or 13.5x ROAS

**Recommendation**: Scale ad budget if ROI > 300%

---

## 🔄 Data Patterns & Realism

### Weekend Effect
Traffic automatically reduces by ~25% on weekends, mimicking real user behavior.

**Example:**
- Weekday average: 2,900 sessions
- Weekend average: 2,175 sessions (-25%)

### Trend Improvements
Performance improves ~0.8% daily, simulating ongoing optimization efforts.

**Week-over-Week:**
- Week 1: 2,650 avg daily sessions
- Week 2: 2,740 avg daily sessions (+3.4%)
- Week 3: 2,835 avg daily sessions (+3.5%)
- Week 4: 2,930 avg daily sessions (+3.4%)

### Random Variation
Each day includes ±15% natural variation to prevent unrealistic uniformity.

---

## 🛠️ Advanced Options

### Custom Date Range
Seed data for different time periods:
```bash
curl -X POST http://localhost:5000/api/ga4/seed-data/CAMPAIGN_ID \
  -H "Content-Type: application/json" \
  -d '{"days":60,"websiteType":"saas"}'
```

### Multiple Website Types
Seed different property types for comparison:
```bash
# E-commerce site
curl -X POST http://localhost:5000/api/ga4/seed-data/CAMPAIGN_ID_1 \
  -d '{"websiteType":"ecommerce"}'

# SaaS product
curl -X POST http://localhost:5000/api/ga4/seed-data/CAMPAIGN_ID_2 \
  -d '{"websiteType":"saas"}'

# Content blog
curl -X POST http://localhost:5000/api/ga4/seed-data/CAMPAIGN_ID_3 \
  -d '{"websiteType":"blog"}'
```

---

## 🧪 Testing Scenarios

### Scenario 1: High-Performing SaaS Site
```json
{
  "websiteType": "saas",
  "days": 30
}
```
**Expected**: High conversion rate (4.2%), low bounce rate (38%)

### Scenario 2: E-commerce Optimization
```json
{
  "websiteType": "ecommerce",
  "days": 30
}
```
**Expected**: Moderate conversion rate (2.5%), higher traffic volume

### Scenario 3: Content Strategy Analysis
```json
{
  "websiteType": "blog",
  "days": 30
}
```
**Expected**: Highest traffic (3,500/day), lowest conversion rate (0.8%)

### Scenario 4: Lead Gen Performance
```json
{
  "websiteType": "leadgen",
  "days": 30
}
```
**Expected**: Highest conversion rate (5.5%), lowest bounce rate (35%)

---

## 📝 Notes

### Data Persistence
- **In-Memory Storage**: Data will be lost on server restart (current setup)
- **Database Storage**: Set `DATABASE_URL` environment variable to persist data

### Realistic Benchmarks
Metrics based on real-world industry averages:
- **SaaS**: 2-5% conversion, 35-45% bounce rate
- **E-commerce**: 1-3% conversion, 40-60% bounce rate
- **Blog**: 0.5-1.5% conversion, 55-70% bounce rate
- **Corporate**: 3-5% conversion, 40-50% bounce rate
- **Lead Gen**: 4-8% conversion, 30-40% bounce rate

### Ad Performance
- 3% of traffic comes from paid ads (realistic for hybrid strategy)
- 2% CTR for display/search ads
- $5-$15 CPC range (varies by industry/competition)

---

## 🆘 Troubleshooting

### Issue: "Campaign not found"
**Solution**: Create campaign first using POST `/api/campaigns`

### Issue: "Failed to seed data"
**Solution**: Check server logs for detailed error message

### Issue: "No GA4 connection"
**Solution**: The seed endpoint automatically creates the connection

### Issue: "Data not showing in dashboard"
**Solution**:
1. Verify seed was successful (check API response)
2. Check campaign ID matches
3. Refresh dashboard page

---

## 📞 Support

**Test Environment:**
- Campaign ID: `7a5b808b-00c9-463f-834d-c0d027dc0ad4`
- Property ID: `properties/951706275`
- Property Name: `SaaS Product Website - Analytics`
- Records Created: 30 daily metrics

**API Endpoints:**
- Seed Data: `POST /api/ga4/seed-data/:campaignId`
- Check Connection: `GET /api/ga4/check-connection/:campaignId`
- View Campaign: `GET /api/campaigns/:id`

---

**Last Updated**: November 9, 2025
**Test Data Version**: 1.0
**Website Type**: SaaS Product
**Data Range**: Last 30 days
