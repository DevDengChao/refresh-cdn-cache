export interface CdnCacheRefresher {
  config(config: Record<string, any>);

  refresh(paths: Array<string> | string);
}
