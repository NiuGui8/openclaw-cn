import { createPluginRuntimeStore } from "openclaw/plugin-sdk/compat";
import type { PluginRuntime } from "openclaw/plugin-sdk/wecom";

const { setRuntime: setWeComRuntime, getRuntime: getWeComRuntime } =
  createPluginRuntimeStore<PluginRuntime>("WeCom runtime not initialized");
export { getWeComRuntime, setWeComRuntime };
