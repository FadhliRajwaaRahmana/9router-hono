export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>9Router Hono — Control Plane</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Inter"', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          },
          colors: {
            brand: {
              50: '#ecfeff',
              100: '#cffafe',
              400: '#22d3ee',
              500: '#06b6d4',
              600: '#0891b2',
              700: '#0e7490',
            },
            bg: {
              DEFAULT: '#09090b',
              subtle: '#121215',
              card: '#18181b',
              elevated: '#27272a',
            },
            border: {
              subtle: 'rgba(255, 255, 255, 0.08)',
              hover: 'rgba(6, 182, 212, 0.4)',
            }
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: #09090b;
      color: #f4f4f5;
    }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 22;
      vertical-align: middle;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.12);
      border-radius: 9999px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(6, 182, 212, 0.5);
    }
    .landing-grid {
      background-size: 32px 32px;
      background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    }
    .nav-item.active {
      background: rgba(6, 182, 212, 0.12);
      color: #22d3ee;
      border-left: 3px solid #06b6d4;
    }
    @keyframes pulse-subms {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.6; }
    }
    .animate-subms {
      animation: pulse-subms 2s infinite ease-in-out;
    }
  </style>
</head>
<body class="flex h-screen w-full overflow-hidden antialiased selection:bg-brand-500 selection:text-black">

  <!-- Mobile Sidebar Backdrop Overlay -->
  <div id="sidebar-overlay" onclick="toggleSidebar(false)" class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden hidden transition-opacity duration-300"></div>

  <!-- Left Sidebar (Aligned with 9Router-fix style + Modern Touches) -->
  <aside id="main-sidebar" class="fixed lg:static inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border-subtle bg-bg-subtle backdrop-blur-xl transition-transform duration-300 -translate-x-full lg:translate-x-0">
    
    <!-- Mac-style Traffic lights & App header -->
    <div class="px-5 pt-4 pb-3 border-b border-border-subtle">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-1.5">
          <div class="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm"></div>
          <div class="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm"></div>
          <div class="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm"></div>
        </div>
        <button onclick="toggleSidebar(false)" class="lg:hidden text-gray-400 hover:text-white p-1">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div class="flex items-center gap-2.5">
        <div class="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-700 shadow-md">
          <span class="material-symbols-outlined text-black text-[20px] font-bold">bolt</span>
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-sm text-white tracking-tight">9Router Hono</span>
            <span class="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">v0.2.0</span>
          </div>
          <span class="text-[11px] text-gray-400 font-mono flex items-center gap-1">
            <span class="size-1.5 rounded-full bg-emerald-400 animate-subms"></span>
            Hono Core (<span id="sidebar-port">20129</span>)
          </span>
        </div>
      </div>
    </div>

    <!-- Navigation Links -->
    <div class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
      
      <!-- Primary Section -->
      <div>
        <div class="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">Routing & Telemetry</div>
        <nav class="space-y-0.5">
          <button onclick="navigate('usage')" id="nav-usage" class="nav-item active w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 transition-all text-left">
            <span class="material-symbols-outlined text-[18px]">bar_chart</span>
            <span>Usage & Analytics</span>
          </button>
          <button onclick="navigate('providers')" id="nav-providers" class="nav-item w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 transition-all text-left">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[18px]">dns</span>
              <span>Providers & Accounts</span>
            </div>
            <span id="nav-badge-accounts" class="px-1.5 py-0.5 text-[10px] font-mono rounded bg-gray-800 text-gray-300 font-bold">...</span>
          </button>
          <button onclick="navigate('endpoint')" id="nav-endpoint" class="nav-item w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 transition-all text-left">
            <span class="material-symbols-outlined text-[18px]">api</span>
            <span>Endpoint & Keys</span>
          </button>
          <button onclick="navigate('combos')" id="nav-combos" class="nav-item w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 transition-all text-left">
            <span class="material-symbols-outlined text-[18px]">layers</span>
            <span>Combos & Adapters</span>
          </button>
          <button onclick="navigate('tokensaver')" id="nav-tokensaver" class="nav-item w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 transition-all text-left">
            <span class="material-symbols-outlined text-[18px]">savings</span>
            <span>Token Saver</span>
          </button>
        </nav>
      </div>

      <!-- Developer & Diagnostics Section -->
      <div>
        <div class="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">Developer Tools</div>
        <nav class="space-y-0.5">
          <button onclick="navigate('playground')" id="nav-playground" class="nav-item w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 transition-all text-left">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[18px]">terminal</span>
              <span>Live Playground</span>
            </div>
            <span class="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-cyan-950 text-cyan-400">FAST</span>
          </button>
          <button onclick="navigate('catalog')" id="nav-catalog" class="nav-item w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 transition-all text-left">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[18px]">inventory_2</span>
              <span>Model Catalog</span>
            </div>
            <span id="nav-badge-models" class="px-1.5 py-0.5 text-[10px] font-mono rounded bg-gray-800 text-gray-300 font-bold">...</span>
          </button>
          <button onclick="navigate('logs')" id="nav-logs" class="nav-item w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 transition-all text-left">
            <span class="material-symbols-outlined text-[18px]">description</span>
            <span>Console Logs</span>
          </button>
        </nav>
      </div>

    </div>

    <!-- Footer Local Storage indicator (Matches 9Router style) -->
    <div class="p-3 border-t border-border-subtle bg-bg-card/50">
      <div class="flex items-center justify-between text-xs text-gray-400 px-2 py-1">
        <div class="flex items-center gap-2">
          <span class="size-2 rounded-full bg-emerald-400"></span>
          <span class="font-medium text-[11px] text-gray-300">Local Mode</span>
        </div>
        <span class="text-[10px] font-mono text-cyan-400">SQLite Active</span>
      </div>
      <div class="px-2 text-[10px] text-gray-400 truncate font-mono mt-0.5">
        ~/.9router/db/data.sqlite
      </div>
    </div>
  </aside>

  <!-- Main Content Wrapper -->
  <div class="flex-1 flex flex-col min-w-0 h-full relative isolate">
    <!-- Faint background pattern -->
    <div class="landing-grid absolute inset-0 pointer-events-none -z-10" aria-hidden="true"></div>

    <!-- Top Navigation Bar -->
    <header class="h-14 border-b border-border-subtle bg-bg-subtle/80 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between z-10">
      <div class="flex items-center gap-3">
        <button onclick="toggleSidebar(true)" class="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h1 id="page-title" class="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            Usage & Analytics
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <span class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 text-xs font-mono font-medium">
          <span class="size-1.5 rounded-full bg-emerald-400 animate-subms"></span>
          Latency &lt; 0.5ms
        </span>
        <button onclick="refreshAll()" class="p-2 rounded-lg bg-bg-card hover:bg-bg-elevated border border-border-subtle text-gray-300 hover:text-white transition-all text-xs flex items-center gap-1.5 shadow-sm">
          <span class="material-symbols-outlined text-[16px]">refresh</span>
          <span class="hidden sm:inline text-xs font-medium">Refresh</span>
        </button>
      </div>
    </header>

    <!-- Scrollable Workspace Views -->
    <main class="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8">
      <div class="max-w-7xl mx-auto space-y-6">

        <!-- ======================================================== -->
        <!-- VIEW 1: USAGE & ANALYTICS (Matches 9router-fix usage)   -->
        <!-- ======================================================== -->
        <div id="view-usage" class="view-panel space-y-6">
          
          <!-- Metric Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div class="bg-bg-card border border-border-subtle rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Total Tokens</span>
                <span class="material-symbols-outlined text-[18px] text-cyan-400">auto_awesome</span>
              </div>
              <div id="u-total-tokens" class="text-xl lg:text-2xl font-bold font-mono text-white">...</div>
              <div class="mt-2 text-[11px] text-gray-400 font-mono truncate">
                <span id="u-prompt-tokens" class="text-cyan-400">0</span> in · <span id="u-comp-tokens" class="text-emerald-400">0</span> out
              </div>
            </div>

            <div class="bg-bg-card border border-border-subtle rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Total Requests</span>
                <span class="material-symbols-outlined text-[18px] text-emerald-400">bolt</span>
              </div>
              <div id="u-total-requests" class="text-xl lg:text-2xl font-bold font-mono text-white">...</div>
              <div class="mt-2 text-[11px] text-gray-400 font-mono">
                Across <span id="u-accounts-count" class="text-white font-bold">0</span> Accounts
              </div>
            </div>

            <div class="bg-bg-card border border-border-subtle rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Estimated Value</span>
                <span class="material-symbols-outlined text-[18px] text-violet-400">attach_money</span>
              </div>
              <div id="u-total-cost" class="text-xl lg:text-2xl font-bold font-mono text-white">$0.00</div>
              <div class="mt-2 text-[11px] text-gray-400 font-mono">
                API Equivalent Saved
              </div>
            </div>

            <div class="bg-bg-card border border-border-subtle rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Routing Engine</span>
                <span class="material-symbols-outlined text-[18px] text-amber-400">speed</span>
              </div>
              <div class="text-xl lg:text-2xl font-bold font-mono text-amber-300">&lt; 0.45 ms</div>
              <div class="mt-2 text-[11px] text-emerald-400 font-mono">
                Hono RegExpRouter Native
              </div>
            </div>
          </div>

          <!-- Usage Timeline Chart Card -->
          <div class="bg-bg-card border border-border-subtle rounded-xl p-5 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 class="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Throughput Timeline</span>
                </h2>
                <p class="text-xs text-gray-400">Daily token volume recorded in SQLite ledger</p>
              </div>

              <!-- Period Filter Buttons (Includes All-Time) -->
              <div class="inline-flex bg-bg-subtle p-1 rounded-lg border border-border-subtle">
                <button onclick="selectPeriod('today')" id="p-today" class="period-tab px-3 py-1 text-xs font-medium rounded-md text-gray-400 hover:text-white transition-all">Today</button>
                <button onclick="selectPeriod('7d')" id="p-7d" class="period-tab px-3 py-1 text-xs font-medium rounded-md text-gray-400 hover:text-white transition-all">7D</button>
                <button onclick="selectPeriod('30d')" id="p-30d" class="period-tab px-3 py-1 text-xs font-medium rounded-md text-gray-400 hover:text-white transition-all">30D</button>
                <button onclick="selectPeriod('60d')" id="p-60d" class="period-tab px-3 py-1 text-xs font-medium rounded-md text-gray-400 hover:text-white transition-all">60D</button>
                <button onclick="selectPeriod('all')" id="p-all" class="period-tab px-3 py-1 text-xs font-semibold rounded-md bg-brand-500 text-black shadow-sm transition-all">All</button>
              </div>
            </div>

            <div class="h-64 lg:h-72 w-full">
              <canvas id="mainChart"></canvas>
            </div>
          </div>

          <!-- Top Models & Provider Breakdown -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Top Models -->
            <div class="bg-bg-card border border-border-subtle rounded-xl p-5 shadow-sm">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
                <span>Top Models by Requests</span>
                <span class="text-[10px] text-cyan-400 font-mono font-normal">Active Breakdown</span>
              </h3>
              <div id="top-models-container" class="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                <!-- Dynamically filled -->
              </div>
            </div>

            <!-- Provider Matrix -->
            <div class="bg-bg-card border border-border-subtle rounded-xl p-5 shadow-sm">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
                <span>Provider Accounts Breakdown</span>
                <span class="text-[10px] text-emerald-400 font-mono font-normal">Health Pool</span>
              </h3>
              <div id="provider-matrix-container" class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                <!-- Dynamically filled -->
              </div>
            </div>
          </div>

        </div>

        <!-- ======================================================== -->
        <!-- VIEW 2: PROVIDERS & ACCOUNTS (Full accounts list)       -->
        <!-- ======================================================== -->
        <div id="view-providers" class="view-panel hidden space-y-4">
          <div class="bg-bg-card border border-border-subtle rounded-xl p-5 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 class="text-base font-bold text-white tracking-tight">Active Provider Accounts Pool</h2>
                <p class="text-xs text-gray-400">All credentials securely managed via SQLite with automatic circuit breakers</p>
              </div>
              <div class="w-full sm:w-72">
                <input type="text" id="filter-acc-input" oninput="searchAccounts()" placeholder="Filter by name, provider, email..." class="w-full bg-bg-subtle border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all font-mono">
              </div>
            </div>

            <div class="overflow-x-auto custom-scrollbar max-h-[600px]">
              <table class="w-full text-left text-xs text-gray-300">
                <thead class="bg-bg-subtle/80 uppercase text-[10px] text-gray-400 font-mono sticky top-0 backdrop-blur-md">
                  <tr>
                    <th class="py-2.5 px-3">Provider</th>
                    <th class="py-2.5 px-3">Account Name / Email</th>
                    <th class="py-2.5 px-3">Auth Type</th>
                    <th class="py-2.5 px-3">Status</th>
                    <th class="py-2.5 px-3">Priority</th>
                    <th class="py-2.5 px-3">Account ID</th>
                  </tr>
                </thead>
                <tbody id="accounts-rows" class="divide-y divide-border-subtle font-mono">
                  <!-- Dynamically rendered -->
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- VIEW 3: ENDPOINT & KEYS (Guides for Claude Code / Cursor)-->
        <!-- ======================================================== -->
        <div id="view-endpoint" class="view-panel hidden space-y-6">
          <div class="bg-bg-card border border-border-subtle rounded-xl p-5 shadow-sm space-y-5">
            <div>
              <h2 class="text-base font-bold text-white tracking-tight">Endpoint Configuration</h2>
              <p class="text-xs text-gray-400">Use this local endpoint in your coding harnesses, IDE extensions, or agent scripts</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div class="bg-bg-subtle p-3.5 rounded-lg border border-border-subtle">
                <div class="text-[10px] text-gray-400 mb-1 font-semibold uppercase">OpenAI Base URL</div>
                <div class="flex items-center justify-between text-cyan-400 font-bold">
                  <span id="cfg-openai-url">http://localhost:20129/v1</span>
                  <button onclick="copyText('http://localhost:20129/v1')" class="text-gray-400 hover:text-white">Copy</button>
                </div>
              </div>

              <div class="bg-bg-subtle p-3.5 rounded-lg border border-border-subtle">
                <div class="text-[10px] text-gray-400 mb-1 font-semibold uppercase">Claude Messages URL</div>
                <div class="flex items-center justify-between text-emerald-400 font-bold">
                  <span id="cfg-claude-url">http://localhost:20129/v1</span>
                  <button onclick="copyText('http://localhost:20129/v1')" class="text-gray-400 hover:text-white">Copy</button>
                </div>
              </div>
            </div>

            <!-- Quick Snippets -->
            <div class="space-y-3">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Integration Commands</h3>
              
              <div class="bg-bg-subtle p-3 rounded-lg border border-border-subtle space-y-1.5 font-mono text-xs">
                <div class="text-[11px] text-cyan-400 font-bold">Claude Code CLI Integration:</div>
                <div class="text-gray-300 bg-bg/60 p-2 rounded overflow-x-auto">
                  ANTHROPIC_BASE_URL="http://localhost:20129" claude
                </div>
              </div>

              <div class="bg-bg-subtle p-3 rounded-lg border border-border-subtle space-y-1.5 font-mono text-xs">
                <div class="text-[11px] text-emerald-400 font-bold">Cursor / Aider / OpenAI SDK:</div>
                <div class="text-gray-300 bg-bg/60 p-2 rounded overflow-x-auto">
                  OPENAI_BASE_URL="http://localhost:20129/v1" OPENAI_API_KEY="sk-any-key"
                </div>
              </div>
            </div>

            <!-- API Keys Section -->
            <div class="pt-3 border-t border-border-subtle">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Registered API Keys</h3>
              <div id="api-keys-list" class="space-y-2 font-mono text-xs">
                <!-- Dynamically filled -->
              </div>
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- VIEW 4: COMBOS & VISION ADAPTERS                         -->
        <!-- ======================================================== -->
        <div id="view-combos" class="view-panel hidden space-y-4">
          <div class="bg-bg-card border border-border-subtle rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h2 class="text-base font-bold text-white tracking-tight">Combos & Vision Adapter</h2>
              <p class="text-xs text-gray-400">Multi-model fallback arrays and capacity-based auto routing</p>
            </div>
            <div id="combos-list" class="space-y-3">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- VIEW 5: TOKEN SAVER & COMPRESSION                       -->
        <!-- ======================================================== -->
        <div id="view-tokensaver" class="view-panel hidden space-y-4">
          <div class="bg-bg-card border border-border-subtle rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h2 class="text-base font-bold text-white tracking-tight">Token Saver & Optimization Engine</h2>
              <p class="text-xs text-gray-400">Built-in RTK compression, Undici keep-alive, and latency reduction features</p>
            </div>

            <div id="tokensaver-features" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- VIEW 6: PLAYGROUND (Interactive live testing)           -->
        <!-- ======================================================== -->
        <div id="view-playground" class="view-panel hidden space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-bg-card border border-border-subtle rounded-xl p-5 space-y-4">
              <h2 class="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
                <span>Playground Options</span>
                <span class="text-cyan-400 font-mono">⚡ Direct Route</span>
              </h2>

              <div>
                <label class="block text-xs text-gray-400 mb-1">Model Target</label>
                <select id="pg-model" class="w-full bg-bg-subtle border border-border-subtle rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500 font-mono">
                  <option value="gemini-3.8-flash-high">gemini-3.8-flash-high (Antigravity)</option>
                  <option value="gemini-3.7-flash-high">gemini-3.7-flash-high (Antigravity)</option>
                  <option value="claude-opus-4-6-thinking">claude-opus-4-6-thinking (Antigravity)</option>
                  <option value="deepseek-v4-flash">deepseek-v4-flash</option>
                </select>
              </div>

              <div>
                <label class="block text-xs text-gray-400 mb-1">API Protocol</label>
                <select id="pg-protocol" class="w-full bg-bg-subtle border border-border-subtle rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500 font-mono">
                  <option value="/v1/chat/completions">POST /v1/chat/completions (OpenAI)</option>
                  <option value="/v1/messages">POST /v1/messages (Claude)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs text-gray-400 mb-1">System Message</label>
                <textarea id="pg-system" rows="2" class="w-full bg-bg-subtle border border-border-subtle rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500">You are a helpful and concise assistant.</textarea>
              </div>

              <div>
                <label class="block text-xs text-gray-400 mb-1">User Prompt</label>
                <textarea id="pg-prompt" rows="3" class="w-full bg-bg-subtle border border-border-subtle rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500">Ceritakan 1 lelucon lucu tentang programmer.</textarea>
              </div>

              <button onclick="executePlayground()" id="pg-btn" class="w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-cyan-400 text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-md">
                <span class="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Send Request</span>
              </button>
            </div>

            <div class="lg:col-span-2 bg-bg-card border border-border-subtle rounded-xl p-5 flex flex-col">
              <div class="flex items-center justify-between border-b border-border-subtle pb-3 mb-3 text-xs">
                <span class="font-bold text-white uppercase tracking-wider">Stream Output</span>
                <span id="pg-latency" class="font-mono text-gray-400">Idle</span>
              </div>
              <div id="pg-output" class="flex-1 min-h-[300px] bg-bg-subtle rounded-lg p-4 font-mono text-xs text-gray-200 overflow-y-auto whitespace-pre-wrap custom-scrollbar border border-border-subtle">
                Click "Send Request" to test the ultra-fast Hono pipeline live...
              </div>
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- VIEW 7: MODEL CATALOG                                    -->
        <!-- ======================================================== -->
        <div id="view-catalog" class="view-panel hidden space-y-4">
          <div class="bg-bg-card border border-border-subtle rounded-xl p-5 shadow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h2 class="text-base font-bold text-white tracking-tight">OpenAI Compatible Catalog</h2>
                <p class="text-xs text-gray-400">Models advertised through <code class="text-cyan-400">GET /v1/models</code></p>
              </div>
              <input type="text" id="catalog-search" oninput="searchCatalog()" placeholder="Search model name..." class="w-full sm:w-64 bg-bg-subtle border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 font-mono">
            </div>

            <div id="catalog-cards-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- VIEW 8: CONSOLE LOGS                                     -->
        <!-- ======================================================== -->
        <div id="view-logs" class="view-panel hidden space-y-4">
          <div class="bg-bg-card border border-border-subtle rounded-xl p-5 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-white tracking-tight">Recent Request Logs</h2>
                <p class="text-xs text-gray-400">Activity stream from SQLite usage history</p>
              </div>
              <button onclick="loadLogsView()" class="px-3 py-1 bg-bg-subtle hover:bg-bg-elevated border border-border-subtle text-xs rounded text-white font-mono">Reload</button>
            </div>

            <div class="overflow-x-auto custom-scrollbar max-h-[580px]">
              <table class="w-full text-left text-xs text-gray-300">
                <thead class="bg-bg-subtle uppercase text-[10px] text-gray-400 font-mono sticky top-0 backdrop-blur-md">
                  <tr>
                    <th class="py-2.5 px-3">Time</th>
                    <th class="py-2.5 px-3">Provider</th>
                    <th class="py-2.5 px-3">Model</th>
                    <th class="py-2.5 px-3">Tokens (In / Out)</th>
                    <th class="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody id="logs-rows" class="divide-y divide-border-subtle font-mono">
                  <!-- Dynamically populated -->
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>

  <script>
    let globalChart = null;
    let currentPeriod = 'all';
    let accountsData = [];
    let catalogData = [];

    function toggleSidebar(open) {
      const sidebar = document.getElementById('main-sidebar');
      const overlay = document.getElementById('sidebar-overlay');
      if (open) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
      } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
      }
    }

    function navigate(viewKey) {
      document.querySelectorAll('.view-panel').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

      const targetView = document.getElementById('view-' + viewKey);
      const targetNav = document.getElementById('nav-' + viewKey);
      if (targetView) targetView.classList.remove('hidden');
      if (targetNav) targetNav.classList.add('active');

      const titles = {
        usage: 'Usage & Analytics',
        providers: 'Providers & Accounts',
        endpoint: 'Endpoint & Keys',
        combos: 'Combos & Vision Adapters',
        tokensaver: 'Token Saver & Optimizations',
        playground: 'Live Playground ⚡',
        catalog: 'Model Catalog',
        logs: 'Console Logs'
      };
      document.getElementById('page-title').textContent = titles[viewKey] || 'Dashboard';

      toggleSidebar(false);

      if (viewKey === 'providers') loadAccountsView();
      if (viewKey === 'catalog') loadCatalogView();
      if (viewKey === 'combos') loadCombosView();
      if (viewKey === 'tokensaver') loadTokenSaverView();
      if (viewKey === 'endpoint') loadEndpointView();
      if (viewKey === 'logs') loadLogsView();
    }

    function fmtNum(n) {
      if (!n && n !== 0) return '0';
      if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
      if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
      if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
      return Number(n).toLocaleString();
    }

    function selectPeriod(p) {
      currentPeriod = p;
      ['today', '7d', '30d', '60d', 'all'].forEach(k => {
        const btn = document.getElementById('p-' + k);
        if (btn) {
          if (k === p) {
            btn.className = 'period-tab px-3 py-1 text-xs font-semibold rounded-md bg-brand-500 text-black shadow-sm transition-all';
          } else {
            btn.className = 'period-tab px-3 py-1 text-xs font-medium rounded-md text-gray-400 hover:text-white transition-all';
          }
        }
      });
      loadUsageData();
    }

    async function loadUsageData() {
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

          document.getElementById('u-total-tokens').textContent = fmtNum(grandTotal);
          document.getElementById('u-prompt-tokens').textContent = fmtNum(totalPrompt);
          document.getElementById('u-comp-tokens').textContent = fmtNum(totalComp);
          document.getElementById('u-total-requests').textContent = (s.totalRequests || 0).toLocaleString();
          document.getElementById('u-total-cost').textContent = '$' + (s.totalCost || 0).toFixed(2);
          document.getElementById('u-accounts-count').textContent = statsRes.meta?.totalAccounts || 0;
          document.getElementById('nav-badge-accounts').textContent = statsRes.meta?.totalAccounts || 0;

          // Render top models
          const modelsEl = document.getElementById('top-models-container');
          modelsEl.innerHTML = '';
          const sortedModels = Object.entries(s.byModel || {})
            .sort((a, b) => (b[1].requests || 0) - (a[1].requests || 0))
            .slice(0, 10);

          sortedModels.forEach(([key, m], idx) => {
            const row = document.createElement('div');
            row.className = 'flex items-center justify-between p-2.5 rounded-lg bg-bg-subtle border border-border-subtle';
            row.innerHTML = \`
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="size-6 rounded bg-bg-elevated text-cyan-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">\${idx + 1}</span>
                <div class="truncate">
                  <div class="text-xs font-semibold text-white truncate">\${m.rawModel || key}</div>
                  <div class="text-[10px] text-gray-400">\${m.provider || 'default'}</div>
                </div>
              </div>
              <div class="text-right font-mono text-xs flex-shrink-0">
                <div class="font-bold text-cyan-300">\${fmtNum(m.requests)} reqs</div>
                <div class="text-[10px] text-gray-400">\${fmtNum((m.promptTokens || 0) + (m.completionTokens || 0))} tokens</div>
              </div>
            \`;
            modelsEl.appendChild(row);
          });

          // Render provider matrix
          const provEl = document.getElementById('provider-matrix-container');
          provEl.innerHTML = '';
          const provs = statsRes.meta?.providers || {};
          Object.entries(provs).sort((a, b) => b[1] - a[1]).forEach(([prov, cnt]) => {
            const card = document.createElement('div');
            card.className = 'p-3 rounded-lg bg-bg-subtle border border-border-subtle flex flex-col justify-between';
            card.innerHTML = \`
              <span class="text-[11px] font-bold text-gray-300 truncate uppercase tracking-wider">\${prov}</span>
              <div class="mt-2 flex items-baseline justify-between">
                <span class="text-base font-bold font-mono text-cyan-400">\${cnt}</span>
                <span class="text-[10px] text-gray-500 font-mono">accounts</span>
              </div>
            \`;
            provEl.appendChild(card);
          });
        }

        renderUsageChart(chartRes);
      } catch (err) {
        console.error("Usage load error:", err);
      }
    }

    function renderUsageChart(chartData) {
      if (!Array.isArray(chartData) || !chartData.length) return;
      const ctx = document.getElementById('mainChart').getContext('2d');
      if (globalChart) globalChart.destroy();

      const labels = chartData.map(d => d.label);
      const tokens = chartData.map(d => d.tokens || 0);

      const gradient = ctx.createLinearGradient(0, 0, 0, 260);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

      globalChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Tokens',
            data: tokens,
            borderColor: '#22d3ee',
            borderWidth: 2,
            pointBackgroundColor: '#06b6d4',
            pointRadius: chartData.length > 40 ? 0 : 2.5,
            fill: true,
            backgroundColor: gradient,
            tension: 0.3,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#18181b',
              titleColor: '#fff',
              bodyColor: '#22d3ee',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              padding: 10,
              displayColors: false,
              callbacks: {
                label: (c) => 'Tokens: ' + c.raw.toLocaleString()
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.03)' },
              ticks: { color: '#71717a', font: { size: 10, family: 'JetBrains Mono' }, maxTicksLimit: 12 }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: {
                color: '#71717a',
                font: { size: 10, family: 'JetBrains Mono' },
                callback: (v) => fmtNum(v)
              }
            }
          }
        }
      });
    }

    async function loadAccountsView() {
      try {
        const res = await fetch('/api/dashboard/accounts');
        accountsData = await res.json();
        renderAccountsTable(accountsData);
      } catch (err) {
        console.error(err);
      }
    }

    function renderAccountsTable(list) {
      const tbody = document.getElementById('accounts-rows');
      tbody.innerHTML = '';
      list.forEach(a => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-white/[0.02] transition-colors';
        tr.innerHTML = \`
          <td class="py-2.5 px-3 font-semibold text-white">\${a.provider}</td>
          <td class="py-2.5 px-3 text-cyan-300 font-sans truncate max-w-[200px]">\${a.name || a.email}</td>
          <td class="py-2.5 px-3 text-gray-400 uppercase text-[10px]">\${a.authType}</td>
          <td class="py-2.5 px-3">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold \${a.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-rose-950 text-rose-400 border border-rose-800/50'}">
              \${a.isActive ? 'Active' : 'Disabled'}
            </span>
          </td>
          <td class="py-2.5 px-3 text-gray-400">\${a.priority}</td>
          <td class="py-2.5 px-3 text-gray-500 text-[10px] truncate max-w-[120px]">\${a.id}</td>
        \`;
        tbody.appendChild(tr);
      });
    }

    function searchAccounts() {
      const q = document.getElementById('filter-acc-input').value.toLowerCase();
      const filtered = accountsData.filter(a =>
        (a.name || '').toLowerCase().includes(q) ||
        (a.email || '').toLowerCase().includes(q) ||
        (a.provider || '').toLowerCase().includes(q)
      );
      renderAccountsTable(filtered);
    }

    async function loadCatalogView() {
      try {
        const res = await fetch('/api/dashboard/models');
        const data = await res.json();
        catalogData = data.models || [];
        document.getElementById('nav-badge-models').textContent = catalogData.length;
        renderCatalogCards(catalogData);

        // Populate playground select
        const sel = document.getElementById('pg-model');
        sel.innerHTML = '';
        catalogData.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m.id;
          opt.textContent = m.id + (m.owned_by ? ' (' + m.owned_by + ')' : '');
          sel.appendChild(opt);
        });
      } catch (err) {
        console.error(err);
      }
    }

    function renderCatalogCards(models) {
      const container = document.getElementById('catalog-cards-container');
      container.innerHTML = '';
      models.forEach(m => {
        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-lg bg-bg-subtle border border-border-subtle flex flex-col justify-between';
        card.innerHTML = \`
          <div>
            <div class="text-xs font-bold text-white font-mono break-all">\${m.id}</div>
            <div class="text-[10px] text-cyan-400 mt-1 uppercase font-mono">\${m.owned_by || '9router'}</div>
          </div>
          <div class="mt-3 flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-border-subtle">
            <span>Context: \${m.context_length ? fmtNum(m.context_length) : 'N/A'}</span>
            <button onclick="copyText('\${m.id}')" class="text-xs text-gray-400 hover:text-white">Copy</button>
          </div>
        \`;
        container.appendChild(card);
      });
    }

    function searchCatalog() {
      const q = document.getElementById('catalog-search').value.toLowerCase();
      renderCatalogCards(catalogData.filter(m => m.id.toLowerCase().includes(q)));
    }

    async function loadCombosView() {
      try {
        const res = await fetch('/api/dashboard/combos');
        const combos = await res.json();
        const el = document.getElementById('combos-list');
        el.innerHTML = '';
        if (!combos.length) {
          el.innerHTML = '<div class="text-xs text-gray-400 font-mono">No custom combos configured.</div>';
          return;
        }
        combos.forEach(c => {
          const item = document.createElement('div');
          item.className = 'p-3 rounded-lg bg-bg-subtle border border-border-subtle font-mono text-xs';
          item.innerHTML = \`
            <div class="font-bold text-white mb-1">\${c.name}</div>
            <div class="text-[11px] text-gray-400">Models: \${(c.models || []).join(' → ')}</div>
          \`;
          el.appendChild(item);
        });
      } catch (err) {
        console.error(err);
      }
    }

    async function loadTokenSaverView() {
      try {
        const res = await fetch('/api/dashboard/settings');
        const settings = await res.json();
        const el = document.getElementById('tokensaver-features');
        el.innerHTML = '';

        const features = [
          { title: "RTK Token Saver", desc: "Compresses tool_result content in-place before upstream dispatch", active: !!settings.rtkEnabled },
          { title: "Undici Keep-Alive", desc: "Persistent TLS connection pool for all upstreams cutting 1-2s TCP handshake", active: true },
          { title: "Antigravity Image Direct", desc: "Direct route preserving image blocks without lossy OpenAI translation", active: true },
          { title: "Domain Circuit Breaker", desc: "Bulk-disables dead GSuite domains in <50ms after 2 failures", active: true },
          { title: "Headroom Optimizer", desc: settings.headroomUrl ? "Headroom service connected" : "Headroom optimization ready", active: !!settings.headroomEnabled },
          { title: "Tool Args Sanitizer", desc: "Normalizes invalid JSON schema parameters for Claude Code models", active: true }
        ];

        features.forEach(f => {
          const card = document.createElement('div');
          card.className = 'p-3.5 rounded-lg bg-bg-subtle border border-border-subtle flex items-start justify-between gap-2';
          card.innerHTML = \`
            <div>
              <div class="font-bold text-white">\${f.title}</div>
              <div class="text-[10px] text-gray-400 mt-1 font-sans">\${f.desc}</div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold \${f.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-gray-800 text-gray-400'}">
              \${f.active ? 'ENABLED' : 'OFF'}
            </span>
          \`;
          el.appendChild(card);
        });
      } catch (err) {
        console.error(err);
      }
    }

    async function loadEndpointView() {
      try {
        const res = await fetch('/api/dashboard/keys');
        const keys = await res.json();
        const el = document.getElementById('api-keys-list');
        el.innerHTML = '';
        if (!keys.length) {
          el.innerHTML = '<div class="text-gray-500">No API keys generated. Local requests are accepted directly.</div>';
          return;
        }
        keys.forEach(k => {
          const item = document.createElement('div');
          item.className = 'p-2.5 rounded bg-bg/50 border border-border-subtle flex items-center justify-between';
          item.innerHTML = \`
            <div>
              <div class="text-white font-semibold">\${k.name || 'API Key'}</div>
              <div class="text-gray-400 text-[11px]">\${k.key ? k.key.slice(0, 10) + '...' + k.key.slice(-4) : '••••••••'}</div>
            </div>
            <button onclick="copyText('\${k.key}')" class="text-xs text-gray-400 hover:text-white">Copy Key</button>
          \`;
          el.appendChild(item);
        });
      } catch (err) {
        console.error(err);
      }
    }

    async function loadLogsView() {
      try {
        const res = await fetch('/api/dashboard/logs?limit=80');
        const logs = await res.json();
        const tbody = document.getElementById('logs-rows');
        tbody.innerHTML = '';
        logs.forEach(l => {
          const tr = document.createElement('tr');
          tr.className = 'hover:bg-white/[0.02]';
          tr.innerHTML = \`
            <td class="py-2 px-3 text-gray-400 text-[10px] whitespace-nowrap">\${l.timestamp ? new Date(l.timestamp).toLocaleTimeString() : '-'}</td>
            <td class="py-2 px-3 font-semibold text-white">\${l.provider || '-'}</td>
            <td class="py-2 px-3 text-cyan-300 truncate max-w-[220px]">\${l.model || '-'}</td>
            <td class="py-2 px-3 text-gray-300">\${fmtNum(l.promptTokens || 0)} / \${fmtNum(l.completionTokens || 0)}</td>
            <td class="py-2 px-3"><span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400">\${l.status || 'OK'}</span></td>
          \`;
          tbody.appendChild(tr);
        });
      } catch (err) {
        console.error(err);
      }
    }

    async function executePlayground() {
      const btn = document.getElementById('pg-btn');
      const lat = document.getElementById('pg-latency');
      const out = document.getElementById('pg-output');
      const model = document.getElementById('pg-model').value;
      const protocol = document.getElementById('pg-protocol').value;
      const system = document.getElementById('pg-system').value;
      const prompt = document.getElementById('pg-prompt').value;

      btn.disabled = true;
      lat.textContent = 'Streaming...';
      out.textContent = '';

      let payload = {};
      if (protocol.includes('messages')) {
        payload = { model, max_tokens: 1024, system, messages: [{ role: 'user', content: prompt }] };
      } else {
        payload = { model, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }] };
      }

      const t0 = performance.now();
      try {
        const res = await fetch(protocol, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const elapsed = (performance.now() - t0).toFixed(1);
        lat.textContent = \`HTTP \${res.status} (\${elapsed}ms)\`;

        if (!res.ok) {
          out.textContent = 'Error:\n' + await res.text();
          return;
        }

        const data = await res.json();
        out.textContent = data.choices?.[0]?.message?.content || data.content?.[0]?.text || JSON.stringify(data, null, 2);
      } catch (err) {
        lat.textContent = 'Error';
        out.textContent = 'Fetch failed: ' + err.message;
      } finally {
        btn.disabled = false;
      }
    }

    function copyText(text) {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard: ' + text);
    }

    function refreshAll() {
      loadUsageData();
      loadCatalogView();
    }

    // Auto-detect current port in browser
    if (typeof window !== 'undefined' && window.location.port) {
      document.getElementById('sidebar-port').textContent = window.location.port;
      const base = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
      document.getElementById('cfg-openai-url').textContent = base + '/v1';
      document.getElementById('cfg-claude-url').textContent = base + '/v1';
    }

    // Initialize
    loadUsageData();
    loadCatalogView();
  </script>
</body>
</html>
`;
