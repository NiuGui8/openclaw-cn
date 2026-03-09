import { createPluginRuntimeStore } from "openclaw/plugin-sdk/compat";
import type { PluginRuntime } from "openclaw/plugin-sdk/sms";

const { setRuntime: setSMSRuntime, getRuntime: getSMSRuntime } =
  createPluginRuntimeStore<PluginRuntime>("SMS runtime not initialized");
export { getSMSRuntime, setSMSRuntime };
