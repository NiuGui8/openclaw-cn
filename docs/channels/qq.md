---
summary: "QQ 机器人配置教程（通过 go-cqhttp）"
read_when:
  - 配置 QQ 渠道
title: "QQ (go-cqhttp)"
---

# QQ (go-cqhttp) 配置教程

本教程将帮助你完成 QQ 渠道的配置，使 OpenClaw 能够通过 QQ 发送和接收消息。

<CardGroup cols={3}>
  <Card title="Gateway 配置" icon="settings" href="/gateway/configuration">
    完整的渠道配置模式和示例
  </Card>
  <Card title="渠道故障排除" icon="wrench" href="/channels/troubleshooting">
    跨渠道诊断和修复指南
  </Card>
  <Card title="Web UI 管理" icon="layout" href="/web">
    通过网页界面管理渠道
  </Card>
</CardGroup>

## 概述

QQ 渠道通过 [go-cqhttp](https://github.com/Mrs4s/go-cqhttp) 中转实现。go-cqhttp 是一个 CQHTTP 协议的实现，可以让 QQ 机器人通过 HTTP API 与 OpenClaw 通信。

## 快速开始

<Steps>
  <Step title="下载并配置 go-cqhttp">
    1. 从 [go-cqhttp releases](https://github.com/Mrs4s/go-cqhttp/releases) 下载最新版本
    2. 解压到任意目录
    3. 运行 `go-cqhttp.exe`（Windows）或 `./go-cqhttp`（Linux/Mac）
    4. 首次运行会生成配置文件

    <Warning>
    go-cqhttp 需要 QQ 账号登录，请使用小号或专门的机器人账号。
    </Warning>
  </Step>

  <Step title="配置 go-cqhttp HTTP API">
    编辑生成的 `config.yml` 文件，配置 HTTP API：

    ```yaml
    # HTTP API 配置
    http:
      enabled: true
      host: 127.0.0.1
      port: 5700
      # 可选：设置访问令牌
      access-token: "your_access_token"

    # 事件上报配置
    post:
      - url: http://127.0.0.1:5700/
        secret: ""
    ```

    保存配置后，重新运行 go-cqhttp。
  </Step>

  <Step title="配置 OpenClaw">
    打开配置文件（通常在 `~/.openclaw/config.yaml` 或项目根目录），添加以下配置：

    ```yaml
    channels:
      qq:
        enabled: true
        httpApiUrl: "http://127.0.0.1:5700"
        accessToken: "your_access_token"  # 与 go-cqhttp 配置一致
    ```

    - `httpApiUrl`：go-cqhttp 的 HTTP API 地址
    - `accessToken`（可选）：与 go-cqhttp 配置的 access-token 一致
  </Step>

  <Step title="启动服务">
    1. 先启动 go-cqhttp：
       ```bash
       ./go-cqhttp
       ```
       首次运行会提示扫码登录，按照提示操作即可。

    2. 再启动 OpenClaw Gateway：
       ```bash
       openclaw gateway
       ```
  </Step>

  <Step title="测试发送消息">
    ```bash
    # 发送私聊消息
    openclaw message send --channel qq --to "user:123456789" --message "Hello!"

    # 发送群消息
    openclaw message send --channel qq --to "group:123456789" --message "Hello!"

    # 发送讨论组消息
    openclaw message send --channel qq --to "discuss:123456789" --message "Hello!"
    ```
  </Step>
</Steps>

## 配置说明

### 目标格式

QQ 渠道支持三种目标格式：
- `user:123456789` - 私聊用户
- `group:123456789` - 群聊
- `discuss:123456789` - 讨论组

### 完整配置项

```yaml
channels:
  qq:
    enabled: true                      # 是否启用
    httpApiUrl: "http://127.0.0.1:5700"  # go-cqhttp API 地址
    accessToken: "your_token"         # 访问令牌（可选）
    accounts:
      default:
        enabled: true
        name: "我的 QQ"
```

### 多账号配置

如果你有多个 go-cqhttp 实例：

```yaml
channels:
  qq:
    accounts:
      bot1:
        httpApiUrl: "http://127.0.0.1:5700"
        name: "机器人1"
      bot2:
        httpApiUrl: "http://127.0.0.1:5701"
        name: "机器人2"
```

## go-cqhttp 进阶配置

### 使用 WebSocket（推荐）

如果想获得更好的实时性，可以配置 WebSocket：

```yaml
# config.yml
ws:
  enabled: true
  host: 127.0.0.1
  port: 6700
```

### 消息缓存设置

```yaml
message:
  post-format: array  # 推荐使用 array 格式
  ignore-invalid-cqcode: false
  fix-cqcode-at: []
  proxy: ""
  proxy-auth: ""
  # 过滤列表
  filter: []
```

## 常见问题

<AccordionGroup>
  <Accordion title="go-cqhttp 登录失败怎么办？">
    1. 确保 QQ 账号没有异常（可能需要手机验证）
    2. 尝试使用设备锁模式登录
    3. 检查网络连接是否正常
    4. 查看 go-cqhttp 日志获取详细错误信息
  </Accordion>

  <Accordion title="消息发送失败怎么办？">
    1. 检查 go-cqhttp 是否正常运行
    2. 检查 HTTP API 地址是否正确
    3. 检查 accessToken 是否匹配
    4. 确认机器人账号状态正常
  </Accordion>

  <Accordion title="如何获取 QQ 号？">
    - 自己的 QQ 号：在 QQ 设置中查看
    - 群号：在群聊信息中查看
    - 用户号：需要通过其他方式获取
  </Accordion>

  <Accordion title="支持发送哪些消息类型？">
    目前支持：
    - 文本消息
    - 图片消息（通过 CQ 码）
    - 表情、图片、语音等多媒体
  </Accordion>
</AccordionGroup>

## 相关链接

- [go-cqhttp 项目](https://github.com/Mrs4s/go-cqhttp)
- [go-cqhttp 文档](https://docs.go-cqhttp.org/)
- [CQ 码参考](https://docs.go-cqhttp.org/cqcode/)
