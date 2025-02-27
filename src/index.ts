import { lodash, Logger, makeUnderLine } from '@serverless-devs/core';
import { RefresherParser } from './refresher-parser';

let manifest = require('../package.json');

let logger = new Logger('refresh-cdn-cache');

/**
 * 插件入口
 * @param inputs
 * @param args
 * @see <https://www.serverless-devs.com/docs/dev-guide/plugin/#%E4%BB%A3%E7%A0%81%E8%A7%84%E8%8C%83>代码规范</a>
 */
module.exports = async function index(inputs, args) {
  logger.info(
    `Thanks for using Refresh CDN Cache plugin v${manifest.version} by DevDengChao.`,
  );
  logger.debug(`inputs params: ${JSON.stringify(inputs)}`);
  logger.debug(`args params: ${JSON.stringify(args)}`);

  let refresher = new RefresherParser(inputs, args).parse(); // choose a proper refresher
  let v2Credentials = lodash.get(inputs, 'credentials');
  let v3Credentials = lodash.get(inputs, 'credential');
  args.credentials = v2Credentials || v3Credentials; // mixin credentials
  await refresher.config(args);
  let paths = lodash.get(args, 'paths');
  await refresher.refresh(paths); // do the job

  logger.info('Refresh CDN cache success.');

  logger.info(
    `If you think my plugin helpful, please support me by star the repository ${makeUnderLine(
      manifest.repository.url,
    )} or buy me a cup of coffee 💗`,
  );

  return inputs;
};
