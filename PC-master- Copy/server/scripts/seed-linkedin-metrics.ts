import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "../../shared/schema";
import { eq, and } from 'drizzle-orm';
import ws from "ws";
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

// Realistic LinkedIn Ad Performance Data Generator
interface LinkedInCampaignProfile {
  name: string;
  objective: 'awareness' | 'engagement' | 'conversion';
  budget: number; // daily budget in USD
  performanceMultiplier: number; // 0.5 to 2.0, affects overall performance
}

// Define different campaign performance profiles
const campaignProfiles: LinkedInCampaignProfile[] = [
  {
    name: 'Brand Awareness - Tech Leaders',
    objective: 'awareness',
    budget: 150,
    performanceMultiplier: 1.2,
  },
  {
    name: 'Lead Generation - Enterprise Sales',
    objective: 'conversion',
    budget: 300,
    performanceMultiplier: 1.5,
  },
  {
    name: 'Engagement - Thought Leadership',
    objective: 'engagement',
    budget: 100,
    performanceMultiplier: 0.9,
  },
  {
    name: 'Product Launch - Innovation Series',
    objective: 'awareness',
    budget: 250,
    performanceMultiplier: 1.8,
  },
  {
    name: 'Webinar Promotion - Q1 Summit',
    objective: 'conversion',
    budget: 200,
    performanceMultiplier: 1.3,
  },
];

// Generate realistic metrics based on campaign profile
function generateDailyMetrics(profile: LinkedInCampaignProfile, dayOffset: number) {
  const { budget, performanceMultiplier, objective } = profile;

  // Add some variability (weekends have lower performance)
  const date = new Date();
  date.setDate(date.getDate() - dayOffset);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const weekendMultiplier = isWeekend ? 0.7 : 1.0;

  // Add seasonal trend (performance improves over time)
  const trendMultiplier = 1 + (30 - dayOffset) * 0.01; // 1% improvement per day

  // Add random variation (±15%)
  const randomVariation = 0.85 + Math.random() * 0.3;

  const totalMultiplier = performanceMultiplier * weekendMultiplier * trendMultiplier * randomVariation;

  // Base metrics calculations
  const spend = budget * (0.85 + Math.random() * 0.3); // 85-115% of daily budget

  // LinkedIn benchmark CTRs: Awareness 0.4-0.6%, Engagement 0.6-1.0%, Conversion 0.3-0.5%
  let baseCTR;
  let baseConversionRate;
  let baseCPC;

  if (objective === 'awareness') {
    baseCTR = 0.45;
    baseConversionRate = 0.015; // 1.5%
    baseCPC = 6.5;
  } else if (objective === 'engagement') {
    baseCTR = 0.75;
    baseConversionRate = 0.025; // 2.5%
    baseCPC = 5.5;
  } else {
    baseCTR = 0.38;
    baseConversionRate = 0.035; // 3.5%
    baseCPC = 8.5;
  }

  // LinkedIn CPM benchmark: $30-65
  const cpm = (25 + Math.random() * 45) * totalMultiplier;

  // Calculate impressions from spend and CPM
  const impressions = Math.round((spend / cpm) * 1000);

  // LinkedIn reach is typically 60-80% of impressions
  const reach = Math.round(impressions * (0.6 + Math.random() * 0.2));

  // Calculate clicks from impressions and CTR
  const ctr = baseCTR * totalMultiplier;
  const clicks = Math.round(impressions * (ctr / 100));

  // Actual CPC (may differ from base due to auction dynamics)
  const cpc = clicks > 0 ? spend / clicks : baseCPC * totalMultiplier;

  // LinkedIn engagement rate: 2-6%
  const engagementRate = (2 + Math.random() * 4) * totalMultiplier;
  const engagements = Math.round(impressions * (engagementRate / 100));

  // Conversions based on clicks and conversion rate
  const cvr = baseConversionRate * totalMultiplier;
  const conversions = Math.round(clicks * cvr);

  // Leads (for B2B campaigns, often 60-80% of conversions)
  const leads = Math.round(conversions * (0.6 + Math.random() * 0.2));

  // Video views (if campaign includes video, typically 30-50% of impressions)
  const videoViews = Math.round(impressions * (0.3 + Math.random() * 0.2));

  // Viral impressions (organic reach from shares, typically 5-15% of paid impressions)
  const viralImpressions = Math.round(impressions * (0.05 + Math.random() * 0.1));

  // Revenue (assuming average deal value of $2000-5000 for B2B)
  const avgDealValue = 2000 + Math.random() * 3000;
  const revenue = conversions * avgDealValue * 0.3; // 30% close rate

  // Calculate derived metrics
  const cpa = conversions > 0 ? spend / conversions : 0;
  const cpl = leads > 0 ? spend / leads : 0;
  const roi = revenue > 0 ? ((revenue - spend) / spend) * 100 : 0;
  const roas = spend > 0 ? revenue / spend : 0;

  return {
    date: date.toISOString().split('T')[0],
    impressions,
    reach,
    clicks,
    engagements,
    spend: Number(spend.toFixed(2)),
    conversions,
    leads,
    videoViews,
    viralImpressions,

    // Derived metrics
    ctr: Number(ctr.toFixed(2)),
    cpc: Number(cpc.toFixed(2)),
    cpm: Number(cpm.toFixed(2)),
    cvr: Number((cvr * 100).toFixed(2)),
    cpa: Number(cpa.toFixed(2)),
    cpl: Number(cpl.toFixed(2)),
    er: Number(engagementRate.toFixed(2)),
    roi: Number(roi.toFixed(2)),
    roas: Number(roas.toFixed(2)),
    revenue: Number(revenue.toFixed(2)),
    conversionRate: Number((cvr * 100).toFixed(2)),
  };
}

