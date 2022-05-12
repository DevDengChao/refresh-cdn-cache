import {CdnCacheRefresher} from "./cdn-cache-refresher";

export abstract class AbstractCdnCacheRefresher implements CdnCacheRefresher {
    abstract onRefresh(paths: Array<string>);

    abstract config(paths: Array<string>);

    async refresh(paths: Array<string>) {
        await this.onRefresh(paths);
    }


}
