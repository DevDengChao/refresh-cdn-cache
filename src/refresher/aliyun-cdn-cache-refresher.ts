import { AbstractCdnCacheRefresher } from './abstract-cdn-cache-refresher';
import { Config } from '@alicloud/openapi-client';
import Client, { RefreshObjectCachesRequest } from '@alicloud/cdn20180510';
import { decryptCredential } from '@serverless-devs/core';
import { Credential } from '../credential';

export class AliyunCdnCacheRefresher extends AbstractCdnCacheRefresher {
  private client: Client;

  protected isCredentialFilled(credential: Credential): boolean {
    return credential.accessKeyId != null && credential.accessKeySecret != null;
  }

  protected async onRefresh(paths: Array<string>) {
    let regexPattern: Array<string> = [];
    let endWithSlash: Array<string> = [];
    let endWithFileExt: Array<string> = [];
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      if (path.startsWith('^') && path.endsWith('$')) {
        regexPattern.push(path.substring(1, path.length - 1));
      } else if (path.endsWith('/')) {
        endWithSlash.push(path);
      } else {
        endWithFileExt.push(path);
      }
    }

    await this.refreshByType(endWithFileExt, 'File');
    await this.refreshByType(endWithSlash, 'Directory');
    await this.refreshByType(regexPattern, 'Regex');
  }

  protected async refreshByType(paths: Array<string>, type: string) {
    if (paths.length === 0) return;
    this.logger.debug(`Refresh paths as ${type}: ${paths}`);

    // https://next.api.aliyun.com/api/Cdn/2018-05-10/RefreshObjectCaches?params={}
    let request = new RefreshObjectCachesRequest();
    // aliyun cdn requires caller to concat paths with \r or \r\n into a single string
    request.objectPath = paths.reduce((previousValue, currentValue) => {
      return previousValue + '\r\n' + currentValue;
    });
    request.objectType = type;
    await this.client.refreshObjectCaches(request); // this may throw runtime exception
  }

  protected loadCredentialFromArgs(args: Record<string, any>): Credential {
    return {
      accessKeyId: args.accessKeyId,
      accessKeySecret: args.accessKeySecret,
    };
  }

  protected loadCredentialFromEnv(env: Record<string, string>): Credential {
    return {
      accessKeyId: env.ALIYUN_CDN_ACCESS_KEY_ID || env.CDN_ACCESS_KEY_ID,
      accessKeySecret:
        env.ALIYUN_CDN_ACCESS_KEY_SECRET || env.CDN_ACCESS_KEY_SECRET,
    };
  }

  protected loadCredentialFromCredentials(
    credentials: Record<string, string>
  ): Credential {
    let decoded = decryptCredential(credentials);
    return {
      accessKeyId: decoded.AccessKeyID,
      accessKeySecret: decoded.AccessKeySecret,
    };
  }

  protected onConfig(credential: Credential) {
    let accessKeyId = credential.accessKeyId;
    let accessKeySecret = credential.accessKeySecret;

    // https://next.api.aliyun.com/api-tools/sdk/Cdn?version=2018-05-10&language=nodejs-tea

    this.client = new Client(
      new Config({
        accessKeyId,
        accessKeySecret,
        endpoint: 'cdn.aliyuncs.com',
      })
    );
  }
}
