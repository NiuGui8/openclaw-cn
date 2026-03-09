import type { ClawdbotConfig, RuntimeEnv } from "openclaw/plugin-sdk/qq";
import type { ResolvedQQAccount } from "./types.js";

export type MonitorQQOpts = {
  config?: ClawdbotConfig;
  runtime?: RuntimeEnv;
  abortSignal?: AbortSignal;
  accountId?: string;
};

export interface QQWebhookPayload {
  post_type?: string;
  message_type?: string;
  sub_type?: string;
  message_id?: number;
  user_id?: number;
  message?: string;
  raw_message?: string;
  font?: number;
  sender?: {
    user_id: number;
    nickname: string;
    card?: string;
  };
  group_id?: number;
  discuss_id?: number;
  time?: number;
}

export async function monitorQQProvider(opts: MonitorQQOpts = {}): Promise<void> {
  const log = opts.runtime?.log ?? console.log;
  const cfg = opts.config;
  const accountId = opts.accountId ?? "default";

  if (!cfg) {
    throw new Error("Config is required for QQ monitor");
  }

  const qqCfg = cfg.channels?.qq;
  const httpApiUrl = accountId === "default"
    ? qqCfg?.httpApiUrl
    : qqCfg?.accounts?.[accountId]?.httpApiUrl;

  if (!httpApiUrl) {
    throw new Error("QQ HTTP API URL not configured");
  }

  log(`qq: starting go-cqhttp HTTP callback monitor for account ${accountId}`);
  log(`qq: webhook endpoint should point to ${httpApiUrl}`);

  // Note: In go-cqhttp, you need to configure the HTTP callback in go-cqhttp's config
  // The callback URL should be set in go-cqhttp's http.yaml
  // This function just logs the configuration
}

export function parseQQWebhook(
  body: QQWebhookPayload,
): {
  messageId: string;
  content: string;
  userId: number;
  groupId?: number;
  discussId?: number;
  sender: { userId: number; nickname: string; card?: string };
} | null {
  if (body.post_type !== "message") {
    return null;
  }

  const userId = body.user_id;
  if (!userId) {
    return null;
  }

  return {
    messageId: String(body.message_id ?? Date.now()),
    content: body.message ?? body.raw_message ?? "",
    userId,
    groupId: body.group_id,
    discussId: body.discuss_id,
    sender: {
      userId: body.sender?.user_id ?? userId,
      nickname: body.sender?.nickname ?? "Unknown",
      card: body.sender?.card,
    },
  };
}
