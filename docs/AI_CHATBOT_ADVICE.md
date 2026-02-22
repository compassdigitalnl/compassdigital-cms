# AI Chatbot Implementatie Advies

**Datum:** 22 Februari 2026
**Status:** Advies Document
**Context:** Payload CMS Platform met Meilisearch, OpenAI integratie

---

## Executive Summary

Er zijn **3 hoofdcategorieën** voor AI chatbot implementatie:

1. **🏠 Self-Hosted Binary** (zoals Meilisearch) - Volledige controle, geen externe kosten
2. **☁️ Managed API Services** - Plug & play, betaal per gebruik
3. **🔌 Hybrid Approach** - Combinatie van self-hosted LLM + managed services

**💡 Aanbeveling:** Start met **Hybrid Approach** (self-hosted embeddings + OpenAI API voor chat), migreer later naar volledig self-hosted als traffic groeit.

---

## Optie 1: Self-Hosted Binary Solutions (Recommended voor jouw use case)

### A. Ollama (⭐ Top Keuze voor Binary Deployment)

**Wat is het?**
- Open-source LLM runtime (zoals Docker voor AI modellen)
- Eén binary file, draait lokaal of op server
- Ondersteunt 50+ modellen (Llama 3, Mistral, Phi, etc.)
- **Vergelijkbaar met Meilisearch qua deployment**

**✅ Voordelen:**
- ✅ **Single binary deployment** - Net als Meilisearch
- ✅ **Gratis/unlimited** - Geen API kosten
- ✅ **Privacy** - Data blijft op eigen server
- ✅ **Low latency** - Geen externe API calls
- ✅ **Offline capable** - Werkt zonder internet
- ✅ **Easy setup** - 1 commando om te installeren
- ✅ **Model switching** - Wissel tussen modellen zonder code changes

**❌ Nadelen:**
- ❌ Vereist GPU voor goede performance (of trage CPU inferentie)
- ❌ RAM vereisten: 8GB+ voor kleine modellen, 32GB+ voor grote
- ❌ Model kwaliteit iets lager dan GPT-4 (maar Llama 3 70B komt dichtbij)
- ❌ Hosting kosten voor GPU server (~€100-300/maand voor dedicated GPU)

**📦 Installatie:**

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Start server
ollama serve

# Download en run een model
ollama pull llama3:8b
ollama run llama3:8b

# API is beschikbaar op http://localhost:11434
```

**💻 Implementatie in je app:**

```typescript
// src/lib/ai/OllamaClient.ts
export class OllamaClient {
  private baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434'

  async chat(messages: Array<{ role: string; content: string }>) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3:8b',
        messages,
        stream: false,
      }),
    })

    const data = await response.json()
    return data.message.content
  }

  async embed(text: string) {
    const response = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'nomic-embed-text',
        prompt: text,
      }),
    })

    const data = await response.json()
    return data.embedding
  }
}
```

**🎯 Use Cases:**
- ✅ Product vragen beantwoorden
- ✅ Knowledge base chatbot
- ✅ Document Q&A
- ✅ Content suggesties
- ❌ Complexe reasoning (gebruik dan OpenAI GPT-4 als fallback)
- ❌ Code generation (Llama 3 is hier zwakker)

**💰 Kosten:**
- **Binary zelf:** Gratis
- **Server:**
  - CPU only (traag): €20-50/maand (bestaande server)
  - GPU (snel): €100-300/maand (dedicated GPU server)
  - GPU cloud (Hetzner): €80/maand voor RTX 3090 equivalent
  - GPU cloud (RunPod): €0.40/uur spot pricing (~€290/maand 24/7)

**📊 Performance:**
- **Llama 3 8B:** ~50 tokens/sec op GPU, ~5 tokens/sec op CPU
- **Llama 3 70B:** ~10 tokens/sec op multi-GPU, onbruikbaar op CPU

**🚀 Deployment Opties:**

1. **Lokale development:**
   ```bash
   ollama serve
   ```

2. **Docker (productie):**
   ```dockerfile
   FROM ollama/ollama:latest

   # Download models tijdens build
   RUN ollama pull llama3:8b
   RUN ollama pull nomic-embed-text

   EXPOSE 11434
   CMD ["ollama", "serve"]
   ```

3. **Server deployment (Ploi/Railway):**
   ```bash
   # Install op server
   curl -fsSL https://ollama.com/install.sh | sh

   # Systemd service (auto-start)
   sudo systemctl enable ollama
   sudo systemctl start ollama

   # Models downloaden
   ollama pull llama3:8b
   ```

**🔧 Aanbevolen Setup:**

```yaml
# docker-compose.yml
services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_MODELS=/root/.ollama/models
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

