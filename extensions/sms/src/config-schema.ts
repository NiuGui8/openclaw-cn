import { z } from "zod";

export const SMSProviderSchema = z.enum(["aliyun", "tencent", "huawei"]);

export const SMSAccountConfigSchema = z.object({
  enabled: z.boolean().optional(),
  name: z.string().optional(),
  provider: SMSProviderSchema.optional(),
  accessKeyId: z.string().optional(),
  accessKeySecret: z.string().optional(),
  signName: z.string().optional(),
  templateCode: z.string().optional(),
  regionId: z.string().optional(),
});

export const SMSConfigSchema = z.object({
  enabled: z.boolean().optional(),
  defaultAccount: z.string().optional(),
  provider: SMSProviderSchema.optional(),
  accessKeyId: z.string().optional(),
  accessKeySecret: z.string().optional(),
  signName: z.string().optional(),
  templateCode: z.string().optional(),
  regionId: z.string().optional(),
  accounts: z.record(z.string(), SMSAccountConfigSchema).optional(),
});

export type SMSConfig = z.infer<typeof SMSConfigSchema>;
export type SMSAccountConfig = z.infer<typeof SMSAccountConfigSchema>;
export type SMSProvider = z.infer<typeof SMSProviderSchema>;
