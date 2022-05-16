import {CdnCacheRefresher} from "./cdn-cache-refresher";
import {Credential} from "../credential";

export abstract class AbstractCdnCacheRefresher implements CdnCacheRefresher {
    private credential: Credential = {};

    async config(args: Record<string, any>) {
        this.credential = this.loadCredentialFromArgs(args);
        if (this.credential != null && this.isCredentialFilled(this.credential)) {
            await this.onConfig(this.credential);
            return;
        }

        this.credential = this.loadCredentialFromEnv(process.env);
        if (this.credential != null && this.isCredentialFilled(this.credential)) {
            await this.onConfig(this.credential);
            return;
        }

        this.credential = this.loadCredentialFromCredentials(args.credentials);
        if (this.credential != null && this.isCredentialFilled(this.credential)) {
            await this.onConfig(this.credential);
            return;
        }

        // TODO 2022/5/16: add refer link
        let message = 'Unable to load credentials.'
        throw new Error(JSON.stringify({
            message,
            tips: message + "\r\n" +
                "Please setup credentials correctly."
        }));
    };

    protected abstract isCredentialFilled(credential: Credential | null): boolean;

    protected abstract loadCredentialFromArgs(args: Record<string, any>): Credential;

    protected abstract loadCredentialFromEnv(env: Record<string, string>): Credential;

    protected abstract loadCredentialFromCredentials(credentials: Record<string, string>): Credential;

    protected abstract onConfig(credential: Credential);

    protected abstract onRefresh(paths: Array<string>);

    async refresh(paths: Array<string> | string) {
        if (typeof paths == "string") paths = [paths]
        await this.onRefresh(paths);
    }
}
