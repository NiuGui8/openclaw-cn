import { html, nothing } from "lit";
import { formatRelativeTimestamp } from "../format.ts";
import type { QQStatus } from "../types.ts";
import { renderChannelConfigSection } from "./channels.config.ts";
import type { ChannelsProps } from "./channels.types.ts";

export function renderQQCard(params: {
  props: ChannelsProps;
  qq?: QQStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, qq, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">QQ</div>
      <div class="card-sub">QQ 即时通讯 (via go-cqhttp)</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${qq?.configured ? "Yes" : "No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${qq?.running ? "Yes" : "No"}</span>
        </div>
        <div>
          <span class="label">API URL</span>
          <span>${qq?.httpApiUrl ? "configured" : "not set"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${qq?.lastStartAt ? formatRelativeTimestamp(qq.lastStartAt) : "n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${qq?.lastProbeAt ? formatRelativeTimestamp(qq.lastProbeAt) : "n/a"}</span>
        </div>
      </div>

      ${
        qq?.lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
              ${qq.lastError}
            </div>`
          : nothing
      }

      ${
        qq?.probe
          ? html`<div class="callout" style="margin-top: 12px;">
              Probe ${qq.probe.ok ? "ok" : "failed"} ·
              ${qq.probe.error ?? ""}
              ${qq.probe.botName ? `@${qq.probe.botName}` : ""}
            </div>`
          : nothing
      }

      ${renderChannelConfigSection({ channelId: "qq", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          Probe
        </button>
      </div>
    </div>
  `;
}
