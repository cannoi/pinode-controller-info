FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="Pi Node Monitor - SoloHost Edition"
LABEL org.opencontainers.image.description="Minimal SoloHost-friendly Pi Node monitoring web shell with explicit diagnostic routes"
LABEL org.opencontainers.image.version="1.1.0"

COPY nginx.conf /etc/nginx/nginx.conf
COPY html/ /usr/share/nginx/html/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3   CMD wget -q -O - http://127.0.0.1:8080/health >/dev/null || exit 1
