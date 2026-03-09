import { createPluginRuntimeStore } from "openclaw/plugin-sdk/compat";
import type { PluginRuntime } from "openclaw/plugin-sdk/dingtalk";

const { setRuntime: setDingTalkRuntime, getRuntime: getDingTalkRuntime } =
  createPluginRuntimeStore<PluginRuntime>("DingTalk runtime not initialized");
export { getDingTalkRuntime, setDingTalkRuntime };
