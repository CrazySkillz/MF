# ⚡ Quick Start Guide

Get PerformanceCore running on your local machine in **2 simple steps**!

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)

---

## 🚀 Two-Step Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/CrazySkillz/MF.git
cd MF
git checkout claude/explain-th-011CUs98PDVt6bDmmA1QeKxP
cd "PC-master- Copy"
```

### Step 2: Run the Quick Start Script

**Mac/Linux:**
```bash
./quick-start.sh
```

**Windows:**
```cmd
quick-start.bat
```

That's it! The script will:
- ✅ Install all dependencies automatically
- ✅ Set up environment configuration
- ✅ Start the development server

---

## 🌐 Access the Application

Once the server starts, open your browser to:

**http://localhost:5000**

---

## 📝 What's Running?

- **Frontend**: React app with Vite dev server
- **Backend**: Express API with in-memory storage
- **Storage**: All data stored in RAM (no database needed)
- **Port**: 5000

---

## 🛑 Stop the Server

Press `Ctrl+C` in the terminal

---

## 💡 Features Available

Without any OAuth setup, you can:
- ✅ View the dashboard UI
- ✅ Create campaigns
- ✅ Add metrics and performance data
- ✅ Set up KPIs and alerts
- ✅ View charts and analytics

---

## 🔧 Optional: OAuth Setup

To enable Google Analytics 4, LinkedIn Ads, or Google Sheets:

1. Get OAuth credentials from the respective platforms
2. Add them to the `.env` file
3. Restart the server

---

## ❓ Troubleshooting

**"Node.js not found"**
- Install Node.js from https://nodejs.org/

**"Permission denied" (Mac/Linux)**
- Run: `chmod +x quick-start.sh`

**Port 5000 already in use**
- Change `PORT=5000` to another port in `.env`

**Need help?**
- Check the main documentation in `replit.md`
- Review `LINKEDIN_OAUTH_VALIDATION.md` for OAuth setup

---

## 🎯 Next Steps

1. Explore the dashboard
2. Create your first campaign
3. Set up KPI tracking
4. Configure integrations (optional)

Happy tracking! 🚀
