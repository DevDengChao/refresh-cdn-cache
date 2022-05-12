import {index} from "../src";
import 'dotenv/config';


test('it works', async function () {
    let inputs = {a: "b"};
    let output = await index(inputs, {
        cdn: "aliyun",
        accessKeyId: process.env.CDN_ACCESS_KEY_ID,
        accessKeySecret: process.env.CDN_ACCESS_KEY_SECRET,
        paths: "https://blog.dengchao.fun/index.html"
    });

    expect(output).toStrictEqual(inputs);
});
