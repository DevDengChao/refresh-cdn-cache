import {AliyunCdnCacheRefresher} from "../../src/refresher/aliyun-cdn-cache-refresher";
import {CdnCacheRefresher} from "../../src/refresher/cdn-cache-refresher";
import 'dotenv/config';
import {backupAccessDotYaml, restoreAccessDotYaml} from "../helper";

let refresher: CdnCacheRefresher;

beforeEach(() => {
    backupAccessDotYaml();
});

afterEach(() => {
    restoreAccessDotYaml();
});

describe('valid access key id and secret', () => {

    beforeEach(async () => {
        let accessKeyId = process.env.CDN_ACCESS_KEY_ID;
        let accessKeySecret = process.env.CDN_ACCESS_KEY_SECRET;
        refresher = new AliyunCdnCacheRefresher();
        await refresher.config({
            accessKeyId,
            accessKeySecret
        });
    });

    test('refresh cdn cache', async function () {
        let path = ['https://blog.dengchao.fun/index.html', 'https://blog.dengchao.fun/tag/'];
        await refresher.refresh(path);
    });

    test('broken path', async function () {
        let path = 'https://broken-path';
        // InvalidObjectPath.Malformed: code: 400, The specified ObjectPath is invalid. request id: xxxx
        await assertThrowsException(path, "InvalidObjectPath.Malformed");
    });

    test('domain not found', async function () {
        let path = 'https://github.com/';
        // InvalidDomain.NotFound: code: 404, The domain [github.com] does not belong to you. request id: xxxx
        await assertThrowsException(path, "InvalidDomain.NotFound");
    });

    test('concat path with comma', async function () {
        let path = 'https://blog.dengchao.fun/,https://blog.dengchao.fun/tag/';
        // it works, but Aliyun CDN treat this as a single valid path
        await refresher.refresh([path]);
    });
});

describe('invalid access key id and secret', () => {

    beforeEach(() => {
        refresher = new AliyunCdnCacheRefresher();
        process.env = {}; // clear all existing env variables
    })

    test('permission denied', async function () {
        // anonymous@devdengchao.onaliyun.com
        // this access key pair has no permission to do anything.
        let accessKeyId = "LTAI5tCzYk2y9aDtixTV2TVi";
        let accessKeySecret = "6HjDCM8TB5YmoMlcuOGXDljuUs6lLb";

        await refresher.config({
            accessKeyId,
            accessKeySecret
        });

        let path = 'https://blog.dengchao.fun/index.html';

        // Forbidden.RAM: code: 403, User not authorized to operate on the specified resource, or this API doesn't support RAM. request id: xxxx
        await assertThrowsException(path, "Forbidden.RAM");
    });

    test('invalid access key id and secret', async function () {
        let accessKeyId = "invalid";
        let accessKeySecret = "invalid";

        await refresher.config({
            accessKeyId,
            accessKeySecret
        });

        let path = 'https://blog.dengchao.fun/index.html';
        // InvalidAccessKeyId.NotFound: code: 404, Specified access key is not found. request id: xxxx
        await assertThrowsException(path, "InvalidAccessKeyId.NotFound");
    });

    test('missing accessKeyId and accessKeySecret', async function () {
        try {
            await refresher.config({});
        } catch (e) {
            expect(e.message).toContain('Unable to load credentials');
        }
    });
});

async function assertThrowsException(path: string, keyword: string) {
    let catchTriggered = false;
    let retry = 0, maxRetry = 3;

    while (retry < maxRetry && !catchTriggered) {
        try {
            await refresher.refresh([path]);
        } catch (e) {
            // maybe we should config connectTimeout or readTimeout instead?
            if (e.message.toString().includes('socket hang up')) {
                retry++;
            } else {
                // console.debug(e);
                expect(e.message).toContain(keyword);
                catchTriggered = true;
            }
        }
    }
    expect(catchTriggered).toBeTruthy();
}
