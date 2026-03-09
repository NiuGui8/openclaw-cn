import type { ChannelOutboundAdapter } from "openclaw/plugin-sdk/qq";
import type { ResolvedQQAccount } from "./types.js";

interface CqhttpResponse<T = unknown> {
  status: string;
  retcode: number;
  data?: T;
  message?: string;
}

async function sendCqhttpRequest<T = unknown>(
  httpApiUrl: string,
  accessToken: string | undefined,
  action: string,
  params: Record<string, unknown>,
): Promise<CqhttpResponse<T>> {
  const url = new URL(`${httpApiUrl}/${action}`);
  if (accessToken) {
    url.searchParams.set("access_token", accessToken);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}

export async function sendPrivateMsgQQ(
  account: ResolvedQQAccount,
  userId: number,
  message: string,
): Promise<{ messageId: number }> {
  if (!account.httpApiUrl) {
    throw new Error("QQ HTTP API URL not configured");
  }

  const result = await sendCqhttpRequest<{ message_id: number }>(
    account.httpApiUrl,
    account.accessToken,
    "send_private_msg",
    {
      user_id: userId,
      message,
    },
  );

  if (result.retcode !== 0) {
    throw new Error(`QQ API error: ${result.message ?? "unknown error"}`);
  }

  return { messageId: result.data?.message_id ?? 0 };
}

export async function sendGroupMsgQQ(
  account: ResolvedQQAccount,
  groupId: number,
  message: string,
): Promise<{ messageId: number }> {
  if (!account.httpApiUrl) {
    throw new Error("QQ HTTP API URL not configured");
  }

  const result = await sendCqhttpRequest<{ message_id: number }>(
    account.httpApiUrl,
    account.accessToken,
    "send_group_msg",
    {
      group_id: groupId,
      message,
    },
  );

  if (result.retcode !== 0) {
    throw new Error(`QQ API error: ${result.message ?? "unknown error"}`);
  }

  return { messageId: result.data?.message_id ?? 0 };
}

export async function sendDiscussMsgQQ(
  account: ResolvedQQAccount,
  discussId: number,
  message: string,
): Promise<{ messageId: number }> {
  if (!account.httpApiUrl) {
    throw new Error("QQ HTTP API URL not configured");
  }

  const result = await sendCqhttpRequest<{ message_id: number }>(
    account.httpApiUrl,
    account.accessToken,
    "send_discuss_msg",
    {
      discuss_id: discussId,
      message,
    },
  );

  if (result.retcode !== 0) {
    throw new Error(`QQ API error: ${result.message ?? "unknown error"}`);
  }

  return { messageId: result.data?.message_id ?? 0 };
}

export const qqOutbound: ChannelOutboundAdapter = {
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
  textChunkLimit: 500,
  sendText: async ({ cfg, to, text, accountId }) => {
    const account = resolveQQAccount(cfg, accountId ?? undefined);

    // Parse target: user:123456, group:123456, discuss:123456
    const targetMatch = to?.match(/^(user|group|discuss):(\d+)$/);
    let result: { messageId: number };

    if (targetMatch) {
      const [, type, idStr] = targetMatch;
      const id = parseInt(idStr, 10);

      if (type === "user") {
        result = await sendPrivateMsgQQ(account, id, text ?? "");
      } else if (type === "group") {
        result = await sendGroupMsgQQ(account, id, text ?? "");
      } else if (type === "discuss") {
        result = await sendDiscussMsgQQ(account, id, text ?? "");
      } else {
        throw new Error(`Unknown QQ target type: ${type}`);
      }
    } else {
      // Default to private message
      const userId = parseInt(to ?? "0", 10);
      if (!userId) {
        throw new Error("Invalid QQ target format. Use user:123456, group:123456, or discuss:123456");
      }
      result = await sendPrivateMsgQQ(account, userId, text ?? "");
    }

    return { channel: "qq", messageId: String(result.messageId) };
  },
  sendMedia: async ({ cfg, to, text, mediaUrl, accountId }) => {
    const account = resolveQQAccount(cfg, accountId ?? undefined);

    // CQ code for image
    const cqImage = `[CQ:image,file=${mediaUrl ?? ""}]`;
    const message = text ? `${text}\n${cqImage}` : cqImage;

    const targetMatch = to?.match(/^(user|group|discuss):(\d+)$/);
    let result: { messageId: number };

    if (targetMatch) {
      const [, type, idStr] = targetMatch;
      const id = parseInt(idStr, 10);

      if (type === "user") {
        result = await sendPrivateMsgQQ(account, id, message);
      } else if (type === "group") {
        result = await sendGroupMsgQQ(account, id, message);
      } else if (type === "discuss") {
        result = await sendDiscussMsgQQ(account, id, message);
      } else {
        throw new Error(`Unknown QQ target type: ${type}`);
      }
    } else {
      const userId = parseInt(to ?? "0", 10);
      if (!userId) {
        throw new Error("Invalid QQ target format");
      }
      result = await sendPrivateMsgQQ(account, userId, message);
    }

    return { channel: "qq", messageId: String(result.messageId) };
  },
};

function resolveQQAccount(
  cfg: unknown,
  accountId?: string,
): ResolvedQQAccount {
  const config = cfg as { channels?: { qq?: { httpApiUrl?: string; accessToken?: string; accounts?: Record<string, { httpApiUrl?: string; accessToken?: string }> } } };
  const qqCfg = config.channels?.qq;
  const defaultAccount = accountId ?? "default";
  const accountCfg = defaultAccount === "default"
    ? { httpApiUrl: qqCfg?.httpApiUrl, accessToken: qqCfg?.accessToken }
    : qqCfg?.accounts?.[defaultAccount] ?? { httpApiUrl: qqCfg?.httpApiUrl, accessToken: qqCfg?.accessToken };

  return {
    accountId: defaultAccount,
    selectionSource: "explicit",
    enabled: true,
    configured: !!accountCfg.httpApiUrl,
    httpApiUrl: accountCfg.httpApiUrl,
    accessToken: accountCfg.accessToken,
    config: {},
  };
}
