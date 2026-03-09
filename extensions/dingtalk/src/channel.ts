import type { ChannelMeta, ChannelPlugin, ClawdbotConfig } from "openclaw/plugin-sdk/dingtalk";
import {
  DEFAULT_ACCOUNT_ID,
} from "openclaw/plugin-sdk/dingtalk";
import { dingTalkOutbound } from "./outbound.js";
import type { ResolvedDingTalkAccount } from "./types.js";

const meta: ChannelMeta = {
  id: "dingtalk",
  label: "DingTalk",
  selectionLabel: "DingTalk (钉钉)",
  docsPath: "/channels/dingtalk",
  docsLabel: "dingtalk",
  blurb: "钉钉企业即时通讯",
  aliases: ["ding"],
  order: 80,
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

function resolveDingTalkAccountFromConfig(
  cfg: ClawdbotConfig,
  accountId?: string | null,
): ResolvedDingTalkAccount {
  const dingtalkCfg = cfg.channels?.dingtalk;
  const resolvedId = accountId ?? DEFAULT_ACCOUNT_ID;
  const isDefault = resolvedId === DEFAULT_ACCOUNT_ID;

  let accountConfig: { webhookUrl?: string; secret?: string; name?: string } = {};
  let enabled = true;
  let configured = false;

  if (isDefault) {
    accountConfig = {
      webhookUrl: dingtalkCfg?.webhookUrl,
      secret: dingtalkCfg?.secret,
    };
    enabled = dingtalkCfg?.enabled ?? true;
    configured = !!dingtalkCfg?.webhookUrl;
  } else {
    const namedAccount = dingtalkCfg?.accounts?.[resolvedId];
    accountConfig = namedAccount ?? {};
    enabled = namedAccount?.enabled ?? true;
    configured = !!namedAccount?.webhookUrl;
  }

  return {
    accountId: resolvedId,
    selectionSource: isDefault ? "default" : "explicit",
    enabled,
    configured,
    name: accountConfig.name,
    webhookUrl: accountConfig.webhookUrl,
    secret: accountConfig.secret,
    config: dingtalkCfg ?? {},
  };
}

function listDingTalkAccountIds(cfg: ClawdbotConfig): string[] {
  const dingtalkCfg = cfg.channels?.dingtalk;
  const ids = [DEFAULT_ACCOUNT_ID];

  if (dingtalkCfg?.accounts) {
    for (const accountId of Object.keys(dingtalkCfg.accounts)) {
      if (accountId !== DEFAULT_ACCOUNT_ID) {
        ids.push(accountId);
      }
    }
  }

  return ids;
}

export const dingtalkPlugin: ChannelPlugin<ResolvedDingTalkAccount> = {
  id: "dingtalk",
  meta: {
    ...meta,
  },
  capabilities: {
    chatTypes: ["direct", "channel"],
    polls: false,
    threads: false,
    media: false,
    reactions: false,
    edit: false,
    reply: false,
  },
  agentPrompt: {
    messageToolHints: () => [
      "- DingTalk targeting: use user ID or chat ID as target",
      "- Supports text and markdown messages",
    ],
  },
  reload: { configPrefixes: ["channels.dingtalk"] },
  configSchema: {
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enabled: { type: "boolean" },
        defaultAccount: { type: "string" },
        webhookUrl: { type: "string", format: "uri" },
        secret: secretInputJsonSchema,
        accounts: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              name: { type: "string" },
              webhookUrl: { type: "string", format: "uri" },
              secret: secretInputJsonSchema,
            },
          },
        },
      },
    },
  },
  config: {
    listAccountIds: (cfg) => listDingTalkAccountIds(cfg),
    resolveAccount: (cfg, accountId) => resolveDingTalkAccountFromConfig(cfg, accountId),
    defaultAccountId: () => DEFAULT_ACCOUNT_ID,
    setAccountEnabled: ({ cfg, accountId, enabled }) => {
      const isDefault = accountId === DEFAULT_ACCOUNT_ID;
      const dingtalkCfg = cfg.channels?.dingtalk ?? {};

      if (isDefault) {
        return {
          ...cfg,
          channels: {
            ...cfg.channels,
            dingtalk: {
              ...dingtalkCfg,
              enabled,
            },
          },
        };
      }

      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          dingtalk: {
            ...dingtalkCfg,
            accounts: {
              ...dingtalkCfg.accounts,
              [accountId]: {
                ...dingtalkCfg.accounts?.[accountId],
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
        delete (nextChannels as Record<string, unknown>).dingtalk;
        if (Object.keys(nextChannels).length > 0) {
          next.channels = nextChannels;
        } else {
          delete next.channels;
        }
        return next;
      }

      const dingtalkCfg = cfg.channels?.dingtalk ?? {};
      const accounts = { ...dingtalkCfg.accounts };
      delete accounts[accountId];

      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          dingtalk: {
            ...dingtalkCfg,
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
    }),
  },
  messaging: {
    normalizeTarget: (raw) => {
      // Simple normalization - just return the raw value
      const trimmed = raw?.trim();
      return trimmed ?? undefined;
    },
    targetResolver: {
      looksLikeId: (id) => !!id && id.length > 0,
      hint: "<userId|chatId>",
    },
  },
  outbound: dingTalkOutbound,
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
      channelId: "dingtalk",
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
      if (!account.webhookUrl) {
        return { ok: false, error: "webhook URL not configured" };
      }
      return { ok: true, webhookUrl: account.webhookUrl };
    },
    buildAccountSnapshot: ({ account, runtime }) => ({
      accountId: account.accountId,
      enabled: account.enabled,
      configured: account.configured,
      name: account.name,
      connected: runtime?.connected ?? false,
      running: runtime?.running ?? false,
    }),
  },
  gateway: {
    startAccount: async (ctx) => {
      const account = resolveDingTalkAccountFromConfig(ctx.cfg, ctx.accountId);
      ctx.log?.info(`[${ctx.accountId}] starting dingtalk webhook monitor`);
      ctx.setStatus({ accountId: ctx.accountId, running: true, connected: true });
      // Webhook 模式下，消息通过 HTTP 回调接收，不需要持续运行
      return monitorDingTalkProvider({
        config: ctx.cfg,
        runtime: ctx.runtime,
        abortSignal: ctx.abortSignal,
        accountId: ctx.accountId,
      });
    },
  },
};

// Import monitor for gateway
import { monitorDingTalkProvider } from "./monitor.js";
