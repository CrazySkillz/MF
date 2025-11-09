#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════
  GA4 REALISTIC METRICS INJECTION - STANDALONE SCRIPT
═══════════════════════════════════════════════════════════════════════

  🚀 JUST CLICK RUN IN YOUR IDE!

  This script does EVERYTHING automatically:
  ✅ Starts the server
  ✅ Injects realistic GA4 data
  ✅ Shows you the results
  ✅ Stops the server when done

  No need to run npm or anything else!

═══════════════════════════════════════════════════════════════════════
"""

import subprocess
import requests
import time
import sys
import os
import signal

# ═══════════════════════════════════════════════════════════════════════
# CONFIGURATION - CHANGE THESE IF YOU WANT
# ═══════════════════════════════════════════════════════════════════════

CAMPAIGN_NAME = "Website Analytics - Q1 2025"

# Website type - determines the realistic metrics generated
# Options: "saas", "ecommerce", "blog", "corporate", "leadgen"
WEBSITE_TYPE = "saas"

# Number of days of historical data to generate
DAYS = 30

# Server will auto-stop after data injection (True) or keep running (False)
STOP_SERVER_WHEN_DONE = True

# ═══════════════════════════════════════════════════════════════════════
# Don't change anything below this line
# ═══════════════════════════════════════════════════════════════════════

BASE_URL = "http://localhost:5000"
server_process = None

def print_header(text):
    print(f"\n{'='*70}")
    print(f"  {text}")
    print(f"{'='*70}\n")

def print_success(text):
    print(f"✅ {text}")

def print_error(text):
    print(f"❌ {text}")

def print_info(text):
    print(f"ℹ️  {text}")

def start_server():
    """Start the npm server automatically"""
    global server_process

    print_header("Starting Server Automatically")
    print_info("Starting npm dev server...")

    # Change to the correct directory
    script_dir = os.path.dirname(os.path.abspath(__file__))

    try:
        # Start the server as a subprocess
        server_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=script_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            preexec_fn=os.setsid if os.name != 'nt' else None
        )

        # Wait for server to be ready
        print_info("Waiting for server to start...")
        max_attempts = 30
        for i in range(max_attempts):
            try:
                response = requests.get(BASE_URL, timeout=1)
                print_success("Server is ready!")
                return True
            except:
                time.sleep(1)
                if i % 5 == 0 and i > 0:
                    print_info(f"Still waiting... ({i}/{max_attempts} seconds)")

        print_error("Server failed to start within 30 seconds")
        return False

    except FileNotFoundError:
        print_error("npm command not found!")
        print_info("Make sure Node.js and npm are installed")
        return False
    except Exception as e:
        print_error(f"Failed to start server: {e}")
        return False

def stop_server():
    """Stop the server"""
    global server_process

    if server_process:
        print_info("Stopping server...")
        try:
            if os.name == 'nt':  # Windows
                server_process.terminate()
            else:  # Unix/Linux/Mac
                os.killpg(os.getpgid(server_process.pid), signal.SIGTERM)
            server_process.wait(timeout=5)
            print_success("Server stopped")
        except Exception as e:
            print_info(f"Server stop: {e}")

def create_campaign():
    """Create a new campaign"""
    print_header("Creating Campaign")

    url = f"{BASE_URL}/api/campaigns"
    payload = {
        "name": CAMPAIGN_NAME,
        "description": "GA4 property tracking website and ad performance"
    }

    try:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        campaign = response.json()

        print_success(f"Campaign created: {campaign['name']}")
        print_info(f"Campaign ID: {campaign['id']}")
        return campaign['id']
    except Exception as e:
        print_error(f"Failed to create campaign: {e}")
        return None

def inject_ga4_data(campaign_id):
    """Inject realistic GA4 metrics"""
    print_header("Injecting GA4 Metrics")

    url = f"{BASE_URL}/api/ga4/seed-data/{campaign_id}"
    payload = {
        "days": DAYS,
        "websiteType": WEBSITE_TYPE
    }

    print_info(f"Website Type: {WEBSITE_TYPE}")
    print_info(f"Days of Data: {DAYS}")
    print_info("Generating realistic metrics...")

    try:
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()

        if result.get('success'):
            print_success("GA4 data injected successfully!")
            return result['summary']
        else:
            print_error(f"Failed: {result.get('message', 'Unknown error')}")
            return None
    except Exception as e:
        print_error(f"Failed to inject data: {e}")
        return None

def display_results(summary):
    """Display the results"""
    print_header("Results Summary")

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
    print_header("🚀 GA4 Metrics Injection - Fully Automated")

    print("This script will:")
    print(f"  1. Start the server automatically")
    print(f"  2. Create campaign: '{CAMPAIGN_NAME}'")
    print(f"  3. Inject {DAYS} days of realistic GA4 data ({WEBSITE_TYPE})")
    print(f"  4. Show you the results")
    if STOP_SERVER_WHEN_DONE:
        print(f"  5. Stop the server\n")
    else:
        print(f"  5. Leave the server running\n")

    try:
        # Start server
        if not start_server():
            print_error("Cannot continue without server")
            sys.exit(1)

        # Create campaign
        campaign_id = create_campaign()
        if not campaign_id:
            stop_server()
            sys.exit(1)

        # Inject GA4 data
        summary = inject_ga4_data(campaign_id)
        if not summary:
            stop_server()
            sys.exit(1)

        # Display results
        display_results(summary)

        print_header("✨ Success!")
        print_success("Realistic GA4 data has been injected into your property!")
        print_info(f"View in dashboard: http://localhost:5000/campaigns/{campaign_id}")

        if STOP_SERVER_WHEN_DONE:
            print()
            stop_server()
        else:
            print()
            print_info("Server is still running at http://localhost:5000")
            print_info("Press Ctrl+C to stop it when you're done")

    except KeyboardInterrupt:
        print("\n\n")
        print_info("Interrupted by user")
        stop_server()
        sys.exit(0)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        stop_server()
        sys.exit(1)

if __name__ == "__main__":
    main()
