import {lodash, Logger} from "@serverless-devs/core";
import {RefresherParser} from "./refresher-parser";

let logger = new Logger("refresh-cdn-cache");

/**
 * 插件入口
 * @param inputs
 * @param args
 */
module.exports = async function index(inputs, args) {
    logger.debug(`inputs params: ${JSON.stringify(inputs)}`);
    logger.debug(`args params: ${JSON.stringify(args)}`);

    let refresher = new RefresherParser(inputs, args).parse();  // choose a proper refresher
    await refresher.config(args);
    let paths = lodash.get(args, "paths");
    await refresher.refresh(paths);                             // do the job

    return inputs;
}
