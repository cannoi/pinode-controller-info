/**
 * Pi Node Telegram Controller PRO — SoloHost Edition v1.2
 * Lightweight dynamic web shell for SoloHost / Pi Network
 * - No Docker socket, no host shell, no external APIs
 * - Port 8080 (0.0.0.0)
 * - Endpoints: /, /health, /status, /api/status
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const START_TIME = Date.now();
const VERSION = '1.2.0';
const APP_NAME = 'Pi Node Telegram Controller PRO — SoloHost Info';

const PUBLIC_DIR = path.join(__dirname, 'public');

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

function getStatus() {
  const mem = process.memoryUsage();
  return {
    ok: true,
    app: APP_NAME,
    version: VERSION,
    timestamp: new Date().toISOString(),
    uptime: formatUptime(Date.now() - START_TIME),
    uptimeMs: Date.now() - START_TIME,
    platform: process.platform,
    arch: process.arch,
    node: process.version,
    hostname: os.hostname(),
    memory: {
      rssMB: Math.round(mem.rss / 1024 / 1024),
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024)
    },
    windows: {
      status: 'ready',
      github: 'https://github.com/cannoi/pinode-telegram-controller',
      download: 'https://github.com/cannoi/pinode-telegram-controller/archive/refs/heads/main.zip'
    },
    solohost: {
      status: 'info-shell',
      note: 'Phiên bản SoloHost đang được tối ưu. Hiện dùng shell thông tin này.'
    }
  };
}

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(text)
  });
  res.end(text);
}

function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(html)
  });
  res.end(html);
}

function serveStatic(req, res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendText(res, 404, 'Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };
    res.writeHead(200, {
      'Content-Type': types[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-store' : 'public, max-age=3600'
    });
    res.end(data);
  });
}

function buildStatusPage(status) {
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Status — Pi Node SoloHost</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:system-ui,Arial,sans-serif;background:#0f1115;color:#e8e8e8;padding:24px}
.card{max-width:640px;margin:0 auto;background:#1a1d24;border:1px solid #333;border-radius:16px;padding:24px}
h1{margin:0 0 8px;font-size:22px}pre{background:#111;padding:14px;border-radius:10px;overflow:auto;font-size:13px}
a{color:#a78bfa}
.ok{color:#34d399;font-weight:700}
</style>
</head>
<body>
<div class="card">
  <h1><span class="ok">●</span> SoloHost Status</h1>
  <p>Version ${status.version} · Uptime ${status.uptime}</p>
  <pre>${JSON.stringify(status, null, 2)}</pre>
  <p><a href="/">← Về trang chính</a> · <a href="/api/status">/api/status</a> · <a href="/health">/health</a></p>
</div>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // Health — plain text (SoloHost / orchestrator friendly)
  if (pathname === '/health') {
    return sendText(res, 200, 'OK\n');
  }

  // JSON status API
  if (pathname === '/api/status') {
    return sendJson(res, 200, getStatus());
  }

  // Human-readable status page
  if (pathname === '/status') {
    return sendHtml(res, 200, buildStatusPage(getStatus()));
  }

  // Root & static files
  if (pathname === '/' || pathname === '/index.html') {
    return serveStatic(req, res, path.join(PUBLIC_DIR, 'index.html'));
  }

  // Favicon silence
  if (pathname === '/favicon.ico') {
    res.writeHead(204);
    return res.end();
  }

  // Other static assets from /public
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);
  if (filePath.startsWith(PUBLIC_DIR) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveStatic(req, res, filePath);
  }

  sendText(res, 404, 'Not Found\n');
});

server.listen(PORT, HOST, () => {
  console.log(`[pinode-controller-info] ${VERSION} listening on http://${HOST}:${PORT}`);
  console.log(`  /          → UI`);
  console.log(`  /health    → OK`);
  console.log(`  /status    → diagnostic page`);
  console.log(`  /api/status→ JSON`);
});
