<div align="center">
  <h2>SimpleWebShell Desktop</h2>
  <h3>Tauri + Vue 3 desktop client for managing remote SimpleWebShell devices</h3>
</div>

### 1. Introduction

`SimpleWebShell-Desktop` is a desktop client built with Tauri 2, Vue 3 and TypeScript. It manages multiple authorized SimpleWebShell services through a device list and provides connection status, remote command execution and session management.

Use it only with devices you own or are explicitly authorized to operate. The client talks to the SimpleWebShell HTTP API; it does not start or host a remote shell service.

### 2. Features

- Device profiles with name, HTTP URL and access key
- Local device list and device switching
- Connection status and current working directory
- GET / POST command execution
- Session listing, creation, switching, details and deletion
- 15-second request timeout and visible errors
- Dark desktop operations UI optimized for a Tauri window

> Device profiles are currently stored in WebView `localStorage`. A production release should replace this with the operating-system keychain/secure-storage plugin so access keys are not stored as plain local configuration.

### 3. Layout

```text
SimpleWebShell-Desktop/
├── src/                         # Vue 3 frontend
│   ├── App.vue                  # device, command and session UI
│   ├── main.ts
│   ├── style.css
│   └── lib/api.ts               # SimpleWebShell HTTP API client
├── src-tauri/                   # Tauri 2 Rust shell
│   ├── src/main.rs
│   ├── src/lib.rs
│   ├── build.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### 4. Development

Requirements:

- Node.js 20+
- Rust stable
- Tauri 2 system dependencies for your operating system

```bash
cd SimpleWebShell-Desktop
npm install
npm run tauri dev
```

Frontend only:

```bash
npm run dev
```

Build frontend:

```bash
npm run build
```

Build desktop bundles:

```bash
npm run tauri build
```

### 5. SimpleWebShell Service

Example remote service:

```bash
./SimpleWebShell -key 123456 -port 8878 -shell /bin/bash
```

Add this device in the desktop client:

```text
Name: edge-node-01
URL: http://192.168.1.20:8878
Access key: 123456
```

API mapping:

| Client function | SimpleWebShell API |
|---|---|
| Status/current path | `/get_current_path` |
| GET command | `/get?key=...&cmd=...&session=...` |
| POST command | `/post?key=...&session=...` |
| Session list | `/session_list` |
| Create session | `/session_create` |
| Session details | `/session_get` |
| Delete session | `/session_delete` |

### 6. Security

- Do not expose the service directly to the public internet; use HTTPS, a VPN or network access control.
- Access keys are currently stored in WebView `localStorage`; do not use production keys on shared OS accounts.
- Command execution, file operations and register operations are privileged; connect only to authorized devices.
- Future releases should add OS keychain storage, certificate validation, device groups, permissions and audit logs.

### 7. Related Projects

- [SimpleWebShell](../SimpleWebShell)
- [FasterEdge](../FasterEdge)
