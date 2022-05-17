import { RefresherParser } from '../src/refresher-parser';
import { AliyunCdnCacheRefresher } from '../src/refresher/aliyun-cdn-cache-refresher';

test('parse aliyun cdn cache refresher from args.cdn', async function () {
  let cdns = ['alibaba', 'aliyun', 'Aliyun' /* also acceptable */];
  let index = Math.floor(Math.random() * cdns.length);
  let cdn = cdns[index];
  // Crypto.randomInt(cdns.length); is not available before nodejs 12.19.0
  console.log(`trying to parse args.cdn with value ${cdn}`);
  let parser = new RefresherParser({}, { cdn });
  let refresher = parser.parse();
  expect(refresher).toBeInstanceOf(AliyunCdnCacheRefresher);
});

test('unacceptable args.cdn', function (done) {
  let parser = new RefresherParser(
    {},
    {
      cdn: 'unacceptable-value',
    }
  );

  try {
    parser.parse();
  } catch (e) {
    expect(e.message).toContain('message');
    expect(e.message).toContain('tips');
    expect(e.message).toContain('Invalid argument cdn value');
    done();
  }
});

test('parse aliyun cdn cache refresher from service.component', async function () {
  let components = ['fc', 'devsapp/fc'];
  let index = Math.floor(Math.random() * components.length);
  let component = components[index];

  console.log(`trying to parse service.component with value ${component}`);
  let parser = new RefresherParser({ project: { component } }, {});
  let refresher = parser.parse();
  expect(refresher).toBeInstanceOf(AliyunCdnCacheRefresher);
});

test('unacceptable service.component', function (done) {
  let parser = new RefresherParser(
    { project: { component: 'unacceptable-value' } },
    {}
  );
  try {
    parser.parse();
  } catch (e) {
    expect(e.message).toContain('message');
    expect(e.message).toContain('tips');
    expect(e.message).toContain(
      'Cannot determine which cdn cache refresher to use'
    );
    done();
  }
});

