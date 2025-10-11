interface AliyunCredential {
  accessKeyId?: string;
  accessKeySecret?: string;
}

export interface Credential extends Record<string, string>, AliyunCredential {}
