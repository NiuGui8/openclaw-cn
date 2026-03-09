import { html, nothing } from "lit";
import { formatRelativeTimestamp } from "../format.ts";
import type { SMSStatus } from "../types.ts";
import { renderChannelConfigSection } from "./channels.config.ts";
import type { ChannelsProps } from "./channels.types.ts";

export function renderSMSCard(params: {
  props: ChannelsProps;
  sms?: SMSStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, sms, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">SMS</div>
      <div class="card-sub">短信发送 (阿里云短信)</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${sms?.configured ? "Yes" : "No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${sms?.running ? "Yes" : "No"}</span>
        </div>
        <div>
          <span class="label">Provider</span>
          <span>${sms?.provider ?? "aliyun"}</span>
        </div>
        <div>
          <span class="label">Sign Name</span>
          <span>${sms?.signName ?? "not set"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${sms?.lastStartAt ? formatRelativeTimestamp(sms.lastStartAt) : "n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${sms?.lastProbeAt ? formatRelativeTimestamp(sms.lastProbeAt) : "n/a"}</span>
        </div>
      </div>

      ${
        sms?.lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
              ${sms.lastError}
            </div>`
          : nothing
      }

      ${
        sms?.probe
          ? html`<div class="callout" style="margin-top: 12px;">
              Probe ${sms.probe.ok ? "ok" : "failed"} ·
              ${sms.probe.error ?? ""}
            </div>`
          : nothing
      }

      ${renderChannelConfigSection({ channelId: "sms", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          Probe
        </button>
      </div>
    </div>
  `;
}
