import 'dotenv/config';
import * as isThereAnyChanges from '../src/is-there-any-changes';

let subject = require('../src/index');

test('when there is something changed, then refresh cdn', async function () {
  let inputs = { a: 'b' };

  jest
    .spyOn(isThereAnyChanges, 'isThereAnyChanges')
    .mockReturnValue(Promise.resolve(true));

  let onSomethingChanged = jest.spyOn(subject, 'onSomethingChanged');

  let output = await subject.default(inputs, {
    cdn: 'aliyun',
    accessKeyId: process.env.CDN_ACCESS_KEY_ID,
    accessKeySecret: process.env.CDN_ACCESS_KEY_SECRET,
    paths: 'https://blog.dengchao.fun/index.html',
  });

  expect(output).toStrictEqual(inputs);
  expect(onSomethingChanged).toHaveBeenCalled();
});

test('when there is nothing changed, then skip refresh cdn', async function () {
  let inputs = {};

  jest
    .spyOn(isThereAnyChanges, 'isThereAnyChanges')
    .mockReturnValue(Promise.resolve(false));

  let onNothingChanged = jest.spyOn(subject, 'onNothingChanged');

  let output = await subject.default(inputs, {
    cdn: '',
    accessKeyId: '',
    accessKeySecret: '',
    paths: '',
  });

  expect(output).toStrictEqual(inputs);
  expect(onNothingChanged).toHaveBeenCalled();
});
