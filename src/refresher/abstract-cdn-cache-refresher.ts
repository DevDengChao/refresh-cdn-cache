import { CdnCacheRefresher } from './cdn-cache-refresher';
import { getCredential, getCredentialAliasList, Logger, makeUnderLine } from '@serverless-devs/core';
import { Credential } from '../credential';

export abstract class AbstractCdnCacheRefresher implements CdnCacheRefresher {
  protected readonly logger = new Logger('refresh-cdn-cache');

  private credential: Credential = {};

  async config(args: Record<string, any>) {
    this.logger.debug('attempt loading credential from args directly');
    this.credential = this.loadCredentialFromArgs(args);
    if (this.credential != null && this.isCredentialFilled(this.credential)) {
      await this.onConfig(this.credential);
      return;
    }

    if (args.access) {
      this.logger.debug('attempt loading credential by args.access');
      let list = await getCredentialAliasList();
      if (list.includes(args.access)) {
        this.credential = await this.loadCredentialFromAccess(args.access);
        if (
          this.credential != null &&
          this.isCredentialFilled(this.credential)
        ) {
          await this.onConfig(this.credential);
          return;
        }
      } else {
        this.logger.warn(
          `attempt loading credential by args.access failed: alias ${args.access} not found. You may need to debug with \`s config get\`.`,
        );
      }
    }

    this.logger.debug('attempt loading credential from environment variables');
    this.credential = this.loadCredentialFromEnv(process.env);
    if (this.credential != null && this.isCredentialFilled(this.credential)) {
      await this.onConfig(this.credential);
      return;
    }

    this.logger.debug(
      "attempt loading credential from @serverless-devs/s' credentials",
    );
    this.credential = this.loadCredentialFromCredentials(args.credentials);
    if (this.credential != null && this.isCredentialFilled(this.credential)) {
      await this.onConfig(this.credential);
      return;
    }

    let message = 'Unable to load credentials.';
    let manifest = require('../../package.json');
    throw new Error(
      JSON.stringify({
        message,
        tips:
          message +
          '\r\n' +
          'Please setup credentials correctly: ' +
          makeUnderLine(manifest.repository.url),
      }),
    );
  }

  async refresh(paths: Array<string> | string) {
    if (typeof paths == 'string') paths = [paths];
    if (!paths || paths.length === 0) return;
    await this.onRefresh(paths);
  }

  protected abstract isCredentialFilled(credential: Credential | null): boolean;

  protected abstract loadCredentialFromArgs(
    args: Record<string, any>,
  ): Credential;

  protected abstract loadCredentialFromEnv(
    env: Record<string, string>,
  ): Credential;

  protected abstract loadCredentialFromCredentials(
    credentials: Record<string, string>,
  ): Credential;

  protected async loadCredentialFromAccess(
    access: string,
  ): Promise<Credential> {
    return this.loadCredentialFromCredentials(await getCredential(access));
  }

  protected abstract onConfig(credential: Credential);

  protected abstract onRefresh(paths: Array<string>);
}
