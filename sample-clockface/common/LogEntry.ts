export class LogEntry {
    timestamp:string;
    logType:string;
    message:string;
    customData:any;

    constructor(message:string, logType:string, customData:any = {}, timestamp:string = "") {
        if (timestamp) {
            this.timestamp = timestamp;
        } else {
            this.timestamp = new Date().toISOString();
        }
        this.logType = logType;
        this.message = message;
        this.customData = customData;
    }

    toString():string {
        return `${this.timestamp} "${this.message}" ${(Object.keys(this.customData).length > 0 ? JSON.stringify(this.customData) : '')}`;
    }
}