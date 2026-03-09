import type { ChannelMeta, ChannelPlugin, ClawdbotConfig } from "openclaw/plugin-sdk/sms";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/sms";
import { smsOutbound } from "./outbound.js";
import { monitorSMSProvider } from "./monitor.js";
import type { ResolvedSMSAccount, SMSProvider } from "./types.js";

const meta: ChannelMeta = {
  id: "sms",
  label: "SMS",
  selectionLabel: "SMS (短信)",
  docsPath: "/channels/sms",
  docsLabel: "sms",
  blurb: "短信发送 (阿里云短信)",
  aliases: ["aliyun-sms"],
  order: 95,
};

const secretInputJsonSchema = {
  oneOf: [
    { type: "string" },
    {
      type: "object",
      additionalProperties: false,
      required: ["source", "provider", "id"],
      properties: {
        source: { type: "string", enum: ["env", "file", "exec"] },
        provider: { type: "string", minLength: 1 },
        id: { type: "string", minLength: 1 },
      },
    },
  ],
} as const;

function resolveSMSAccountFromConfig(
  cfg: ClawdbotConfig,
  accountId?: string | null,
): ResolvedSMSAccount {
  const smsCfg = cfg.channels?.sms;
  const resolvedId = accountId ?? DEFAULT_ACCOUNT_ID;
  const isDefault = resolvedId === DEFAULT_ACCOUNT_ID;

  let accountConfig: {
    provider?: SMSProvider;
    accessKeyId?: string;
    accessKeySecret?: string;
    signName?: string;
    templateCode?: string;
    regionId?: string;
    name?: string;
  } = {};
  let enabled = true;
  let configured = false;

  if (isDefault) {
    accountConfig = {
      provider: smsCfg?.provider ?? "aliyun",
      accessKeyId: smsCfg?.accessKeyId,
      accessKeySecret: smsCfg?.accessKeySecret,
      signName: smsCfg?.signName,
      templateCode: smsCfg?.templateCode,
      regionId: smsCfg?.regionId,
    };
    enabled = smsCfg?.enabled ?? true;
    configured = !!(smsCfg?.accessKeyId && smsCfg?.accessKeySecret && smsCfg?.signName && smsCfg?.templateCode);
  } else {
    const namedAccount = smsCfg?.accounts?.[resolvedId];
    accountConfig = namedAccount ?? {
      provider: smsCfg?.provider ?? "aliyun",
      accessKeyId: smsCfg?.accessKeyId,
      accessKeySecret: smsCfg?.accessKeySecret,
      signName: smsCfg?.signName,
      templateCode: smsCfg?.templateCode,
      regionId: smsCfg?.regionId,
    };
    enabled = namedAccount?.enabled ?? true;
    configured = !!(accountConfig.accessKeyId && accountConfig.accessKeySecret && accountConfig.signName && accountConfig.templateCode);
  }

  return {
    accountId: resolvedId,
    selectionSource: isDefault ? "default" : "explicit",
    enabled,
    configured,
    name: accountConfig.name,
    provider: accountConfig.provider ?? "aliyun",
    accessKeyId: accountConfig.accessKeyId,
    accessKeySecret: accountConfig.accessKeySecret,
    signName: accountConfig.signName,
    templateCode: accountConfig.templateCode,
    regionId: accountConfig.regionId,
    config: smsCfg ?? {},
  };
}

function listSMSAccountIds(cfg: ClawdbotConfig): string[] {
  const smsCfg = cfg.channels?.sms;
  const ids = [DEFAULT_ACCOUNT_ID];

  if (smsCfg?.accounts) {
    for (const accountId of Object.keys(smsCfg.accounts)) {
      if (accountId !== DEFAULT_ACCOUNT_ID) {
        ids.push(accountId);
      }
    }
  }

  return ids;
}

