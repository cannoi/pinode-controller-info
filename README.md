# Pi Node Telegram Controller PRO — SoloHost Info

**Version 1.2.0** · Dynamic lightweight web shell for SoloHost / Pi Network

## 🪟 Windows — Đã sẵn sàng

Phiên bản Windows đã hoàn thiện.

- GitHub: https://github.com/cannoi/pinode-telegram-controller
- Tải ZIP: https://github.com/cannoi/pinode-telegram-controller/archive/refs/heads/main.zip

## 🐳 SoloHost — Shell thông tin động

App này là **shell thông tin động** (Node.js thuần, không dependency ngoài) chạy trên SoloHost:

| Endpoint     | Mục đích                          |
|--------------|-----------------------------------|
| `/`          | Trang UI chính (tiếng Việt)       |
| `/health`    | Health check plain-text → `OK`    |
| `/status`    | Trang diagnostic HTML             |
| `/api/status`| JSON status (uptime, memory, …)   |

- Lắng nghe `0.0.0.0:8080`
- Không dùng Docker socket, không chạy lệnh host, không gọi API ngoài
- Phù hợp SoloHost (nhẹ, healthcheck rõ ràng)

### Docker image

```bash
docker pull ghcr.io/cannoi/pinode-controller-info:latest
```

Hoặc build local:

```bash
docker build -t pinode-controller-info:1.2.0 .
docker run --rm -p 8081:8080 --name pinode-info pinode-controller-info:1.2.0
```

Sau đó mở:

- http://localhost:8081/
- http://localhost:8081/health
- http://localhost:8081/status
- http://localhost:8081/api/status

### Chạy không Docker

```bash
node server.js
# → http://0.0.0.0:8080
```

## Important for SoloHost

- Container **phải** listen `0.0.0.0:8080` (không dùng `127.0.0.1`).
- Mapping `8081:8080` trong `docker-compose.yml` chỉ để test local.
- SoloHost sẽ tự publish port theo platform.

## Changelog

### v1.2.0
- Chuyển từ nginx static → Node.js dynamic shell
- Thêm `/api/status` (JSON realtime: uptime, memory, version)
- Thêm `/status` (trang diagnostic)
- UI cập nhật live stats mỗi 15s
- Dockerfile + HEALTHCHECK sẵn sàng SoloHost
- Zero npm dependencies (chỉ Node stdlib)

### v1.1.0
- Static nginx edition (legacy)
