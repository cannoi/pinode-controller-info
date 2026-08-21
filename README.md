# Pi Node Monitor — SoloHost Edition v1.0.0

Minimal, self-contained web app designed for a stable first-stage Pi Network SoloHost deployment.

- nginx Alpine only
- listens on `0.0.0.0:8080` inside the container
- `/health` returns HTTP 200
- `/api/status` returns JSON
- no Node.js, Python, database, framework, CDN, Docker socket, or host commands
- UI stays available even when Pi Node integration is not connected

## Local test

```bash
docker build -t pi-node-solohost:1.0.0 .
docker run --rm -p 8081:8080 --name pi-node-solohost pi-node-solohost:1.0.0
```

Open `http://localhost:8081` and verify `/health`.

## SoloHost

The image exposes container port `8080` and does not hard-code a host port in the image. The deployment layer can publish the port. The included compose file uses `8081:8080` only for local testing.

This V1 deliberately does not access the Docker socket or control the Pi Node container. A later monitor module can provide real Pi Node data independently.
