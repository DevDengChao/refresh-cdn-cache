import {CdnCacheRefresher} from "./cdn-cache-refresher";

export abstract class AbstractCdnCacheRefresher implements CdnCacheRefresher {
    abstract onRefresh(paths: Array<string>);

    protected _config: Record<string, any>;

    config(config: Record<string, any>) {
        this._config = config;
    }

    async refresh(paths: Array<string>) {
        await this.onRefresh(paths);
    }


}
