import type { OpenClawPluginApi } from "../../dist/plugin-sdk/qq.js";
import { emptyPluginConfigSchema } from "../../dist/plugin-sdk/qq.js";
import { qqPlugin } from "./src/channel.js";
import { setQQRuntime } from "./src/runtime.js";

const plugin = {
  id: "qq",
  name: "QQ",
  description: "QQ channel plugin (via go-cqhttp)",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setQQRuntime(api.runtime);
    api.registerChannel({ plugin: qqPlugin });
  },
};

export default plugin;
