# BQ - AI Tool Discovery Platform

BQ is a production-ready, AI-powered tool discovery platform that performs **real-time internet research** to recommend the best AI tools for your specific needs.

## 🚀 Features

- **Real-Time Research**: Scours DuckDuckGo, GitHub, Reddit, and ProductHunt in parallel.
- **Smart Categorization**: Automatically categorizes tools as Free, Freemium, Paid, or Open Source.
- **Honest Reviews**: Highlights key strengths and honest limitations/gotchas.
- **Privacy First**: No login required, conversation history stored locally.
- **100% Free Stack**: Built on free tiers of Vercel, Groq, and public APIs.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes (Serverless)
- **AI Engine**: Groq API (Llama 3.1 70b)
- **Research**: DuckDuckGo API, GitHub API, Reddit JSON API, Cheerio (ProductHunt)

## 📦 Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/bq-mvp.git
    cd bq-mvp
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Copy `.env.local.example` to `.env.local` and add your Groq API key:
    ```bash
    cp .env.local.example .env.local
    ```
    Get your free API key from [Groq Console](https://console.groq.com).

4.  **Run Locally**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## 🌐 Deployment

Deploy to Vercel in minutes:

1.  Push your code to a GitHub repository.
2.  Import the project on [Vercel](https://vercel.com).
3.  Add the `GROQ_API_KEY` environment variable in the Vercel dashboard.
4.  Deploy!

## ⚠️ Limitations & Known Issues

-   **Rate Limits**: GitHub and Reddit APIs have rate limits. If research fails, try again in a few minutes.
-   **Scraping**: ProductHunt scraping is fragile and may break if their DOM changes.
-   **Context Window**: Extremely long conversations may hit the LLM context limit (though Llama 3.1 has a large window).

## 📄 License

MIT License. Built for the AI Agentic Coding Challenge.
