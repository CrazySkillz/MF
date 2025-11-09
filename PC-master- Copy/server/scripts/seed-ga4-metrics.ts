import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import * as schema from "../../shared/schema";
import ws from "ws";
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

// Realistic GA4 Website Analytics Data Generator
interface GA4DailyMetrics {
  date: string;
  // Traffic metrics
  sessions: number;
  users: number;
  newUsers: number;
  activeUsers: number;
  pageviews: number;
  screenPageViews: number;

  // Engagement metrics
  bounceRate: number;
  engagementRate: number;
  averageSessionDuration: number;
  userEngagementDuration: number;
  engagedSessions: number;
  eventsPerSession: number;
  screenPageViewsPerSession: number;

  // Conversion metrics
  conversions: number;
  eventCount: number;

  // Advertising metrics (if running paid campaigns)
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
}

interface WebsiteProfile {
  name: string;
  type: 'ecommerce' | 'saas' | 'blog' | 'corporate' | 'leadgen';
  avgDailySessions: number;
  conversionRate: number; // percentage
  avgSessionDuration: number; // seconds
  bounceRate: number; // percentage
  performanceMultiplier: number;
}

// Different website types with realistic profiles
const websiteProfiles: WebsiteProfile[] = [
  {
    name: 'E-commerce Store',
    type: 'ecommerce',
    avgDailySessions: 2500,
    conversionRate: 2.5,
    avgSessionDuration: 180,
    bounceRate: 45,
    performanceMultiplier: 1.3,
  },
  {
    name: 'SaaS Product',
    type: 'saas',
    avgDailySessions: 1800,
    conversionRate: 4.2,
    avgSessionDuration: 240,
    bounceRate: 38,
    performanceMultiplier: 1.5,
  },
  {
    name: 'Content Blog',
    type: 'blog',
    avgDailySessions: 3500,
    conversionRate: 0.8,
    avgSessionDuration: 150,
    bounceRate: 58,
    performanceMultiplier: 1.1,
  },
  {
    name: 'Corporate Website',
    type: 'corporate',
    avgDailySessions: 1200,
    conversionRate: 3.8,
    avgSessionDuration: 200,
    bounceRate: 42,
    performanceMultiplier: 1.0,
  },
  {
    name: 'Lead Generation Site',
    type: 'leadgen',
    avgDailySessions: 1500,
    conversionRate: 5.5,
    avgSessionDuration: 220,
    bounceRate: 35,
    performanceMultiplier: 1.4,
  },
];

// Generate realistic daily GA4 metrics
function generateDailyGA4Metrics(profile: WebsiteProfile, dayOffset: number): GA4DailyMetrics {
  const { avgDailySessions, conversionRate, avgSessionDuration, bounceRate, performanceMultiplier } = profile;

  // Calculate date
  const date = new Date();
  date.setDate(date.getDate() - dayOffset);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  // Apply multipliers
  const weekendMultiplier = isWeekend ? 0.75 : 1.0; // Less traffic on weekends
  const trendMultiplier = 1 + (30 - dayOffset) * 0.008; // 0.8% improvement per day
  const randomVariation = 0.85 + Math.random() * 0.3; // ±15%
  const totalMultiplier = performanceMultiplier * weekendMultiplier * trendMultiplier * randomVariation;

  // Traffic metrics
  const sessions = Math.round(avgDailySessions * totalMultiplier);
  const returningUserRate = 0.3 + Math.random() * 0.2; // 30-50% returning users
  const users = Math.round(sessions * (0.85 + Math.random() * 0.1)); // Users slightly less than sessions
  const newUsers = Math.round(users * (1 - returningUserRate));
  const activeUsers = Math.round(users * (0.7 + Math.random() * 0.2)); // 70-90% active

  // Page views
  const pagesPerSession = 2.5 + Math.random() * 2.5; // 2.5-5 pages per session
  const pageviews = Math.round(sessions * pagesPerSession);
  const screenPageViews = pageviews; // Same for web analytics
  const screenPageViewsPerSession = parseFloat((pageviews / sessions).toFixed(2));

  // Engagement metrics
  const calculatedBounceRate = parseFloat((bounceRate * (0.9 + Math.random() * 0.2) / 100).toFixed(4));
  const engagementRate = parseFloat((1 - calculatedBounceRate).toFixed(4));
  const engagedSessions = Math.round(sessions * engagementRate);
  const averageSessionDurationSeconds = Math.round(avgSessionDuration * (0.8 + Math.random() * 0.4));
  const userEngagementDuration = averageSessionDurationSeconds * sessions;

  // Events
  const eventsPerSession = parseFloat((4 + Math.random() * 6).toFixed(2)); // 4-10 events per session
  const eventCount = Math.round(sessions * eventsPerSession);

  // Conversions (based on profile conversion rate)
  const conversions = Math.round(sessions * (conversionRate / 100) * (0.8 + Math.random() * 0.4));

  // Advertising metrics (assuming running Google Ads)
  const adClickRate = 0.03; // 3% of sessions come from ads
  const adSessions = Math.round(sessions * adClickRate);
  const impressions = Math.round(adSessions / 0.02); // 2% CTR from ads
  const clicks = adSessions;
  const ctr = parseFloat((clicks / impressions * 100).toFixed(2));
  const cpc = parseFloat((5 + Math.random() * 10).toFixed(2)); // $5-$15 CPC

  return {
    date: date.toISOString().split('T')[0],
    sessions,
    users,
    newUsers,
    activeUsers,
    pageviews,
    screenPageViews,
    bounceRate: calculatedBounceRate,
    engagementRate,
    averageSessionDuration: averageSessionDurationSeconds,
    userEngagementDuration,
    engagedSessions,
    eventsPerSession,
    screenPageViewsPerSession,
    conversions,
    eventCount,
    impressions,
    clicks,
    ctr,
    cpc,
  };
}

