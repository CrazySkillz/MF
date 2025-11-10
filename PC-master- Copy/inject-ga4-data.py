#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════
  GA4 REALISTIC METRICS INJECTION SCRIPT
═══════════════════════════════════════════════════════════════════════

  🚀 HOW TO USE IN YOUR IDE (PyCharm, VS Code, etc.):

  1. Make sure the server is running first:
     - Open terminal and run: npm run dev
     - Wait for message: "serving on port 5000"

  2. Click the "Run" button in your IDE (or press F5)

  3. That's it! Data will be injected automatically.

═══════════════════════════════════════════════════════════════════════

  📝 CUSTOMIZE HERE (Optional):
"""

import requests
import json
import sys

# ═══════════════════════════════════════════════════════════════════════
# CONFIGURATION - CHANGE THESE VALUES IF NEEDED
# ═══════════════════════════════════════════════════════════════════════

BASE_URL = "http://localhost:5000"
CAMPAIGN_NAME = "Website Analytics - Q1 2025"

# Website type - determines the realistic metrics generated
# Options: "saas", "ecommerce", "blog", "corporate", "leadgen"
WEBSITE_TYPE = "saas"

# Number of days of historical data to generate
DAYS = 30

# ═══════════════════════════════════════════════════════════════════════
# Don't change anything below this line
# ═══════════════════════════════════════════════════════════════════════

def print_header(text):
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}\n")

def print_success(text):
    print(f"✅ {text}")

def print_error(text):
    print(f"❌ {text}")

def print_info(text):
    print(f"ℹ️  {text}")

def create_campaign():
    """Create a new campaign"""
    print_header("Step 1: Creating Campaign")

    url = f"{BASE_URL}/api/campaigns"
    payload = {
        "name": CAMPAIGN_NAME,
        "description": "GA4 property tracking website and ad performance"
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        campaign = response.json()

        print_success(f"Campaign created: {campaign['name']}")
        print_info(f"Campaign ID: {campaign['id']}")
        return campaign['id']
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to server. Make sure it's running:")
        print_info("Run: npm run dev")
        sys.exit(1)
    except Exception as e:
        print_error(f"Failed to create campaign: {e}")
        sys.exit(1)

def inject_ga4_data(campaign_id):
    """Inject realistic GA4 metrics"""
    print_header("Step 2: Injecting GA4 Metrics")

    url = f"{BASE_URL}/api/ga4/seed-data/{campaign_id}"
    payload = {
        "days": DAYS,
        "websiteType": WEBSITE_TYPE
    }

    print_info(f"Website Type: {WEBSITE_TYPE}")
    print_info(f"Days of Data: {DAYS}")
    print_info("Generating realistic metrics...")

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result = response.json()

        if result.get('success'):
            print_success("GA4 data injected successfully!")
            return result['summary']
        else:
            print_error(f"Failed: {result.get('message', 'Unknown error')}")
            sys.exit(1)
    except Exception as e:
        print_error(f"Failed to inject data: {e}")
        sys.exit(1)

def display_results(summary):
    """Display the results"""
    print_header("Step 3: Results Summary")

    totals = summary['totals']

    print(f"🏢 Property: {summary['propertyName']}")
    print(f"📊 Website Type: {summary['websiteType']}")
    print(f"📅 Time Range: {summary['timeRange']}")
    print(f"📝 Total Records: {summary['totalRecords']}\n")

    print("📈 30-Day Performance Metrics:")
    print(f"  • Sessions:        {totals['sessions']}")
    print(f"  • Users:           {totals['users']}")
    print(f"  • Pageviews:       {totals['pageviews']}")
    print(f"  • Conversions:     {totals['conversions']}")
    print(f"  • Ad Impressions:  {totals['adImpressions']}")
    print(f"  • Ad Clicks:       {totals['adClicks']}")
    print(f"  • Ad Spend:        {totals['adSpend']}")
    print(f"  • Avg CTR:         {totals['avgCTR']}")
    print(f"  • Avg Conv. Rate:  {totals['avgConversionRate']}")
    print(f"  • Avg CPC:         {totals['avgCPC']}")

def main():
    print_header("GA4 Metrics Data Injection Tool")

    print("This script will:")
    print(f"  1. Create a campaign: '{CAMPAIGN_NAME}'")
    print(f"  2. Inject {DAYS} days of realistic GA4 metrics ({WEBSITE_TYPE} website)")
    print("  3. Display the results\n")

    # Check if server is running
    try:
        requests.get(BASE_URL, timeout=2)
    except:
        print_error("Server is not running!")
        print("\n" + "="*60)
        print("  ⚠️  ACTION REQUIRED")
        print("="*60)
        print("\n1️⃣  Open a terminal")
        print("2️⃣  Run this command:")
        print("\n    npm run dev")
        print("\n3️⃣  Wait for: 'serving on port 5000'")
        print("4️⃣  Then run this script again\n")
        print("="*60 + "\n")
        sys.exit(1)

    # Create campaign
    campaign_id = create_campaign()

    # Inject GA4 data
    summary = inject_ga4_data(campaign_id)

    # Display results
    display_results(summary)

    print_header("✨ Success!")
    print_success("Realistic GA4 data has been injected into your property!")
    print_info(f"View in dashboard: http://localhost:5000/campaigns/{campaign_id}")
    print()

if __name__ == "__main__":
    main()
