# 🦞 OpenClaw — 个人 AI 助手

> ⚡️ **本仓库新增特性**（相对于原始仓库 [openclaw/openclaw](https://github.com/openclaw/openclaw)）
>
> 本仓库是 OpenClaw 的中文本地化分支，相较于原始仓库新增了以下渠道支持：

| 渠道 | 文档 | 说明 |
|------|------|------|
| 钉钉 | [dingtalk.md](docs/channels/dingtalk.md) | 钉钉机器人 Webhook |
| 企业微信 | [wecom.md](docs/channels/wecom.md) | 企业微信机器人 Webhook |
| QQ | [qq.md](docs/channels/qq.md) | 通过 go-cqhttp 中转 |
| 短信 | [sms.md](docs/channels/sms.md) | 阿里云短信发送 |

<p align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text-dark.png">
        <img src="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text.png" alt="OpenClaw" width="500">
    </picture>
</p>

<p align="center">
  <strong>EXFOLIATE! EXFOLIATE!</strong>
</p>

<p align="center">
  <a href="https://github.com/openclaw/openclaw/actions/workflows/ci.yml?branch=main"><img src="https://img.shields.io/github/actions/workflow/status/openclaw/openclaw/ci.yml?branch=main&style=for-the-badge" alt="CI status"></a>
  <a href="https://github.com/openclaw/openclaw/releases"><img src="https://img.shields.io/github/v/release/openclaw/openclaw?include_prereleases&style=for-the-badge" alt="GitHub release"></a>
  <a href="https://discord.gg/clawd"><img src="https://img.shields.io/discord/1456350064065904867?label=Discord&logo=discord&logoColor=white&color=5865F2&style=for-the-badge" alt="Discord"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License"></a>
</p>

**OpenClaw** 是一个运行在你自己设备上的 _个人 AI 助手_。
它可以在你已使用的通讯渠道上回复你（WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage、BlueBubbles、IRC、Microsoft Teams、Matrix、飞书、LINE、Mattermost、Nextcloud Talk、Nostr、Synology Chat、Tlon、Twitch、Zalo、Zalo Personal、WebChat、钉钉、企业微信、QQ、短信）。它可以在 macOS/iOS/Android 上听说，也可以渲染你控制的实时 Canvas。Gateway 只是控制平面——产品本身就是助手。

如果你想要一个感觉本地、快速、始终在线的个人助手，这就是它。

[网站](https://openclaw.ai) · [文档](https://github.com/NiuGui8/openclaw-cn/blob/main) · [愿景](VISION.md) · [DeepWiki](https://deepwiki.com/openclaw/openclaw) · [入门指南](https://github.com/NiuGui8/openclaw-cn/blob/main/start/getting-started) · [更新](https://github.com/NiuGui8/openclaw-cn/blob/main/install/updating) · [展示](https://github.com/NiuGui8/openclaw-cn/blob/main/start/showcase) · [常见问题](https://github.com/NiuGui8/openclaw-cn/blob/main/help/faq) · [向导](https://github.com/NiuGui8/openclaw-cn/blob/main/start/wizard) · [Nix](https://github.com/openclaw/nix-openclaw) · [Docker](https://github.com/NiuGui8/openclaw-cn/blob/main/install/docker) · [Discord](https://discord.gg/clawd)

推荐方式：在终端运行 onboarding 向导（`openclaw onboard`）。
向导会逐步引导你设置 Gateway、工作区、渠道和技能。CLI 向导是推荐路径，支持 **macOS、Linux 和 Windows（通过 WSL2；强烈推荐）**。
支持 npm、pnpm 或 bun。
新用户？从这里开始：[入门指南](https://github.com/NiuGui8/openclaw-cn/blob/main/start/getting-started)

## 赞助商

| OpenAI                                                            | Vercel                                                            | Blacksmith                                                                   | Convex                                                                |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [![OpenAI](docs/assets/sponsors/openai.svg)](https://openai.com/) | [![Vercel](docs/assets/sponsors/vercel.svg)](https://vercel.com/) | [![Blacksmith](docs/assets/sponsors/blacksmith.svg)](https://blacksmith.sh/) | [![Convex](docs/assets/sponsors/convex.svg)](https://www.convex.dev/) |

**订阅（OAuth）：**

- **[OpenAI](https://openai.com/)** (ChatGPT/Codex)

注意：虽然支持许多提供商/模型，但为获得最佳体验并降低提示注入风险，请使用你能使用的最强大的最新一代模型。参见 [Onboarding](https://github.com/NiuGui8/openclaw-cn/blob/main/start/onboarding)。

## 模型（选择 + 认证）

- 模型配置 + CLI：[Models](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/models)
- 认证配置轮换（OAuth vs API 密钥）+ 回退：[Model failover](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/model-failover)

## 安装（推荐）

运行环境：**Node ≥22**。

```bash
npm install -g openclaw@latest
# 或：pnpm add -g openclaw@latest

openclaw onboard --install-daemon
```

向导会安装 Gateway 守护进程（launchd/systemd 用户服务），使其保持运行。

## 快速开始

运行环境：**Node ≥22**。

完整新手指南（认证、配对、渠道）：[Getting started](https://github.com/NiuGui8/openclaw-cn/blob/main/start/getting-started)

```bash
openclaw onboard --install-daemon

openclaw gateway --port 18789 --verbose

# 发送消息
openclaw message send --to +1234567890 --message "Hello from OpenClaw"

# 与助手对话（可选择发送到任何已连接渠道：WhatsApp/Telegram/Slack/Discord/Google Chat/Signal/iMessage/BlueBubbles/IRC/Microsoft Teams/Matrix/飞书/LINE/Mattermost/Nextcloud Talk/Nostr/Synology Chat/Tlon/Twitch/Zalo/Zalo Personal/WebChat/钉钉/企业微信/QQ/短信）
openclaw agent --message "Ship checklist" --thinking high
```

升级？[更新指南](https://github.com/NiuGui8/openclaw-cn/blob/main/install/updating)（并运行 `openclaw doctor`）。

## 开发渠道

- **stable**：标记发布（`vYYYY.M.D` 或 `vYYYY.M.D-<patch>`），npm dist-tag `latest`。
- **beta**：预发布标签（`vYYYY.M.D-beta.N`），npm dist-tag `beta`（macOS 应用可能缺失）。
- **dev**：主分支的最新提交，npm dist-tag `dev`（发布时）。

切换渠道（git + npm）：`openclaw update --channel stable|beta|dev`
详情：[Development channels](https://github.com/NiuGui8/openclaw-cn/blob/main/install/development-channels)

## 从源码构建（开发）

建议使用 `pnpm` 从源码构建。Bun 可选用于直接运行 TypeScript。

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw

pnpm install
pnpm ui:build # 首次运行自动安装 UI 依赖
pnpm build

pnpm openclaw onboard --install-daemon

# 开发循环（TS 更改时自动重载）
pnpm gateway:watch
```

注意：`pnpm openclaw …` 直接运行 TypeScript（通过 `tsx`）。`pnpm build` 生成 `dist/` 用于通过 Node / 打包的 `openclaw` 二进制文件运行。

## 安全默认设置（DM 访问）

OpenClaw 连接到真实的通讯平台。将入站 DM 视为**不受信任的输入**。

完整安全指南：[Security](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway/security)

Telegram/WhatsApp/Signal/iMessage/Microsoft Teams/Discord/Google Chat/Slack 的默认行为：

- **DM 配对**（`dmPolicy="pairing"` / `channels.discord.dmPolicy="pairing"` / `channels.slack.dmPolicy="pairing"`；旧版：`channels.discord.dm.policy`、`channels.slack.dm.policy`）：未知发送者会收到简短配对码，机器人不会处理他们的消息。
- 批准：`openclaw pairing approve <channel> <code>`（然后发送者被添加到本地白名单存储）。
- 公共入站 DM 需要明确选择加入：设置 `dmPolicy="open"` 并在渠道白名单（`allowFrom` / `channels.discord.allowFrom` / `channels.slack.allowFrom`；旧版：`channels.discord.dm.allowFrom`、`channels.slack.dm.allowFrom`）中包含 `"*"`。

运行 `openclaw doctor` 以发现 risky/misconfigured 的 DM 策略。

## 亮点

- **[本地优先 Gateway](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway)** — 会话、渠道、工具和事件的单一控制平面。
- **[多渠道收件箱](https://github.com/NiuGui8/openclaw-cn/blob/main/channels)** — WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、BlueBubbles (iMessage)、iMessage (旧版)、IRC、Microsoft Teams、Matrix、飞书、LINE、Mattermost、Nextcloud Talk、Nostr、Synology Chat、Tlon、Twitch、Zalo、Zalo Personal、WebChat、钉钉、企业微信、QQ、短信、macOS、iOS/Android。
- **[多代理路由](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway/configuration)** — 将入站渠道/账户/对等点路由到隔离的代理（工作区 + 每代理会话）。
- **[语音唤醒](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes/voicewake) + [对话模式](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes/talk)** — macOS/iOS 上的唤醒词和 Android 上的连续语音（ElevenLabs + 系统 TTS 回退）。
- **[实时 Canvas](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/mac/canvas)** — 代理驱动的可视化工作区，包含 [A2UI](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/mac/canvas#canvas-a2ui)。
- **[一流工具](https://github.com/NiuGui8/openclaw-cn/blob/main/tools)** — 浏览器、canvas、节点、cron、会话和 Discord/Slack 操作。
- **[伴侣应用](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/macos)** — macOS 菜单栏应用 + iOS/Android [节点](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes)。
- **[Onboarding](https://github.com/NiuGui8/openclaw-cn/blob/main/start/wizard) + [技能](https://github.com/NiuGui8/openclaw-cn/blob/main/tools/skills)** — 向导驱动的设置，包含捆绑/管理/工作区技能。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=openclaw/openclaw&type=date&legend=top-left)](https://www.star-history.com/#openclaw/openclaw&type=date&legend=top-left)

## 我们构建的所有内容

### 核心平台

- 带会话、存在、配置、cron、webhook、[Control UI](https://github.com/NiuGui8/openclaw-cn/blob/main/web) 和 [Canvas 主机](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/mac/canvas#canvas-a2ui) 的 [Gateway WS 控制平面](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway)。
- [CLI 界面](https://github.com/NiuGui8/openclaw-cn/blob/main/tools/agent-send)：gateway、agent、send、[wizard](https://github.com/NiuGui8/openclaw-cn/blob/main/start/wizard) 和 [doctor](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway/doctor)。
- [Pi 代理运行时](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/agent) RPC 模式，支持工具流和块流。
- [会话模型](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/session)：`main` 用于直接聊天、群组隔离、激活模式、队列模式、回复。群组规则：[Groups](https://github.com/NiuGui8/openclaw-cn/blob/main/channels/groups)。
- [媒体管道](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes/images)：图片/音频/视频、转录钩子、大小限制、临时文件生命周期。音频详情：[Audio](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes/audio)。

### 渠道

- [渠道](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/index.md)：[WhatsApp](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/whatsapp.md) (Baileys)、[Telegram](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/telegram.md) (grammY)、[Slack](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/slack.md) (Bolt)、[Discord](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/discord.md) (discord.js)、[Google Chat](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/googlechat.md) (Chat API)、[Signal](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/signal.md) (signal-cli)、[BlueBubbles](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/bluebubbles.md) (iMessage，推荐)、[iMessage](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/imessage.md) (旧版 imsg)、[IRC](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/irc.md)、[Microsoft Teams](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/msteams.md)、[Matrix](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/matrix.md)、[飞书](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/feishu.md)、[LINE](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/line.md)、[Mattermost](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/mattermost.md)、[Nextcloud Talk](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/nextcloud-talk.md)、[Nostr](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/nostr.md)、[Synology Chat](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/synology-chat.md)、[Tlon](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/tlon.md)、[Twitch](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/twitch.md)、[Zalo](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/zalo.md)、[Zalo Personal](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/zalouser.md)、[WebChat](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/web/webchat.md)、[钉钉](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/dingtalk.md)、[企业微信](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/wecom.md)、[QQ](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/qq.md)、[短信](https://github.com/NiuGui8/openclaw-cn/blob/main/docs/channels/sms.md)。
- [群组路由](https://github.com/NiuGui8/openclaw-cn/blob/main/channels/group-messages)：提及门控、回复标签、每渠道分块和路由。渠道规则：[Channels](https://github.com/NiuGui8/openclaw-cn/blob/main/channels)。

### 应用 + 节点

- [macOS 应用](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/macos)：菜单栏控制平面、[语音唤醒](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes/voicewake)/PTT、[对话模式](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes/talk) 覆盖层、[WebChat](https://github.com/NiuGui8/openclaw-cn/blob/main/web/webchat)、调试工具、[远程 Gateway](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway/remote) 控制。
- [iOS 节点](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/ios)：[Canvas](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/mac/canvas)、[语音唤醒](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes/voicewake)、[对话模式](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes/talk)、相机、屏幕录制、Bonjour + 设备配对。
- [Android 节点](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/android)：连接标签（设置码/手动）、聊天会话、语音标签、[Canvas](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/mac/canvas)、相机/屏幕录制，以及 Android 设备命令（通知/位置/短信/照片/联系人/日历/运动/应用更新）。
- [macOS 节点模式](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes)：system.run/notify + canvas/camera 暴露。

### 工具 + 自动化

- [浏览器控制](https://github.com/NiuGui8/openclaw-cn/blob/main/tools/browser)：专用 openclaw Chrome/Chromium、快照、操作、上传、配置文件。
- [Canvas](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/mac/canvas)：[A2UI](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/mac/canvas#canvas-a2ui) 推送/重置、eval、快照。
- [节点](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes)：相机快照/剪辑、屏幕录制、[位置获取](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes/location-command)、通知。
- [Cron + 唤醒](https://github.com/NiuGui8/openclaw-cn/blob/main/automation/cron-jobs)；[webhooks](https://github.com/NiuGui8/openclaw-cn/blob/main/automation/webhook)；[Gmail Pub/Sub](https://github.com/NiuGui8/openclaw-cn/blob/main/automation/gmail-pubsub)。
- [技能平台](https://github.com/NiuGui8/openclaw-cn/blob/main/tools/skills)：捆绑、管理和工作区技能，具有安装门控和 UI。

### 运行时 + 安全

- [渠道路由](https://github.com/NiuGui8/openclaw-cn/blob/main/channels/channel-routing)、[重试策略](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/retry) 和 [流式/分块](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/streaming)。
- [存在](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/presence)、[输入提示](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/typing-indicators) 和 [使用跟踪](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/usage-tracking)。
- [模型](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/models)、[模型故障转移](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/model-failover) 和 [会话修剪](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/session-pruning)。
- [安全](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway/security) 和 [故障排除](https://github.com/NiuGui8/openclaw-cn/blob/main/channels/troubleshooting)。

### 运维 + 打包

- [Control UI](https://github.com/NiuGui8/openclaw-cn/blob/main/web) + [WebChat](https://github.com/NiuGui8/openclaw-cn/blob/main/web/webchat) 直接从 Gateway 提供服务。
- [Tailscale Serve/Funnel](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway/tailscale) 或 [SSH 隧道](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway/remote)，支持令牌/密码认证。
- [Nix 模式](https://github.com/NiuGui8/openclaw-cn/blob/main/install/nix) 用于声明式配置；[Docker](https://github.com/NiuGui8/openclaw-cn/blob/main/install/docker) 安装。
- [Doctor](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway/doctor) 迁移、[日志](https://github.com/NiuGui8/openclaw-cn/blob/main/logging)。

## 工作原理（简要）

```
WhatsApp / Telegram / Slack / Discord / Google Chat / Signal / iMessage / BlueBubbles / IRC / Microsoft Teams / Matrix / 飞书 / LINE / Mattermost / Nextcloud Talk / Nostr / Synology Chat / Tlon / Twitch / Zalo / Zalo Personal / WebChat / 钉钉 / 企业微信 / QQ / 短信
               │
               ▼
┌───────────────────────────────┐
│            Gateway           │
│       (control plane)       │
│     ws://127.0.0.1:18789   │
└──────────────┬────────────────┘
               │
               ├─ Pi agent (RPC)
               ├─ CLI (openclaw …)
               ├─ WebChat UI
               ├─ macOS app
               └─ iOS / Android 节点
```

## 关键子系统

- **[Gateway WebSocket 网络](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/architecture)** — 客户端、工具和事件的单一 WS 控制平面（加运维：[Gateway runbook](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway)）。
- **[Tailscale 暴露](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway/tailscale)** — Serve/Funnel 用于 Gateway 仪表板 + WS（远程访问：[Remote](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway/remote)）。
- **[浏览器控制](https://github.com/NiuGui8/openclaw-cn/blob/main/tools/browser)** — openclaw 管理的 Chrome/Chromium，带 CDP 控制。
- **[Canvas + A2UI](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/mac/canvas)** — 代理驱动的可视化工作区（A2UI 主机：[Canvas/A2UI](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/mac/canvas#canvas-a2ui)）。
- **[语音唤醒](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes/voicewake) + [对话模式](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes/talk)** — macOS/iOS 上的唤醒词加 Android 上的连续语音。
- **[节点](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes)** — Canvas、相机快照/剪辑、屏幕录制、`location.get`、通知，加上 macOS 专属的 `system.run`/`system.notify`。

## Tailscale 访问（Gateway 仪表板）

OpenClaw 可以在 Gateway 保持绑定到 loopback 的同时自动配置 Tailscale **Serve**（仅 tailnet）或 **Funnel**（公共）。配置 `gateway.tailscale.mode`：

- `off`：无 Tailscale 自动化（默认）。
- `serve`：通过 `tailscale serve` 的仅 tailnet HTTPS（默认使用 Tailscale 身份标头）。
- `funnel`：通过 `tailscale funnel` 的公共 HTTPS（需要共享密码认证）。

注意：

- 启用 Serve/Funnel 时 `gateway.bind` 必须保持为 `loopback`（OpenClaw 强制执行）。
- 可通过设置 `gateway.auth.mode: "password"` 或 `gateway.auth.allowTailscale: false` 强制要求密码。
- 除非设置 `gateway.auth.mode: "password"`，否则 Funnel 拒绝启动。
- 可选：`gateway.tailscale.resetOnExit` 在关闭时撤销 Serve/Funnel。

详情：[Tailscale 指南](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway/tailscale) · [Web 界面](https://github.com/NiuGui8/openclaw-cn/blob/main/web)

## 远程 Gateway（Linux 很棒）

在小型 Linux 实例上运行 Gateway 完全可以。客户端（macOS 应用、CLI、WebChat）可以通过 **Tailscale Serve/Funnel** 或 **SSH 隧道** 连接，你仍然可以配对设备节点（macOS/iOS/Android）以在需要时执行设备本地操作。

- **Gateway 主机** 默认运行 exec 工具和渠道连接。
- **设备节点** 通过 `node.invoke` 运行设备本地操作（`system.run`、相机、屏幕录制、通知）。
简而言之：exec 在 Gateway 所在位置运行；设备操作在设备所在位置运行。

详情：[远程访问](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway/remote) · [节点](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes) · [安全](https://github.com/NiuGui8/openclaw-cn/blob/main/gateway/security)

## 通过 Gateway 协议的 macOS 权限

macOS 应用可以运行在**节点模式**，并通过 Gateway WebSocket 宣传其功能和权限映射（`node.list` / `node.describe`）。然后客户端可以通过 `node.invoke` 执行本地操作：

- `system.run` 运行本地命令并返回 stdout/stderr/退出码；设置 `needsScreenRecording: true` 以要求屏幕录制权限（否则会得到 `PERMISSION_MISSING`）。
- `system.notify` 发布用户通知，如果通知被拒绝则失败。
- `canvas.*`、`camera.*`、`screen.record` 和 `location.get` 也通过 `node.invoke` 路由，并遵循 TCC 权限状态。

提升的 bash（主机权限）独立于 macOS TCC：

- 使用 `/elevated on|off` 在启用 + 允许列表时切换每会话提升访问。
- Gateway 通过 `sessions.patch`（WS 方法）以及 `thinkingLevel`、`verboseLevel`、`model`、`sendPolicy` 和 `groupActivation` 保持每会话切换。

详情：[节点](https://github.com/NiuGui8/openclaw-cn/blob/main/nodes) · [macOS 应用](https://github.com/NiuGui8/openclaw-cn/blob/main/platforms/macos) · [Gateway 协议](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/architecture)

## 代理到代理（sessions\_\* 工具）

- 使用这些来协调跨会话的工作，而无需在聊天界面之间跳转。
- `sessions_list` — 发现活动会话（代理）及其元数据。
- `sessions_history` — 获取会话的转录日志。
- `sessions_send` — 向另一个会话发送消息；可选的回复来回 ping-pong + 宣布步骤（`REPLY_SKIP`、`ANNOUNCE_SKIP`）。

详情：[会话工具](https://github.com/NiuGui8/openclaw-cn/blob/main/concepts/session-tool)

## 技能注册表（ClawHub）

ClawHub 是一个极简的技能注册表。启用 ClawHub 后，代理可以自动搜索技能并在需要时拉取新的。

[ClawHub](https://clawhub.com)

## 聊天命令

在 WhatsApp/Telegram/Slack/Google Chat/Microsoft Teams/WebChat 发送以下命令（群组命令仅所有者可用）：

- `/status` — 紧凑会话状态（模型 + token，成本如有）
- `/new` 或 `/reset` — 重置会话
- `/compact` — 压缩会话上下文（摘要）
- `/think <level>` — off|minimal|low|medium|high|xhigh（仅 GPT-5.2 + Codex 模型）
- `/verbose on|off`
- `/usage off|tokens|full` — 每响应使用量页脚
- `/restart` — 重启 Gateway（群组中仅所有者）
- `/activation mention|always` — 群组激活切换（仅群组）

## 应用（可选）

Gateway 本身就能提供出色体验。所有应用都是可选的，会添加额外功能。

如果你计划构建/运行伴侣应用，请遵循以下平台手册。

### macOS（OpenClaw.app）（可选）

- Gateway 的菜单栏控制和健康状态。
- 语音唤醒 + 按键通话覆盖层。
- WebChat + 调试工具。
- SSH 远程 Gateway 控制。

注意：签名构建是 macOS 权限在重建之间保持的必要条件（参见 `docs/mac/permissions.md`）。

### iOS 节点（可选）

