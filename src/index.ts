import { lodash, Logger, makeUnderLine } from '@serverless-devs/core';
import { RefresherParser } from './refresher-parser';
import { isThereAnyChanges } from './is-there-any-changes';

let manifest = require('../package.json');

let logger = new Logger('refresh-cdn-cache');

export async function onSomethingChanged(inputs, args) {
  let refresher = new RefresherParser(inputs, args).parse(); // choose a proper refresher
  args.credentials = lodash.get(inputs, 'credentials'); // mixin credentials
  await refresher.config(args);
  let paths = lodash.get(args, 'paths');
  await refresher.refresh(paths); // do the job

  logger.info('Refresh CDN cache success.');
}

export function onNothingChanged() {
  logger.info('Refresh CDN cache skipped as nothing changed.');
}

/**
 * 插件入口
 * @param inputs
 * @param args
 * @see <a href="https://github.com/Serverless-Devs/Serverless-Devs/blob/master/spec/zh/0.0.2/serverless_package_model/package_model.md#%E6%8F%92%E4%BB%B6%E6%A8%A1%E5%9E%8B%E8%A7%84%E8%8C%83">插件模型规范</a>
 */
export default async function index(inputs, args) {
  logger.info(
    `Thanks for using Refresh CDN Cache plugin v${manifest.version} by DevDengChao.`
  );
  logger.debug(`inputs params: ${JSON.stringify(inputs)}`);
  logger.debug(`args params: ${JSON.stringify(args)}`);

  if (await isThereAnyChanges(inputs, args)) {
    await this.onSomethingChanged(inputs, args);
  } else {
    this.onNothingChanged();
  }

  logger.info(
    `If you think my plugin helpful, please support me by star the repository ${makeUnderLine(
      manifest.repository.url
    )} or buy me a cup of coffee 💗`
  );

  return inputs;
};

