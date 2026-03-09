import { z } from "zod";

export const WeComAccountConfigSchema = z.object({
  enabled: z.boolean().optional(),
  name: z.string().optional(),
  webhookUrl: z.string().url().optional(),
});

export const WeComConfigSchema = z.object({
  enabled: z.boolean().optional(),
  defaultAccount: z.string().optional(),
  webhookUrl: z.string().url().optional(),
  accounts: z.record(z.string(), WeComAccountConfigSchema).optional(),
});

export type WeComConfig = z.infer<typeof WeComConfigSchema>;
export type WeComAccountConfig = z.infer<typeof WeComAccountConfigSchema>;
