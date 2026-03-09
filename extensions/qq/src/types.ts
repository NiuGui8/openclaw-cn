export type QQConfig = {
  enabled?: boolean;
  defaultAccount?: string;
  httpApiUrl?: string;
  accessToken?: string;
  accounts?: Record<string, QQAccountConfig>;
};

export type QQAccountConfig = {
  enabled?: boolean;
  name?: string;
  httpApiUrl?: string;
  accessToken?: string;
};

export type ResolvedQQAccount = {
  accountId: string;
  selectionSource: "explicit" | "default" | "fallback";
  enabled: boolean;
  configured: boolean;
  name?: string;
  httpApiUrl?: string;
  accessToken?: string;
  config: QQConfig;
};

export type QQMessageContext = {
  messageId: number;
  userId: number;
  message: string;
  rawMessage: string;
  font: number;
  sender: {
    userId: number;
    nickname: string;
    card?: string;
  };
  groupId?: number;
  discussionId?: number;
};

export type QQSender = {
  userId: number;
  nickname: string;
  card?: string;
};

export type QQSendingResult = {
  messageId: number;
};

export type QQProbeResult = {
  ok: boolean;
  error?: string;
  botName?: string;
  botId?: number;
};