export const smsPlugin: ChannelPlugin<ResolvedSMSAccount> = {
  id: "sms",
  meta: {
    ...meta,
  },
  capabilities: {
    chatTypes: ["direct"],
    polls: false,
    threads: false,
    media: false,
    reactions: false,
    edit: false,
    reply: false,
  },
  agentPrompt: {
    messageToolHints: () => [
      "- SMS targeting: use phone number (e.g., +86138xxxxxxxx)",
      "- SMS is outbound-only, no incoming messages",
    ],
  },
  reload: { configPrefixes: ["channels.sms"] },
  configSchema: {
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enabled: { type: "boolean" },
        defaultAccount: { type: "string" },
        provider: { type: "string", enum: ["aliyun", "tencent", "huawei"] },
        accessKeyId: { type: "string" },
        accessKeySecret: secretInputJsonSchema,
        signName: { type: "string" },
        templateCode: { type: "string" },
        regionId: { type: "string" },
        accounts: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              name: { type: "string" },
              provider: { type: "string", enum: ["aliyun", "tencent", "huawei"] },
              accessKeyId: { type: "string" },
              accessKeySecret: secretInputJsonSchema,
              signName: { type: "string" },
              templateCode: { type: "string" },
              regionId: { type: "string" },
            },
          },
        },
      },
    },
  },
  config: {
    listAccountIds: (cfg) => listSMSAccountIds(cfg),
    resolveAccount: (cfg, accountId) => resolveSMSAccountFromConfig(cfg, accountId),
    defaultAccountId: () => DEFAULT_ACCOUNT_ID,
    setAccountEnabled: ({ cfg, accountId, enabled }) => {
      const isDefault = accountId === DEFAULT_ACCOUNT_ID;
      const smsCfg = cfg.channels?.sms ?? {};

      if (isDefault) {
        return {
          ...cfg,
          channels: {
            ...cfg.channels,
            sms: {
              ...smsCfg,
              enabled,
            },
          },
        };
      }

      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          sms: {
            ...smsCfg,
            accounts: {
              ...smsCfg.accounts,
              [accountId]: {
                ...smsCfg.accounts?.[accountId],
                enabled,
              },
            },
          },
        },
      };
    },
    deleteAccount: ({ cfg, accountId }) => {
      const isDefault = accountId === DEFAULT_ACCOUNT_ID;

      if (isDefault) {
        const next = { ...cfg } as ClawdbotConfig;
        const nextChannels = { ...cfg.channels };
        delete (nextChannels as Record<string, unknown>).sms;
        if (Object.keys(nextChannels).length > 0) {
          next.channels = nextChannels;
        } else {
          delete next.channels;
        }
        return next;
      }

      const smsCfg = cfg.channels?.sms ?? {};
      const accounts = { ...smsCfg.accounts };
      delete accounts[accountId];

      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          sms: {
            ...smsCfg,
            accounts: Object.keys(accounts).length > 0 ? accounts : undefined,
          },
        },
      };
    },
    isConfigured: (account) => account.configured,
    describeAccount: (account) => ({
      accountId: account.accountId,
      enabled: account.enabled,
      configured: account.configured,
      name: account.name,
      provider: account.provider,
      signName: account.signName,
    }),
  },
  messaging: {
    normalizeTarget: (raw) => {
      // Normalize phone number: remove non-digits except +
      const normalized = raw?.replace(/[^\d+]/g, "");
      return normalized ?? undefined;
    },
    targetResolver: {
      looksLikeId: (id) => !!id && /^\+?\d{7,15}$/.test(id),
      hint: "<+86138xxxxxxxx>",
    },
  },
  outbound: smsOutbound,
  status: {
    defaultRuntime: {
      accountId: DEFAULT_ACCOUNT_ID,
      running: false,
      connected: false,
      lastConnectedAt: null,
      lastDisconnect: null,
      lastEventAt: null,
      lastStartAt: null,
      lastStopAt: null,
      lastError: null,
    },
    buildChannelSummary: ({ snapshot }) => ({
      channelId: "sms",
      accounts: [
        {
          accountId: snapshot.accountId,
          enabled: snapshot.enabled,
          configured: snapshot.configured,
          connected: snapshot.connected,
          running: snapshot.running,
        },
      ],
    }),
    probeAccount: async ({ account }) => {
      if (!account.accessKeyId || !account.accessKeySecret) {
        return { ok: false, error: "Access key not configured" };
      }
      if (!account.signName || !account.templateCode) {
        return { ok: false, error: "Sign name or template code not configured" };
      }
      return { ok: true, provider: account.provider };
    },
    buildAccountSnapshot: ({ account, runtime }) => ({
      accountId: account.accountId,
      enabled: account.enabled,
      configured: account.configured,
      name: account.name,
      provider: account.provider,
      signName: account.signName,
      connected: runtime?.connected ?? false,
      running: runtime?.running ?? false,
    }),
  },
  gateway: {
    startAccount: async (ctx) => {
      const account = resolveSMSAccountFromConfig(ctx.cfg, ctx.accountId);
      ctx.log?.info(`[${ctx.accountId}] starting sms provider (outbound only)`);
      ctx.setStatus({ accountId: ctx.accountId, running: true, connected: true });
      return monitorSMSProvider({
        config: ctx.cfg,
        runtime: ctx.runtime,
        abortSignal: ctx.abortSignal,
        accountId: ctx.accountId,
      });
    },
  },
};
