# 🌌 AETHERIA — Autonomous Planetary Expedition Intelligence

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Netlify%20Production-00f2fe?style=for-the-badge&logo=netlify&logoColor=030712)](https://aetheria-expeditions.netlify.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-white?style=for-the-badge&logo=github&logoColor=black)](https://github.com/Manasa2429/AI-tourism-2)
[![React](https://img.shields.io/badge/React%2018.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite%205.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Flash%203.5-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS%20Mapping-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Java](https://img.shields.io/badge/Java%2021%20LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot%203.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)

**An architectural-grade, intelligent travel synthesis platform designed for the modern explorer.**  
Discover global sanctuaries, inspect real-time satellite weather streams, calculate Haversine flight telemetry, consult an autonomous Gemini AI concierge, and synthesize multi-day GPS expeditions with authentic landmark waypoints, transit times, and interactive GIS cartography.

[Explore Live Production Deployment](https://aetheria-expeditions.netlify.app) • [GitHub Repository](https://github.com/Manasa2429/AI-tourism-2) • [Feature Suite](#-features-completed) • [Getting Started](#-instructions-to-run-the-project)

</div>

---

## 🌐 Live Application Status

* **Live Production Link**: **[https://aetheria-expeditions.netlify.app](https://aetheria-expeditions.netlify.app)**
* **Access Level**: **100% Public & Passwordless** (Zero SSO or login wall required)
* **Hosting**: Netlify Global Edge Network with single-page application client routing

---

## 📖 Table of Contents

1. [Overview of What Was Built](#-overview-of-what-was-built)
2. [Features Completed](#-features-completed)
3. [Architecture & Data Flow](#-architecture--data-flow)
4. [Technology Stack](#-technology-stack)
5. [Repository Structure](#-repository-structure)
6. [Instructions to Run the Project](#-instructions-to-run-the-project)
7. [Environment Configuration](#-environment-configuration)
8. [Git Push Commands](#-git-push-commands)
9. [License](#-license)

---

## 🧭 Overview of What Was Built

Modern travel planners often suffer from two major shortcomings:
1. **Generic, hallucinated suggestions**: Standard trip generators produce abstract lists of activities without factual grounding, accurate coordinates, or realistic transit context.
2. **Disconnected trip telemetry**: Travelers are forced to use multiple separate apps to check current weather, determine distances between consecutive stops, and visualize geographic routes on a map.

**AETHERIA** solves this by unifying **spatial intelligence**, **Google Gemini LLM reasoning**, and **live meteorological data** inside an editorial, dark-obsidian interface:

* **Worldwide Sanctuaries Catalog**: 16 indexed global destinations across **Asia**, **Europe**, **Americas**, and **Africa** featuring authentic photography, cultural background, prime seasonal windows, and estimated daily budgets.
* **Instant Landmark & Weather Telemetry**: Real-time atmospheric microclimates (temperature, humidity, wind velocity) combined with latitude/longitude geocoding and Haversine distance calculations.
* **Autonomous AI Expedition Studio**: Synthesizes structured, day-by-day itineraries tailored by travel pace, budget tiers, and curated day excursions (e.g., *Versailles from Paris*, *Nara from Kyoto*), outputting verified landmark stops with transit modes, inter-stop distances in kilometers, and estimated transit times.
* **Interactive Cartographic Route Map**: Renders sequential waypoint pins connected by animated route vectors on a high-contrast CartoDB dark canvas map.
* **Aura AI Concierge**: An always-available conversational assistant equipped with destination awareness to assist with packing lists, cultural nuances, and regional transit passes.

---

## ⚡ Features Completed

### 🛸 1. Visual Theme & Planetary Video Experience
- [x] **AETHERIA Brand System**: Deep obsidian palette (`#030712`), cyan telemetry accents (`#00f2fe`), and emerald aurora gradients (`#10b981`).
- [x] **Self-Hosted Looping Video**: High-definition NASA Earth & Aurora Australis orbital video loop bundled directly in `/videos/` to prevent external CDN `403 Forbidden` hotlinking errors.
- [x] **Interactive Canvas Aurora Particles**: Ambient particle canvas reacting to cursor movement in the hero section.
- [x] **Dynamic Video Poster**: Instant backdrop rendering prevents blank hero states while video streams buffer.

### 🗺️ 2. Global Destination Explorer & Search
- [x] **Pre-Loaded 16-Sanctuary Catalog**:
  - **Asia**: Kyoto (Japan), Bali (Indonesia), Tokyo (Japan), Dubai (UAE), Kedarnath (India).
  - **Europe**: Paris (France), Rome (Italy), Swiss Alps (Switzerland), Santorini (Greece), Reykjavik (Iceland).
  - **Americas**: Banff (Canada), New York (USA), Rio de Janeiro (Brazil).
  - **Africa**: Cape Town (South Africa), Cairo (Egypt), Serengeti (Tanzania).
- [x] **Multi-Continent Filters**: Instant zero-latency switching between continents and travel vibes.
- [x] **Full-Text Worldwide Search**: Search any global city or landmark with auto-scrolling to results.
- [x] **Destination Dossier Modal**: In-depth cultural descriptions, currency formatting, prime seasons, and photo galleries.

### 🛰️ 3. Meteorological & Spatial Telemetry
- [x] **Live Weather Stream**: Real-time atmospheric conditions (temperature, humidity, wind speed) via OpenWeatherMap.
- [x] **Astronomical Climatic Fallback**: Calculates seasonal temperature curves using destination latitude and hemisphere if network APIs are rate-limited.
- [x] **Imperial / Metric Toggle**: Seamless instant switching between Celsius (°C) and Fahrenheit (°F).
- [x] **Haversine Distance Engine**: Computes great-circle flight distances from user origin to any sanctuary.
- [x] **Departure Hub Selector**: Optional one-click departure selector for London, New York, Tokyo, Sydney, and Mumbai.

### 🧠 4. AI Multi-Day Itinerary Synthesis
- [x] **Google Gemini AI Reasoning**: Generates structured, day-by-day expedition plans customized by travel style (Culture, Nature, Luxury, Architecture) and budget tier.
- [x] **Detailed Landmark Waypoints**: Each stop includes:
  - Exact landmark name and category tag.
  - Inter-stop distance in kilometers (e.g. `1.8 km from previous landmark`).
  - Estimated transit duration & mode (e.g. `~20 min scenic walk` or `~15 min metro`).
  - Factual historical/architectural claim to fame.
  - Entry ticket pricing and recommended visit duration.
- [x] **Curated Nearby Day Excursions**: Incorporates high-value regional excursions (e.g. *Versailles* for Paris, *Nara* for Kyoto, *Tungnath* for Kedarnath).
- [x] **15ms Client-Side Synthesis Engine**: Resilient offline fallback engine ensures zero blank screens or infinite loading freezes on static edge hosting.

### 📍 5. Interactive GIS Route Map
- [x] **CartoDB Dark Tile Layer**: Minimalist, watermark-free dark cartographic base tiles.
- [x] **Numbered Sequential Waypoints**: Pins (`1`, `2`, `3`, `4`) matching the itinerary stop timeline.
- [x] **Animated Traversal Polylines**: Glowing cyan dashed route paths tracing walking or transit routes.
- [x] **Dynamic Centroid Calculation**: Automatically centers and zooms directly over the planned city.

### 💬 6. Aura AI Concierge
- [x] **Slide-Out Conversational Drawer**: Always-available floating action button in the viewport.
- [x] **Contextual Travel Intelligence**: Answers questions about local tipping rules, transit passes, seasonal attire, and packing checklists.
- [x] **Instant Question Chips**: One-click suggested questions for rapid answers.

### 🛡️ 7. Production Hardening & Persistence
- [x] **Zero-Password Netlify Deployment**: Live production deployment with open public access.
- [x] **Axios Static-Host Interceptor**: Detects HTML fallback strings from static rewrite rules and triggers clean client-side fallbacks.
- [x] **Bi-Directional State Persistence**: Active section hash (`#itinerary`, `#sanctuaries`), selected trip parameters, and saved itineraries persist through browser reloads.

---

## 🏛️ Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│          React 18 + Vite + Tailwind CSS (AETHERIA)          │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
                │ Direct AI Reasoning         │ REST APIs
                ▼                             ▼
┌───────────────────────────────┐  ┌───────────────────────────┐
│     Google Gemini AI API      │  │    Meteorological APIs    │
│  - Multi-Day Structured Plans │  │  - OpenWeatherMap Stream  │
│  - Transit Times & Stops      │  │  - Lat/Lng Climate Models │
│  - Aura AI Concierge Chat     │  └───────────────────────────┘
└───────────────────────────────┘             │
                │                             ▼
                ▼              ┌───────────────────────────────┐
┌───────────────────────────┐  │     Leaflet Cartography       │
│   Landmarks Database      │  │  - Sequential Waypoints (1-4) │
│  - 7-Day Verified Stops   │  │  - Animated Cyan Polylines    │
│  - Coordinates & Transit  │  │  - CartoDB Dark Raster Tiles  │
└───────────────────────────┘  └───────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | **React 18.3** (Functional Components, Hooks, Context API) |
| **Build Tooling** | **Vite 5.4** (Lightning-fast HMR, Rollup production bundling) |
| **Styling & Theme** | **Tailwind CSS 3.4**, Custom Glassmorphism, CSS Radial Aurora Glows |
| **Mapping Engine** | **Leaflet 1.9.4**, CartoDB Dark Matter Raster Tiles |
| **Icons & Media** | **Lucide React**, Canvas-Confetti, NASA Planetary Video Archives |
| **AI Reasoning** | **Google Gemini API** (`gemini-3.5-flash-lite`, `gemini-3.6-flash`) |
| **Backend (Optional)**| **Java 21 LTS**, **Spring Boot 3.3.3**, `CompletableFuture`, MongoDB |
| **Hosting & CI/CD** | **Netlify Global Edge CDN**, SPA Rewrite Rules |

---

## 📁 Repository Structure

```
AI-tourism-2/
├── README.md                      # Comprehensive project documentation
├── backend/                       # Java 21 & Spring Boot 3.3.3 backend
│   ├── pom.xml                    # Maven configuration and dependencies
│   ├── src/main/java/com/tourism/ # Controllers, Models, Repositories, Services
│   └── src/main/resources/        # application.yml configuration
└── frontend/                      # React 18 + Vite frontend application
    ├── netlify.toml               # Netlify build and SPA rewrite configuration
    ├── index.html                 # HTML entry with Google Fonts & Leaflet styles
    ├── package.json               # Dependencies and scripts
    ├── vite.config.js             # Vite development & build setup
    ├── tailwind.config.js         # AETHERIA custom theme palette & fonts
    ├── public/
    │   └── videos/
    │       ├── aurora-loop.mp4    # High-definition NASA Aurora loop video
    │       └── hero-loop.mp4      # Direct fallback video
    └── src/
        ├── App.jsx                # Core application shell & navigation manager
        ├── components/
        │   ├── hero/              # HeroSection with looping video & search
        │   ├── explorer/          # DestinationExplorer with filters & cards
        │   ├── destination/       # DestinationDetailModal & WeatherWidget
        │   ├── itinerary/         # ItineraryPlanner, ItineraryTimeline, ItineraryMap
        │   ├── ai-chat/           # ChatDrawer (Aura AI Concierge)
        │   └── common/            # Navbar, Footer, UI notifications
        ├── context/               # LocationContext, SavedTripsContext
        └── services/
            ├── api.js             # Gemini AI, weather, and fallback catalogs
            └── landmarksData.js   # Verified multi-day GPS landmark datasets
```

---

## 🚀 Instructions to Run the Project

### Prerequisites

Ensure the following tools are installed on your system:
* **Node.js**: v18.0.0 or later ([Download Node.js](https://nodejs.org/))
* **npm**: v9.0.0 or later (bundled with Node.js)
* **Git**: ([Download Git](https://git-scm.com/))
* *(Optional)* **Java JDK 21** & **Maven 3.8+** (only required if running the optional Spring Boot backend)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Manasa2429/AI-tourism-2.git
cd AI-tourism-2
```

---

### Step 2: Configure Environment Variables

Navigate to the `frontend` directory and create an `.env` file:

```bash
cd frontend
touch .env
```

Add your **Google Gemini API Key** (obtainable for free from [Google AI Studio](https://aistudio.google.com/)):

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: If you don't provide an API key, the application automatically runs in **Resilient Standalone Mode**, generating verified multi-day itineraries from the built-in landmark dataset.

---

### Step 3: Install Frontend Dependencies

From the `frontend/` directory, run:

```bash
npm install
```

---

### Step 4: Start the Development Server

Launch the Vite local development server:

```bash
npm run dev
```

Once running, the terminal will display your local address:

```
  VITE v5.4.21  ready in 280 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and visit **`http://localhost:5173`**.

---

### Step 5: (Optional) Run the Spring Boot Backend

If you wish to run the Java 21 backend alongside the frontend:

1. Open a separate terminal tab.
2. Navigate to the `backend/` directory:
   ```bash
   cd backend
   mvn clean spring-boot:run
   ```
3. The backend REST API will be accessible at `http://localhost:8080`.

---

### Step 6: Build for Production

To create an optimized production build:

```bash
cd frontend
npm run build
```

The compiled assets will be output to `frontend/dist/`, ready for deployment to **Netlify**, **Vercel**, or **Surge**.

---

## 📦 Git Push Commands

Use these exact commands to push the entire project and documentation to your GitHub repository:

```bash
# 1. Navigate to the project root directory
cd /path/to/AI-tourism-2

# 2. Check changed files
git status

# 3. Stage all files (sensitive .env files are excluded by .gitignore)
git add .

# 4. Commit your changes
git commit -m "feat: complete Aetheria travel intelligence platform with updated theme, live Netlify deployment, and full documentation"

# 5. Push to GitHub repository
git remote set-url origin https://github.com/Manasa2429/AI-tourism-2.git
git branch -M main
git push -u origin main
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  <b>AETHERIA Planetary Expeditions</b> • Crafted for travelers exploring the world's greatest wonders.
</div>
