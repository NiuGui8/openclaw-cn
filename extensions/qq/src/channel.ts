import type { ChannelMeta, ChannelPlugin, ClawdbotConfig } from "openclaw/plugin-sdk/qq";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/qq";
import { qqOutbound } from "./outbound.js";
import { monitorQQProvider } from "./monitor.js";
import type { ResolvedQQAccount } from "./types.js";

const meta: ChannelMeta = {
  id: "qq",
  label: "QQ",
  selectionLabel: "QQ (via go-cqhttp)",
  docsPath: "/channels/qq",
  docsLabel: "qq",
  blurb: "QQ 即时通讯 (通过 go-cqhttp 中转)",
  aliases: ["qq-bot"],
  order: 90,
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

function resolveQQAccountFromConfig(
  cfg: ClawdbotConfig,
  accountId?: string | null,
): ResolvedQQAccount {
  const qqCfg = cfg.channels?.qq;
  const resolvedId = accountId ?? DEFAULT_ACCOUNT_ID;
  const isDefault = resolvedId === DEFAULT_ACCOUNT_ID;

  let accountConfig: { httpApiUrl?: string; accessToken?: string; name?: string } = {};
  let enabled = true;
  let configured = false;

  if (isDefault) {
    accountConfig = {
      httpApiUrl: qqCfg?.httpApiUrl,
      accessToken: qqCfg?.accessToken,
    };
    enabled = qqCfg?.enabled ?? true;
    configured = !!qqCfg?.httpApiUrl;
  } else {
    const namedAccount = qqCfg?.accounts?.[resolvedId];
    accountConfig = namedAccount ?? {};
    enabled = namedAccount?.enabled ?? true;
    configured = !!namedAccount?.httpApiUrl;
  }

  return {
    accountId: resolvedId,
    selectionSource: isDefault ? "default" : "explicit",
    enabled,
    configured,
    name: accountConfig.name,
    httpApiUrl: accountConfig.httpApiUrl,
    accessToken: accountConfig.accessToken,
    config: qqCfg ?? {},
  };
}

function listQQAccountIds(cfg: ClawdbotConfig): string[] {
  const qqCfg = cfg.channels?.qq;
  const ids = [DEFAULT_ACCOUNT_ID];

  if (qqCfg?.accounts) {
    for (const accountId of Object.keys(qqCfg.accounts)) {
      if (accountId !== DEFAULT_ACCOUNT_ID) {
        ids.push(accountId);
      }
    }
  }

  return ids;
}

export const qqPlugin: ChannelPlugin<ResolvedQQAccount> = {
  id: "qq",
  meta: {
    ...meta,
  },
  capabilities: {
    chatTypes: ["direct", "channel"],
    polls: false,
    threads: false,
    media: true,
    reactions: false,
    edit: false,
    reply: false,
  },
  agentPrompt: {
    messageToolHints: () => [
      "- QQ targeting: use format user:123456, group:123456, or discuss:123456",
      "- Supports private, group, and discuss messages",
    ],
  },
  reload: { configPrefixes: ["channels.qq"] },
  configSchema: {
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enabled: { type: "boolean" },
        defaultAccount: { type: "string" },
        httpApiUrl: { type: "string", format: "uri" },
        accessToken: secretInputJsonSchema,
        accounts: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              name: { type: "string" },
              httpApiUrl: { type: "string", format: "uri" },
              accessToken: secretInputJsonSchema,
            },
          },
        },
      },
    },
  },
  config: {
    listAccountIds: (cfg) => listQQAccountIds(cfg),
    resolveAccount: (cfg, accountId) => resolveQQAccountFromConfig(cfg, accountId),
    defaultAccountId: () => DEFAULT_ACCOUNT_ID,
    setAccountEnabled: ({ cfg, accountId, enabled }) => {
      const isDefault = accountId === DEFAULT_ACCOUNT_ID;
      const qqCfg = cfg.channels?.qq ?? {};

      if (isDefault) {
        return {
          ...cfg,
          channels: {
            ...cfg.channels,
            qq: {
              ...qqCfg,
              enabled,
            },
          },
        };
      }

      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          qq: {
            ...qqCfg,
            accounts: {
              ...qqCfg.accounts,
              [accountId]: {
                ...qqCfg.accounts?.[accountId],
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
        delete (nextChannels as Record<string, unknown>).qq;
        if (Object.keys(nextChannels).length > 0) {
          next.channels = nextChannels;
        } else {
          delete next.channels;
        }
        return next;
      }

      const qqCfg = cfg.channels?.qq ?? {};
      const accounts = { ...qqCfg.accounts };
      delete accounts[accountId];

      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          qq: {
            ...qqCfg,
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
      httpApiUrl: account.httpApiUrl,
    }),
  },
  messaging: {
    normalizeTarget: (raw) => {
      const trimmed = raw?.trim();
      // Support formats: user:123456, group:123456, discuss:123456, or just 123456
      if (!trimmed) return undefined;

      // If it's just a number, assume it's a user ID
      if (/^\d+$/.test(trimmed)) {
        return `user:${trimmed}`;
      }
      return trimmed;
    },
    targetResolver: {
      looksLikeId: (id) => !!id && /^\d+$/.test(id.replace(/^(user|group|discuss):/, "")),
      hint: "<user:123456|group:123456|discuss:123456>",
    },
  },
  outbound: qqOutbound,
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
      channelId: "qq",
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
      if (!account.httpApiUrl) {
        return { ok: false, error: "HTTP API URL not configured" };
      }
      return { ok: true, httpApiUrl: account.httpApiUrl };
    },
    buildAccountSnapshot: ({ account, runtime }) => ({
      accountId: account.accountId,
      enabled: account.enabled,
      configured: account.configured,
      name: account.name,
      httpApiUrl: account.httpApiUrl,
      connected: runtime?.connected ?? false,
      running: runtime?.running ?? false,
    }),
  },
  gateway: {
    startAccount: async (ctx) => {
      const account = resolveQQAccountFromConfig(ctx.cfg, ctx.accountId);
      ctx.log?.info(`[${ctx.accountId}] starting qq go-cqhttp monitor`);
      ctx.setStatus({ accountId: ctx.accountId, running: true, connected: true });
      return monitorQQProvider({
        config: ctx.cfg,
        runtime: ctx.runtime,
        abortSignal: ctx.abortSignal,
        accountId: ctx.accountId,
      });
    },
  },
};
