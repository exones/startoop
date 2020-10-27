import { Logger } from "tslog";

export const LogRoot: Logger = new Logger({
    overwriteConsole: true
});

export function newLogger(): Logger {
    return LogRoot;
}