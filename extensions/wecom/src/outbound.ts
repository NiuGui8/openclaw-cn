import type { ChannelOutboundAdapter } from "openclaw/plugin-sdk/wecom";
import type { ResolvedWeComAccount } from "./types.js";

async function sendWeComRequest(
  webhookUrl: string,
  body: Record<string, unknown>,
): Promise<{ errcode: number; errmsg: string; msgid?: string }> {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response.json();
}

export async function sendTextWeCom(
  account: ResolvedWeComAccount,
  text: string,
): Promise<{ msgId: string }> {
  if (!account.webhookUrl) {
    throw new Error("WeCom webhook URL not configured");
  }

  const result = await sendWeComRequest(account.webhookUrl, {
    msgtype: "text",
    text: {
      content: text,
    },
  });

  if (result.errcode !== 0) {
    throw new Error(`WeCom API error: ${result.errmsg}`);
  }

  return { msgId: result.msgid ?? `msg_${Date.now()}` };
}

export async function sendMarkdownWeCom(
  account: ResolvedWeComAccount,
  text: string,
): Promise<{ msgId: string }> {
  if (!account.webhookUrl) {
    throw new Error("WeCom webhook URL not configured");
  }

  const result = await sendWeComRequest(account.webhookUrl, {
    msgtype: "markdown",
    markdown: {
      content: text,
    },
  });

  if (result.errcode !== 0) {
    throw new Error(`WeCom API error: ${result.errmsg}`);
  }

  return { msgId: result.msgid ?? `msg_${Date.now()}` };
}

export async function sendNewsWeCom(
  account: ResolvedWeComAccount,
  articles: Array<{ title: string; description: string; url: string; picurl?: string }>,
): Promise<{ msgId: string }> {
  if (!account.webhookUrl) {
    throw new Error("WeCom webhook URL not configured");
  }

  const result = await sendWeComRequest(account.webhookUrl, {
    msgtype: "news",
    news: {
      articles,
    },
  });

  if (result.errcode !== 0) {
    throw new Error(`WeCom API error: ${result.errmsg}`);
  }

  return { msgId: result.msgid ?? `msg_${Date.now()}` };
}

export const wecomOutbound: ChannelOutboundAdapter = {
  deliveryMode: "direct",
  chunker: (text, limit) => {
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
    const account = resolveWeComAccount(cfg, accountId ?? undefined);
    const result = await sendTextWeCom(account, text ?? "");
    return { channel: "wecom", messageId: result.msgId };
  },
  sendMedia: async ({ cfg, to, text, mediaUrl, accountId }) => {
    const account = resolveWeComAccount(cfg, accountId ?? undefined);
    const mediaText = text ? `${text}\n${mediaUrl}` : (mediaUrl ?? "");
    const result = await sendTextWeCom(account, mediaText);
    return { channel: "wecom", messageId: result.msgId };
  },
};

function resolveWeComAccount(
  cfg: unknown,
  accountId?: string,
): ResolvedWeComAccount {
  const config = cfg as { channels?: { wecom?: { webhookUrl?: string; accounts?: Record<string, { webhookUrl?: string }> } } };
  const wecomCfg = config.channels?.wecom;
  const defaultAccount = accountId ?? "default";
  const accountCfg = defaultAccount === "default"
    ? { webhookUrl: wecomCfg?.webhookUrl }
    : wecomCfg?.accounts?.[defaultAccount] ?? { webhookUrl: wecomCfg?.webhookUrl };

  return {
    accountId: defaultAccount,
    selectionSource: "explicit",
    enabled: true,
    configured: !!accountCfg.webhookUrl,
    webhookUrl: accountCfg.webhookUrl,
    config: {},
  };
}
