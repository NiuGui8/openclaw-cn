import crypto from "crypto";
import type { ChannelOutboundAdapter } from "openclaw/plugin-sdk/dingtalk";
import type { ResolvedDingTalkAccount } from "./types.js";

function signSecret(secret: string, timestamp: number): string {
  const stringToSign = `${timestamp}\n${secret}`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(stringToSign);
  return hmac.digest("base64");
}

async function sendDingTalkRequest(
  webhookUrl: string,
  secret: string | undefined,
  body: Record<string, unknown>,
): Promise<{ errcode: number; errmsg: string; messageId?: string }> {
  const timestamp = Date.now();
  let url = webhookUrl;

  if (secret) {
    const sign = signSecret(secret, timestamp);
    url = `${webhookUrl}&timestamp=${timestamp}&sign=${encodeURIComponent(sign)}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response.json();
}

export async function sendTextDingTalk(
  account: ResolvedDingTalkAccount,
  text: string,
): Promise<{ messageId: string }> {
  if (!account.webhookUrl) {
    throw new Error("DingTalk webhook URL not configured");
  }

  const result = await sendDingTalkRequest(
    account.webhookUrl,
    account.secret,
    {
      msgtype: "text",
      text: {
        content: text,
      },
    },
  );

  if (result.errcode !== 0) {
    throw new Error(`DingTalk API error: ${result.errmsg}`);
  }

  return { messageId: result.messageId ?? `msg_${Date.now()}` };
}

export async function sendMarkdownDingTalk(
  account: ResolvedDingTalkAccount,
  title: string,
  text: string,
): Promise<{ messageId: string }> {
  if (!account.webhookUrl) {
    throw new Error("DingTalk webhook URL not configured");
  }

  const result = await sendDingTalkRequest(
    account.webhookUrl,
    account.secret,
    {
      msgtype: "markdown",
      markdown: {
        title,
        text,
      },
    },
  );

  if (result.errcode !== 0) {
    throw new Error(`DingTalk API error: ${result.errmsg}`);
  }

  return { messageId: result.messageId ?? `msg_${Date.now()}` };
}

export async function sendCardDingTalk(
  account: ResolvedDingTalkAccount,
  title: string,
  text: string,
  buttons?: Array<{ title: string; url: string }>,
): Promise<{ messageId: string }> {
  if (!account.webhookUrl) {
    throw new Error("DingTalk webhook URL not configured");
  }

  const card = {
    title,
    text,
    btnOrientation: "0",
    btns: buttons?.map((btn) => ({
      title: btn.title,
      actionURL: btn.url,
    })) ?? [],
  };

  const result = await sendDingTalkRequest(
    account.webhookUrl,
    account.secret,
    {
      msgtype: "interactive_card",
      interactive_card: card,
    },
  );

  if (result.errcode !== 0) {
    throw new Error(`DingTalk API error: ${result.errmsg}`);
  }

  return { messageId: result.messageId ?? `msg_${Date.now()}` };
}

export const dingTalkOutbound: ChannelOutboundAdapter = {
  deliveryMode: "direct",
  chunker: (text, limit) => {
    // Simple chunking by newline or length
    const chunks: string[] = [];
    let current = "";
    for (const line of text.split("\n")) {
      if (current.length + line.length + 1 > limit && current) {
        chunks.push(current);
        current = "";
      }
      current += (current ? "\n" : "") + line;
    }
    if (current) chunks.push(current);
    return chunks;
  },
  chunkerMode: "text",
  textChunkLimit: 4000,
  sendText: async ({ cfg, to, text, accountId }) => {
    const account = resolveDingTalkAccount(cfg, accountId ?? undefined);
    const result = await sendTextDingTalk(account, text ?? "");
    return { channel: "dingtalk", messageId: result.messageId };
  },
  sendMedia: async ({ cfg, to, text, mediaUrl, accountId }) => {
    const account = resolveDingTalkAccount(cfg, accountId ?? undefined);
    // For media, send as text with the URL
    const mediaText = text ? `${text}\n${mediaUrl}` : (mediaUrl ?? "");
    const result = await sendTextDingTalk(account, mediaText);
    return { channel: "dingtalk", messageId: result.messageId };
  },
};

// Simple account resolution helper - use any to avoid complex type issues
function resolveDingTalkAccount(
  cfg: unknown,
  accountId?: string,
): ResolvedDingTalkAccount {
  const config = cfg as { channels?: { dingtalk?: { webhookUrl?: string; secret?: string; accounts?: Record<string, { webhookUrl?: string; secret?: string }> } } };
  const dingtalkCfg = config.channels?.dingtalk;
  const defaultAccount = accountId ?? "default";
  const accountCfg = defaultAccount === "default"
    ? { webhookUrl: dingtalkCfg?.webhookUrl, secret: dingtalkCfg?.secret }
    : dingtalkCfg?.accounts?.[defaultAccount] ?? { webhookUrl: dingtalkCfg?.webhookUrl, secret: dingtalkCfg?.secret };

  return {
    accountId: defaultAccount,
    selectionSource: "explicit",
    enabled: true,
    configured: !!accountCfg.webhookUrl,
    webhookUrl: accountCfg.webhookUrl,
    secret: accountCfg.secret,
    config: {},
  };
}
