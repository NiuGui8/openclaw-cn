import type { ChannelMeta, ChannelPlugin, ClawdbotConfig } from "openclaw/plugin-sdk/wecom";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/wecom";
import { wecomOutbound } from "./outbound.js";
import { monitorWeComProvider } from "./monitor.js";
import type { ResolvedWeComAccount } from "./types.js";

const meta: ChannelMeta = {
  id: "wecom",
  label: "WeCom",
  selectionLabel: "WeCom (企业微信)",
  docsPath: "/channels/wecom",
  docsLabel: "wecom",
  blurb: "企业微信企业即时通讯",
  aliases: ["wechat", "enterprise-wechat"],
  order: 85,
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

function resolveWeComAccountFromConfig(
  cfg: ClawdbotConfig,
  accountId?: string | null,
): ResolvedWeComAccount {
  const wecomCfg = cfg.channels?.wecom;
  const resolvedId = accountId ?? DEFAULT_ACCOUNT_ID;
  const isDefault = resolvedId === DEFAULT_ACCOUNT_ID;

  let accountConfig: { webhookUrl?: string; name?: string } = {};
  let enabled = true;
  let configured = false;

  if (isDefault) {
    accountConfig = {
      webhookUrl: wecomCfg?.webhookUrl,
    };
    enabled = wecomCfg?.enabled ?? true;
    configured = !!wecomCfg?.webhookUrl;
  } else {
    const namedAccount = wecomCfg?.accounts?.[resolvedId];
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
    config: wecomCfg ?? {},
  };
}

function listWeComAccountIds(cfg: ClawdbotConfig): string[] {
  const wecomCfg = cfg.channels?.wecom;
  const ids = [DEFAULT_ACCOUNT_ID];

  if (wecomCfg?.accounts) {
    for (const accountId of Object.keys(wecomCfg.accounts)) {
      if (accountId !== DEFAULT_ACCOUNT_ID) {
        ids.push(accountId);
      }
    }
  }

  return ids;
}

export const wecomPlugin: ChannelPlugin<ResolvedWeComAccount> = {
  id: "wecom",
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
      "- WeCom targeting: use user ID or chat ID as target",
      "- Supports text and markdown messages",
    ],
  },
  reload: { configPrefixes: ["channels.wecom"] },
  configSchema: {
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enabled: { type: "boolean" },
        defaultAccount: { type: "string" },
        webhookUrl: { type: "string", format: "uri" },
        accounts: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              name: { type: "string" },
              webhookUrl: { type: "string", format: "uri" },
            },
          },
        },
      },
    },
  },
  config: {
    listAccountIds: (cfg) => listWeComAccountIds(cfg),
    resolveAccount: (cfg, accountId) => resolveWeComAccountFromConfig(cfg, accountId),
    defaultAccountId: () => DEFAULT_ACCOUNT_ID,
    setAccountEnabled: ({ cfg, accountId, enabled }) => {
      const isDefault = accountId === DEFAULT_ACCOUNT_ID;
      const wecomCfg = cfg.channels?.wecom ?? {};

      if (isDefault) {
        return {
          ...cfg,
          channels: {
            ...cfg.channels,
            wecom: {
              ...wecomCfg,
              enabled,
            },
          },
        };
      }

      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          wecom: {
            ...wecomCfg,
            accounts: {
              ...wecomCfg.accounts,
              [accountId]: {
                ...wecomCfg.accounts?.[accountId],
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
        delete (nextChannels as Record<string, unknown>).wecom;
        if (Object.keys(nextChannels).length > 0) {
          next.channels = nextChannels;
        } else {
          delete next.channels;
        }
        return next;
      }

      const wecomCfg = cfg.channels?.wecom ?? {};
      const accounts = { ...wecomCfg.accounts };
      delete accounts[accountId];

      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          wecom: {
            ...wecomCfg,
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
      const trimmed = raw?.trim();
      return trimmed ?? undefined;
    },
    targetResolver: {
      looksLikeId: (id) => !!id && id.length > 0,
      hint: "<userId|chatId>",
    },
  },
  outbound: wecomOutbound,
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
      channelId: "wecom",
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
      const account = resolveWeComAccountFromConfig(ctx.cfg, ctx.accountId);
      ctx.log?.info(`[${ctx.accountId}] starting wecom webhook monitor`);
      ctx.setStatus({ accountId: ctx.accountId, running: true, connected: true });
      return monitorWeComProvider({
        config: ctx.cfg,
        runtime: ctx.runtime,
        abortSignal: ctx.abortSignal,
        accountId: ctx.accountId,
      });
    },
  },
};
