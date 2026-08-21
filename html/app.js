(() => {
  const $ = (id) => document.getElementById(id);

  async function checkHealth() {
    const started = performance.now();
    try {
      const r = await fetch("/health", { cache: "no-store" });
      const ms = Math.round(performance.now() - started);
      if (!r.ok) throw new Error("HTTP " + r.status);
      $("healthStatus").textContent = "OK";
      $("healthStatus").className = "value good";
      $("healthTime").textContent = `Response ${ms} ms`;
    } catch (e) {
      $("healthStatus").textContent = "ERROR";
      $("healthStatus").className = "value bad";
      $("healthTime").textContent = "Health endpoint unavailable";
    }
  }

  async function loadStatus() {
    try {
      const r = await fetch("/api/status", { cache: "no-store" });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const data = await r.json();

      $("nodeStatus").textContent = String(data.node || "NOT CONNECTED").toUpperCase();
      $("containerName").textContent = "Container: " + (data.container || "not configured");
      $("version").textContent = data.version || "1.1.0";
      $("apiStatus").textContent = "OK";
      $("apiStatus").className = "value good";
    } catch (_) {
      $("nodeStatus").textContent = "WEB ONLY";
      $("containerName").textContent = "API status unavailable";
      $("apiStatus").textContent = "ERROR";
      $("apiStatus").className = "value bad";
    }
  }

  async function probeRoot() {
    try {
      const r = await fetch("/", { cache: "no-store" });
      $("rootStatus").textContent = r.ok ? "OK" : "HTTP " + r.status;
      $("rootStatus").className = r.ok ? "value good" : "value bad";
    } catch (_) {
      $("rootStatus").textContent = "ERROR";
      $("rootStatus").className = "value bad";
    }
  }

  checkHealth();
  loadStatus();
  probeRoot();

  setInterval(checkHealth, 60000);
  setInterval(loadStatus, 60000);
})();
