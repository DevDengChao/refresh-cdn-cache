import {getRootHome} from "@serverless-devs/core";
import path from "path";
import fs from "fs";

export function backupAccessDotYaml() {
    console.log('backup existing access.yaml');
    let home = getRootHome();
    let src = path.join(home, 'access.yaml');
    if (fs.existsSync(src)) fs.renameSync(src, path.join(home, 'access-backup.yaml'));
}

export function restoreAccessDotYaml() {
    console.log("restore existing access.yaml");
    let home = getRootHome();
    let src = path.join(home, 'access-backup.yaml');
    if (fs.existsSync(src)) fs.renameSync(src, path.join(home, 'access.yaml'));
}
