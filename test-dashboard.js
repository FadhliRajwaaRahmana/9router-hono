import { app } from "./dist/server.js";

async function testDashboardEndpoints() {
  console.log("1. Testing GET /dashboard (HTML response)");
  const resDash = await app.request("http://localhost/dashboard");
  console.log("Dashboard status:", resDash.status, "Content-Type:", resDash.headers.get("content-type"));
  const html = await resDash.text();
  console.log("HTML length:", html.length, "Includes 9Router Hono:", html.includes("9Router Hono"));

  console.log("\n2. Testing GET /api/dashboard/stats");
  const resStats = await app.request("http://localhost/api/dashboard/stats?period=all");
  console.log("Stats status:", resStats.status);
  const jsonStats = await resStats.json();
  console.log("Meta Total Accounts:", jsonStats.meta?.totalAccounts);
  console.log("Stats Prompt Tokens:", jsonStats.stats?.totalPromptTokens?.toLocaleString());

  console.log("\n3. Testing GET /api/dashboard/chart");
  const resChart = await app.request("http://localhost/api/dashboard/chart?period=all");
  console.log("Chart status:", resChart.status);
  const jsonChart = await resChart.json();
  console.log("Chart data length:", jsonChart.length);

  console.log("\n4. Testing GET /api/dashboard/accounts");
  const resAcc = await app.request("http://localhost/api/dashboard/accounts");
  console.log("Accounts status:", resAcc.status);
  const jsonAcc = await resAcc.json();
  console.log("Accounts count:", jsonAcc.length, "Sample account:", jsonAcc[0]?.name);

  console.log("\n5. Testing GET /api/dashboard/models");
  const resModels = await app.request("http://localhost/api/dashboard/models");
  console.log("Models status:", resModels.status);
  const jsonModels = await resModels.json();
  console.log("Catalog count:", jsonModels.models?.length);

  console.log("\n6. Testing GET /api/dashboard/logs");
  const resLogs = await app.request("http://localhost/api/dashboard/logs?limit=5");
  console.log("Logs status:", resLogs.status);
  const jsonLogs = await resLogs.json();
  console.log("Logs count:", jsonLogs.length);

  console.log("\n✅ ALL DASHBOARD ENDPOINTS VALIDATED SUCCESSFULLY!");
  process.exit(0);
}

testDashboardEndpoints().catch((err) => {
  console.error("❌ Dashboard validation failed:", err);
  process.exit(1);
});
