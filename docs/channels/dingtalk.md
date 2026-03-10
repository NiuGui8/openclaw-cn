---
summary: "钉钉机器人配置教程"
read_when:
  - 配置钉钉渠道
title: "钉钉 (DingTalk)"
---

# 钉钉 (DingTalk) 配置教程

本教程将帮助你完成钉钉机器人的配置，使 OpenClaw 能够通过钉钉发送消息。

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
  <Step title="创建钉钉机器人">
    1. 打开[钉钉开放平台](https://open.dingtalk.com/)
    2. 使用钉钉账号登录
    3. 在左侧菜单点击「机器人」
    4. 点击「创建机器人」
    5. 填写机器人信息：
       - 机器人名称：OpenClaw
       - 描述：个人 AI 助手
    6. 选择「自定义机器人」
    7. 点击「创建」
  </Step>

  <Step title="获取 Webhook 地址">
    创建机器人后，你将获得一个 Webhook 地址，格式如下：

    ```
    https://oapi.dingtalk.com/robot/send?access_token=xxxxxxxx
    ```

    **保存这个地址**，后续配置需要用到。

    <Warning>
    Webhook 地址请妥善保管，不要泄露给他人。
    </Warning>
  </Step>

  <Step title="开启加签（可选但推荐）">
    1. 在机器人详情页面，找到「安全设置」
    2. 选择「加签」方式
    3. 点击「查看密钥」，会显示一个以 `SEC` 开头的密钥
    4. **保存这个密钥**，后续配置需要用到
  </Step>

  <Step title="配置 OpenClaw">
    打开配置文件（通常在 `~/.openclaw/config.yaml` 或项目根目录），添加以下配置：

    ```yaml
    channels:
      dingtalk:
        enabled: true
        webhookUrl: "https://oapi.dingtalk.com/robot/send?access_token=你的access_token"
        secret: "SECxxxxxxxx"
    ```

    - 将 `你的access_token` 替换为你的 Webhook 地址中的 token
    - 如果开启了加签，将 `SECxxxxxxxx` 替换为你的密钥
  </Step>

  <Step title="启动 Gateway">
    ```bash
    openclaw gateway
    ```

    Gateway 启动后，钉钉渠道即可使用。
  </Step>

  <Step title="测试发送消息">
    ```bash
    openclaw message send --channel dingtalk --to "userId" --message "Hello from OpenClaw!"
    ```

    <Note>
    钉钉机器人只能主动发送消息，无法接收回复。如果需要双向交互，建议使用其他渠道。
    </Note>
  </Step>
</Steps>

## 配置说明

### 完整配置项

```yaml
channels:
  dingtalk:
    enabled: true                    # 是否启用
    webhookUrl: "https://..."        # Webhook 地址（必填）
    secret: "SEC..."                 # 加签密钥（可选）
    accounts:
      default:
        enabled: true
        name: "我的钉钉"
```

### 多账号配置

如果你有多个钉钉机器人：

```yaml
channels:
  dingtalk:
    accounts:
      work:
        webhookUrl: "https://...token1"
        name: "工作助手"
      personal:
        webhookUrl: "https://...token2"
        name: "个人助手"
```

## 常见问题

<AccordionGroup>
  <Accordion title="消息发送失败怎么办？">
    1. 检查 Webhook 地址是否正确
    2. 检查 access_token 是否过期
    3. 查看 Gateway 日志获取详细错误信息
    4. 确认机器人没有被禁用
  </Accordion>

  <Accordion title="如何获取用户 ID？">
    在钉钉群聊中，可以@机器人来获取用户 ID，或者在消息被动接收时获取。
  </Accordion>

  <Accordion title="支持发送哪些消息类型？">
    目前支持：
    - 文本消息
    - Markdown 消息
    - 卡片消息（Interactive Card）
  </Accordion>
</AccordionGroup>

## 相关链接

- [钉钉开放平台文档](https://open.dingtalk.com/document/robot)
- [钉钉机器人开发指南](https://open.dingtalk.com/document/robot/create-robot)
