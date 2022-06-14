import { AbstractCdnCacheRefresher } from '../../src/refresher/abstract-cdn-cache-refresher';
import { Credential } from '../../src/credential';
import { getCredential, setKnownCredential } from '@serverless-devs/core';
import { backupAccessDotYaml, restoreAccessDotYaml } from '../helper';

beforeEach(() => {
  backupAccessDotYaml();
});

afterEach(() => {
  restoreAccessDotYaml();
});

test('load credential from args', function (done) {
  new MyCdnCacheRefresher(done).config({ a: 'dummy-access-content' });
});

describe('load credential by args.access', () => {
  test('args.access found', function (done) {
    let refresher = new MyCdnCacheRefresher(done);
    setKnownCredential({ A: 'dummy-access-content' }, 'dummy-args-access').then(
      () => refresher.config({ access: 'dummy-args-access' })
    );
  });

  test('args.access not found', function (done) {
    let refresher = new MyCdnCacheRefresher(done);
    process.env.TMP_ACCESS = 'dummy-access-content';
    setKnownCredential(
      { A: 'dummy-args-access-content' },
      'dummy-args-access'
    ).then(() => refresher.config({ access: 'default' }));
  });
});

describe('load credential from env', () => {
  test('load credential from env', function (done) {
    process.env.TMP_A = 'dummy-access-content';
    let refresher = new MyCdnCacheRefresher(done);
    refresher.config({});
  });
  test('load credential from env', function (done) {
    process.env.TMP_ACCESS = 'dummy-access-content';
    let refresher = new MyCdnCacheRefresher(done);
    refresher.config({});
  });
});

test('load credential from credentials', function (done) {
  process.env = {}; // reset all env in this test case
  let refresher = new MyCdnCacheRefresher(done);
  // setup @serverless-devs/s credentials manually
  setKnownCredential({ A: 'dummy-access-content' }, 'dummy-access')
    .then(() => getCredential('dummy-access'))
    .then((credentials) => {
      console.log(`injecting credentials ${credentials}`);
      return refresher.config({ credentials });
    });
});

test('unable to load credential', function (done) {
  process.env = {}; // reset all env in this test case
  new MyCdnCacheRefresher(() => {
    done('This function should not be invoked');
  })
    .config({
      credentials: {
        B: 'the key should be A',
      },
    })
    .catch((error) => {
      console.warn(error.message);
      expect(JSON.parse(error.message).tips).toContain(
        'Please setup credentials correctly.'
      );
      done();
    });
});

test('refresh a single item', function (done) {
  new MyCdnCacheRefresher(done).refresh('index.html').then();
});

class MyCdnCacheRefresher extends AbstractCdnCacheRefresher {
  private readonly done: Function;

  constructor(done) {
    super();
    this.done = done;
  }

  isCredentialFilled(credential: Credential): boolean {
    return credential.a != null;
  }

  loadCredentialFromArgs(args: Record<string, any>): Credential {
    return { a: args.a };
  }

  loadCredentialFromEnv(env: Record<string, string>): Credential {
    return {
      a: env.TMP_ACCESS || env.TMP_A,
    };
  }

  protected onConfig(credential: Credential) {
    expect(credential.a).toBe('dummy-access-content');
    this.done();
  }

  protected onRefresh(paths: Array<string>) {
    expect(paths).toStrictEqual(['index.html']);
    this.done();
  }

  protected loadCredentialFromCredentials(
    credentials: Record<string, string>
  ): Credential {
    return {
      a: credentials.A,
    };
  }
}
