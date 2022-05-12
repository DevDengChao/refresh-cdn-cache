import {AbstractCdnCacheRefresher} from "./abstract-cdn-cache-refresher";
import {Config} from "@alicloud/openapi-client";
import Client, {RefreshObjectCachesRequest} from "@alicloud/cdn20180510";

export class AliyunCdnCacheRefresher extends AbstractCdnCacheRefresher {

    private client: Client;

    async config(args: Record<string, any>): Promise<void> {
        let accessKeyId = args.accessKeyId;
        let accessKeySecret = args.accessKeySecret;

        // https://next.api.aliyun.com/api-tools/sdk/Cdn?version=2018-05-10&language=nodejs-tea
        // https://next.api.aliyun.com/api/Cdn/2018-05-10/RefreshObjectCaches?params={}

        this.client = new Client(new Config({
            accessKeyId,
            accessKeySecret,
            endpoint: "cdn.aliyuncs.com"
        }));
    }

    async onRefresh(paths: Array<string>) {
        let request = new RefreshObjectCachesRequest();

        // aliyun cdn requires caller to concat paths with \r or \r\n into a single string
        request.objectPath = paths.reduce((previousValue, currentValue) => {
            return previousValue + "\r\n" + currentValue;
        });
        await this.client.refreshObjectCaches(request); // this may throw runtime exception
    }


}
