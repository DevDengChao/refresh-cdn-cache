import { Logger, makeUnderLine } from "@serverless-devs/core";
import { Main } from "./main";

let manifest = require("../package.json");

let logger = new Logger("refresh-cdn-cache");

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

  // mock 全局方法会导致单元测试或集成测试找不到 xxx() 或 this.xxx(), 如果使用 export.xxx()
  // 则会影响到 IDE 代码静态分析功能, 因此将全局方法的控制权转移到对象上, 以便测试和 IDE 静态分析.
  await Main.handle(inputs, args);

  logger.info(
    `If you think my plugin helpful, please support me by star the repository ${makeUnderLine(
      manifest.repository.url
    )} or buy me a cup of coffee 💗`
  );

  return inputs;
};

