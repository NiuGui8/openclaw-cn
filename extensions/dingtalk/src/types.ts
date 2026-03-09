export type DingTalkConfig = {
  enabled?: boolean;
  defaultAccount?: string;
  webhookUrl?: string;
  secret?: string;
  accounts?: Record<string, DingTalkAccountConfig>;
};

export type DingTalkAccountConfig = {
  enabled?: boolean;
  name?: string;
  webhookUrl?: string;
  secret?: string;
};

export type ResolvedDingTalkAccount = {
  accountId: string;
  selectionSource: "explicit" | "default" | "fallback";
  enabled: boolean;
  configured: boolean;
  name?: string;
  webhookUrl?: string;
  secret?: string;
  config: DingTalkConfig;
};

export type DingTalkMessageContext = {
  webhookEventId: string;
  msgType: string;
  content: string;
  senderUserId?: string;
  senderNick?: string;
  conversationId?: string;
  chatId?: string;
};

export type DingTalkSendResult = {
  messageId: string;
};

export type DingTalkProbeResult = {
  ok: boolean;
  error?: string;
  webhookUrl?: string;
};
