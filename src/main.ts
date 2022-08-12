import { lodash, Logger } from '@serverless-devs/core';
import { RefresherParser } from './refresher-parser';

export class Main {
  private static readonly logger = new Logger('refresh-cdn-cache');

  static async onSomethingChanged(inputs, args) {
    let refresher = new RefresherParser(inputs, args).parse(); // choose a proper refresher
    args.credentials = lodash.get(inputs, 'credentials'); // mixin credentials
    await refresher.config(args);
    let paths = lodash.get(args, 'paths');
    await refresher.refresh(paths); // do the job

    this.logger.info('Refresh CDN cache success.');
  }

  static onNothingChanged() {
    this.logger.info('Refresh CDN cache skipped as nothing changed.');
  }

  static async handle(inputs, args) {
    if (await this.isThereAnyChanges(inputs, args)) {
      await this.onSomethingChanged(inputs, args);
    } else {
      this.onNothingChanged();
    }
  }

  static async isThereAnyChanges(inputs, args): Promise<boolean> {
    return true;
  }
}
