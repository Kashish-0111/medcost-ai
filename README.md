# MedCost AI 🏥

AI-Powered Healthcare Navigator & Cost Estimator — Find the best hospitals and estimate surgery costs instantly!

## Features ✨
- 🤖 AI-powered natural language search (Hindi + English)
- 🏥 Smart hospital ranking algorithm
- 💰 Detailed cost estimation (Surgery + Hospital + Medicines + Buffer)
- 🔑 JWT Authentication
- 📊 Search history saved to MongoDB
- 🐳 Docker ready

## Tech Stack 🛠️
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **AI:** OpenRouter (NVIDIA Nemotron free)
- **Auth:** JWT + bcryptjs

## Hospital Ranking Algorithm 📊
Score = Clinical×30% + Cost×25% + Reputation×25% + Capacity×20%

Factors: Success rate, accreditation (JCI/NABH), rating, budget fit

## Getting Started 🚀

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints 📡
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/search | Search hospitals |

## Example Query 💡
```json
{
    "procedure": "dil ki surgery",
    "city": "Delhi",
    "budget": 300000
}
```
AI detects → "Heart Surgery" → Top 5 hospitals ranked with cost breakdown!

## Cities Covered 🌍
Delhi, Mumbai, Bangalore

## GitHub
🔗 https://github.com/Kashish-0111/medcost-ai
