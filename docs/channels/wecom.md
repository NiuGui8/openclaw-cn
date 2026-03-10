---
summary: "企业微信机器人配置教程"
read_when:
  - 配置企业微信渠道
title: "企业微信 (WeCom)"
---

# 企业微信 (WeCom) 配置教程

本教程将帮助你完成企业微信机器人的配置，使 OpenClaw 能够通过企业微信发送消息。

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

## 快速开始

<Steps>
  <Step title="创建企业微信机器人">
    1. 登录[企业微信管理后台](https://work.weixin.qq.com/)
    2. 点击「应用管理」
    3. 点击「创建应用」
    4. 填写应用信息：
       - 应用名称：OpenClaw
       - 应用描述：个人 AI 助手
       - 应用 Logo：可以上传一个图标（可选）
    5. 点击「创建」

    <Note>
    需要企业管理员权限才能创建应用。
    </Note>
  </Step>

  <Step title="获取 Webhook 地址">
    1. 在应用详情页面，找到「API 接收消息」
    2. 点击「设置 API 接收」
    3. 选择「企业微信机器人」
    4. 点击「添加机器人」
    5. 为机器人命名（如 OpenClaw）
    6. 获取 Webhook 地址，格式如下：

    ```
    https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    ```

    **保存这个地址**，后续配置需要用到。
  </Step>

  <Step title="配置 OpenClaw">
    打开配置文件（通常在 `~/.openclaw/config.yaml` 或项目根目录），添加以下配置：

    ```yaml
    channels:
      wecom:
        enabled: true
        webhookUrl: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=你的key"
    ```

    - 将 `你的key` 替换为你的 Webhook 地址中的 key
  </Step>

  <Step title="启动 Gateway">
    ```bash
    openclaw gateway
    ```

    Gateway 启动后，企业微信渠道即可使用。
  </Step>

  <Step title="测试发送消息">
    ```bash
    openclaw message send --channel wecom --to "userId" --message "Hello from OpenClaw!"
    ```

    <Note>
    企业微信机器人只能主动发送消息到群聊或个人，无法接收回复。
    </Note>
  </Step>
</Steps>

## 配置说明

### 完整配置项

```yaml
channels:
  wecom:
    enabled: true                    # 是否启用
    webhookUrl: "https://..."       # Webhook 地址（必填）
    accounts:
      default:
        enabled: true
        name: "我的企业微信"
```

### 多账号配置

如果你有多个企业微信机器人：

```yaml
channels:
  wecom:
    accounts:
      work:
        webhookUrl: "https://...key1"
        name: "工作通知"
      notify:
        webhookUrl: "https://...key2"
        name: "通知助手"
```

## 常见问题

<AccordionGroup>
  <Accordion title="消息发送失败怎么办？">
    1. 检查 Webhook 地址是否正确
    2. 检查 key 是否正确
    3. 查看 Gateway 日志获取详细错误信息
    4. 确认应用没有被禁用
  </Accordion>

  <Accordion title="如何获取用户 ID？">
    在企业微信中，可以在通讯录中查看用户的 userID，或者通过发送消息被动接收。
  </Accordion>

  <Accordion title="支持发送哪些消息类型？">
    目前支持：
    - 文本消息
    - Markdown 消息
    - 图文消息（News）
  </Accordion>

  <Accordion title="机器人有哪些限制？">
    - 机器人消息只能发送到群聊或个人
    - 每个机器人每天最多发送消息数量有限制
    - 消息有大小限制
  </Accordion>
</AccordionGroup>

## 相关链接

- [企业微信开发文档](https://developer.work.weixin.qq.com/document/guid)
- [企业微信机器人接入指南](https://developer.work.weixin.qq.com/document/17294)
