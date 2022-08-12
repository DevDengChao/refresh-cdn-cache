import 'dotenv/config';
import { Main } from '../src/main';

test('when there is something changed, then refresh cdn', async function () {
  let inputs = { a: 'b' };

  let subject = Main;

  jest
    .spyOn(subject, 'isThereAnyChanges')
    .mockReturnValue(Promise.resolve(true));

  let onSomethingChanged = jest.spyOn(subject, 'onSomethingChanged');

  await subject.handle(inputs, {
    cdn: 'aliyun',
    accessKeyId: process.env.CDN_ACCESS_KEY_ID,
    accessKeySecret: process.env.CDN_ACCESS_KEY_SECRET,
    paths: 'https://blog.dengchao.fun/index.html',
  });

  expect(onSomethingChanged).toHaveBeenCalled();
});

test('when there is nothing changed, then skip refresh cdn', async function () {
  let inputs = {};
  let subject = Main;

  jest
    .spyOn(subject, 'isThereAnyChanges')
    .mockReturnValue(Promise.resolve(false));

  let onNothingChanged = jest.spyOn(subject, 'onNothingChanged');

  await subject.handle(inputs, {
    cdn: '',
    accessKeyId: '',
    accessKeySecret: '',
    paths: '',
  });

  expect(onNothingChanged).toHaveBeenCalled();
});
