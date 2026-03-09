import { z } from "zod";

export const QQAccountConfigSchema = z.object({
  enabled: z.boolean().optional(),
  name: z.string().optional(),
  httpApiUrl: z.string().url().optional(),
  accessToken: z.string().optional(),
});

export const QQConfigSchema = z.object({
  enabled: z.boolean().optional(),
  defaultAccount: z.string().optional(),
  httpApiUrl: z.string().url().optional(),
  accessToken: z.string().optional(),
  accounts: z.record(z.string(), QQAccountConfigSchema).optional(),
});

export type QQConfig = z.infer<typeof QQConfigSchema>;
export type QQAccountConfig = z.infer<typeof QQAccountConfigSchema>;
