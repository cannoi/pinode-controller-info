# Pi Node Monitor — SoloHost Edition V1.1

V1.1 is a diagnostic-focused revision of the lightweight SoloHost web shell.

## What changed from V1.0

- Explicit `GET /` route serving `index.html`
- Explicit `GET /index.html`
- Added `GET /status`
- Added `GET /api/status`
- Added visible root/health/API diagnostics
- Disabled caching for diagnostic responses
- Kept container port at `8080`
- Kept health check at `/health`
- No framework, CDN, database, Docker socket, or host command execution
- Slow 60-second polling only

## Endpoints

| Endpoint | Purpose |
|---|---|
| `/` | Main web UI |
| `/index.html` | Main web UI direct path |
| `/status` | Minimal SoloHost diagnostic page |
| `/health` | Plain-text health check, HTTP 200 |
| `/api/status` | Minimal JSON status |

## Local test

```bash
docker build -t pi-node-solohost:1.1.0 .
docker run --rm -p 8081:8080 --name pi-node-solohost pi-node-solohost:1.1.0
```

Then test:

```text
http://localhost:8081/
http://localhost:8081/status
http://localhost:8081/health
http://localhost:8081/api/status
```

## Important for SoloHost

The image listens on `0.0.0.0:8080`. Do not replace this with `127.0.0.1`.

The `8081:8080` mapping in `docker-compose.yml` is for local Windows testing. A SoloHost deployment should let the host/orchestrator publish its own host port.

V1.1 still does not access the Pi Node Docker socket. Pi Node integration should be added only after the SoloHost web proxy is confirmed to display `/` successfully.

## Debugging the blank page

If SoloHost logs show repeated:

```text
GET /health 200
```

but never show:

```text
GET /
```

then the health checker is reaching the container while the UI/proxy path is not requesting the root page. Test `/status` as the simplest possible HTML route.

If `/status` works but `/` does not, the issue is likely path/proxy handling rather than nginx health.

## Security

No Docker socket is mounted and no host commands are executed. Do not expose administrative Pi Node or Stellar Core HTTP interfaces publicly.
