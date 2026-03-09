export type WeComConfig = {
  enabled?: boolean;
  defaultAccount?: string;
  webhookUrl?: string;
  accounts?: Record<string, WeComAccountConfig>;
};

export type WeComAccountConfig = {
  enabled?: boolean;
  name?: string;
  webhookUrl?: string;
};

export type ResolvedWeComAccount = {
  accountId: string;
  selectionSource: "explicit" | "default" | "fallback";
  enabled: boolean;
  configured: boolean;
  name?: string;
  webhookUrl?: string;
  config: WeComConfig;
};

export type WeComMessageContext = {
  msgId: string;
  msgType: string;
  content: string;
  fromUserName?: string;
  agentId?: string;
  chatId?: string;
};

export type WeComSendResult = {
  msgId: string;
};

export type WeComProbeResult = {
  ok: boolean;
  error?: string;
  webhookUrl?: string;
};
