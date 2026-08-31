<div align="center">
  <h2>SimpleWebShell Desktop</h2>
  <h3>基于 Tauri + Vue 3 的 SimpleWebShell 远程设备管理客户端</h3>
</div>

### 一、项目简介

`SimpleWebShell-Desktop` 是 SimpleWebShell 的桌面客户端，使用 Tauri 2 + Vue 3 + TypeScript 实现。它将多个远程 SimpleWebShell 服务集中到设备列表中，提供设备连接、在线状态、命令执行和 Session 管理。

仅用于你拥有或明确获授权管理的设备。客户端当前通过 SimpleWebShell HTTP API 通信，不会启动或托管远端 shell 服务。

### 二、已实现功能

- 远程设备配置：名称、HTTP 地址、访问密钥
- 本地设备列表和当前设备切换
- 连接状态与当前目录显示
- GET / POST 命令执行
- Session 列表、新建、切换、详情、删除
- 文件上传和下载
- 15 秒请求超时和错误提示
- 超长/异常响应由服务端 API 负责拒绝
- 暗色桌面运维界面，适合 Tauri 窗口使用

> 设备配置目前保存在浏览器 WebView 的 `localStorage` 中。生产环境应替换为 Tauri 插件提供的系统钥匙串/安全存储，避免访问密钥以明文保存在本地配置中。

### 三、目录结构

```text
SimpleWebShell-Desktop/
├── src/                         # Vue 3 前端
│   ├── App.vue                  # 设备、命令、Session 管理界面
│   ├── main.ts
│   ├── style.css
│   └── lib/api.ts               # SimpleWebShell HTTP API 客户端
├── src-tauri/                   # Tauri 2 Rust 壳
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

### 四、开发环境

需要：

- Node.js 20+
- Rust stable
- Tauri 2 系统依赖（按操作系统安装 WebView/WebKit 开发包）

```bash
cd SimpleWebShell-Desktop
npm install
npm run tauri dev
```

只运行浏览器前端：

```bash
npm run dev
```

构建前端：

```bash
npm run build
```

构建桌面安装包：

```bash
npm run tauri build
```

### 五、SimpleWebShell 服务配置

远端服务示例：

```bash
./SimpleWebShell -key 123456 -port 8878 -shell /bin/bash
```

在客户端添加：

```text
名称：edge-node-01
地址：http://192.168.1.20:8878
访问密钥：123456
```

API 对应关系：

| 客户端功能 | SimpleWebShell API |
|---|---|
| 状态/当前目录 | `/get_current_path` |
| 执行 GET 命令 | `/get?key=...&cmd=...&session=...` |
| 执行 POST 命令 | `/post?key=...&session=...` |
| Session 列表 | `/session_list` |
| 新建 Session | `/session_create` |
| Session 详情 | `/session_get` |
| 删除 Session | `/session_delete` |

### 六、安全说明

- 不要把服务直接暴露到公网；建议使用 HTTPS 反向代理、VPN 或内网访问控制。
- 访问密钥当前保存在 WebView `localStorage`，不要在共享操作系统账户上使用生产密钥。
- `RegAbility`、命令执行和文件操作都具有高权限，仅连接明确授权的设备。
- 后续应增加系统钥匙串存储、证书校验、设备分组权限和审计日志。

### 七、关联项目

- [SimpleWebShell](../SimpleWebShell)
- [FasterEdge](../FasterEdge)
