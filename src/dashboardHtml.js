export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>9Router Hono — Ultra-Fast Control Plane</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          },
          colors: {
            brand: {
              50: '#ecfeff',
              100: '#cffafe',
              400: '#22d3ee',
              500: '#06b6d4',
              600: '#0891b2',
            },
            surface: {
              50: '#18181b',
              100: '#27272a',
              200: '#3f3f46',
              800: '#09090b',
              900: '#030712',
            }
          },
          boxShadow: {
            'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
            'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
          }
        }
      }
    }
  </script>
  <style>
    body {
      background: radial-gradient(circle at 50% 0%, #0d1e2e 0%, #030712 60%);
      color: #f3f4f6;
      min-height: 100vh;
    }
    .glass-card {
      background: rgba(18, 24, 38, 0.7);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .glass-nav {
      background: rgba(3, 7, 18, 0.85);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .custom-scroll::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scroll::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.2);
    }
    .custom-scroll::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.15);
      border-radius: 9999px;
    }
    .custom-scroll::-webkit-scrollbar-thumb:hover {
      background: rgba(6, 182, 212, 0.5);
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.15); }
    }
    .animate-pulse-dot {
      animation: pulse-dot 2s infinite ease-in-out;
    }
  </style>
</head>
<body class="font-sans antialiased selection:bg-brand-500 selection:text-black">

  <!-- Top App Navigation -->
  <header class="sticky top-0 z-50 glass-nav px-4 lg:px-8 py-3.5 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 via-cyan-400 to-emerald-400 flex items-center justify-center shadow-glow-cyan">
        <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-gray-100 to-cyan-300 bg-clip-text text-transparent">9Router Hono</span>
          <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase tracking-widest font-mono">v0.1.0</span>
          <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5 font-mono">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot"></span>
            SUB-MS
          </span>
        </div>
        <p class="text-xs text-gray-400 hidden sm:block">Ultra-Fast Headless Routing Engine & Telemetry</p>
      </div>
    </div>

    <!-- Desktop Navigation Tabs -->
    <nav class="hidden md:flex items-center gap-1 bg-gray-900/80 p-1.5 rounded-xl border border-white/5">
      <button onclick="switchTab('overview')" id="tab-btn-overview" class="tab-btn px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 bg-brand-500 text-black shadow-glow-cyan">
        Overview
      </button>
      <button onclick="switchTab('accounts')" id="tab-btn-accounts" class="tab-btn px-4 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-all duration-200">
        Accounts (<span id="nav-acc-count">0</span>)
      </button>
      <button onclick="switchTab('models')" id="tab-btn-models" class="tab-btn px-4 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-all duration-200">
        Catalog (<span id="nav-model-count">0</span>)
      </button>
      <button onclick="switchTab('playground')" id="tab-btn-playground" class="tab-btn px-4 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-all duration-200">
        Playground ⚡
      </button>
      <button onclick="switchTab('logs')" id="tab-btn-logs" class="tab-btn px-4 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-all duration-200">
        Live Logs
      </button>
    </nav>

    <!-- Header Actions -->
    <div class="flex items-center gap-2">
      <button onclick="fetchData()" class="p-2 rounded-xl bg-gray-800/60 hover:bg-gray-700/80 text-gray-300 hover:text-white border border-white/5 transition-all text-xs flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span class="hidden sm:inline">Refresh</span>
      </button>
    </div>
  </header>

  <!-- Mobile Bottom Navigation Bar -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-nav px-3 py-2 flex justify-around border-t border-white/10">
    <button onclick="switchTab('overview')" class="flex flex-col items-center gap-1 text-[11px] text-brand-400">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
      Overview
    </button>
    <button onclick="switchTab('accounts')" class="flex flex-col items-center gap-1 text-[11px] text-gray-400">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
      Accounts
    </button>
    <button onclick="switchTab('models')" class="flex flex-col items-center gap-1 text-[11px] text-gray-400">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
      Models
    </button>
    <button onclick="switchTab('playground')" class="flex flex-col items-center gap-1 text-[11px] text-gray-400">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      Playground
    </button>
    <button onclick="switchTab('logs')" class="flex flex-col items-center gap-1 text-[11px] text-gray-400">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
      Logs
    </button>
  </div>

  <!-- Main Content Body -->
  <main class="max-w-7xl mx-auto px-4 lg:px-8 py-6 pb-24 md:pb-12">

    <!-- TAB 1: OVERVIEW -->
    <section id="tab-overview" class="space-y-6">

      <!-- Hero Metrics Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        
        <div class="glass-card rounded-2xl p-4 lg:p-5 relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all"></div>
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Total Tokens</span>
            <span class="text-cyan-400 text-sm">✦</span>
          </div>
          <div id="stat-total-tokens" class="text-xl lg:text-2xl font-black tracking-tight text-white font-mono">...</div>
          <div class="mt-2 text-[11px] text-gray-400 flex items-center gap-1 font-mono">
            <span id="stat-prompt-tokens" class="text-cyan-400">0</span> in · <span id="stat-comp-tokens" class="text-emerald-400">0</span> out
          </div>
        </div>

        <div class="glass-card rounded-2xl p-4 lg:p-5 relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Total Requests</span>
            <span class="text-emerald-400 text-sm">⚡</span>
          </div>
          <div id="stat-total-requests" class="text-xl lg:text-2xl font-black tracking-tight text-white font-mono">...</div>
          <div class="mt-2 text-[11px] text-gray-400 font-mono">
            Across <span id="stat-account-pool" class="text-white font-bold">0</span> Accounts
          </div>
        </div>

        <div class="glass-card rounded-2xl p-4 lg:p-5 relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-violet-500/10 rounded-full blur-xl group-hover:bg-violet-500/20 transition-all"></div>
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Total Saved Value</span>
            <span class="text-violet-400 text-sm">$</span>
          </div>
          <div id="stat-total-cost" class="text-xl lg:text-2xl font-black tracking-tight text-white font-mono">$0.00</div>
          <div class="mt-2 text-[11px] text-gray-400 font-mono">
            Estimated API Equivalent
          </div>
        </div>

        <div class="glass-card rounded-2xl p-4 lg:p-5 relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Proxy Latency</span>
            <span class="text-amber-400 text-sm">⏱</span>
          </div>
          <div class="text-xl lg:text-2xl font-black tracking-tight text-amber-300 font-mono">&lt; 0.45 ms</div>
          <div class="mt-2 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span>●</span> Hono Native Routing
          </div>
        </div>

      </div>

      <!-- Main Chart Section -->
      <div class="glass-card rounded-2xl p-5 lg:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Token Throughput & Timeline</span>
            </h2>
            <p class="text-xs text-gray-400">Aggregated token volume over time from shared SQLite ledger</p>
          </div>
          
          <!-- Period Selector Filter -->
          <div class="inline-flex bg-gray-950 p-1 rounded-xl border border-white/5 self-start sm:self-auto">
            <button onclick="setPeriod('today')" id="period-today" class="period-btn px-3 py-1 text-xs font-medium rounded-lg text-gray-400 hover:text-white transition-all">Today</button>
            <button onclick="setPeriod('7d')" id="period-7d" class="period-btn px-3 py-1 text-xs font-medium rounded-lg text-gray-400 hover:text-white transition-all">7D</button>
            <button onclick="setPeriod('30d')" id="period-30d" class="period-btn px-3 py-1 text-xs font-medium rounded-lg text-gray-400 hover:text-white transition-all">30D</button>
            <button onclick="setPeriod('all')" id="period-all" class="period-btn px-3 py-1 text-xs font-semibold rounded-lg bg-brand-500 text-black shadow-glow-cyan transition-all">All Time</button>
          </div>
        </div>

        <div class="h-[260px] lg:h-[320px] w-full">
          <canvas id="usageChart"></canvas>
        </div>
      </div>

      <!-- Models & Providers Grid Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Top Models -->
        <div class="glass-card rounded-2xl p-5 lg:p-6">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Top Models by Volume</span>
            <span class="text-xs text-cyan-400 font-mono font-normal">Ranked by Requests</span>
          </h3>
          <div id="models-rank-list" class="space-y-3 custom-scroll max-h-[380px] overflow-y-auto pr-2">
            <!-- Dynamically populated -->
          </div>
        </div>

        <!-- Provider Accounts Pool Matrix -->
        <div class="glass-card rounded-2xl p-5 lg:p-6">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Provider Connection Matrix</span>
            <span class="text-xs text-emerald-400 font-mono font-normal">Active Failover Pool</span>
          </h3>
          <div id="providers-matrix-list" class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-2 custom-scroll">
            <!-- Dynamically populated -->
          </div>
        </div>

      </div>

    </section>


    <!-- TAB 2: ACCOUNTS -->
    <section id="tab-accounts" class="hidden space-y-4">
      <div class="glass-card rounded-2xl p-5 lg:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 class="text-base font-bold text-white tracking-tight">Active Accounts Pool</h2>
            <p class="text-xs text-gray-400">All provider credentials loaded seamlessly from <code class="text-cyan-400">~/.9router/db/data.sqlite</code></p>
          </div>
          <div class="w-full sm:w-64">
            <input type="text" id="account-search" oninput="filterAccounts()" placeholder="Filter accounts by email/name..." class="w-full bg-gray-950/80 border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all">
          </div>
        </div>

        <div class="overflow-x-auto custom-scroll max-h-[600px]">
          <table class="w-full text-left text-xs text-gray-300">
            <thead class="bg-gray-950/60 uppercase text-[10px] text-gray-400 font-mono sticky top-0 backdrop-blur-md">
              <tr>
                <th class="py-3 px-3">Provider</th>
                <th class="py-3 px-3">Identity / Name</th>
                <th class="py-3 px-3">Auth Type</th>
                <th class="py-3 px-3">Status</th>
                <th class="py-3 px-3">Priority</th>
                <th class="py-3 px-3">Account ID</th>
              </tr>
            </thead>
            <tbody id="accounts-table-body" class="divide-y divide-white/5 font-mono">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>


    <!-- TAB 3: MODELS CATALOG -->
    <section id="tab-models" class="hidden space-y-4">
      <div class="glass-card rounded-2xl p-5 lg:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 class="text-base font-bold text-white tracking-tight">OpenAI Compatible Model Catalog</h2>
            <p class="text-xs text-gray-400">Registered and combo models available through <code class="text-cyan-400">/v1/models</code></p>
          </div>
          <div class="w-full sm:w-64">
            <input type="text" id="model-search" oninput="filterCatalog()" placeholder="Search model id..." class="w-full bg-gray-950/80 border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all">
          </div>
        </div>

        <div id="catalog-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scroll">
          <!-- Dynamically populated -->
        </div>
      </div>
    </section>


    <!-- TAB 4: PLAYGROUND ⚡ -->
    <section id="tab-playground" class="hidden space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Controls Column -->
        <div class="glass-card rounded-2xl p-5 lg:p-6 space-y-4">
          <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Playground Config</span>
            <span class="text-cyan-400 text-xs">⚡ Direct Hono Fast-Path</span>
          </h2>

          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">Target Model</label>
            <select id="play-model" class="w-full bg-gray-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500">
              <option value="gemini-3.8-flash-high">gemini-3.8-flash-high (Antigravity)</option>
              <option value="gemini-3.7-flash-high">gemini-3.7-flash-high (Antigravity)</option>
              <option value="claude-opus-4-6-thinking">claude-opus-4-6-thinking (Antigravity)</option>
              <option value="deepseek-v4-flash">deepseek-v4-flash (Fast)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">API Endpoint Protocol</label>
            <select id="play-endpoint" class="w-full bg-gray-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500">
              <option value="/v1/chat/completions">POST /v1/chat/completions (OpenAI Format)</option>
              <option value="/v1/messages">POST /v1/messages (Claude Format)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">9Router API Key (if required)</label>
            <input type="password" id="play-key" placeholder="Optional if requireApiKey=false" class="w-full bg-gray-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500">
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">System Prompt</label>
            <textarea id="play-system" rows="2" class="w-full bg-gray-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500">You are a helpful, terse AI assistant running on 9router-hono.</textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">User Message</label>
            <textarea id="play-prompt" rows="4" class="w-full bg-gray-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500">Tuliskan pantun jenaka 2 bait tentang kecepatan internet.</textarea>
          </div>

          <button onclick="runPlayground()" id="play-submit-btn" class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-glow-cyan flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Send Request
          </button>
        </div>

        <!-- Output Column -->
        <div class="lg:col-span-2 glass-card rounded-2xl p-5 lg:p-6 flex flex-col">
          <div class="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <h3 class="text-sm font-bold text-white uppercase tracking-wider">Stream Response</h3>
            <span id="play-status" class="text-xs font-mono text-gray-400">Idle</span>
          </div>

          <div id="play-output" class="flex-1 min-h-[350px] bg-gray-950/80 rounded-xl p-4 font-mono text-xs text-gray-200 overflow-y-auto whitespace-pre-wrap custom-scroll border border-white/5">
            Click "Send Request" to test the ultra-fast Hono pipeline live...
          </div>
        </div>

      </div>
    </section>


    <!-- TAB 5: LIVE LOGS -->
    <section id="tab-logs" class="hidden space-y-4">
      <div class="glass-card rounded-2xl p-5 lg:p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-base font-bold text-white tracking-tight">Recent Request Logs</h2>
            <p class="text-xs text-gray-400">Real-time ledger events recorded by 9router core</p>
          </div>
          <button onclick="loadLogs()" class="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded-lg text-white font-mono transition-all">Reload</button>
        </div>

        <div class="overflow-x-auto custom-scroll max-h-[580px]">
          <table class="w-full text-left text-xs text-gray-300">
            <thead class="bg-gray-950/60 uppercase text-[10px] text-gray-400 font-mono sticky top-0 backdrop-blur-md">
              <tr>
                <th class="py-2.5 px-3">Timestamp</th>
                <th class="py-2.5 px-3">Provider</th>
                <th class="py-2.5 px-3">Model</th>
                <th class="py-2.5 px-3">Tokens (In / Out)</th>
                <th class="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody id="logs-table-body" class="divide-y divide-white/5 font-mono">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

  </main>

  <script>
    let globalChart = null;
    let currentPeriod = 'all';
    let cachedAccounts = [];
    let cachedModels = [];

    // Tab Navigation
    function switchTab(tabId) {
      ['overview', 'accounts', 'models', 'playground', 'logs'].forEach(t => {
        const el = document.getElementById('tab-' + t);
        const btn = document.getElementById('tab-btn-' + t);
        if (el) el.classList.toggle('hidden', t !== tabId);
        if (btn) {
          if (t === tabId) {
            btn.className = 'tab-btn px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand-500 text-black shadow-glow-cyan transition-all duration-200';
          } else {
            btn.className = 'tab-btn px-4 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-all duration-200';
          }
        }
      });
      if (tabId === 'logs') loadLogs();
    }

    // Number formatter
    function fmt(n) {
      if (!n && n !== 0) return '0';
      if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
      if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
      if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
      return Number(n).toLocaleString();
    }

    // Period selector
    function setPeriod(p) {
      currentPeriod = p;
      ['today', '7d', '30d', 'all'].forEach(k => {
        const btn = document.getElementById('period-' + k);
        if (btn) {
          if (k === p) {
            btn.className = 'period-btn px-3 py-1 text-xs font-semibold rounded-lg bg-brand-500 text-black shadow-glow-cyan transition-all';
          } else {
            btn.className = 'period-btn px-3 py-1 text-xs font-medium rounded-lg text-gray-400 hover:text-white transition-all';
          }
        }
      });
      fetchData();
    }

    // Fetch stats and chart
    async function fetchData() {
      try {
        const [statsRes, chartRes] = await Promise.all([
          fetch('/api/dashboard/stats?period=' + currentPeriod).then(r => r.json()),
          fetch('/api/dashboard/chart?period=' + currentPeriod).then(r => r.json())
        ]);

        if (statsRes.stats) {
          const s = statsRes.stats;
          const totalPrompt = s.totalPromptTokens || 0;
          const totalComp = s.totalCompletionTokens || 0;
          const totalCached = s.totalCachedTokens || 0;
          const grandTotal = totalPrompt + totalComp + totalCached;

          document.getElementById('stat-total-tokens').textContent = fmt(grandTotal);
          document.getElementById('stat-prompt-tokens').textContent = fmt(totalPrompt);
          document.getElementById('stat-comp-tokens').textContent = fmt(totalComp);
          document.getElementById('stat-total-requests').textContent = (s.totalRequests || 0).toLocaleString();
          document.getElementById('stat-total-cost').textContent = '$' + (s.totalCost || 0).toFixed(2);
          document.getElementById('stat-account-pool').textContent = statsRes.meta?.totalAccounts || 0;
          document.getElementById('nav-acc-count').textContent = statsRes.meta?.totalAccounts || 0;

          // Populate top models list
          const modelsList = document.getElementById('models-rank-list');
          modelsList.innerHTML = '';
          const sortedModels = Object.entries(s.byModel || {})
            .sort((a, b) => (b[1].requests || 0) - (a[1].requests || 0))
            .slice(0, 10);

          sortedModels.forEach(([modelKey, m], idx) => {
            const mTotal = (m.promptTokens || 0) + (m.completionTokens || 0);
            const row = document.createElement('div');
            row.className = 'flex items-center justify-between p-2.5 rounded-xl bg-gray-950/40 border border-white/5 hover:border-cyan-500/30 transition-all';
            row.innerHTML = \`
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="h-6 w-6 rounded-lg bg-gray-800 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">\${idx + 1}</span>
                <div class="truncate">
                  <div class="text-xs font-semibold text-white truncate">\${m.rawModel || modelKey}</div>
                  <div class="text-[10px] text-gray-400">\${m.provider || 'default'}</div>
                </div>
              </div>
              <div class="text-right font-mono text-xs flex-shrink-0">
                <div class="font-bold text-cyan-300">\${fmt(m.requests)} reqs</div>
                <div class="text-[10px] text-gray-400">\${fmt(mTotal)} tokens</div>
              </div>
            \`;
            modelsList.appendChild(row);
          });

          // Populate providers matrix
          const provList = document.getElementById('providers-matrix-list');
          provList.innerHTML = '';
          const providers = statsRes.meta?.providers || {};
          Object.entries(providers)
            .sort((a, b) => b[1] - a[1])
            .forEach(([prov, cnt]) => {
              const card = document.createElement('div');
              card.className = 'p-3 rounded-xl bg-gray-950/50 border border-white/5 flex flex-col justify-between';
              card.innerHTML = \`
                <span class="text-[11px] font-bold text-gray-300 truncate uppercase tracking-wider">\${prov}</span>
                <div class="mt-2 flex items-baseline justify-between">
                  <span class="text-lg font-black font-mono text-cyan-400">\${cnt}</span>
                  <span class="text-[10px] text-gray-500 font-mono">accounts</span>
                </div>
              \`;
              provList.appendChild(card);
            });
        }

        // Render Chart
        renderChart(chartRes);

      } catch (e) {
        console.error("Dashboard fetch error:", e);
      }
    }

    function renderChart(chartData) {
      if (!Array.isArray(chartData) || !chartData.length) return;
      const ctx = document.getElementById('usageChart').getContext('2d');
      if (globalChart) globalChart.destroy();

      const labels = chartData.map(d => d.label);
      const tokens = chartData.map(d => d.tokens || 0);

      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

      globalChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Tokens Processed',
            data: tokens,
            borderColor: '#22d3ee',
            borderWidth: 2.5,
            pointBackgroundColor: '#06b6d4',
            pointRadius: chartData.length > 40 ? 0 : 3,
            pointHoverRadius: 6,
            fill: true,
            backgroundColor: gradient,
            tension: 0.35,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index',
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              titleColor: '#fff',
              bodyColor: '#22d3ee',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              padding: 10,
              displayColors: false,
              callbacks: {
                label: (ctx) => 'Tokens: ' + ctx.raw.toLocaleString()
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.03)' },
              ticks: { color: '#6b7280', font: { size: 10, family: 'JetBrains Mono' }, maxTicksLimit: 12 }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: {
                color: '#6b7280',
                font: { size: 10, family: 'JetBrains Mono' },
                callback: (val) => fmt(val)
              }
            }
          }
        }
      });
    }

    // Load Accounts
    async function loadAccounts() {
      try {
        const res = await fetch('/api/dashboard/accounts');
        cachedAccounts = await res.json();
        renderAccountsTable(cachedAccounts);
      } catch (e) {
        console.error(e);
      }
    }

    function renderAccountsTable(list) {
      const tbody = document.getElementById('accounts-table-body');
      tbody.innerHTML = '';
      list.forEach(a => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-white/[0.02] transition-colors';
        tr.innerHTML = \`
          <td class="py-2.5 px-3 font-semibold text-white">\${a.provider}</td>
          <td class="py-2.5 px-3 text-cyan-300 font-sans truncate max-w-[200px]">\${a.name || a.email}</td>
          <td class="py-2.5 px-3 text-gray-400 uppercase text-[10px]">\${a.authType}</td>
          <td class="py-2.5 px-3">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${a.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-rose-950 text-rose-400 border border-rose-800/60'}">
              \${a.isActive ? 'Active' : 'Disabled'}
            </span>
          </td>
          <td class="py-2.5 px-3 text-gray-400">\${a.priority}</td>
          <td class="py-2.5 px-3 text-gray-500 text-[10px] truncate max-w-[120px]">\${a.id}</td>
        \`;
        tbody.appendChild(tr);
      });
    }

    function filterAccounts() {
      const query = document.getElementById('account-search').value.toLowerCase();
      const filtered = cachedAccounts.filter(a => 
        (a.name || '').toLowerCase().includes(query) ||
        (a.email || '').toLowerCase().includes(query) ||
        (a.provider || '').toLowerCase().includes(query)
      );
      renderAccountsTable(filtered);
    }

    // Load Models Catalog
    async function loadCatalog() {
      try {
        const res = await fetch('/api/dashboard/models');
        const data = await res.json();
        cachedModels = data.models || [];
        document.getElementById('nav-model-count').textContent = cachedModels.length;
        renderCatalog(cachedModels);

        // Populate playground select
        const sel = document.getElementById('play-model');
        sel.innerHTML = '';
        cachedModels.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m.id;
          opt.textContent = m.id + (m.owned_by ? ' (' + m.owned_by + ')' : '');
          sel.appendChild(opt);
        });
      } catch (e) {
        console.error(e);
      }
    }

    function renderCatalog(models) {
      const grid = document.getElementById('catalog-grid');
      grid.innerHTML = '';
      models.forEach(m => {
        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-xl bg-gray-950/60 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between';
        card.innerHTML = \`
          <div>
            <div class="text-xs font-bold text-white font-mono break-all">\${m.id}</div>
            <div class="text-[10px] text-cyan-400 mt-1 uppercase tracking-wider font-mono">\${m.owned_by || '9router'}</div>
          </div>
          <div class="mt-3 flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-white/5">
            <span>Context: \${m.context_length ? fmt(m.context_length) : 'N/A'}</span>
            <button onclick="copyModel('\${m.id}')" class="text-xs text-gray-400 hover:text-white">Copy</button>
          </div>
        \`;
        grid.appendChild(card);
      });
    }

    function filterCatalog() {
      const query = document.getElementById('model-search').value.toLowerCase();
      const filtered = cachedModels.filter(m => m.id.toLowerCase().includes(query));
      renderCatalog(filtered);
    }

    function copyModel(id) {
      navigator.clipboard.writeText(id);
      alert('Model ID copied: ' + id);
    }

    // Load Logs
    async function loadLogs() {
      try {
        const res = await fetch('/api/dashboard/logs?limit=80');
        const logs = await res.json();
        const tbody = document.getElementById('logs-table-body');
        tbody.innerHTML = '';
        logs.forEach(l => {
          const tr = document.createElement('tr');
          tr.className = 'hover:bg-white/[0.02] transition-colors';
          const inTokens = l.promptTokens || 0;
          const outTokens = l.completionTokens || 0;
          tr.innerHTML = \`
            <td class="py-2 px-3 text-gray-400 text-[10px] whitespace-nowrap">\${l.timestamp ? new Date(l.timestamp).toLocaleTimeString() : '-'}</td>
            <td class="py-2 px-3 font-semibold text-white">\${l.provider || '-'}</td>
            <td class="py-2 px-3 text-cyan-300 truncate max-w-[220px]">\${l.model || '-'}</td>
            <td class="py-2 px-3 text-gray-300">\${fmt(inTokens)} / \${fmt(outTokens)}</td>
            <td class="py-2 px-3"><span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400">\${l.status || 'OK'}</span></td>
          \`;
          tbody.appendChild(tr);
        });
      } catch (e) {
        console.error(e);
      }
    }

    // Playground Execution
    async function runPlayground() {
      const btn = document.getElementById('play-submit-btn');
      const status = document.getElementById('play-status');
      const out = document.getElementById('play-output');
      const model = document.getElementById('play-model').value;
      const endpoint = document.getElementById('play-endpoint').value;
      const key = document.getElementById('play-key').value;
      const system = document.getElementById('play-system').value;
      const prompt = document.getElementById('play-prompt').value;

      btn.disabled = true;
      btn.classList.add('opacity-50');
      status.textContent = 'Connecting...';
      out.textContent = '';

      const headers = { 'Content-Type': 'application/json' };
      if (key) headers['Authorization'] = 'Bearer ' + key;

      let payload = {};
      if (endpoint.includes('messages')) {
        payload = {
          model,
          max_tokens: 1024,
          system,
          messages: [{ role: 'user', content: prompt }]
        };
      } else {
        payload = {
          model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt }
          ]
        };
      }

      const startTime = performance.now();

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        const elapsed = (performance.now() - startTime).toFixed(1);
        status.textContent = \`Status: \${res.status} (\${elapsed}ms)\`;

        if (!res.ok) {
          const err = await res.text();
          out.textContent = \`Error (\${res.status}):\n\${err}\`;
          return;
        }

        const data = await res.json();
        if (data.choices?.[0]?.message?.content) {
          out.textContent = data.choices[0].message.content;
        } else if (data.content?.[0]?.text) {
          out.textContent = data.content[0].text;
        } else {
          out.textContent = JSON.stringify(data, null, 2);
        }
      } catch (err) {
        status.textContent = 'Failed';
        out.textContent = 'Request failed: ' + err.message;
      } finally {
        btn.disabled = false;
        btn.classList.remove('opacity-50');
      }
    }

    // Initial Load
    fetchData();
    loadAccounts();
    loadCatalog();
  </script>
</body>
</html>
`;
