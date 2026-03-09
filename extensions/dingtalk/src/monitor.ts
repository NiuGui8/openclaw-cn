import type { ClawdbotConfig, RuntimeEnv } from "openclaw/plugin-sdk/dingtalk";
import type { ResolvedDingTalkAccount } from "./types.js";

export type MonitorDingTalkOpts = {
  config?: ClawdbotConfig;
  runtime?: RuntimeEnv;
  abortSignal?: AbortSignal;
  accountId?: string;
};

export interface DingTalkWebhookPayload {
  eventId?: string;
  eventType?: string;
  timestamp?: number;
  msgtype?: string;
  text?: { content: string };
  markdown?: { title: string; text: string };
  sender?: { userId: string; nick?: string };
  conversation?: { conversationId: string; chatId?: string };
  robot?: { code?: string };
}

export async function monitorDingTalkProvider(opts: MonitorDingTalkOpts = {}): Promise<void> {
  // DingTalk webhook 模式：消息通过 HTTP POST 推送到 OpenClaw
  // 这里不启动服务，只是注册处理函数
  const log = opts.runtime?.log ?? console.log;
  log("dingtalk: webhook monitor mode - messages received via HTTP callback");
}

export function parseDingTalkWebhook(
  body: DingTalkWebhookPayload,
): {
  messageId: string;
  content: string;
  msgType: string;
  senderUserId?: string;
  senderNick?: string;
  conversationId?: string;
} | null {
  if (!body.msgtype) {
    return null;
  }

  let content = "";
  let msgType = body.msgtype;

  if (body.text?.content) {
    content = body.text.content;
  } else if (body.markdown?.text) {
    content = body.markdown.text;
  }

  return {
    messageId: body.eventId ?? `evt_${Date.now()}`,
    content,
    msgType,
    senderUserId: body.sender?.userId,
    senderNick: body.sender?.nick,
    conversationId: body.conversation?.conversationId,
  };
}
