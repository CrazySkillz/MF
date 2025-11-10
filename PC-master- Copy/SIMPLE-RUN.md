# 🎯 SIMPLEST WAY - Just Run One File!

## Just Execute This Python File:

```bash
python3 inject-ga4-data-standalone.py
```

**OR** open `inject-ga4-data-standalone.py` in your IDE and click **Run** ▶️

---

## That's It!

The script does **EVERYTHING** automatically:
- ✅ Starts the server
- ✅ Creates a campaign
- ✅ Injects 30 days of realistic GA4 data
- ✅ Shows you all the metrics
- ✅ Stops the server when done

**No npm commands. No terminals. Just one Python file!**

---

## Example Output:

```
🚀 GA4 Metrics Injection - Fully Automated

This script will:
  1. Start the server automatically
  2. Create campaign: 'Website Analytics - Q1 2025'
  3. Inject 30 days of realistic GA4 data (saas)
  4. Show you the results
  5. Stop the server

✅ Server is ready!
✅ Campaign created: Website Analytics - Q1 2025
✅ GA4 data injected successfully!

📈 30-Day Performance Metrics:
  • Sessions:        85,302
  • Users:           76,992
  • Pageviews:       308,330
  • Conversions:     3,607
  • Ad Impressions:  127,950
  • Ad Clicks:       2,559
  • Ad Spend:        $26,570.04
  • Avg CTR:         2.00%
  • Avg Conv. Rate:  4.23%
  • Avg CPC:         $10.38

✅ Success! Realistic GA4 data has been injected!
✅ Server stopped
```

---

## Customize (Optional)

Want different data? Edit the top of `inject-ga4-data-standalone.py`:

```python
WEBSITE_TYPE = "saas"     # Change to: ecommerce, blog, corporate, leadgen
DAYS = 30                 # Change to: 7, 14, 60, 90
STOP_SERVER_WHEN_DONE = True  # Keep server running after? Set to False
```

---

## That's All! 🚀

No configuration. No setup. Just run the file!