async function seedGA4Metrics() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set. Cannot seed data.");
    process.exit(1);
  }

  console.log("🚀 Starting GA4 metrics seed...\n");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });

  try {
    // Get all campaigns
    const campaigns = await db.select().from(schema.campaigns);

    if (campaigns.length === 0) {
      console.log("⚠️  No campaigns found. Creating a demo campaign...");

      const [demoCampaign] = await db.insert(schema.campaigns).values({
        id: crypto.randomUUID(),
        name: 'Q1 2025 Digital Marketing Campaign',
        description: 'Website analytics and paid advertising performance',
        createdAt: new Date(),
      }).returning();

      campaigns.push(demoCampaign);
      console.log(`✅ Created demo campaign: ${demoCampaign.name}`);
    }

    const campaignId = campaigns[0].id;
    console.log(`📊 Using campaign: ${campaigns[0].name} (${campaignId})\n`);

    // Check if GA4 connection exists
    const existingConnections = await db
      .select()
      .from(schema.ga4Connections)
      .where(eq(schema.ga4Connections.campaignId, campaignId));

    if (existingConnections.length === 0) {
      console.log("🔗 Creating GA4 connection...");

      const [connection] = await db.insert(schema.ga4Connections).values({
        id: crypto.randomUUID(),
        campaignId,
        propertyId: 'properties/' + Math.floor(Math.random() * 999999999),
        propertyName: 'Demo Website Analytics',
        websiteUrl: 'https://www.demo-website.com',
        displayName: 'Main Website Property',
        method: 'access_token',
        accessToken: 'demo_access_token_' + Date.now(),
        refreshToken: 'demo_refresh_token_' + Date.now(),
        isPrimary: true,
        isActive: true,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        connectedAt: new Date(),
        createdAt: new Date(),
      }).returning();

      console.log(`✅ Created GA4 connection: ${connection.propertyName}\n`);
    } else {
      console.log(`✅ Using existing GA4 connection: ${existingConnections[0].propertyName}\n`);
    }

    // Generate and insert metrics for primary website
    const primaryProfile = websiteProfiles[0]; // Use E-commerce Store as primary
    console.log("📈 Generating realistic GA4 metrics for 30 days...\n");
    console.log(`   Website: ${primaryProfile.name}`);
    console.log(`   Type: ${primaryProfile.type}`);
    console.log(`   Avg Daily Sessions: ${primaryProfile.avgDailySessions.toLocaleString()}`);
    console.log(`   Conversion Rate: ${primaryProfile.conversionRate}%\n`);

    let totalRecordsInserted = 0;
    const summaryMetrics = {
      sessions: 0,
      users: 0,
      pageviews: 0,
      conversions: 0,
      impressions: 0,
      clicks: 0,
      totalSpend: 0,
    };

    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const metrics = generateDailyGA4Metrics(primaryProfile, dayOffset);

      // Store in performance_data table (generic metrics table)
      await db.insert(schema.performanceData).values({
        id: crypto.randomUUID(),
        campaignId,
        date: metrics.date,
        impressions: metrics.impressions,
        clicks: metrics.clicks,
        spend: (metrics.clicks * metrics.cpc).toFixed(2),
        conversions: metrics.conversions,
        reach: metrics.users,
        engagement: metrics.engagedSessions,
        createdAt: new Date(),
      });

      // Accumulate summary metrics
      summaryMetrics.sessions += metrics.sessions;
      summaryMetrics.users += metrics.users;
      summaryMetrics.pageviews += metrics.pageviews;
      summaryMetrics.conversions += metrics.conversions;
      summaryMetrics.impressions += metrics.impressions;
      summaryMetrics.clicks += metrics.clicks;
      summaryMetrics.totalSpend += metrics.clicks * metrics.cpc;

      totalRecordsInserted++;
    }

    console.log(`✅ Successfully seeded ${totalRecordsInserted} GA4 metric records!`);
    console.log(`\n📊 30-Day Summary:`);
    console.log(`   • Total Sessions: ${summaryMetrics.sessions.toLocaleString()}`);
    console.log(`   • Total Users: ${summaryMetrics.users.toLocaleString()}`);
    console.log(`   • Total Pageviews: ${summaryMetrics.pageviews.toLocaleString()}`);
    console.log(`   • Total Conversions: ${summaryMetrics.conversions.toLocaleString()}`);
    console.log(`   • Total Ad Impressions: ${summaryMetrics.impressions.toLocaleString()}`);
    console.log(`   • Total Ad Clicks: ${summaryMetrics.clicks.toLocaleString()}`);
    console.log(`   • Total Ad Spend: $${summaryMetrics.totalSpend.toFixed(2)}`);
    console.log(`   • Avg CTR: ${((summaryMetrics.clicks / summaryMetrics.impressions) * 100).toFixed(2)}%`);
    console.log(`   • Avg Conversion Rate: ${((summaryMetrics.conversions / summaryMetrics.sessions) * 100).toFixed(2)}%`);
    console.log(`\n🎯 Next steps:`);
    console.log(`   1. Start your server: npm run dev`);
    console.log(`   2. Navigate to GA4 Analytics dashboard`);
    console.log(`   3. View campaign: ${campaignId}`);
    console.log(`   4. Analyze the realistic GA4 performance data!`);

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seed function
seedGA4Metrics()
  .then(() => {
    console.log("\n✨ Seed completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seed failed:", error);
    process.exit(1);
  });
