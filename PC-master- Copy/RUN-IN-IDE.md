# 🚀 Run in Your IDE - Super Simple!

## For PyCharm, VS Code, or Any Python IDE

### Step 1: Start the Server (One Time)
Open a terminal and run:
```bash
npm run dev
```

Wait for the message: `serving on port 5000`

**Leave this terminal running!**

---

### Step 2: Open and Run the Python Script

1. **Open** `inject-ga4-data.py` in your IDE
2. **Click** the Run button (▶️) or press **F5**
3. **Done!** ✅

---

## What You'll See

```
============================================================
  GA4 Metrics Data Injection Tool
============================================================

This script will:
  1. Create a campaign: 'Website Analytics - Q1 2025'
  2. Inject 30 days of realistic GA4 metrics (saas website)
  3. Display the results

✅ Campaign created: Website Analytics - Q1 2025
✅ GA4 data injected successfully!

📈 30-Day Performance Metrics:
  • Sessions:        84,392
  • Users:           76,181
  • Pageviews:       325,954
  • Conversions:     3,585
  ...

✅ Realistic GA4 data has been injected into your property!
```

---

## Customize (Optional)

Want different data? Edit these lines at the top of `inject-ga4-data.py`:

```python
CAMPAIGN_NAME = "Website Analytics - Q1 2025"  # Change name
WEBSITE_TYPE = "saas"                          # Change type
DAYS = 30                                      # Change days
```

### Website Types:
- `"saas"` - SaaS Product (4.2% conversion)
- `"ecommerce"` - E-commerce Store (2.5% conversion)
- `"blog"` - Content Blog (0.8% conversion)
- `"corporate"` - Corporate Website (3.8% conversion)
- `"leadgen"` - Lead Generation (5.5% conversion)

---

## Troubleshooting

### ❌ "Server is not running!"
**Solution:** Make sure you ran `npm run dev` in a terminal first.

### ❌ "ModuleNotFoundError: No module named 'requests'"
**Solution:** Install the requests library:
```bash
pip install requests
```

---

## That's It! 🎉

Your GA4 property now has 30 days of realistic data!