async function seedLinkedInMetrics() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set. Cannot seed data.");
    process.exit(1);
  }

  console.log("🚀 Starting LinkedIn metrics seed...\n");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });

  try {
    // Get all campaigns
    const campaigns = await db.select().from(schema.campaigns);

    if (campaigns.length === 0) {
      console.log("⚠️  No campaigns found. Creating a demo campaign...");

      // Create a demo campaign
      const [demoCampaign] = await db.insert(schema.campaigns).values({
        id: crypto.randomUUID(),
        name: 'Q1 2025 Digital Marketing Campaign',
        description: 'Integrated campaign across LinkedIn, Google Ads, and Meta platforms',
        createdAt: new Date(),
      }).returning();

      campaigns.push(demoCampaign);
      console.log(`✅ Created demo campaign: ${demoCampaign.name}`);
    }

    const campaignId = campaigns[0].id;
    console.log(`📊 Using campaign: ${campaigns[0].name} (${campaignId})\n`);

    // Check if LinkedIn connection exists
    const existingConnections = await db
      .select()
      .from(schema.linkedinConnections)
      .where(eq(schema.linkedinConnections.campaignId, campaignId));

    let connectionId: string;

    if (existingConnections.length === 0) {
      console.log("🔗 Creating LinkedIn connection...");

      const [connection] = await db.insert(schema.linkedinConnections).values({
        id: crypto.randomUUID(),
        campaignId,
        adAccountId: 'li-ad-account-' + Math.random().toString(36).substring(7),
        adAccountName: 'Performance Core Demo Account',
        accessToken: 'demo_access_token_' + Date.now(),
        refreshToken: 'demo_refresh_token_' + Date.now(),
        method: 'oauth',
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        connectedAt: new Date(),
        createdAt: new Date(),
      }).returning();

      connectionId = connection.id;
      console.log(`✅ Created LinkedIn connection: ${connection.adAccountName}\n`);
    } else {
      connectionId = existingConnections[0].id;
      console.log(`✅ Using existing LinkedIn connection: ${existingConnections[0].adAccountName}\n`);
    }

    // Generate and insert metrics for each campaign profile
    console.log("📈 Generating realistic metrics for 5 LinkedIn campaigns over 30 days...\n");

    let totalRecordsInserted = 0;

    for (const profile of campaignProfiles) {
      console.log(`   Campaign: ${profile.name}`);
      console.log(`   Objective: ${profile.objective} | Budget: $${profile.budget}/day`);

      const campaignIdUnique = `lc_${Math.random().toString(36).substring(2, 15)}`;

      for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
        const metrics = generateDailyMetrics(profile, dayOffset);

        await db.insert(schema.linkedinImportMetrics).values({
          id: crypto.randomUUID(),
          sessionId: connectionId,
          campaignId: campaignIdUnique,
          campaignName: profile.name,
          status: 'ACTIVE',
          startDate: new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000),
          importedAt: new Date(),
        });

        await db.insert(schema.linkedinAdPerformance).values({
          id: crypto.randomUUID(),
          sessionId: connectionId,
          campaignId: campaignIdUnique,
          date: metrics.date,

          // Core metrics
          impressions: metrics.impressions,
          reach: metrics.reach,
          clicks: metrics.clicks,
          engagements: metrics.engagements,
          spend: metrics.spend.toString(),
          conversions: metrics.conversions,
          leads: metrics.leads,
          videoViews: metrics.videoViews,
          viralImpressions: metrics.viralImpressions,

          // Derived metrics
          ctr: metrics.ctr.toString(),
          cpc: metrics.cpc.toString(),
          cpm: metrics.cpm.toString(),
          cvr: metrics.cvr.toString(),
          cpa: metrics.cpa.toString(),
          cpl: metrics.cpl.toString(),
          er: metrics.er.toString(),
          roi: metrics.roi.toString(),
          roas: metrics.roas.toString(),
          revenue: metrics.revenue.toString(),
          conversionRate: metrics.conversionRate.toString(),

          createdAt: new Date(),
        });

        totalRecordsInserted++;
      }

      // Calculate and display campaign totals
      const totals = {
        impressions: 0,
        clicks: 0,
        spend: 0,
        conversions: 0,
        leads: 0,
      };

      for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
        const metrics = generateDailyMetrics(profile, dayOffset);
        totals.impressions += metrics.impressions;
        totals.clicks += metrics.clicks;
        totals.spend += metrics.spend;
        totals.conversions += metrics.conversions;
        totals.leads += metrics.leads;
      }

      console.log(`   ✓ 30-day totals: ${totals.impressions.toLocaleString()} impressions, ${totals.clicks.toLocaleString()} clicks`);
      console.log(`   ✓ Total spend: $${totals.spend.toFixed(2)} | Conversions: ${totals.conversions} | Leads: ${totals.leads}\n`);
    }

    console.log(`\n✅ Successfully seeded ${totalRecordsInserted} metric records across ${campaignProfiles.length} campaigns!`);
    console.log(`\n📊 Data Summary:`);
    console.log(`   • Time range: Last 30 days`);
    console.log(`   • Campaigns: ${campaignProfiles.length}`);
    console.log(`   • Total records: ${totalRecordsInserted}`);
    console.log(`   • Metrics per campaign: ${totalRecordsInserted / campaignProfiles.length}`);
    console.log(`\n🎯 Next steps:`);
    console.log(`   1. Start your server: npm run dev`);
    console.log(`   2. Navigate to LinkedIn Analytics dashboard`);
    console.log(`   3. View campaign: ${campaignId}`);
    console.log(`   4. Analyze the realistic performance data!`);

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seed function
seedLinkedInMetrics()
  .then(() => {
    console.log("\n✨ Seed completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seed failed:", error);
    process.exit(1);
  });
