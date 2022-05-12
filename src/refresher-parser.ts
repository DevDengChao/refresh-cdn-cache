import {CdnCacheRefresher} from "./refresher/cdn-cache-refresher";
import {lodash, Logger} from "@serverless-devs/core";
import {AliyunCdnCacheRefresher} from "./refresher/aliyun-cdn-cache-refresher";

let logger = new Logger("refresh-cdn-cache");


export class RefresherParser {

    private readonly inputs: object;
    private readonly args: object;

    constructor(inputs: object, args: object) {
        this.inputs = inputs;
        this.args = args;
    }

    private readonly acceptableCdnValues = "Acceptable values (case insensitive):\r\n" +
        "  + alibaba\r\n" +
        "  + aliyun\r\n";

    public parse(): CdnCacheRefresher {
        // NOTE: maybe we should use something like multi-key map to do this

        // prefer args.cdn then service.component as user may using CDN at another cloud
        let cdn = lodash.get(this.args, "cdn", "" /* default to empty string*/).toLowerCase();
        switch (cdn) {
            case "":
                logger.debug(`Cannot determine which cdn cache refresher to use by args.cdn`);
                break;
            case "alibaba":
            case "aliyun":
                logger.info(`Decided to use aliyun cdn cache refresher as user specified args.cdn with value '${cdn}'`);
                return new AliyunCdnCacheRefresher();
            default:
                throw new Error(JSON.stringify({
                    message: `Invalid argument cdn value '${cdn}'.`,
                    tips: this.acceptableCdnValues
                }));
        }

        let component = lodash.get(this.inputs, "component");
        switch (component) {
            case 'fc':
            case 'devsapp/fc':
                logger.info(`Decided to use aliyun cdn cache refresher as user specified service.component with value '${component}'`);
                return new AliyunCdnCacheRefresher();
            default:
                let message = `Cannot determine which cdn cache refresher to use.`;
                // TODO 2022/5/12: highlight in example
                throw new Error(JSON.stringify({
                    message,
                    tips: message + "\r\n" +
                        "Please specify a cdn argument like below or report your issue here: https://github.com/DevDengChao/refresh-cdn-cache\r\n" +
                        "\r\n" +
                        "actions:\r\n" +
                        "  post-deploy:\r\n" +
                        "    - plugin: DevDengChao/refresh-cdn-cache\r\n" +
                        "      args:\r\n" +
                        "        cdn: aliyun\r\n" +
                        "\r\n" +
                        this.acceptableCdnValues,
                }));
        }
    }
}
