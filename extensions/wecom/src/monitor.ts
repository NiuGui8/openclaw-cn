import type { ClawdbotConfig, RuntimeEnv } from "openclaw/plugin-sdk/wecom";

export type MonitorWeComOpts = {
  config?: ClawdbotConfig;
  runtime?: RuntimeEnv;
  abortSignal?: AbortSignal;
  accountId?: string;
};

export interface WeComWebhookPayload {
  msgId?: string;
  msgType?: string;
  content?: string;
  fromUserName?: string;
  agentId?: string;
  toUserName?: string;
  createTime?: number;
}

export async function monitorWeComProvider(opts: MonitorWeComOpts = {}): Promise<void> {
  const log = opts.runtime?.log ?? console.log;
  log("wecom: webhook monitor mode - messages received via HTTP callback");
}

export function parseWeComWebhook(
  body: WeComWebhookPayload,
): {
  msgId: string;
  content: string;
  msgType: string;
  fromUserName?: string;
  agentId?: string;
} | null {
  if (!body.msgType) {
    return null;
  }

  return {
    msgId: body.msgId ?? `evt_${Date.now()}`,
    content: body.content ?? "",
    msgType: body.msgType,
    fromUserName: body.fromUserName,
    agentId: body.agentId,
  };
}
