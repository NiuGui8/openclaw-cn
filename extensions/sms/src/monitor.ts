import type { ClawdbotConfig, RuntimeEnv } from "openclaw/plugin-sdk/sms";

export type MonitorSMSOpts = {
  config?: ClawdbotConfig;
  runtime?: RuntimeEnv;
  abortSignal?: AbortSignal;
  accountId?: string;
};

export async function monitorSMSProvider(opts: MonitorSMSOpts = {}): Promise<void> {
  const log = opts.runtime?.log ?? console.log;
  // SMS is outbound-only, no incoming messages to monitor
  log("sms: outbound-only channel - no message monitoring needed");
}
