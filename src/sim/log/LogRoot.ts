import { Logger } from "tslog";

export const LogRoot: Logger = new Logger({
    overwriteConsole: true
});

export function newLogger(name: string): Logger {
    return LogRoot.getChildLogger();
}