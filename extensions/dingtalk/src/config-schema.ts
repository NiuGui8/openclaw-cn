import { z } from "zod";

export const DingTalkAccountConfigSchema = z.object({
  enabled: z.boolean().optional(),
  name: z.string().optional(),
  webhookUrl: z.string().url().optional(),
  secret: z.string().optional(),
});

export const DingTalkConfigSchema = z.object({
  enabled: z.boolean().optional(),
  defaultAccount: z.string().optional(),
  webhookUrl: z.string().url().optional(),
  secret: z.string().optional(),
  accounts: z.record(z.string(), DingTalkAccountConfigSchema).optional(),
});

export type DingTalkConfig = z.infer<typeof DingTalkConfigSchema>;
export type DingTalkAccountConfig = z.infer<typeof DingTalkAccountConfigSchema>;
