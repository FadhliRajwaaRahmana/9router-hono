import {
  getUsageStats,
  getChartData,
  getRecentLogs,
} from "./lib/usageDb.js";
import {
  getProviderConnections,
  getProviderNodes,
  getApiKeys,
  createApiKey,
  deleteApiKey,
  getSettings,
  updateSettings,
  getModelAliases,
  getCombos,
  createCombo,
  deleteCombo,
  getProxyPools,
  updateProviderConnection,
} from "./lib/localDb.js";
import { buildModelsList } from "./modelsHandler.js";

export function registerDashboardRoutes(app) {
  // Stats overview
  app.get("/api/dashboard/stats", async (c) => {
    try {
      const period = c.req.query("period") || "all";
      const stats = await getUsageStats(period);
      const connections = await getProviderConnections();
      const nodes = await getProviderNodes();
      const keys = await getApiKeys();

      const activeConns = connections.filter((x) => x.isActive !== 0);
      const providerBreakdown = {};
      for (const conn of connections) {
        const p = conn.provider;
        if (!providerBreakdown[p]) providerBreakdown[p] = 0;
        providerBreakdown[p]++;
      }

      return c.json({
        period,
        stats,
        meta: {
          totalAccounts: connections.length,
          activeAccounts: activeConns.length,
          totalNodes: nodes.length,
          totalApiKeys: keys.length,
          providers: providerBreakdown,
        },
      });
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  // Chart data
  app.get("/api/dashboard/chart", async (c) => {
    try {
      const period = c.req.query("period") || "all";
      const data = await getChartData(period);
      return c.json(data);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  // Recent logs
  app.get("/api/dashboard/logs", async (c) => {
    try {
      const limit = Number(c.req.query("limit")) || 100;
      const logs = await getRecentLogs(limit);
      return c.json(logs);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  // Accounts list
  app.get("/api/dashboard/accounts", async (c) => {
    try {
      const connections = await getProviderConnections();
      const safeConns = connections.map((cn) => {
        let parsedData = {};
        try {
          parsedData = typeof cn.data === "string" ? JSON.parse(cn.data) : cn.data || {};
        } catch {}
        return {
          id: cn.id,
          provider: cn.provider,
          name: cn.name || cn.email || "Unnamed Account",
          email: cn.email || "",
          authType: cn.authType,
          isActive: cn.isActive !== 0,
          priority: cn.priority || 0,
          createdAt: cn.createdAt,
          updatedAt: cn.updatedAt,
          testStatus: parsedData.testStatus || (cn.isActive !== 0 ? "active" : "inactive"),
          hasAccessToken: !!parsedData.accessToken,
          hasApiKey: !!parsedData.apiKey,
        };
      });
      return c.json(safeConns);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  // Toggle account active status
  app.post("/api/dashboard/accounts/toggle", async (c) => {
    try {
      const { id, isActive } = await c.req.json();
      await updateProviderConnection(id, { isActive: isActive ? 1 : 0 });
      return c.json({ success: true, id, isActive });
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  // Models catalog
  app.get("/api/dashboard/models", async (c) => {
    try {
      const rawModels = await buildModelsList(["llm"]);
      const models = Array.isArray(rawModels) ? rawModels : (rawModels?.data || []);
      const aliases = await getModelAliases();
      return c.json({ models, aliases: aliases || {} });
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  // Combos list & management
  app.get("/api/dashboard/combos", async (c) => {
    try {
      const combos = await getCombos();
      return c.json(combos);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.post("/api/dashboard/combos", async (c) => {
    try {
      const { name, models } = await c.req.json();
      if (!name || !models || !models.length) {
        return c.json({ error: "Name and models array are required" }, 400);
      }
      const newCombo = await createCombo({ name, models });
      return c.json({ success: true, combo: newCombo });
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.delete("/api/dashboard/combos/:id", async (c) => {
    try {
      const id = c.req.param("id");
      await deleteCombo(id);
      return c.json({ success: true, id });
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  // Settings (Token Saver, RTK, Headroom, Security)
  app.get("/api/dashboard/settings", async (c) => {
    try {
      const settings = await getSettings();
      return c.json(settings);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.post("/api/dashboard/settings", async (c) => {
    try {
      const body = await c.req.json();
      await updateSettings(body);
      const updated = await getSettings();
      return c.json({ success: true, settings: updated });
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  // API Keys
  app.get("/api/dashboard/keys", async (c) => {
    try {
      const keys = await getApiKeys();
      return c.json(keys);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.post("/api/dashboard/keys", async (c) => {
    try {
      const { name } = await c.req.json();
      const newKey = await createApiKey({ name: name || "API Key" });
      return c.json({ success: true, key: newKey });
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.delete("/api/dashboard/keys/:id", async (c) => {
    try {
      const id = c.req.param("id");
      await deleteApiKey(id);
      return c.json({ success: true, id });
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  // Proxy Pools
  app.get("/api/dashboard/proxy-pools", async (c) => {
    try {
      const pools = await getProxyPools();
      return c.json(pools);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });
}
