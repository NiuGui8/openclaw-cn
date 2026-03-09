import type { OpenClawPluginApi } from "openclaw/plugin-sdk/sms";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/sms";
import { smsPlugin } from "./src/channel.js";
import { setSMSRuntime } from "./src/runtime.js";

const plugin = {
  id: "sms",
  name: "SMS",
  description: "SMS channel plugin (Aliyun SMS provider)",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setSMSRuntime(api.runtime);
    api.registerChannel({ plugin: smsPlugin });
  },
};

export default plugin;
