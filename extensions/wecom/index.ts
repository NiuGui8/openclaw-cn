import type { OpenClawPluginApi } from "openclaw/plugin-sdk/wecom";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/wecom";
import { wecomPlugin } from "./src/channel.js";
import { setWeComRuntime } from "./src/runtime.js";

const plugin = {
  id: "wecom",
  name: "WeCom",
  description: "WeCom (Enterprise WeChat) channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setWeComRuntime(api.runtime);
    api.registerChannel({ plugin: wecomPlugin });
  },
};

export default plugin;
