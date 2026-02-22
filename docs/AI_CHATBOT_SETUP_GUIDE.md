# 🤖 AI Chatbot Setup Guide

**Complete guide voor het configureren van de AI chatbot met RAG (Retrieval Augmented Generation)**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Setup Options](#setup-options)
5. [Quick Start](#quick-start)
6. [Configuration](#configuration)
7. [API Documentation](#api-documentation)
8. [Frontend Integration](#frontend-integration)
9. [Cost Optimization](#cost-optimization)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)

---

## Overview

De AI chatbot is een intelligente assistent die gebruikers helpt vragen te beantwoorden over jouw website/producten/diensten. De chatbot gebruikt **RAG (Retrieval Augmented Generation)** om context op te halen uit je kennisbank (blog posts, pagina's, FAQs) via Meilisearch en combineert dit met AI om accurate antwoorden te geven.

### Key Benefits

- ✅ **Accurate antwoorden** - Context uit je eigen content via Meilisearch
- ✅ **Kostenbesparing** - 95% cost reduction met Groq (gratis!)
- ✅ **Bronvermelding** - Toont welke pagina's gebruikt zijn
- ✅ **Self-hosted optie** - Privacy-first met Ollama
- ✅ **Hybride routing** - Automatisch beste model kiezen
- ✅ **CMS-gestuurd** - Volledig configureerbaar via admin panel

---

## Features

### 🎯 Core Features

- **RAG (Retrieval Augmented Generation)** - Zoekt eerst relevante content in Meilisearch
- **Multi-model support** - Groq, OpenAI, Ollama, Hybrid routing
- **Knowledge base integration** - Blog posts, pages, FAQs, products
- **Source attribution** - Toont bronlinks bij antwoorden
- **Conversation history** - Onthoudt vorige vragen/antwoorden
- **Rate limiting** - Bescherming tegen misbruik
- **Content moderation** - Blocked keywords, IP blocking
- **Analytics** - Usage tracking en conversation logging

### 🎨 UI Features

- **Floating widget** - Configureerbare positie (4 hoeken)
- **Customizable design** - Kleuren, iconen, berichten
- **Suggested questions** - Quick-start vragen
- **Mobile responsive** - Werkt op alle devices
- **Loading states** - Smooth animations
- **Error handling** - Vriendelijke foutmeldingen

### 🧠 AI Capabilities

- **Hybrid routing** - Automatisch model selectie:
  - Simple queries (< 15 woorden) → Groq (gratis)
  - Medium queries (15-30 woorden) → GPT-3.5
  - Complex queries (> 30 woorden) → GPT-4
- **Context extraction** - Haalt plain text uit Lexical content
- **Cost tracking** - Monitort AI usage en kosten
- **Fallback handling** - Graceful degradation bij failures

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Question                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
          ┌────────────────────────┐
          │  ChatbotWidget (UI)    │
          │  - Input validation    │
          │  - Message display     │
          │  - Source rendering    │
          └────────────┬───────────┘
                       │
                       ▼
          ┌────────────────────────┐
          │  /api/chatbot/chat     │
          │  - Feature flag check  │
          │  - Rate limiting       │
          │  - Error handling      │
          └────────────┬───────────┘
                       │
                       ▼
          ┌────────────────────────┐
          │  RAGChatbotService     │
          │  1. Load settings      │
          │  2. Search knowledge   │
          │  3. Build prompt       │
          │  4. Route to model     │
          │  5. Return response    │
          └────────────┬───────────┘
                       │
           ┌───────────┴───────────┐
           │                       │
           ▼                       ▼
  ┌────────────────┐     ┌────────────────┐
  │  Meilisearch   │     │  AI Model      │
  │  - Search docs │     │  - Groq        │
  │  - Fetch full  │     │  - OpenAI      │
  │  - Extract text│     │  - Ollama      │
  └────────────────┘     └────────────────┘
           │                       │
           └───────────┬───────────┘
                       │
                       ▼
          ┌────────────────────────┐
          │  Response + Sources    │
          └────────────────────────┘
```

---

## Setup Options

### Option 1: Groq (RECOMMENDED - Free & Fast) ⚡

**Best for:** 90% van alle chatbot queries

**Pros:**
- 🎉 Gratis! (14,400 requests/day)
- ⚡ 100x sneller dan OpenAI
- 🚀 Llama 3 70B model (hoge kwaliteit)
- ✅ OpenAI-compatible API

**Cons:**
- 🌐 External API (requires internet)
- 📊 Rate limits (meer dan genoeg voor meeste use cases)

**Setup:**
1. Ga naar https://console.groq.com/keys
2. Maak gratis account
3. Genereer API key
4. Voeg toe aan `.env`:
   ```bash
   GROQ_API_KEY=gsk_your_api_key_here
   ENABLE_CHATBOT=true
   ```

---

### Option 2: OpenAI (High Quality)

**Best for:** Complexe vragen, code generation, math

**Pros:**
- 🧠 GPT-4 = beste kwaliteit
- 📚 Grote context window
- 🔧 Veel features (functions, vision, etc.)

**Cons:**
- 💰 Kost geld ($0.01-0.03 per 1k tokens)
- 🐌 Langzamer dan Groq

**Setup:**
1. Ga naar https://platform.openai.com/api-keys
2. Maak API key
3. Voeg toe aan `.env`:
   ```bash
   OPENAI_API_KEY=sk-proj-...your-key...
   ENABLE_CHATBOT=true
   ```

---

### Option 3: Ollama (Self-hosted - Privacy First) 🏠

**Best for:** Privacy-sensitive deployments, no API costs

**Pros:**
- 🔒 100% privacy (runs locally)
- 💰 Geen API kosten
- ⚡ Snelle response (lokaal netwerk)

**Cons:**
- 🖥️ Vereist server resources (8GB+ RAM)
- 🔧 Meer setup werk
- 📊 Beperktere model keuze

**Setup:**

**macOS/Linux:**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull Llama 3 model
ollama pull llama3:8b

# Start server (runs on http://localhost:11434)
ollama serve
```

**Docker:**
```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
docker exec -it ollama ollama pull llama3:8b
```

**Configuration:**
```bash
# .env
OLLAMA_URL=http://localhost:11434
ENABLE_CHATBOT=true
```

---

### Option 4: Hybrid (Best of All Worlds) 🔀

**Best for:** Production deployments, cost optimization

**Pros:**
- 💰 95% cost reduction vs. GPT-4 only
- ⚡ Fast for simple queries (Groq)
- 🧠 Smart for complex queries (GPT-4)
- ✅ Automatic routing

**Cons:**
- 🔑 Vereist meerdere API keys

**Setup:**
```bash
# .env
GROQ_API_KEY=gsk_your_groq_key
OPENAI_API_KEY=sk-proj-your_openai_key
ENABLE_CHATBOT=true
```

**Routing Logic:**
- Simple queries (< 15 woorden) → Groq (gratis)
- Medium queries (15-30 woorden) → GPT-3.5 ($0.0005/1k tokens)
- Complex queries (> 30 woorden, code, math) → GPT-4 ($0.01/1k tokens)

**Cost Example (1000 chats/month):**
- 70% simple (700 chats) → Groq = €0
- 20% medium (200 chats) → GPT-3.5 = €0.10
- 10% complex (100 chats) → GPT-4 = €1.00
- **Total: €1.10/month** (vs. €10/month GPT-4 only!)

---

## Quick Start

### 1. Install Dependencies

Alle dependencies zijn al geïnstalleerd (OpenAI SDK wordt gebruikt voor Groq).

### 2. Configure Environment

```bash
# Minimum required (Groq - gratis!)
GROQ_API_KEY=gsk_your_api_key_here
ENABLE_CHATBOT=true

# Optional (Hybrid mode)
OPENAI_API_KEY=sk-proj-your_key_here

# Optional (Self-hosted)
OLLAMA_URL=http://localhost:11434
```

### 3. Configure in Admin Panel

1. Start development server:
   ```bash
   npm run dev
   ```

2. Login to admin: http://localhost:3020/admin

3. Go to **Globals → Chatbot Settings**

4. Configure:
   - ✅ Enable Chatbot
   - 🤖 Select Model (groq, gpt-4, hybrid)
   - 🎨 Customize UI (position, colors, messages)
   - 🧠 Configure RAG (knowledge base integration)
   - 🛡️ Setup rate limiting

### 4. Add to Your Site

De chatbot wordt automatisch toegevoegd via `ChatbotProvider` component.

**RootLayout integration** (already done):
```tsx
// src/app/(frontend)/layout.tsx
import { ChatbotProvider } from '@/branches/shared/components/features/chatbot'

export default async function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatbotProvider />
      </body>
    </html>
  )
}
```

### 5. Test

1. Open http://localhost:3020
2. Zie floating chat button (rechtsonder)
3. Klik om chatbot te openen
4. Test met voorbeeldvraag: "Wat zijn jullie openingstijden?"

---

## Configuration

### Admin Panel Settings

Ga naar **Globals → Chatbot Settings** in admin panel.

#### Tab 1: General Settings

- **Enable Chatbot** - On/off toggle
- **AI Model** - groq, gpt-4, gpt-3.5, ollama, hybrid
- **Temperature** - 0-2 (0 = factual, 2 = creative)
- **Max Tokens** - Response length (500 = default)
- **Context Window** - Number of messages to remember (5 = default)

#### Tab 2: UI Customization

- **Position** - bottom-right, bottom-left, top-right, top-left
- **Button Color** - Hex color (e.g., #0ea5e9)
- **Button Icon** - chat, robot, lightbulb, question
- **Welcome Message** - First message shown
- **Placeholder** - Input field placeholder
- **Suggested Questions** - Quick-start vragen

#### Tab 3: Context & Training

- **System Prompt** - AI instructions/personality
- **Knowledge Base Integration** (RAG):
  - ✅ Enable RAG
  - Max Results (3 = default)
  - Include Source Links
  - Collections to Search (blog-posts, pages, faqs, products)
- **Training Context** - Extra company info, FAQs, policies

#### Tab 4: Rate Limiting & Security

- **Rate Limiting**:
  - Max Messages per Hour (20 = default)
  - Max Messages per Day (50 = default)
  - Cooldown Seconds (3 = default)
  - Blocked IPs
- **Content Moderation**:
  - Enable Moderation
  - Blocked Keywords

#### Tab 5: Advanced

- **API Configuration** - Status van API keys
- **Analytics** - Logging, retention days
- **Fallback** - Error messages, contact email

---

## API Documentation

### POST /api/chatbot/chat

Send a message to the chatbot.

**Request:**
```json
{
  "message": "Wat zijn jullie openingstijden?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hallo!",
      "timestamp": 1234567890
    },
    {
      "role": "assistant",
      "content": "Hallo! Hoe kan ik je helpen?",
      "timestamp": 1234567891
    }
  ],
  "sessionId": "session_123_abc"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "answer": "We zijn geopend van maandag t/m vrijdag van 9:00 tot 17:00 uur.",
    "sources": [
      {
        "title": "Contact & Openingstijden",
        "url": "/contact",
        "excerpt": "Onze winkel is geopend van maandag t/m vrijdag..."
      }
    ],
    "model": "groq-llama3-70b",
    "usage": {
      "promptTokens": 150,
      "completionTokens": 50,
      "totalTokens": 200
    },
    "cost": 0,
    "timestamp": 1234567892
  }
}
```

**Response (Error):**
```json
{
  "error": "Rate limit exceeded",
  "message": "Please try again in a few moments"
}
```

**Rate Limits:**
- Message length: max 1000 characters
- Conversation history: max 50 messages
- Configurable per-user limits in admin

---

### GET /api/chatbot/chat

Check if chatbot is available.

**Response:**
```json
{
  "available": true,
  "models": {
    "groq": true,
    "openai": true,
    "ollama": false
  }
}
```

---

## Frontend Integration

### Using ChatbotProvider (Recommended)

De `ChatbotProvider` component haalt automatisch settings op uit Payload en rendert de chatbot widget.

```tsx
import { ChatbotProvider } from '@/branches/shared/components/features/chatbot'

export default async function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatbotProvider />
      </body>
    </html>
  )
}
```

### Custom Integration

Als je volledige controle wilt:

```tsx
'use client'

import { ChatbotWidget } from '@/branches/shared/components/features/chatbot'

export function MyChatbot() {
  const settings = {
    enabled: true,
    model: 'hybrid',
    temperature: 0.7,
    maxTokens: 500,
    contextWindow: 5,
    position: 'bottom-right',
    buttonColor: '#0ea5e9',
    buttonIcon: 'chat',
    welcomeMessage: 'Hallo! Hoe kan ik je helpen?',
    placeholder: 'Typ je vraag...',
    knowledgeBaseIntegration: {
      enabled: true,
      maxResults: 3,
      includeSourceLinks: true,
      searchCollections: ['blog-posts', 'pages'],
    },
  }

  return <ChatbotWidget settings={settings} />
}
```

### Using the useChatbot Hook

Voor custom UI:

```tsx
'use client'

import { useChatbot } from '@/branches/shared/components/features/chatbot'

export function MyCustomChatUI() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation,
    isAvailable,
  } = useChatbot()

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i} className={msg.role}>
          {msg.content}
        </div>
      ))}

      <form onSubmit={(e) => {
        e.preventDefault()
        sendMessage(e.target.message.value)
      }}>
        <input name="message" />
        <button disabled={isLoading}>Send</button>
      </form>
    </div>
  )
}
```

---

## Cost Optimization

### Hybrid Routing Strategy

De chatbot gebruikt automatisch het goedkoopste model dat geschikt is voor de vraag:

**Query Complexity Analysis:**
```typescript
function determineModel(query: string): string {
  const wordCount = query.split(/\s+/).length
  const hasCode = /```|code|function|class/i.test(query)
  const hasMath = /berekening|formule|equation/i.test(query)
  const hasComplex = /waarom|uitleg|verschil tussen|vergelijk/i.test(query)

  // Complex → GPT-4
  if (wordCount > 30 || hasCode || hasMath || hasComplex) {
    return 'gpt-4'
  }

  // Medium → GPT-3.5
  if (wordCount > 15) {
    return 'gpt-3.5'
  }

  // Simple → Groq (free!)
  return 'groq'
}
```

### Cost Breakdown (1000 chats/month)

**Groq Only (RECOMMENDED for most sites):**
- Cost: €0 (14,400 requests/day free!)
- Quality: Excellent (Llama 3 70B)
- Speed: 100x faster than OpenAI

**Hybrid Mode (RECOMMENDED for complex sites):**
- 70% simple → Groq = €0
- 20% medium → GPT-3.5 = €0.10
- 10% complex → GPT-4 = €1.00
- **Total: €1.10/month**

**OpenAI Only (Not recommended):**
- 100% GPT-4 → €10-15/month
- Slower responses
- Higher costs

### Best Practices

1. **Start with Groq** - Test if it's good enough (usually is!)
2. **Enable Hybrid** - If you need GPT-4 for some queries
3. **Monitor Usage** - Check analytics in admin panel
4. **Optimize System Prompt** - Better prompts = cheaper tokens
5. **Enable Caching** - Reuse responses for similar questions

---

## Testing

### Manual Testing

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:** http://localhost:3020

3. **Test scenarios:**
   - ✅ Simple question: "Wat zijn jullie openingstijden?"
   - ✅ Knowledge base question: "Hoe werkt jullie verzending?"
   - ✅ Product question: "Verkopen jullie X?"
   - ✅ Complex question: "Wat is het verschil tussen product A en B?"
   - ✅ Error handling: Send empty message
   - ✅ Rate limiting: Send 51+ messages quickly

### API Testing

**Test with cURL:**
```bash
# Check availability
curl http://localhost:3020/api/chatbot/chat

# Send message
curl -X POST http://localhost:3020/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Wat zijn jullie openingstijden?"
  }'
```

### Unit Testing

```typescript
// Example test (add to your test suite)
import { RAGChatbotService } from '@/lib/ai/RAGChatbotService'

describe('RAGChatbotService', () => {
  it('should return response with sources', async () => {
    const chatbot = new RAGChatbotService()
    const response = await chatbot.chat('Wat zijn jullie openingstijden?')

    expect(response.answer).toBeDefined()
    expect(response.sources).toBeArray()
    expect(response.model).toBeDefined()
  })
})
```

---

## Troubleshooting

### Chatbot Not Appearing

**Problem:** Chatbot widget niet zichtbaar op site

**Solutions:**
1. Check feature flag: `ENABLE_CHATBOT=true` in `.env`
2. Check admin panel: Globals → Chatbot Settings → Enabled = true
3. Check API keys: `GROQ_API_KEY` or `OPENAI_API_KEY` is set
4. Check console for errors: F12 → Console tab
5. Verify ChatbotProvider is added to RootLayout

### "Chatbot feature is not enabled"

**Problem:** API returns 403 Forbidden

**Solutions:**
1. Set `ENABLE_CHATBOT=true` in `.env`
2. Restart dev server: `npm run dev`
3. Verify feature flag is loaded: Check `/api/chatbot/chat` endpoint

### "No AI model available"

**Problem:** No API keys configured

**Solutions:**
1. Get free Groq API key: https://console.groq.com/keys
2. Add to `.env`: `GROQ_API_KEY=gsk_...`
3. Restart server
4. Test: `curl http://localhost:3020/api/chatbot/chat`

### "Rate limit exceeded"

**Problem:** Too many requests from Groq

**Solutions:**
1. Groq free tier: 14,400 requests/day (very generous!)
2. Check if you're actually hitting limits (unlikely)
3. Add OpenAI as fallback: `OPENAI_API_KEY=sk-...`
4. Enable hybrid mode in admin panel

### No Knowledge Base Results

**Problem:** Chatbot doesn't use context from blog/pages

**Solutions:**
1. Check Meilisearch is running: `curl http://localhost:7700/health`
2. Index your content: Run Meilisearch sync in admin
3. Verify RAG is enabled: Chatbot Settings → Knowledge Base Integration → Enabled
4. Check search collections: Make sure blog-posts, pages are selected
5. Test search: `/api/search?q=test`

### Ollama Connection Failed

**Problem:** "Ollama server not available"

**Solutions:**
1. Check Ollama is running: `ollama list`
2. Start Ollama server: `ollama serve`
3. Verify URL: `OLLAMA_URL=http://localhost:11434` in `.env`
4. Test connection: `curl http://localhost:11434/api/tags`
5. Pull model: `ollama pull llama3:8b`

### Slow Responses

**Problem:** Chatbot takes >5 seconds to respond

**Solutions:**
1. Use Groq (100x faster than OpenAI!)
2. Reduce maxTokens in admin panel (500 → 300)
3. Disable RAG if not needed (faster but less accurate)
4. Use Ollama locally (fastest option)
5. Enable caching for common questions

---

## Advanced Configuration

### Custom System Prompts

**Example 1: E-commerce Store**
```
Je bent een behulpzame verkoopassistent voor [BEDRIJF].

Beantwoord vragen over producten, prijzen, verzending en retourbeleid.
Wees vriendelijk en professioneel.
Als je het antwoord niet zeker weet, zeg dat eerlijk en verwijs naar contact.

Belangrijke informatie:
- Gratis verzending vanaf €50
- 30 dagen retourrecht
- Verzending binnen 24 uur
- Contact: info@bedrijf.nl, 020-1234567
```

**Example 2: SaaS Platform**
```
Je bent een technische support assistent voor [PRODUCT].

Help gebruikers met:
- Account setup en configuratie
- Feature uitleg en best practices
- Troubleshooting en debugging
- API documentatie vragen

Gebruik technische taal maar blijf begrijpelijk.
Verwijs naar docs voor complexe vragen.
```

### Multi-Language Support

De chatbot ondersteunt automatisch de taal van de gebruiker:

```typescript
// In system prompt
Je bent een meertalige assistent.
- Nederlands: Standaard taal
- Engels: Voor internationale klanten
- Duits/Frans: Op verzoek

Detecteer automatisch de taal van de vraag en antwoord in dezelfde taal.
```

### Custom Knowledge Base Collections

```typescript
// In ChatbotSettings
knowledgeBaseIntegration: {
  enabled: true,
  maxResults: 5, // More context
  searchCollections: [
    'blog-posts',
    'pages',
    'products',
    'faqs',
    'cases',
    'documentation' // Custom collection
  ],
}
```

---

## Performance Monitoring

### Analytics Dashboard (Future Feature)

Track in admin panel:
- Total conversations
- Average response time
- Most asked questions
- Source attribution (which pages help most)
- Cost per conversation
- Model usage breakdown

### Manual Tracking

Check usage in API responses:

```typescript
const response = await chatbot.chat(message)

console.log('Model used:', response.model)
console.log('Tokens:', response.usage?.totalTokens)
console.log('Cost:', response.cost)
console.log('Sources:', response.sources.length)
```

---

## Next Steps

1. **Basic Setup** - Get free Groq API key and enable chatbot
2. **Customize** - Configure UI, messages, suggested questions
3. **Test** - Try various questions and scenarios
4. **Optimize** - Monitor usage and adjust settings
5. **Scale** - Enable hybrid mode if needed

---

## Support

**Questions?**
- 📚 Check troubleshooting section above
- 🐛 Report bugs via GitHub issues
- 💡 Feature requests welcome!

**Useful Links:**
- Groq Console: https://console.groq.com
- OpenAI Platform: https://platform.openai.com
- Ollama Docs: https://ollama.com
- Meilisearch Docs: https://docs.meilisearch.com

---

**Happy chatting! 🤖✨**
