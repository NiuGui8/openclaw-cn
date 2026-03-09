export type SMSProvider = "aliyun" | "tencent" | "huawei";

export type SMSConfig = {
  enabled?: boolean;
  defaultAccount?: string;
  provider?: SMSProvider;
  accessKeyId?: string;
  accessKeySecret?: string;
  signName?: string;
  templateCode?: string;
  regionId?: string;
  accounts?: Record<string, SMSAccountConfig>;
};

export type SMSAccountConfig = {
  enabled?: boolean;
  name?: string;
  provider?: SMSProvider;
  accessKeyId?: string;
  accessKeySecret?: string;
  signName?: string;
  templateCode?: string;
  regionId?: string;
};

export type ResolvedSMSAccount = {
  accountId: string;
  selectionSource: "explicit" | "default" | "fallback";
  enabled: boolean;
  configured: boolean;
  name?: string;
  provider: SMSProvider;
  accessKeyId?: string;
  accessKeySecret?: string;
  signName?: string;
  templateCode?: string;
  regionId?: string;
  config: SMSConfig;
};

export type SMSMessageContext = {
  phoneNumber: string;
  templateCode?: string;
  content?: string;
};

export type SMSSendResult = {
  bizId?: string;
  code?: string;
  message?: string;
};

export type SMSProbeResult = {
  ok: boolean;
  error?: string;
  provider?: SMSProvider;
};
