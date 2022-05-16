import {AbstractCdnCacheRefresher} from "./abstract-cdn-cache-refresher";
import {Config} from "@alicloud/openapi-client";
import Client, {RefreshObjectCachesRequest} from "@alicloud/cdn20180510";
import {decryptCredential, Logger} from "@serverless-devs/core";
import {Credential} from "../credential";


export class AliyunCdnCacheRefresher extends AbstractCdnCacheRefresher {
    private readonly logger = new Logger("refresh-cdn-cache/aliyun");

    private client: Client;

    protected isCredentialFilled(credential: Credential): boolean {
        return credential.accessKeyId != null && credential.accessKeySecret != null;
    }

    protected async onRefresh(paths: Array<string>) {
        let request = new RefreshObjectCachesRequest();

        // aliyun cdn requires caller to concat paths with \r or \r\n into a single string
        request.objectPath = paths.reduce((previousValue, currentValue) => {
            return previousValue + "\r\n" + currentValue;
        });
        await this.client.refreshObjectCaches(request); // this may throw runtime exception
        this.logger.info("Refresh CDN cache success.");
    }

    protected loadCredentialFromArgs(args: Record<string, any>): Credential {
        return {
            accessKeyId: args.accessKeyId,
            accessKeySecret: args.accessKeySecret
        }
    }

    protected loadCredentialFromEnv(env: Record<string, string>): Credential {
        return {
            accessKeyId: env.ALIYUN_CDN_ACCESS_KEY_ID || env.CDN_ACCESS_KEY_ID,
            accessKeySecret: env.ALIYUN_CDN_ACCESS_KEY_SECRET || env.CDN_ACCESS_KEY_SECRET
        }
    }

    protected loadCredentialFromCredentials(credentials: Record<string, string>): Credential {
        let decoded = decryptCredential(credentials);
        return {
            accessKeyId: decoded.AccessKeyID,
            accessKeySecret: decoded.AccessKeySecret
        }
    }

    protected onConfig(credential: Credential) {
        let accessKeyId = credential.accessKeyId;
        let accessKeySecret = credential.accessKeySecret;

        // https://next.api.aliyun.com/api-tools/sdk/Cdn?version=2018-05-10&language=nodejs-tea
        // https://next.api.aliyun.com/api/Cdn/2018-05-10/RefreshObjectCaches?params={}

        this.client = new Client(new Config({
            accessKeyId,
            accessKeySecret,
            endpoint: "cdn.aliyuncs.com"
        }));
    }
}
