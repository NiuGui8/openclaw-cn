import type { ChannelOutboundAdapter } from "openclaw/plugin-sdk/sms";
import type { ResolvedSMSAccount } from "./types.js";
import { sendSMSAliyun } from "./providers/aliyun.js";

export async function sendSMS(
  account: ResolvedSMSAccount,
  phoneNumber: string,
  message: string,
): Promise<{ bizId?: string; messageId: string }> {
  // For now, only support Aliyun
  // Can extend to support Tencent, Huawei in the future
  if (account.provider !== "aliyun") {
    throw new Error(`SMS provider ${account.provider} not implemented yet`);
  }

  const result = await sendSMSAliyun({
    account,
    phoneNumber,
    templateParam: { message },
  });

  if (result.code !== "OK") {
    throw new Error(`SMS sending failed: ${result.message}`);
  }

  return {
    bizId: result.bizId,
    messageId: result.bizId ?? `sms_${Date.now()}`,
  };
}

export const smsOutbound: ChannelOutboundAdapter = {
  deliveryMode: "direct",
  chunker: (text, limit) => {
    // SMS has a character limit, typically 70 for single SMS
    // Split by sentences if possible
    const chunks: string[] = [];
    const maxChars = Math.min(limit, 70);

    let current = "";
    for (const char of text) {
      if (current.length >= maxChars) {
        chunks.push(current);
        current = "";
      }
      current += char;
    }
    if (current) chunks.push(current);

    return chunks;
  },
  chunkerMode: "text",
  textChunkLimit: 70,
  sendText: async ({ cfg, to, text, accountId }) => {
    const account = resolveSMSAccount(cfg, accountId ?? undefined);

    // Phone number should be in format: +86138xxxxxxxx
    const phoneNumber = to?.replace(/[^0-9+]/g, "");
    if (!phoneNumber) {
      throw new Error("Invalid phone number");
    }

    const result = await sendSMS(account, phoneNumber, text ?? "");
    return { channel: "sms", messageId: result.messageId };
  },
  sendMedia: async ({ cfg, to, text, mediaUrl, accountId }) => {
    // SMS doesn't support media, send as text with URL
    const account = resolveSMSAccount(cfg, accountId ?? undefined);
    const phoneNumber = to?.replace(/[^0-9+]/g, "");

    if (!phoneNumber) {
      throw new Error("Invalid phone number");
    }

    const content = text ? `${text}\n${mediaUrl}` : (mediaUrl ?? "");
    const result = await sendSMS(account, phoneNumber, content);
    return { channel: "sms", messageId: result.messageId };
  },
};

function resolveSMSAccount(
  cfg: unknown,
  accountId?: string,
): ResolvedSMSAccount {
  const config = cfg as { channels?: { sms?: { provider?: string; accessKeyId?: string; accessKeySecret?: string; signName?: string; templateCode?: string; regionId?: string; accounts?: Record<string, { provider?: string; accessKeyId?: string; accessKeySecret?: string; signName?: string; templateCode?: string; regionId?: string }> } } };
  const smsCfg = config.channels?.sms;
  const defaultAccount = accountId ?? "default";
  const accountCfg = defaultAccount === "default"
    ? {
        provider: smsCfg?.provider ?? "aliyun",
        accessKeyId: smsCfg?.accessKeyId,
        accessKeySecret: smsCfg?.accessKeySecret,
        signName: smsCfg?.signName,
        templateCode: smsCfg?.templateCode,
        regionId: smsCfg?.regionId,
      }
    : smsCfg?.accounts?.[defaultAccount] ?? {
        provider: smsCfg?.provider ?? "aliyun",
        accessKeyId: smsCfg?.accessKeyId,
        accessKeySecret: smsCfg?.accessKeySecret,
        signName: smsCfg?.signName,
        templateCode: smsCfg?.templateCode,
        regionId: smsCfg?.regionId,
      };

  return {
    accountId: defaultAccount,
    selectionSource: "explicit",
    enabled: true,
    configured: !!(accountCfg.accessKeyId && accountCfg.accessKeySecret && accountCfg.signName && accountCfg.templateCode),
    provider: (accountCfg.provider as "aliyun" | "tencent" | "huawei") ?? "aliyun",
    accessKeyId: accountCfg.accessKeyId,
    accessKeySecret: accountCfg.accessKeySecret,
    signName: accountCfg.signName,
    templateCode: accountCfg.templateCode,
    regionId: accountCfg.regionId,
    config: {},
  };
}
