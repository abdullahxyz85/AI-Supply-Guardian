# 🛡️ AI Supply Guardian

Hey there! Welcome to AI Supply Guardian - a smart supply chain management system that actually makes sense of your supplier emails and helps you catch problems before they become disasters.

## What's This All About?

Look, managing suppliers is tough. You get hundreds of emails about delays, price changes, and order updates. Who has time to read them all? That's where we come in.

AI Supply Guardian uses AI agents to automatically read your supplier emails, extract the important stuff, and flag potential issues. Think of it as having a super-attentive assistant who never sleeps and never misses a detail.

## What Can It Do?

- **Email Intelligence**: Connects to your Gmail and automatically processes supplier communications
- **Smart Data Extraction**: AI agents pull out order details, delivery dates, prices, and tracking numbers
- **Risk Detection**: Spots delays, price hikes, and quality issues before they hurt your business
- **Supplier Management**: Keep track of all your suppliers and their performance in one place
- **Inventory Tracking**: Monitor stock levels and get alerts when things run low
- **Order Management**: See all your orders and their status at a glance
- **Beautiful Dashboard**: Actually looks good and is easy to use (we're proud of this one!)

## The Tech Stack

We built this with some solid tools:

- **Frontend**: React + TypeScript + Vite (fast and modern)
- **Styling**: Tailwind CSS (because life's too short for writing custom CSS)
- **Backend**: Python with Supabase (PostgreSQL for the win)
- **Auth**: Firebase + Google OAuth (secure and familiar)
- **AI Orchestration**: Opus AI Workflows (hackathon required technology)
- **LLM**: Google Gemini API (hackathon required technology)
- **Workflow Engine**: n8n for automation
- **Icons**: Lucide React (clean and consistent)

## Hackathon Technologies

This project was built specifically using the required hackathon technologies:

### 🎯 Opus Workflow

We designed our entire agent system using Opus workflow builder. The platform helped us orchestrate complex multi-agent interactions for email processing and risk analysis.

**Our Opus Workflow Architecture:**

<img width="1617" height="384" alt="Screenshot 2025-11-18 132109" src="https://github.com/user-attachments/assets/4d71aa08-dcb1-4598-abb3-d63aa8450a52" />

The workflow handles:

1. **Workflow Input** → Receives supplier emails
2. **Extract Risk Events** → AI agent extracts key information from emails
3. **Review & Analyze** → Validates and processes extracted data
4. **Supplier Performance Analysis** → Evaluates supplier reliability
5. **Generate Recommendations** → Creates actionable insights
6. **Dual Output Streams**:
   - Notifies stakeholders of critical issues
   - Updates operational database with insights

### 🤖 Google Gemini API Integration

We're using Google's Gemini API as our primary LLM for:

- Natural language understanding of supplier emails
- Extracting structured data from unstructured text
- Generating human-readable risk assessments
- Creating smart recommendations based on historical data

### ⚡ n8n Workflow Automation

While we showcase the Opus workflow design, our implementation also leverages n8n for production automation:

**n8n Implementation Details:**

<img width="581" height="530" alt="Screenshot 2025-11-18 131630" src="https://github.com/user-attachments/assets/cc8dd40d-4f9c-4c71-a72a-b32e9cadbd41" />


We've built multiple workflow pipelines:

- **Email Processing Pipeline**: Automatically fetches and processes Gmail messages
- **Data Extraction Pipeline**: Uses Gemini API to parse email content
- **Risk Analysis Pipeline**: Identifies patterns and flags potential issues
- **Database Operations**: Updates Supabase tables in real-time
- **Notification System**: Alerts team members of critical events

The n8n workflows mirror our Opus design but give us production-grade reliability and easier debugging during development.

## Themes? We Got 'Em!

Tired of boring purple UIs? Switch to our ArcFi-inspired orange theme. Dark mode is baked in because we know you're coding at 2 AM.

## Getting Started

### What You'll Need

- Node.js (v18 or higher)
- Python 3.8+
- A Supabase account (free tier works great)
- A Google Cloud account (for OAuth)

### Setting It Up

1. **Clone this bad boy**

```bash
git clone https://github.com/abdullahxyz85/AI-Supply-Guardian.git
cd AI-Supply-Guardian
```

2. **Install the frontend stuff**

```bash
npm install
```

3. **Set up your environment variables**

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

4. **Set up Supabase**

Run the SQL files in your Supabase SQL Editor:

```bash
# In this order:
1. supabase/schema.sql
2. supabase/migrations/add_google_oauth_tokens.sql
3. supabase/migrations/add_ai_analysis_results.sql
```

5. **Backend setup** (optional, for AI agents)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your API keys to .env
```

6. **Fire it up!**

```bash
npm run dev
```

Visit `http://localhost:5173` and you're good to go!

## How the AI Magic Works

Our agent system is built on Opus AI's orchestration platform, leveraging Google Gemini API for natural language processing.

### The Agent Architecture

**Primary Workflow (Opus-Powered):**

1. **Email Ingestion Agent**: Monitors Gmail inbox for supplier communications
2. **Extraction Agent**: Uses Gemini API to read emails and extract structured data (order IDs, dates, prices, tracking numbers)
3. **Risk Analysis Agent**: Evaluates extracted data against historical patterns and flags potential issues
4. **Recommendation Engine**: Generates actionable insights with confidence scores
5. **Database Sync Agent**: Updates your dashboard in real-time

The entire flow is orchestrated through Opus AI, which manages agent handoffs, error handling, and ensures reliable processing even with high email volumes.

### Why This Tech Stack?

- **Opus AI**: Provides visual workflow building and robust agent orchestration (hackathon requirement)
- **Google Gemini API**: Handles complex natural language understanding with high accuracy (hackathon requirement)
- **n8n**: Gives us production-ready automation and easy debugging
- **Supabase**: Real-time updates without the backend complexity

Both agents work autonomously once you connect your Gmail. They process emails in the background and update your dashboard as new information arrives.

## Database Schema

We've got 9 main tables:

- `suppliers` - Your supplier list
- `inventory` - Stock tracking
- `orders` - Order management
- `emails` - Raw email data
- `extracted_data` - AI-extracted information
- `risk_analysis` - Risk assessments
- `audit_log` - Change tracking
- `google_oauth_tokens` - OAuth credentials
- `ai_analysis_results` - Detailed AI analysis

All set up with proper relationships and real-time subscriptions.

## Project Structure

```
AI-Supply-Guardian/
├── src/
│   ├── components/      # React components
│   │   ├── Auth/        # Login/signup
│   │   ├── Inventory/   # Stock management
│   │   ├── Orders/      # Order tracking
│   │   ├── Risk/        # Email & risk analysis
│   │   └── Suppliers/   # Supplier management
│   ├── contexts/        # React contexts (auth, theme)
│   ├── lib/             # Utilities (Supabase, Firebase)
│   └── types/           # TypeScript types
├── backend/             # Python backend for AI agents
├── supabase/           # Database schema & migrations
└── public/             # Static assets
```

## Contributing

Found a bug? Have a cool idea? PRs are welcome! Just:

1. Fork it
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Known Issues

- AI agent integration is still being refined (works, but not perfect)
- Email parsing can be finicky with unusual formats
- Real-time updates sometimes lag (Supabase free tier limits)

## Roadmap

Things we're working on:

- [ ] Multi-language support
- [ ] Mobile app
- [ ] Advanced analytics dashboard
- [ ] Supplier performance scoring
- [ ] Automated reordering suggestions
- [ ] Integration with major ERPs

## License

MIT - do whatever you want with it, just don't sue us 😄

## Questions?

Open an issue or reach out. We're here to help!

---

Built with ☕ and late nights by developers who were tired of drowning in supplier emails.
