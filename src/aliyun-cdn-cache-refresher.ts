import {AbstractCdnCacheRefresher} from "./abstract-cdn-cache-refresher";
import {Config} from "@alicloud/openapi-client";
import Client, {RefreshObjectCachesRequest} from "@alicloud/cdn20180510";

export class AliyunCdnCacheRefresher extends AbstractCdnCacheRefresher {
    async onRefresh(paths: Array<string>) {
        let accessKeyId = this._config.accessKeyId;
        let accessKeySecret = this._config.accessKeySecret;

        // https://next.api.aliyun.com/api-tools/sdk/Cdn?version=2018-05-10&language=nodejs-tea
        // https://next.api.aliyun.com/api/Cdn/2018-05-10/RefreshObjectCaches?params={}
        let config = new Config({
            accessKeyId,
            accessKeySecret,
            endpoint: "cdn.aliyuncs.com"
        });

        let client = new Client(config);
        let request = new RefreshObjectCachesRequest();

        // aliyun cdn requires caller to concat paths with \r or \r\n into a single string
        request.objectPath = paths.reduce((previousValue, currentValue) => {
            return previousValue + "\r\n" + currentValue;
        });
        await client.refreshObjectCaches(request); // this may throw runtime exception
    }


}
