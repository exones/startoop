export class Logger {
    info(msg: any): void {
        console.log(msg);
    }

    debug(msg: any): void {
        console.debug(msg);
    }

    warn(msg: any): void {
        console.warn(msg);
    }

    error(msg: any): void {
        console.error(msg);
    }
}