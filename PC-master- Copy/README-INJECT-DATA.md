# 🚀 Quick Start: Inject GA4 Data

## Simple Method (Just 2 Commands!)

### 1. Start the server
```bash
npm run dev
```

### 2. Run the Python script (in a new terminal)
```bash
python3 inject-ga4-data.py
```

**That's it!** ✅

---

## What You Get

The script will automatically:
- ✅ Create a campaign
- ✅ Connect a GA4 property
- ✅ Inject 30 days of realistic website analytics data
- ✅ Show you the results

---

## Customize (Optional)

Edit `inject-ga4-data.py` and change these settings:

```python
WEBSITE_TYPE = "saas"  # Change to: ecommerce, blog, corporate, or leadgen
DAYS = 30              # Change to: 7, 14, 60, 90, etc.
CAMPAIGN_NAME = "..."  # Change the campaign name
```

### Website Types:
- **saas** - SaaS Product (4.2% conversion, 1,800 daily sessions)
- **ecommerce** - E-commerce Store (2.5% conversion, 2,500 daily sessions)
- **blog** - Content Blog (0.8% conversion, 3,500 daily sessions)
- **corporate** - Corporate Website (3.8% conversion, 1,200 daily sessions)
- **leadgen** - Lead Generation (5.5% conversion, 1,500 daily sessions)

---

## Example Output

```
============================================================
  GA4 Metrics Data Injection Tool
============================================================

This script will:
  1. Create a new campaign
  2. Inject 30 days of realistic GA4 metrics
  3. Display the results

============================================================
  Step 1: Creating Campaign
============================================================

✅ Campaign created: Website Analytics - Q1 2025
ℹ️  Campaign ID: abc-123-def-456

============================================================
  Step 2: Injecting GA4 Metrics
============================================================

ℹ️  Website Type: saas
ℹ️  Days of Data: 30
ℹ️  Generating realistic metrics...
✅ GA4 data injected successfully!

============================================================
  Step 3: Results Summary
============================================================

🏢 Property: SaaS Product Website - Analytics
📊 Website Type: saas
📅 Time Range: Last 30 days
📝 Total Records: 30

📈 30-Day Performance Metrics:
  • Sessions:        83,509
  • Users:           75,274
  • Pageviews:       299,038
  • Conversions:     3,500
  • Ad Impressions:  125,300
  • Ad Clicks:       2,506
  • Ad Spend:        $25,944.57
  • Avg CTR:         2.00%
  • Avg Conv. Rate:  4.19%
  • Avg CPC:         $10.35

============================================================
  ✨ Success!
============================================================

✅ Realistic GA4 data has been injected into your property!
ℹ️  View in dashboard: http://localhost:5000/campaigns/abc-123
```

---

## Troubleshooting

### Error: "Cannot connect to server"
**Solution:** Make sure the server is running first:
```bash
npm run dev
```

### Error: "python3: command not found"
**Solution:** Try `python` instead:
```bash
python inject-ga4-data.py
```

### Want to inject more data?
Just run the script again! It will create a new campaign each time.

---

## That's All! 🎉

Your GA4 property now has realistic data ready for analysis!
