import crypto from "crypto";
import type { ResolvedSMSAccount } from "../types.js";

interface AliyunSendParams {
  account: ResolvedSMSAccount;
  phoneNumber: string;
  templateParam?: Record<string, string>;
}

interface AliyunResponse {
  Code: string;
  Message: string;
  BizId?: string;
  RequestId: string;
}

function buildAliyunSignature(
  accessKeySecret: string,
  params: Record<string, string>,
): string {
  // Sort params and build query string
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => {
      const value = encodeURIComponent(params[key]);
      return `${encodeURIComponent(key)}=${value}`;
    })
    .join("&");

  // Build string to sign
  const stringToSign = `POST&%2F&${encodeURIComponent(sortedParams)}`;

  // HMAC-SHA1 signature
  const hmac = crypto.createHmac("sha1", `${accessKeySecret}&`);
  hmac.update(stringToSign);
  return hmac.digest("base64");
}

export async function sendSMSAliyun(params: AliyunSendParams): Promise<{
  bizId?: string;
  code: string;
  message: string;
}> {
  const { account, phoneNumber, templateParam } = params;

  if (!account.accessKeyId || !account.accessKeySecret) {
    throw new Error("Aliyun access key not configured");
  }

  if (!account.signName || !account.templateCode) {
    throw new Error("SMS sign name or template code not configured");
  }

  const regionId = account.regionId ?? "cn-hangzhou";
  const endpoint = `https://dysmsapi.aliyuncs.com/?SignatureVersion=1.0&Format=JSON&SignatureMethod=HMAC-SHA1&Timestamp=${encodeURIComponent(new Date().toISOString())}&SignatureNonce=${Math.random().toString(36).substring(2)}&AccessKeyId=${account.accessKeyId}&Action=SendSms&Version=2017-05-25&RegionId=${regionId}&PhoneNumbers=${encodeURIComponent(phoneNumber)}&SignName=${encodeURIComponent(account.signName)}&TemplateCode=${encodeURIComponent(account.templateCode)}`;

  const paramsWithSignature: Record<string, string> = {
    SignatureVersion: "1.0",
    Format: "JSON",
    SignatureMethod: "HMAC-SHA1",
    Timestamp: new Date().toISOString(),
    SignatureNonce: Math.random().toString(36).substring(2),
    AccessKeyId: account.accessKeyId,
    Action: "SendSms",
    Version: "2017-05-25",
    RegionId: regionId,
    PhoneNumbers: phoneNumber,
    SignName: account.signName,
    TemplateCode: account.templateCode,
  };

  if (templateParam) {
    paramsWithSignature.TemplateParam = JSON.stringify(templateParam);
  }

  const signature = buildAliyunSignature(account.accessKeySecret, paramsWithSignature);
  const url = `${endpoint}&Signature=${encodeURIComponent(signature)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const result: AliyunResponse = await response.json();

  return {
    bizId: result.BizId,
    code: result.Code,
    message: result.Message,
  };
}