volumes:
  ollama_data:
```

---

### B. LocalAI (Alternatief voor Ollama)

**Wat is het?**
- OpenAI-compatible API server
- Draait lokaal, ondersteunt meerdere model formaten
- Drop-in replacement voor OpenAI API

**✅ Voordelen:**
- ✅ OpenAI API compatible (makkelijk om te switchen)
- ✅ Gratis/unlimited
- ✅ Ondersteunt meer model formaten dan Ollama

**❌ Nadelen:**
- ❌ Complexere setup dan Ollama
- ❌ Minder geoptimaliseerd dan Ollama
- ❌ Kleinere community

**📦 Installatie:**

```bash
# Docker
docker run -p 8080:8080 -v $PWD/models:/models localai/localai:latest
```

**💻 Gebruik (OpenAI compatible):**

```typescript
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'http://localhost:8080/v1',
  apiKey: 'not-needed', // LocalAI vereist geen key
})

const response = await client.chat.completions.create({
  model: 'llama3-8b',
  messages: [{ role: 'user', content: 'Hallo!' }],
})
```

---

### C. LLaMA.cpp + HTTP Server

**Wat is het?**
- C++ implementatie van LLaMA modellen
- Ultra-fast, minimale dependencies
- Kan als HTTP server draaien

**✅ Voordelen:**
- ✅ Snelste CPU inferentie
- ✅ Laagste memory footprint
- ✅ Beste performance/watt ratio

**❌ Nadelen:**
- ❌ Vereist handmatige model conversie
- ❌ Minder user-friendly dan Ollama
- ❌ Meer technische kennis nodig

**💡 Advies:** Gebruik Ollama tenzij je extreme performance optimalisatie nodig hebt.

---

## Optie 2: Managed API Services (Plug & Play)

### A. OpenAI API (Je hebt dit al!)

**Wat heb je al:**
- ✅ OpenAI API key geconfigureerd
- ✅ `/api/ai/*` endpoints beschikbaar

**💻 Chatbot Implementation:**

```typescript
// src/lib/ai/ChatbotService.ts
import OpenAI from 'openai'

export class ChatbotService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  async chat(messages: Array<{ role: string; content: string }>, context?: string) {
    const systemPrompt = `
      Je bent een behulpzame AI assistent voor ${process.env.COMPANY_NAME}.

      Context over het bedrijf:
      ${context || 'Geen specifieke context beschikbaar.'}

      Beantwoord vragen vriendelijk en professioneel in het Nederlands.
    `

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return response.choices[0].message.content
  }

  async chatWithKnowledgeBase(query: string, posts: any[]) {
    // Vind relevante blog posts
    const relevantContext = posts
      .slice(0, 3)
      .map(p => `# ${p.title}\n${p.excerpt}`)
      .join('\n\n')

    return this.chat(
      [{ role: 'user', content: query }],
      `Relevante kennisbank artikelen:\n\n${relevantContext}`
    )
  }
}
```

**💰 Kosten (OpenAI GPT-4 Turbo):**
- Input: $10 per 1M tokens (~750K woorden)
- Output: $30 per 1M tokens
- **Typisch chat gesprek:** ~$0.01-0.05 per conversatie
- **100 chats/dag:** ~$30-150/maand
- **1000 chats/dag:** ~$300-1500/maand

**💡 Cost Optimization:**
- Gebruik GPT-3.5 Turbo voor simpele vragen (~10x goedkoper)
- Cache system prompts
- Limiet op max_tokens
- Rate limiting per user

---

### B. Anthropic Claude API

**Voordelen over OpenAI:**
- ✅ Langere context window (200K tokens vs 128K)
- ✅ Beter in het volgen van instructies
- ✅ Vaak beter in Nederlands
- ✅ Minder "hallucinations"

**❌ Nadelen:**
- ❌ Duurder dan GPT-4 Turbo
- ❌ Langzamer response tijd

**💰 Kosten (Claude 3 Sonnet):**
- Input: $15 per 1M tokens
- Output: $75 per 1M tokens
- ~1.5-2x duurder dan GPT-4

---

### C. Groq API (⚡ Fastest Inference)

**Wat is het?**
- Managed API voor LLaMA, Mixtral modellen
- **100x sneller** dan OpenAI (custom hardware)
- Gratis tier beschikbaar!

**✅ Voordelen:**
- ✅ **Extreem snel** - 500+ tokens/sec
- ✅ **Gratis tier** - 14,400 requests/dag
- ✅ **Goedkoop** - $0.10 per 1M tokens (100x goedkoper dan GPT-4!)
- ✅ OpenAI-compatible API

**❌ Nadelen:**
- ❌ Model kwaliteit lager dan GPT-4
- ❌ Kortere context window (32K)

**💻 Implementatie:**

```typescript
import OpenAI from 'openai'

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

const response = await groq.chat.completions.create({
  model: 'llama3-70b-8192',
  messages: [{ role: 'user', content: 'Hallo!' }],
})
```

**💰 Kosten:**
- **Gratis tier:** 14,400 requests/dag
- **Betaald:** $0.10 per 1M tokens (~300x goedkoper dan GPT-4)

**🎯 Perfect voor:**
- ✅ Snelle responses (real-time chat)
- ✅ Hoog volume (goedkoop)
- ✅ Simpele tot medium complexe vragen
- ❌ Complexe reasoning (gebruik GPT-4)

**💡 Aanbeveling:** Gebruik Groq voor 90% van vragen, fallback naar GPT-4 voor complexe vragen.

---

### D. Together.ai (Goedkoop + Veel Modellen)

**Voordelen:**
- 60+ open-source modellen
- Pay-per-use pricing
- Goedkoper dan OpenAI

**💰 Kosten:**
- Llama 3 70B: $0.90 per 1M tokens
- Mixtral 8x7B: $0.60 per 1M tokens

---

## Optie 3: Hybrid Approach (⭐ AANBEVOLEN)

### Strategie: Best of Both Worlds

**Architectuur:**

```
User Query
    ↓
[Meilisearch Search] → Vind relevante docs
    ↓
[Embeddings (Local)] → Ollama/LocalAI voor embeddings
    ↓
[Rerank & Filter]
    ↓
[LLM Response]
    ├─ Simple query → Groq (fast + cheap)
    ├─ Medium query → Ollama (free + privacy)
    └─ Complex query → OpenAI GPT-4 (quality)
```

**💻 Implementatie:**

```typescript
// src/lib/ai/HybridChatbot.ts
import { OllamaClient } from './OllamaClient'
import { MeilisearchClient } from './MeilisearchClient'
import OpenAI from 'openai'

export class HybridChatbot {
  private ollama = new OllamaClient()
  private meilisearch = new MeilisearchClient()
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  private groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  })

  async chat(query: string, conversationHistory: any[] = []) {
    // 1. Search knowledge base via Meilisearch
    const relevantDocs = await this.meilisearch.search(query, { limit: 3 })

    // 2. Generate embeddings locally (privacy + free)
    const queryEmbedding = await this.ollama.embed(query)

    // 3. Build context
    const context = relevantDocs
      .map(doc => `# ${doc.title}\n${doc.content}`)
      .join('\n\n')

    // 4. Determine complexity
    const complexity = this.analyzeComplexity(query)

    // 5. Route to appropriate LLM
    if (complexity === 'simple') {
      // Fast + cheap (Groq)
      return this.chatWithGroq(query, context, conversationHistory)
    } else if (complexity === 'medium') {
      // Free + private (Ollama)
      return this.chatWithOllama(query, context, conversationHistory)
    } else {
      // High quality (OpenAI)
      return this.chatWithOpenAI(query, context, conversationHistory)
    }
  }

  private analyzeComplexity(query: string): 'simple' | 'medium' | 'complex' {
    const wordCount = query.split(' ').length
    const hasCode = /```|code|function|class/.test(query)
    const hasMath = /berekening|formule|equation/.test(query)

    if (wordCount > 50 || hasCode || hasMath) return 'complex'
    if (wordCount > 20) return 'medium'
    return 'simple'
  }

  private async chatWithGroq(query: string, context: string, history: any[]) {
    const response = await this.groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: `Context:\n${context}` },
        ...history,
        { role: 'user', content: query },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return {
      answer: response.choices[0].message.content,
      model: 'groq-llama3-70b',
      cost: 0, // Gratis tier
    }
  }

  private async chatWithOllama(query: string, context: string, history: any[]) {
    const answer = await this.ollama.chat([
      { role: 'system', content: `Context:\n${context}` },
      ...history,
      { role: 'user', content: query },
    ])

    return {
      answer,
      model: 'ollama-llama3-8b',
      cost: 0, // Gratis
    }
  }

  private async chatWithOpenAI(query: string, context: string, history: any[]) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: `Context:\n${context}` },
        ...history,
        { role: 'user', content: query },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const inputTokens = response.usage?.prompt_tokens || 0
    const outputTokens = response.usage?.completion_tokens || 0
    const cost = (inputTokens * 0.01 + outputTokens * 0.03) / 1000

    return {
      answer: response.choices[0].message.content,
      model: 'gpt-4-turbo',
      cost,
    }
  }
}
```

**💰 Kosten Breakdown (1000 chats/maand):**

| Scenario | Model | Kosten/maand | Response tijd |
|----------|-------|--------------|---------------|
| **100% OpenAI** | GPT-4 | €300-1500 | 5-10s |
| **100% Groq** | Llama 3 70B | €0 (gratis tier) | 1-2s |
| **100% Ollama** | Llama 3 8B | €80 (GPU server) | 2-5s |
| **Hybrid (aanbevolen)** | Mix | €50-200 | 2-8s |

**Hybrid verdeling:**
- 60% Simple queries → Groq (gratis)
- 30% Medium queries → Ollama (server cost)
- 10% Complex queries → GPT-4 (~€30-150/maand)

---

## RAG (Retrieval Augmented Generation) Setup

**Wat is RAG?**
Combinatie van search (Meilisearch) + AI (LLM) voor accurate antwoorden uit je eigen content.

### Full Implementation

```typescript
// src/lib/ai/RAGService.ts
import { getPayload } from 'payload'
import config from '@payload-config'

export class RAGService {
  private chatbot = new HybridChatbot()

  async answerQuestion(question: string) {
    const payload = await getPayload({ config })

    // 1. Search via Meilisearch (je hebt dit al!)
    const searchResults = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/search?q=${encodeURIComponent(question)}`
    ).then(r => r.json())

    // 2. Get full content van top 3 results
    const relevantPosts = await Promise.all(
      searchResults.hits.slice(0, 3).map(async (hit: any) => {
        const post = await payload.findByID({
          collection: 'blog-posts',
          id: hit.id,
          depth: 0,
        })
        return post
      })
    )

    // 3. Build context
    const context = relevantPosts
      .map(post => `
        Titel: ${post.title}

        ${post.excerpt}

        ${this.extractText(post.content)}
      `)
      .join('\n\n---\n\n')

    // 4. Ask LLM with context
    const response = await this.chatbot.chat(question, [])

    return {
      answer: response.answer,
      sources: relevantPosts.map(p => ({
        title: p.title,
        url: `/blog/${p.categories[0].slug}/${p.slug}`,
      })),
      model: response.model,
    }
  }

  private extractText(lexicalContent: any): string {
    // Extract plain text from Lexical
    // (gebruik calculateReadingTime logic)
  }
}
```

### API Endpoint

```typescript
// src/app/api/chatbot/route.ts
import { NextRequest } from 'next/server'
import { RAGService } from '@/lib/ai/RAGService'

export async function POST(req: NextRequest) {
  const { question, conversationId } = await req.json()

  const rag = new RAGService()
  const response = await rag.answerQuestion(question)

  return Response.json(response)
}
```

### Frontend Component

```tsx
// src/components/Chatbot.tsx
'use client'

import { useState } from 'react'

export function Chatbot() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      })

      const data = await response.json()

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
          model: data.model,
        },
      ])
    } catch (error) {
      console.error('Chatbot error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chatbot-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <p>{msg.content}</p>
            {msg.sources && (
              <div className="sources">
                <p>Bronnen:</p>
                {msg.sources.map((source: any, j: number) => (
                  <a key={j} href={source.url}>{source.title}</a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Stel een vraag..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? 'Laden...' : 'Verstuur'}
        </button>
      </div>
    </div>
  )
}
```

---

## Deployment Scenario's

### Scenario 1: Minimale Setup (Start klein)

**Stack:**
- Groq API (gratis tier) voor chat
- Meilisearch (je hebt dit al) voor search
- OpenAI embeddings (klein volume, goedkoop)

**Kosten:** €0-20/maand
**Setup tijd:** 1-2 dagen
**Performance:** Uitstekend

**Deployment:**
```bash
# .env
GROQ_API_KEY=xxx
OPENAI_API_KEY=xxx # Voor fallback
MEILISEARCH_HOST=xxx # Je hebt dit al
```

---

### Scenario 2: Privacy-First (Self-hosted)

**Stack:**
- Ollama binary op server voor chat
- Meilisearch voor search
- Ollama embeddings (gratis, lokaal)

**Kosten:** €80-150/maand (GPU server)
**Setup tijd:** 3-5 dagen
**Performance:** Goed (afhankelijk van GPU)

**Deployment:**
```bash
# Server setup
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3:8b
ollama pull nomic-embed-text

# Systemd service
sudo systemctl enable ollama
sudo systemctl start ollama

# .env
OLLAMA_URL=http://localhost:11434
```

---

### Scenario 3: Production-Ready Hybrid (⭐ AANBEVOLEN)

**Stack:**
- Groq API voor 80% van queries (snel + goedkoop)
- Ollama op server voor privacy-gevoelige vragen
- OpenAI GPT-4 voor complexe vragen (10%)
- Meilisearch voor search + caching

**Kosten:** €100-300/maand
**Setup tijd:** 1 week
**Performance:** Excellent

**Architecture:**

```
                    ┌─────────────┐
                    │   User      │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Frontend   │
                    │  Chatbot    │
                    └──────┬──────┘
                           │
                    ┌──────▼────────┐
                    │ /api/chatbot  │
                    └──────┬────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
         ┌──────▼──────┐      ┌──────▼──────┐
         │ Meilisearch │      │ RAG Service │
         │   Search    │      │   Router    │
         └─────────────┘      └──────┬──────┘
                                     │
                        ┌────────────┼────────────┐
                        │            │            │
                 ┌──────▼──────┐ ┌──▼───┐ ┌──────▼──────┐
                 │ Groq API    │ │Ollama│ │ OpenAI API  │
                 │ (80% fast)  │ │(10%) │ │ (10% smart) │
                 └─────────────┘ └──────┘ └─────────────┘
```

**Deployment:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Je hebt dit al!
  meilisearch:
    image: getmeili/meilisearch:latest
    ports:
      - "7700:7700"
    volumes:
      - meilisearch_data:/meili_data
    environment:
      - MEILI_MASTER_KEY=${MEILI_MASTER_KEY}

  # Nieuw: Ollama voor privacy
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  # Je app (Payload + Next.js)
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OLLAMA_URL=http://ollama:11434
      - MEILISEARCH_HOST=http://meilisearch:7700
    depends_on:
      - meilisearch
      - ollama

volumes:
  meilisearch_data:
  ollama_data:
```

---

## Hardware Requirements

### CPU-Only (Budget)

**Server specs:**
- CPU: 8+ cores
- RAM: 16GB+
- Storage: 50GB SSD

**Performance:**
- Llama 3 8B: ~5 tokens/sec (traag maar werkbaar)
- Response tijd: 10-30 seconden

**Kosten:** €20-50/maand
**Geschikt voor:** Low traffic, budget projects

---

### GPU Server (Recommended)

**Server specs:**
- GPU: NVIDIA RTX 3090 / RTX 4090 / A4000
- CPU: 8+ cores
- RAM: 32GB+
- Storage: 100GB SSD

**Performance:**
- Llama 3 8B: ~50 tokens/sec
- Llama 3 70B: ~10 tokens/sec
- Response tijd: 2-5 seconden

**Kosten:** €80-300/maand
**Geschikt voor:** Production, medium-high traffic

**Providers:**
- Hetzner Cloud (GPU): €80/maand
- RunPod (spot): €0.40/uur (~€290/maand 24/7)
- Vast.ai (spot): €0.30-0.60/uur
- OVH Cloud: €100-200/maand

---

### Cloud GPU (Scalable)

**Managed options:**
- Together.ai (serverless)
- Replicate.com (pay-per-use)
- Modal.com (serverless GPU)

**Performance:**
- Auto-scaling
- Cold start: 5-15 seconden
- Warm: 1-3 seconden

**Kosten:** €50-500/maand (afhankelijk van traffic)
**Geschikt voor:** Variable traffic, geen server management

---

## Cost Comparison (1000 chats/maand)

| Solution | Setup Kosten | Maandelijkse Kosten | Response Tijd | Kwaliteit |
|----------|--------------|---------------------|---------------|-----------|
| **Groq API (gratis tier)** | €0 | €0 | 1-2s | ⭐⭐⭐⭐ |
| **OpenAI GPT-3.5** | €0 | €30-100 | 3-5s | ⭐⭐⭐⭐ |
| **OpenAI GPT-4** | €0 | €300-1500 | 5-10s | ⭐⭐⭐⭐⭐ |
| **Ollama (CPU server)** | €500 | €30 | 10-30s | ⭐⭐⭐ |
| **Ollama (GPU server)** | €1000 | €100-300 | 2-5s | ⭐⭐⭐⭐ |
| **Hybrid (Groq + GPT-4)** | €0 | €50-200 | 2-8s | ⭐⭐⭐⭐⭐ |
| **LocalAI** | €500 | €100 | 5-15s | ⭐⭐⭐ |
| **Together.ai** | €0 | €50-200 | 2-4s | ⭐⭐⭐⭐ |

**💡 Aanbeveling:** Start met **Hybrid (Groq + GPT-4)** - beste prijs/kwaliteit verhouding.

---

## Implementation Roadmap

### Phase 1: MVP (1 week)

**Doel:** Werkende chatbot met kennisbank integratie

**Stack:**
- ✅ Groq API (gratis tier)
- ✅ Meilisearch (heb je al)
- ✅ OpenAI embeddings

**Tasks:**
1. ✅ Setup Groq API account (5 min)
2. ✅ Create `/api/chatbot` endpoint (2 uur)
3. ✅ Implement RAG service (4 uur)
4. ✅ Create frontend chatbot component (4 uur)
5. ✅ Test & refine prompts (2 uur)

**Deliverable:** Werkende chatbot widget op website

**Kosten:** €0/maand

---

### Phase 2: Production (2 weken)

**Doel:** Schaalbare, betrouwbare chatbot

**Stack:**
- ✅ Groq API voor simpele vragen
- ✅ OpenAI GPT-4 voor complexe vragen
- ✅ Redis voor chat history caching
- ✅ Rate limiting & analytics

**Tasks:**
1. ✅ Implement query routing logic (4 uur)
2. ✅ Add conversation history (4 uur)
3. ✅ Implement rate limiting (2 uur)
4. ✅ Add analytics tracking (4 uur)
5. ✅ UI/UX improvements (8 uur)
6. ✅ Testing & optimization (8 uur)

**Deliverable:** Production-ready chatbot

**Kosten:** €50-200/maand

---

### Phase 3: Self-Hosted (3-4 weken)

**Doel:** Privacy-first, kostenbesparend

**Stack:**
- ✅ Ollama binary op GPU server
- ✅ Self-hosted embeddings
- ✅ Groq fallback voor piek momenten

**Tasks:**
1. ✅ Setup GPU server (1 dag)
2. ✅ Install & configure Ollama (2 uur)
3. ✅ Download & test models (4 uur)
4. ✅ Implement Ollama client (4 uur)
5. ✅ Update routing logic (2 uur)
6. ✅ Load testing (8 uur)
7. ✅ Monitoring & alerting (4 uur)

**Deliverable:** Self-hosted chatbot met cloud fallback

**Kosten:** €100-300/maand

---

## Aanbevolen Aanpak voor Jouw Project

### ✅ Stap 1: Start met Groq (Deze week)

**Waarom:**
- ✅ Gratis tier (14,400 requests/dag)
- ✅ Extreem snel (100x sneller dan OpenAI)
- ✅ OpenAI-compatible API (makkelijk te implementeren)
- ✅ Goed genoeg voor 90% van vragen

**Implementation:**

```bash
# 1. Get Groq API key (gratis)
# https://console.groq.com/keys

# 2. Add to .env
GROQ_API_KEY=gsk_xxx

# 3. Install dependency
npm install openai
```

```typescript
// src/lib/ai/GroqChatbot.ts
import OpenAI from 'openai'

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

export async function chatWithGroq(query: string, context: string) {
  const response = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [
      {
        role: 'system',
        content: `Je bent een behulpzame AI assistent voor ${process.env.COMPANY_NAME}.

        Context:
        ${context}

        Beantwoord vragen vriendelijk en accuraat in het Nederlands.`,
      },
      { role: 'user', content: query },
    ],
    temperature: 0.7,
    max_tokens: 500,
  })

  return response.choices[0].message.content
}
```

**Kosten:** €0
**Tijd:** 2-4 uur
**Result:** Werkende chatbot

---

### ✅ Stap 2: Integreer met Meilisearch (Volgende week)

**Waarom:**
- ✅ Je hebt Meilisearch al
- ✅ RAG (search + AI) = betere antwoorden
- ✅ Bronnen vermelden = trustworthy

**Implementation:**

```typescript
// src/lib/ai/RAGChatbot.ts
import { chatWithGroq } from './GroqChatbot'

export async function answerQuestion(question: string) {
  // 1. Search Meilisearch
  const searchResults = await fetch(
    `${process.env.MEILISEARCH_HOST}/indexes/blog-posts/search`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MEILISEARCH_KEY}`,
      },
      body: JSON.stringify({
        q: question,
        limit: 3,
      }),
    }
  ).then(r => r.json())

  // 2. Build context
  const context = searchResults.hits
    .map((hit: any) => `# ${hit.title}\n\n${hit.excerpt}`)
    .join('\n\n---\n\n')

  // 3. Ask Groq
  const answer = await chatWithGroq(question, context)

  return {
    answer,
    sources: searchResults.hits.map((hit: any) => ({
      title: hit.title,
      url: `/blog/${hit.category}/${hit.slug}`,
    })),
  }
}
```

**Kosten:** €0
**Tijd:** 4-6 uur
**Result:** RAG chatbot met bronnen

---

### ✅ Stap 3: Add GPT-4 Fallback (Over 2 weken)

**Waarom:**
- ✅ Complexe vragen vereisen GPT-4
- ✅ 90% via Groq (gratis), 10% via GPT-4 (betaald)
- ✅ Beste prijs/kwaliteit

**Implementation:**

```typescript
// src/lib/ai/HybridChatbot.ts
import { chatWithGroq } from './GroqChatbot'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function hybridChat(question: string, context: string) {
  const complexity = analyzeComplexity(question)

  if (complexity === 'simple' || complexity === 'medium') {
    // Use Groq (gratis)
    return {
      answer: await chatWithGroq(question, context),
      model: 'groq-llama3-70b',
      cost: 0,
    }
  } else {
    // Use GPT-4 (betaald, maar beter)
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: `Context:\n${context}` },
        { role: 'user', content: question },
      ],
    })

    return {
      answer: response.choices[0].message.content,
      model: 'gpt-4-turbo',
      cost: (response.usage?.total_tokens || 0) * 0.00003,
    }
  }
}

function analyzeComplexity(question: string): 'simple' | 'medium' | 'complex' {
  const wordCount = question.split(' ').length
  const keywords = ['hoe werkt', 'uitleg', 'verschil tussen', 'vergelijk']
  const hasComplexKeywords = keywords.some(k => question.toLowerCase().includes(k))

  if (wordCount > 30 || hasComplexKeywords) return 'complex'
  if (wordCount > 15) return 'medium'
  return 'simple'
}
```

**Kosten:** €20-100/maand (afhankelijk van traffic)
**Tijd:** 2-3 uur
**Result:** Beste antwoorden voor alle vragen

---

### ✅ Stap 4: Evalueer Self-Hosted (Over 1-2 maanden)

**Wanneer:**
- Traffic > 500 chats/dag
- Privacy concerns
- Budget > €100/maand beschikbaar

**Setup Ollama:**

```bash
# 1. Server setup (Hetzner GPU €80/maand)
ssh root@your-server

# 2. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 3. Download models
ollama pull llama3:8b          # 4.7GB
ollama pull llama3:70b         # 40GB (vereist 48GB+ RAM)
ollama pull nomic-embed-text   # 274MB

# 4. Start server
ollama serve

# 5. Test
curl http://localhost:11434/api/generate -d '{
  "model": "llama3:8b",
  "prompt": "Hallo, hoe gaat het?"
}'
```

**Update app:**

```typescript
// .env
OLLAMA_URL=http://your-server:11434

// src/lib/ai/OllamaClient.ts
export async function chatWithOllama(question: string, context: string) {
  const response = await fetch(`${process.env.OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3:8b',
      messages: [
        { role: 'system', content: `Context:\n${context}` },
        { role: 'user', content: question },
      ],
      stream: false,
    }),
  })

  const data = await response.json()
  return data.message.content
}
```

**Kosten:** €80-300/maand (server cost)
**Tijd:** 1-2 dagen
**Result:** Self-hosted, unlimited gebruik

---

## Feature Comparison

| Feature | Groq | OpenAI | Ollama | Hybrid |
|---------|------|--------|--------|--------|
| **Kosten** | ✅ Gratis | ❌ Duur | ⚠️ Server | ✅ Laag |
| **Snelheid** | ✅✅✅ | ⚠️ Traag | ✅✅ | ✅✅ |
| **Kwaliteit** | ✅✅✅✅ | ✅✅✅✅✅ | ✅✅✅ | ✅✅✅✅✅ |
| **Privacy** | ❌ Cloud | ❌ Cloud | ✅ Self-hosted | ⚠️ Mix |
| **Setup** | ✅ 5 min | ✅ 5 min | ⚠️ 1 dag | ⚠️ 2 dagen |
| **Schalen** | ✅✅✅ | ✅✅✅ | ⚠️ Server | ✅✅ |
| **Nederlands** | ✅✅✅ | ✅✅✅✅ | ✅✅✅ | ✅✅✅✅ |

---

## Conclusie & Aanbeveling

### 🎯 Voor jouw project: **Hybrid Approach**

**Fase 1 (Nu - 1 week):**
- ✅ Start met **Groq API** (gratis, snel, goed genoeg)
- ✅ Integreer met **Meilisearch** (heb je al)
- ✅ Simpel RAG implementation
- **Kosten:** €0/maand
- **Tijd:** 1 week

**Fase 2 (Week 2-4):**
- ✅ Add **GPT-4 fallback** voor complexe vragen
- ✅ Conversation history
- ✅ Analytics
- **Kosten:** €20-100/maand
- **Tijd:** 2 weken

**Fase 3 (Maand 2-3):**
- ✅ Evalueer traffic & kosten
- ✅ Overweeg **Ollama** als traffic > 500/dag
- ✅ GPU server setup indien cost-effective
- **Kosten:** €100-300/maand (alleen bij hoge traffic)
- **Tijd:** 1-2 weken

### 💰 ROI Berekening

**Scenario: 100 chats/dag (3000/maand)**

| Oplossing | Kosten/maand | Response tijd |
|-----------|--------------|---------------|
| 100% OpenAI GPT-4 | €900-4500 | 5-10s |
| 100% Groq | €0 | 1-2s |
| Hybrid (80% Groq, 20% GPT-4) | €180-900 | 2-5s |
| Self-hosted Ollama | €100 (server) | 3-7s |

**Break-even point voor self-hosted:**
- Groq gratis tier: Nooit (blijf bij Groq!)
- Betaald Groq: Bij ~500 chats/dag
- OpenAI GPT-4: Bij ~30 chats/dag

**💡 Conclusie:** Start met Groq, switch naar Ollama bij >500 chats/dag

---

## Next Steps

### Actie Items:

1. **✅ Week 1:** Implementeer Groq chatbot
   - Sign up voor Groq API (gratis)
   - Maak `/api/chatbot` endpoint
   - Basic frontend widget

2. **✅ Week 2:** RAG integratie
   - Connect met Meilisearch
   - Context building
   - Source attribution

3. **✅ Week 3-4:** Production polish
   - Add GPT-4 fallback
   - Conversation history
   - Rate limiting
   - Analytics

4. **⏳ Maand 2:** Evalueer metrics
   - Track aantal chats
   - Monitor kosten
   - Measure user satisfaction
   - Decide: stay Groq vs switch Ollama

### Code Templates Ready:

Wil je dat ik de volledige implementatie maak? Ik kan leveren:

1. ✅ `/api/chatbot` endpoint
2. ✅ RAG service met Meilisearch
3. ✅ Chatbot UI component
4. ✅ Groq client
5. ✅ Hybrid routing logic
6. ✅ Analytics & monitoring
7. ✅ Rate limiting

Zeg het woord en ik bouw het! 🚀

---

**Document versie:** 1.0
**Laatst bijgewerkt:** 22 Februari 2026
**Status:** ✅ Complete Advies
