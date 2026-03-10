---
summary: "阿里云短信配置教程"
read_when:
  - 配置短信渠道
title: "短信 (SMS)"
---

# 短信 (SMS) 配置教程

本教程将帮助你完成阿里云短信服务的配置，使 OpenClaw 能够发送短信通知。

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
  <Step title="注册阿里云账号">
    1. 访问[阿里云官网](https://www.aliyun.com/)
    2. 注册一个阿里云账号
    3. 完成实名认证（必需）
  </Step>

  <Step title="开通短信服务">
    1. 登录阿里云控制台
    2. 在产品分类中找到「短信服务」
    3. 点击「开通服务」（免费开通，但使用需要付费）
    4. 仔细阅读并同意服务条款
  </Step>

  <Step title="创建 AccessKey">
    1. 在阿里云控制台右上角，点击头像
    2. 选择「AccessKey 管理」
    3. 选择「使用子用户 AccessKey」（推荐，更安全）
    4. 点击「创建用户」，填写信息：
       - 登录名称：openclaw-sms
       - 勾选「OpenAPI调用访问」
    5. 创建后，**务必保存** AccessKeyId 和 AccessKeySecret

    <Warning>
    AccessKeySecret 只显示一次，请立即保存！如果忘记，只能重新创建。
    </Warning>
  </Step>

  <Step title="配置短信签名">
    1. 在短信服务控制台，点击左侧「签名管理」
    2. 点击「添加签名」
    3. 填写签名信息：
       - 签名名称：OpenClaw 通知
       - 签名来源：自用（验证码/通知）
       - 适用场景：验证码、通知短信
    4. 提交审核（通常 1-2 小时）
  </Step>

  <Step title="配置短信模板">
    1. 在短信服务控制台，点击左侧「模板管理」
    2. 点击「添加模板」
    3. 填写模板信息：
       - 模板名称：OpenClaw 通知
       - 模板类型：通知
       - 模板内容：`${message}`

       <Note>
       模板内容中 `${message}` 是变量占位符，实际发送时会被替换。
       </Note>

    4. 提交审核（通常 1-2 小时）
  </Step>

  <Step title="授权子用户">
    1. 在 AccessKey 管理中，找到创建的子用户
    2. 点击「添加权限」
    3. 搜索并添加「AliyunDysmsFullAccess」（短信完全访问权限）
  </Step>

  <Step title="配置 OpenClaw">
    打开配置文件（通常在 `~/.openclaw/config.yaml` 或项目根目录），添加以下配置：

    ```yaml
    channels:
      sms:
        enabled: true
        provider: "aliyun"                    # 短信服务商
        accessKeyId: "your_access_key_id"    # 你的 AccessKeyId
        accessKeySecret: "your_secret"       # 你的 AccessKeySecret
        signName: "你的短信签名"              # 审核通过的签名
        templateCode: "SMS_123456789"       # 审核通过的模板ID
        regionId: "cn-hangzhou"              # 地域（默认杭州）
    ```

    - `accessKeyId` 和 `accessKeySecret`：步骤 3 保存的信息
    - `signName`：步骤 4 审核通过的签名
    - `templateCode`：步骤 5 审核通过的模板 ID
  </Step>

  <Step title="启动 Gateway">
    ```bash
    openclaw gateway
    ```

    Gateway 启动后，短信渠道即可使用。
  </Step>

  <Step title="测试发送短信">
    ```bash
    # 发送短信
    openclaw message send --channel sms --to "+8613812345678" --message "你的验证码是 123456"
    ```

    <Note>
    手机号需要加国家码，中国大陆手机号格式：`+86138xxxxxxxx`
    </Note>
  </Step>
</Steps>

## 配置说明

### 完整配置项

```yaml
channels:
  sms:
    enabled: true                        # 是否启用
    provider: "aliyun"                   # 短信服务商（当前只支持 aliyun）
    accessKeyId: "your_access_key_id"  # AccessKey ID
    accessKeySecret: "your_secret"      # AccessKey Secret
    signName: "你的签名"                 # 短信签名
    templateCode: "SMS_xxxxx"           # 短信模板 ID
    regionId: "cn-hangzhou"            # 地域（可选）
    accounts:
      default:
        enabled: true
        name: "我的短信"
```

### 多账号配置

如果你有多个阿里云账号或短信服务：

```yaml
channels:
  sms:
    accounts:
      main:
        provider: "aliyun"
        accessKeyId: "id1"
        accessKeySecret: "secret1"
        signName: "签名1"
        templateCode: "SMS_xxx1"
      backup:
        provider: "aliyun"
        accessKeyId: "id2"
        accessKeySecret: "secret2"
        signName: "签名2"
        templateCode: "SMS_xxx2"
```

## 常见问题

<AccordionGroup>
  <Accordion title="短信发送失败怎么办？">
    1. 检查 AccessKeyId 和 AccessKeySecret 是否正确
    2. 检查签名和模板是否审核通过
    3. 检查账户余额是否充足
    4. 查看 Gateway 日志获取详细错误信息
    5. 确认手机号格式正确（需要 +86 前缀）
  </Accordion>

  <Accordion title="签名或模板审核需要多长时间？">
    通常 1-2 个工作日内完成审核。
  </Accordion>

  <Accordion title="短信如何收费？**
    阿里云短信按条计费，具体费用请参考[阿里云短信定价](https://www.aliyun.com/price/product?spm=5176.211517.0.0.7e8c4d45abcd)。
  </Accordion>

  <Accordion title="支持哪些手机号格式？">
    支持中国大陆手机号（+86开头）和部分国际手机号。
  </Accordion>

  <Accordion title="短信内容有什么限制？**
    - 短信内容必须包含在已审核的模板中
    - 变量内容不能包含敏感词
    - 单条短信有长度限制（通常 70 个字符）
  </Accordion>
</AccordionGroup>

## 相关链接

- [阿里云短信服务](https://www.aliyun.com/product/sms)
- [阿里云短信控制台](https://dysms.console.aliyun.com/)
- [短信定价说明](https://www.aliyun.com/price/product?spm=5176.211517.0.0.7e8c4d45abcd)
