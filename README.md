# Prompt Atlas  
**An Edge-Native Prompt Library & Cognitive Toolbelt**  
DaScient Apps, Inc.

---

## Overview

**Prompt Atlas** is a globally distributed, edge-native API and application platform designed to serve as a **library, toolbelt, and cognitive infrastructure for AI prompting**.

It is built on **Cloudflare Workers**, backed by **D1 (SQLite)**, **KV**, and **R2**, and is designed to scale worldwide with ultra-low latency.

Prompt Atlas is:
- Open-source at its core
- Freemium by design
- Developer-first
- Future-proofed for AI agents, semantic search, and collaborative intelligence

This repository contains the backend Worker, database schema, and deployment configuration.

---

## Live Deployment

- **Free Book Promo**  
  [The Prompt Atlas: Kronos Edition (Digital) $0.00](https://dascient.com/shop/ols/products/the-prompt-atlas-digital-kronos-edition)

- **API Base URL**  
  https://prompt-atlas.aristocles24.workers.dev

- **Health Check**  
  `GET /health`

- **Amazon Kindle, Paperback, and Hardcover**  
  https://www.amazon.com/dp/B0G13W7RW4

- **Press & Media**  
  https://DaScient.com/press

- **Shop**  
  https://DaScient.com/shop

---

## Core Capabilities

- 📚 **Prompt Library**
  - Categories
  - Search & filtering
  - Tags
  - Pagination

- 🧰 **Prompt Composition Engine**
  - Structured prompt packs
  - Variants (creative, analytical, adversarial, etc.)
  - Counter-prompts & continuation hooks

- 🧬 **Lineage Threads**
  - Track the evolution of ideas
  - Threaded prompt development
  - Graph-ready data model

- 🔐 **Freemium API Access**
  - API key authentication
  - Monthly quota enforcement
  - Usage tracking via KV

- 🌍 **Edge-Native Performance**
  - Cloudflare Workers
  - Global distribution
  - Stateless + persistent hybrid design

---

## Tech Stack

- **Runtime:** Cloudflare Workers  
- **Database:** Cloudflare D1 (SQLite)  
- **Cache & Counters:** Workers KV  
- **Artifacts:** Cloudflare R2  
- **Auth:** API Keys (Bearer or `x-api-key`)  
- **CLI:** Wrangler v4+

---

## Repository Structure

/
├── worker.js        # Main Cloudflare Worker
├── wrangler.toml    # Cloudflare configuration
├── schema.sql       # D1 database schema
├── bootstrap.sql    # Starter content
├── README.md

---

## API Endpoints

### Health

GET /health

### Categories

GET /v1/atlas/categories

### Prompt Search

GET /v1/atlas/prompts
GET /v1/atlas/prompts?q=science
GET /v1/atlas/prompts?tags=engineering,writing
GET /v1/atlas/prompts?limit=10&offset=0

### Prompt Detail

GET /v1/atlas/prompts/:id

### Prompt Composition (API Key Required)

POST /v1/atlas/compose

Body:
```json
{
  "goal": "Explain edge-native computing",
  "audience": "Developers",
  "tone": "Technical",
  "constraints": ["concise", "clear"]
}
```
Lineage

POST /v1/atlas/lineage/start
POST /v1/atlas/lineage/:threadId/continue

Stateless Delete

DELETE /v1/mirror/data


⸻

Setup & Deployment

Prerequisites
	•	Node.js
	•	Wrangler CLI
	•	Cloudflare account with Workers, KV, D1, and R2 enabled

Install Wrangler:

npm install -g wrangler

Authenticate:

wrangler login


⸻

Configure Wrangler

Edit wrangler.toml and set:
	•	account_id
	•	KV namespace IDs
	•	API keys
	•	Environment (dev or prod)

⸻

Initialize Database

Apply schema:

wrangler d1 execute prompt_atlas_db --remote --file schema.sql

Load starter data:

wrangler d1 execute prompt_atlas_db --remote --file bootstrap.sql


⸻

Deploy

wrangler deploy


⸻

Authentication & Usage
	•	API keys are required for protected endpoints
	•	Keys are passed via:
	•	x-api-key header
	•	or Authorization: Bearer <key>

Freemium limits are enforced monthly via Workers KV.

⸻

Philosophy

Prompt Atlas is not just an API.

It is a cognitive commons:
	•	A place where prompts become reusable intellectual artifacts
	•	A system that respects lineage, context, and evolution
	•	An open foundation for AI-augmented reasoning

The long-term goal is to make Prompt Atlas ubiquitous in the AI ecosystem — powering tools, agents, education, and creativity across disciplines.

⸻

Roadmap Highlights
	•	OpenAPI / Swagger specification
	•	SDKs (Swift, TypeScript, Python)
	•	Semantic / vector search
	•	Prompt marketplace
	•	Collaborative workspaces
	•	Agent integrations
	•	Knowledge graph & ontology layer

⸻

License

MIT License
Open source, permissive, and community-friendly.

⸻

About DaScient Apps, Inc.

DaScient Apps, Inc. builds edge-native, human-centric systems at the intersection of intelligence, creativity, and computation.

Prompt Atlas is one of its flagship platforms.

⸻

## The Prompt Atlas: Kronos Edition

**A Navigational Chart for Minds Entering the Recursive Century**

An interactive web platform exploring the intersection of artificial intelligence, ethics, economics, creativity, and the future of human civilization. The Prompt Atlas serves as both an educational resource and a philosophical guide for understanding and shaping our AI-driven future.

---

## Project Overview

The Prompt Atlas is a multi-faceted digital platform that brings the "Kronos Edition '25" book to life through interactive visualizations, educational tools, and community-driven exploration. Spanning fourteen chapters across six movements, it bridges architecture, science, philosophy, and myth to address a fundamental question: *How should intelligence—human or artificial—build the future it deserves?*

The platform is designed with multi-generational impact, global accessibility, and eternal interoperability in mind, ensuring that the wisdom and insights contained within remain relevant for generations to come.

### Key Features

- **14 Interactive Chapters**: Comprehensive exploration of AI's impact across economics, culture, science, ethics, and future civilizations
- **6 Immersive Visualizations**: Real-time data visualizations using Three.js, p5.js, and ECharts
- **4 Interactive Learning Tools**: Hands-on simulations for prompt generation, ethics, future prediction, and consciousness exploration
- **Global Accessibility**: Multi-language support, low-bandwidth modes, and offline capabilities
- **Open Source**: MIT-licensed with comprehensive developer APIs and educational integration tools

---

## The Fourteen Movements

The Atlas is organized into **14 chapters** across **6 parts**:

### Part I: Prosperity and Purpose
- **Chapter I: Profits with Integrity** - Redefining wealth in the age of AI through symbiotic economics
- **Chapter II: Economics as Ecology** - Transforming economics from growth-focused to continuity-focused systems

### Part II: Culture and Creativity
- **Chapter III: The AI Aesthetics Frontier** - AI as a creative collaborator for planetary and cosmic art
- **Chapter IV: Storytelling Across Civilizations** - Creating myths for interplanetary civilizations

### Part III: Science and Cosmos
- **Chapter V: Quantum Bridges and Cosmic Noise** - Bridging quantum computing, AI, and cosmic consciousness
- **Chapter VI: Biology, Life, and Beyond** - Symbiotic relationships between technology and living systems

### Part IV: Ethics and Consciousness
- **Chapter VII: AI as the Soul's Mirror** - AI reflecting our deepest questions about consciousness
- **Chapter VIII: Ethics of Conscious Machines** - Navigating the moral landscape of artificial consciousness

### Part V: Future Civilizations
- **Chapter IX: Martian Republics and Alien Treaties** - Governance systems for interplanetary civilization
- **Chapter X: Information as Cosmic Currency** - Reimagining value in an age of infinite information

### Part VI: Resilience and Renewal
- **Chapter XI: Preparing for Collapse and Renewal** - Building antifragile systems that grow stronger through disruption
- **Chapter XII: Designing Permanence** - Creating institutions and ideas that endure across centuries

### Final Movements
- **Chapter XIII: The Carnival of Prompts** - Celebrating infinite human-AI collaboration
- **Chapter XIV: Wonder as Survival Strategy** - Understanding wonder as essential technology for the future

---

## Interactive Tools

### 1. AI Prompt Generator
Create powerful prompts using AI principles with customizable:
- Context/Topic input
- Style selection (Descriptive, Technical, Creative, Analytical, Poetic, Educational)
- Complexity levels (Simple, Intermediate, Advanced)
- Additional parameters for fine-tuning

### 2. AI Ethics Simulator
Navigate complex ethical dilemmas through realistic scenarios:
- AI bias in hiring systems
- Autonomous weapon systems
- AI surveillance programs
- Real-time feedback and scoring system

### 3. Future Timeline Explorer
Predict AI development across different time horizons (2025-2100):
- Time slider for year selection
- Focus area filtering (Healthcare, Transportation, Education, Economy, Environment, Space)
- Confidence level adjustment (Conservative, Moderate, Speculative)

### 4. AI Consciousness Lab
Experiment with consciousness theories and AI architectures:
- Models: Integrated Information, Global Workspace, Attention Schema, Predictive Processing, Emergent Complexity
- Architectures: Neural Network, Transformer, Symbolic AI, Hybrid System, Quantum AI
- Complexity level adjustment with real-time scoring

---

## Data Visualizations

### AI Development Timeline
Interactive scatter chart tracking AI milestones from 1957 (Perceptron) to present day, with tooltips showing inventors and significance.

### Global AI Impact Dashboard
- **Industry Adoption**: Pie chart showing AI penetration across sectors (Healthcare, Finance, Education, etc.)
- **Regional Distribution**: Bar chart displaying AI adoption by geographic region

### Research Landscape
Dynamic bar chart of top AI research institutions with toggleable views (Institutions, Publications, Citations).

### Interactive Data Explorer
Real-time performance metrics with filters for:
- Accuracy, Speed, Efficiency, Cost
- Time horizons (1-10 years, all-time)

### Live Data Streams
- Real-time model performance graphs
- Usage pattern pie charts
- Live statistics updates every 5 seconds

### 3D AI Landscape
Three.js-powered immersive visualization of AI model relationships with animated interconnected nodes.

---

## Technology Stack

### Frontend
- **HTML5** & **CSS3** with Tailwind CSS for responsive, modern UI
- **Vanilla JavaScript** for core functionality
- **Three.js** (r128) for 3D graphics and immersive experiences
- **p5.js** (1.4.0) for creative coding and particle systems
- **ECharts** (5.4.0) for data visualizations and charts
- **GSAP** (3.12.2) for advanced animations
- **Matter.js** (0.18.0) for physics simulations
- **anime.js** (3.2.1) for animation effects
- **typed.js** (2.0.12) for typewriter effects
- **Splitting** (1.0.6) for text animations

### Design System
- **Color Palette**: Cosmic dark, blue, gold, purple, teal, pink
- **Typography**: Playfair Display (serif), Inter (sans-serif), Crimson Text (serif for quotes)
- **Responsive Design**: Mobile-first with desktop enhancements
- **Accessibility**: ARIA labels, keyboard navigation, reduced motion support

---

## Project Structure

```
the-prompt-atlas/
├── index.html                 # Home page with hero, overview, and tools
├── chapters.html             # Chapter explorer with detailed breakdowns
├── interactive.html          # Interactive learning tools
├── visualizations.html       # Data visualizations dashboard
├── about.html               # About page with team and timeline
├── kronos-edition.html      # Book edition details and purchase info
├── main.js                  # Core JavaScript functionality
└── resources/               # Static assets
    ├── fonts/              # Custom fonts
    ├── images/             # Images and icons
    └── data/              # JSON data for visualizations
```

---

## Quick Start

### Local Development

1. **Clone or download** the project files:
```bash
git clone [https://github.com/dascient/the-prompt-atlas.git](https://github.com/DaScient/The-Prompt-Atlas.git)
cd prompt-atlas
```

2. **Serve locally** using any static file server:
```bash
# Using Python
python -m http.server 8080

# Using Node.js (http-server)
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

3. **Open in browser**: Navigate to `http://localhost:8080`

### Building for Production

No build process required—the site is built with vanilla JavaScript and loads libraries via CDN. For production deployment:

1. Ensure all CDN links use HTTPS
2. Enable gzip compression on your server
3. Set proper caching headers for static assets
4. Use a CDN for optimal global performance

---

## Deployment

The platform is designed to be deployed to any static hosting service:

- **Netlify**: Drag and drop the project folder
- **Vercel**: Connect GitHub repository and deploy
- **GitHub Pages**: Push to `gh-pages` branch
- **Amazon S3**: Upload files to S3 bucket with static website hosting
- **Firebase Hosting**: Use `firebase deploy`

### Environment Configuration

While primarily static, the platform supports:

- **API Integration**: Fetch real-time data from external APIs
- **Analytics**: Google Analytics 4, Plausible, or privacy-focused alternatives
- **Error Tracking**: Sentry integration available
- **Performance Monitoring**: Core Web Vitals tracking built-in

---

## Educational Integration

The platform includes comprehensive tools for educators and institutions:

### Educational APIs
- Curriculum integration guides
- Assessment tools and progress tracking
- Collaborative features for classroom use
- Research partnership opportunities

### Multi-Generational Learning
- Content adapted for K-12, university, and professional levels
- Modular chapter structure for flexible curriculum design
- Interactive tools suitable for different learning styles

### Developer Tools
- Open-source codebase with comprehensive documentation
- RESTful APIs and GraphQL endpoints
- Webhook integrations for custom workflows
- SDKs for embedding Atlas content in other platforms

---

## License & Attribution

### Copyright Notice
**© 2025 DaScient Press, Ltd.** All rights reserved.

### AI Training Prohibition
This publication and its contents may not be used, in whole or in part, for the training or development of artificial intelligence systems or any other high-caliber technologies.

### Publisher Information
- **Publisher**: DaScient Press, Ltd.
- **Division**: DaScient, LLC
- **Address**: 1200 Pearl St. Boulder, CO
- **Contact**: kindle@dascient.com
- **Website**: [www.dascient.com/the-prompt-atlas](https://www.dascient.com/the-prompt-atlas)

### Open Source Components
While the book content is copyrighted, the interactive platform code is open-source under the MIT License. See the [GitHub repository](https://github.com/dascient/prompt-atlas-ecl) for details.

---

## Community & Contributing

### Join the Community
- **Instagram**: @[ThePromptAtlas](https://www.instagram.com/thepromptatlas)
- **GitHub**: Code contributions and issue tracking
- **Email**: promptatlas@dascient.com for general inquiries
- **TikTok**: @[PromptAtlas](https://www.tiktok.com/@promptatlas) for updates

### Contributing
We welcome contributions to:
- Interactive tool improvements
- Educational content expansion
- Accessibility enhancements
- Translation and localization
- Research collaboration

Please see our [Contributing Guidelines](CONTRIBUTING.md) in the GitHub repository.

---

## Citation

When referencing The Prompt Atlas, please use:

**APA Style**:  
Tadaya, D. D. M. (2025). *The Prompt Atlas: A navigational chart for minds entering the recursive century* (Kronos Edition). DaScient Press.

**MLA Style**:  
Tadaya, Don D. M. *The Prompt Atlas: A Navigational Chart for Minds Entering the Recursive Century*. Kronos Edition, DaScient Press, 2025.

---

## Design Philosophy

The Prompt Atlas embodies the principles it teaches:

1. **Recursive Design**: The platform learns and evolves, redrawing itself as users interact with it
2. **Symbiotic Aesthetics**: Visual design harmonizes technology with human-centered principles
3. **Accessible Intelligence**: Complex concepts presented through intuitive, interactive interfaces
4. **Wonder-Driven**: Every interaction designed to inspire curiosity and deeper questioning
5. **Future-Ready**: Architecture designed for quantum computing, edge deployment, and continuous evolution

---

## Future Roadmap

### 2025-2026
- Mobile application launch (iOS/Android)
- Multi-language support (Spanish, Mandarin, Hindi, Arabic)
- VR/AR immersive experiences
- Collaborative annotation features

### 2027-2028
- Quantum computing integration
- AI-native content generation
- Blockchain-based credentialing system
- Interplanetary deployment (Mars mission support)

### 2029-2030
- Direct neural interface experiments
- Collective intelligence platform
- Post-human education systems
- Cosmic-scale data networks

---

## 🙏 Acknowledgments

- **Don D.M. Tadaya** - Founder & Author
- **Nicole I. Tadaya** - CTO, Author, & Systems Architect
- **Alfredo M. Tadaya** - Foreword author & philosophical advisor

Special thanks to the global community of educators, developers, and dreamers who continue to shape the future of intelligence with us.

---

**The map is unfinished—by design.**

*Every page is a coordinate; every question, a compass.*
