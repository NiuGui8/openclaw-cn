import { html, nothing } from "lit";
import { formatRelativeTimestamp } from "../format.ts";
import type { WeComStatus } from "../types.ts";
import { renderChannelConfigSection } from "./channels.config.ts";
import type { ChannelsProps } from "./channels.types.ts";

export function renderWeComCard(params: {
  props: ChannelsProps;
  wecom?: WeComStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, wecom, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">WeCom</div>
      <div class="card-sub">企业微信</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${wecom?.configured ? "Yes" : "No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${wecom?.running ? "Yes" : "No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${wecom?.lastStartAt ? formatRelativeTimestamp(wecom.lastStartAt) : "n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${wecom?.lastProbeAt ? formatRelativeTimestamp(wecom.lastProbeAt) : "n/a"}</span>
        </div>
      </div>

      ${
        wecom?.lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
              ${wecom.lastError}
            </div>`
          : nothing
      }

      ${
        wecom?.probe
          ? html`<div class="callout" style="margin-top: 12px;">
              Probe ${wecom.probe.ok ? "ok" : "failed"} ·
              ${wecom.probe.error ?? ""}
            </div>`
          : nothing
      }

      ${renderChannelConfigSection({ channelId: "wecom", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          Probe
        </button>
      </div>
    </div>
  `;
}
