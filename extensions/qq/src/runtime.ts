import { createPluginRuntimeStore } from "openclaw/plugin-sdk/compat";
import type { PluginRuntime } from "openclaw/plugin-sdk/qq";

const { setRuntime: setQQRuntime, getRuntime: getQQRuntime } =
  createPluginRuntimeStore<PluginRuntime>("QQ runtime not initialized");
export { getQQRuntime, setQQRuntime };
