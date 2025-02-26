import { CdnCacheRefresher } from './refresher/cdn-cache-refresher';
import { chalk, lodash, Logger, makeUnderLine } from '@serverless-devs/core';
import { AliyunCdnCacheRefresher } from './refresher/aliyun-cdn-cache-refresher';

let logger = new Logger('refresh-cdn-cache');

export class RefresherParser {
  private readonly inputs: object;
  private readonly args: object;
  private readonly acceptableCdnValues =
    'Acceptable values (case insensitive):\r\n' +
    '  + alibaba\r\n' +
    '  + aliyun\r\n';

  constructor(inputs: object, args: object) {
    this.inputs = inputs;
    this.args = args;
  }

  public parse(): CdnCacheRefresher {
    // NOTE: maybe we should use something like multi-key map to do this

    // prefer args.cdn then service.component as user may using CDN at another cloud
    let cdn = lodash
      .get(this.args, 'cdn', '' /* default to empty string*/)
      .toLowerCase();
    switch (cdn) {
      case '':
        logger.debug(
          `Cannot determine which cdn cache refresher to use by args.cdn`,
        );
        break;
      case 'alibaba':
      case 'aliyun':
        logger.info(
          `Decided to use aliyun cdn cache refresher as user specified args.cdn with value '${cdn}'`,
        );
        return new AliyunCdnCacheRefresher();
      default:
        let message = `Invalid argument cdn value '${cdn}'.`;
        throw new Error(
          JSON.stringify({
            message,
            tips: message + '\r\n' + this.acceptableCdnValues,
          }),
        );
    }

    let v2Component = lodash.get(this.inputs, 'project.component');
    let v3Component = lodash.get(this.inputs, 'resource.component');
    let component = v2Component || v3Component;
    switch (component) {
      case 'fc':
      case 'fc3':
      case 'devsapp/fc':
      case 'devsapp/fc3':
        logger.info(
          `Decided to use aliyun cdn cache refresher as user specified component with value '${component}'`,
        );
        return new AliyunCdnCacheRefresher();
      default:
        let message = `Cannot determine which cdn cache refresher to use.`;
        throw new Error(
          JSON.stringify({
            message,
            tips:
              message +
              '\r\n' +
              'Please specify a cdn argument like below or report your issue here: ' +
              makeUnderLine(require('../package.json').repository.url) +
              '\r\n' +
              '\r\n' +
              'actions:\r\n' +
              '  post-deploy:\r\n' +
              '    - plugin: refresh-cdn-cache\r\n' +
              '      args:\r\n' +
              chalk.green('        cdn: aliyun\r\n') +
              '\r\n' +
              this.acceptableCdnValues,
          }),
        );
    }
  }
}
