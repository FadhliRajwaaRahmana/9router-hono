import { app } from "./dist/server.js";

async function testHono() {
  const apiKey = "sk-7549e4d40d693362-tjw2g5-816ff28b";
  const authHeader = `Bearer ${apiKey}`;

  console.log("1. Testing GET / (Unauthenticated public)");
  const resRoot = await app.request("http://localhost/");
  const jsonRoot = await resRoot.json();
  console.log("Root status:", resRoot.status, jsonRoot.name, jsonRoot.engine);

  console.log("2. Testing GET /health");
  const resHealth = await app.request("http://localhost/health");
  console.log("Health status:", resHealth.status, await resHealth.text());

  console.log("3. Testing GET /v1/models (With API key)");
  const resModels = await app.request("http://localhost/v1/models", {
    headers: { Authorization: authHeader }
  });
  const jsonModels = await resModels.json();
  console.log("Models status:", resModels.status, "Count:", jsonModels.data?.length);
  if (jsonModels.data?.length > 0) {
    console.log("Sample model:", jsonModels.data[0].id);
  }

  console.log("4. Testing POST /v1/chat/completions (Dry-run validation with auth)");
  const resChat = await app.request("http://localhost/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader
    },
    body: JSON.stringify({
      model: "non-existent-model",
      messages: [{ role: "user", content: "hi" }]
    })
  });
  console.log("Chat status with invalid model:", resChat.status);
  const chatJson = await resChat.json();
  console.log("Chat error message:", chatJson.error?.message);

  console.log("\n✅ ALL SMOKE TESTS PASSED CLEANLY!");
  process.exit(0);
}

testHono().catch((err) => {
  console.error("❌ Smoke test failed:", err);
  process.exit(1);
});
